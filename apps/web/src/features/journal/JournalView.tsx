"use client";

import { exercises } from "@features/breathing/data";
import { Badge } from "@features/breathing/hooks/useCustomExercises";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  Brain,
  Calendar,
  ChevronRight,
  Info,
  PieChart,
  ShieldCheck,
  Timer,
  Wind,
  Zap,
} from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";

interface JournalViewProps {
  sessions: {
    exerciseId: string;
    date: string;
    duration: number;
    cycles?: number;
  }[];
  stats: {
    totalMinutes: number;
    sessionCount: number;
    streak: number;
    badges: Badge[];
  };
}

interface Session {
  exerciseId: string;
  date: string;
  duration: number;
  cycles?: number;
}

const HealthTrendGraph = ({ sessions }: { sessions: Session[] }) => {
  const [activeMetric, setActiveMetric] = useState<
    "vagal" | "cardiac" | "lung" | "focus" | "apnea"
  >("vagal");

  const multiTrendData = useMemo(() => {
    const now = new Date();
    const vagal = [];
    const cardiac = [];
    const lung = [];
    const focus = [];
    const apnea = [];

    for (let i = 11; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay() - i * 7);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      const weekStartStr = weekStart.toISOString().split("T")[0];
      const weekEndStr = weekEnd.toISOString().split("T")[0];

      const weeklySessions = sessions.filter((s) => {
        const sessionDate = s.date.split("T")[0];
        return sessionDate >= weekStartStr && sessionDate <= weekEndStr;
      });

      const totalMinutes = weeklySessions.reduce(
        (acc, s) => acc + s.duration / 60,
        0,
      );
      const totalCycles = weeklySessions.reduce(
        (acc, s) => acc + (s.cycles || s.duration / 15),
        0,
      );
      const sessionCount = weeklySessions.length;
      const uniqueExercises = new Set(weeklySessions.map((s) => s.exerciseId))
        .size;

      const holdSessions = weeklySessions.filter((s) => {
        const ex = exercises.find((e) => e.id === s.exerciseId);
        return ex && (ex.pattern.hold1 > 0 || ex.pattern.hold2 > 0);
      });
      const holdIntensity = holdSessions.reduce((acc, s) => {
        const ex = exercises.find((e) => e.id === s.exerciseId)!;
        return acc + (ex.pattern.hold1 + ex.pattern.hold2);
      }, 0);

      const baseline = 22;

      vagal.push(
        Math.max(
          baseline,
          Math.min(100, (sessionCount / 5) * 50 + (totalMinutes / 100) * 50),
        ),
      );
      cardiac.push(
        Math.max(
          baseline + 5,
          Math.min(100, (totalCycles / 150) * 40 + (totalMinutes / 120) * 60),
        ),
      );
      lung.push(
        Math.max(
          baseline - 5,
          Math.min(100, (totalCycles / 200) * 85 + (sessionCount / 7) * 15),
        ),
      );
      focus.push(
        Math.max(
          baseline + 10,
          Math.min(100, (uniqueExercises / 3) * 60 + (totalMinutes / 90) * 40),
        ),
      );
      apnea.push(
        Math.max(
          baseline,
          Math.min(100, (holdIntensity / 40) * 70 + (totalMinutes / 150) * 30),
        ),
      );
    }

    return { vagal, cardiac, lung, focus, apnea };
  }, [sessions]);

  const metrics = [
    {
      id: "vagal",
      label: "Vagal Tone",
      icon: ShieldCheck,
      desc: "Stress Resilience",
      longDesc:
        'Vagal Tone measures your nervous system\'s "braking" speed. A higher score means your body recovers from stress faster.',
    },
    {
      id: "cardiac",
      label: "Coherence",
      icon: Activity,
      desc: "Heart Balance",
      longDesc:
        "Cardiac Coherence tracks the synchronization of heart rhythm and breath, reducing emotional volatility.",
    },
    {
      id: "lung",
      label: "Lung Capacity",
      icon: Wind,
      desc: "Oxygen Uptake",
      longDesc:
        "Physical lung elasticity and diaphragm strength, allowing for deeper oxygen saturation in tissues.",
    },
    {
      id: "apnea",
      label: "CO2 Tolerance",
      icon: Timer,
      desc: "Breath Hold Stamina",
      longDesc:
        "Measures your resilience to CO2 buildup. Training this increases red blood cell count and cellular energy production.",
    },
    {
      id: "focus",
      label: "Neural Calm",
      icon: Brain,
      desc: "Focus Clarity",
      longDesc:
        "The reduction of cortisol-induced brain fog, improving your ability to maintain single-pointed focus.",
    },
  ] as const;

  const currentMetric = metrics.find((m) => m.id === activeMetric)!;
  const currentScore = Math.round(multiTrendData[activeMetric][11] || 0);
  const isNewUser = sessions.length < 3;

  const getPoints = (data: number[]) =>
    data.map((d, i) => `${(i / (data.length - 1)) * 100},${100 - d}`).join(" ");

  return (
    <div className="group relative w-full overflow-hidden rounded-[42px] border border-white/[0.06] bg-white/[0.02] p-8 shadow-2xl backdrop-blur-md">
      {/* iOS Style Inner Glow */}
      <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-white opacity-0 blur-[100px] transition-opacity duration-1000 group-hover:opacity-[0.03]" />

      {/* Dynamic Headline */}
      <div className="relative z-10 mb-10 flex items-start justify-between px-1">
        <div className="flex items-center gap-5">
          <motion.div
            key={currentMetric.id}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex h-14 w-14 items-center justify-center rounded-[20px] border border-white/10 bg-white/[0.04] shadow-2xl"
          >
            <div className="absolute inset-0 rounded-full bg-white opacity-10 blur-xl" />
            <currentMetric.icon
              size={26}
              className="relative z-10 text-white"
            />
          </motion.div>
          <div className="space-y-1">
            <AnimatePresence mode="wait">
              <motion.h3
                key={currentMetric.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-2xl font-light tracking-tight text-white"
              >
                {currentMetric.label}
              </motion.h3>
            </AnimatePresence>
            <p className="text-[10px] font-black tracking-[0.3em] text-white/50 uppercase">
              {currentMetric.desc}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center justify-end gap-2">
            <motion.span
              key={currentScore}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-light tracking-tighter text-white"
            >
              {currentScore}
            </motion.span>
            <span className="mt-2 text-[10px] font-bold tracking-widest text-white/40 uppercase">
              pts
            </span>
          </div>
          <p
            className={`mt-1 text-[8px] font-black tracking-[0.2em] uppercase ${isNewUser ? "text-blue-400/90" : "text-emerald-400/90"}`}
          >
            {isNewUser ? "Baseline State" : "Improving"}
          </p>
        </div>
      </div>

      {/* Refined Thin-Line Multi-Graph */}
      <div className="group relative z-10 mb-10 h-44 w-full px-2">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="h-full w-full overflow-visible"
        >
          {metrics.map((m) => {
            const isActive = activeMetric === m.id;
            return (
              <motion.polyline
                key={m.id}
                fill="none"
                stroke={
                  isActive
                    ? "rgba(255, 255, 255, 0.85)"
                    : "rgba(255, 255, 255, 0.15)"
                }
                strokeWidth={isActive ? 2 : 0.75}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={m.id === "apnea" ? "4 2" : "none"}
                points={getPoints(multiTrendData[m.id])}
                className={`transition-all duration-700 ${isActive ? "opacity-100" : "opacity-40"}`}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              />
            );
          })}

          <motion.polyline
            key={`${activeMetric}-glow`}
            fill="none"
            stroke="rgba(255, 255, 255, 0.4)"
            strokeWidth={4}
            strokeLinecap="round"
            strokeLinejoin="round"
            points={getPoints(multiTrendData[activeMetric])}
            className="opacity-10 blur-[6px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
          />
        </svg>
      </div>

      {/* Interactive Legend (Clickable Items) */}
      <div className="relative z-10 space-y-8">
        <div className="grid grid-cols-2 gap-3">
          {metrics.map((m) => {
            const isActive = activeMetric === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setActiveMetric(m.id)}
                className={`flex items-center gap-3 rounded-[28px] border p-3.5 text-left transition-all duration-500 ${isActive ? "border-white/20 bg-white/[0.08] shadow-2xl" : "border-white/[0.05] bg-white/[0.02] opacity-40 hover:border-white/10 hover:bg-white/[0.04] hover:opacity-100"}`}
              >
                <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] shadow-inner">
                  <div className="absolute inset-0 rounded-full bg-white opacity-10 blur-xl" />
                  <m.icon size={16} className="relative z-10 text-white" />
                </div>
                <div className="flex min-w-0 flex-col">
                  <div className="flex items-center gap-1.5 overflow-hidden">
                    <div
                      className={`h-1.5 w-1.5 shrink-0 rounded-full ${isActive ? "bg-white" : "bg-white/30"}`}
                    />
                    <span className="truncate text-[8px] font-black tracking-widest text-white/50 uppercase">
                      {m.label}
                    </span>
                  </div>
                  <span className="mt-1 text-[10px] leading-none font-medium tracking-tight text-white">
                    {isActive ? "Active" : "Analyze"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Dynamic Insight Box */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeMetric}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4 rounded-[36px] border border-white/[0.06] bg-white/[0.02] p-7 shadow-inner"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Info size={14} className="text-white" />
                <span className="text-[10px] font-bold tracking-[0.2em] text-white/50 uppercase">
                  Training Insight
                </span>
              </div>
              <ChevronRight size={14} className="text-white/40" />
            </div>
            <p className="text-[11px] leading-relaxed font-light text-white/70">
              {isNewUser
                ? `Welcome. Your current ${currentMetric.label} is at a baseline of ${currentScore}pts. Complete 3 sessions of breath-holding exercises to see your training curve evolve.`
                : currentMetric.longDesc}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="pointer-events-none absolute inset-0 bg-white/[0.01]" />
    </div>
  );
};

const DailyActivityBarChart = ({ sessions }: { sessions: Session[] }) => {
  const [timeRange, setTimeRange] = useState<"weekly" | "monthly" | "yearly">(
    "weekly",
  );

  const chartData = useMemo(() => {
    const now = new Date();
    if (timeRange === "weekly") {
      const data = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(now.getDate() - i);
        const dateStr = date.toISOString().split("T")[0];

        const daySessions = sessions.filter(
          (s) => s.date.split("T")[0] === dateStr,
        );
        const totalMinutes = daySessions.reduce(
          (acc, s) => acc + s.duration / 60,
          0,
        );
        const sessionCount = daySessions.length;

        data.push({
          label: date.toLocaleDateString("en-US", { weekday: "short" }),
          dateLabel: date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          minutes: totalMinutes,
          sessionsCount: sessionCount,
          isActive: date.toDateString() === now.toDateString(),
        });
      }
      return data;
    } else if (timeRange === "monthly") {
      const data = [];
      for (let i = 3; i >= 0; i--) {
        const start = new Date(now);
        start.setDate(now.getDate() - (i + 1) * 7 + 1);
        const end = new Date(now);
        end.setDate(now.getDate() - i * 7);

        const startStr = start.toISOString().split("T")[0];
        const endStr = end.toISOString().split("T")[0];

        const rangeSessions = sessions.filter((s) => {
          const dateStr = s.date.split("T")[0];
          return dateStr >= startStr && dateStr <= endStr;
        });

        const mins = rangeSessions.reduce((acc, s) => acc + s.duration / 60, 0);
        data.push({
          label: `Wk ${4 - i}`,
          dateLabel: `${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })}-${end.getDate()}`,
          minutes: mins,
          sessionsCount: rangeSessions.length,
          isActive: i === 0,
        });
      }
      return data;
    } else {
      const data = [];
      for (let i = 11; i >= 0; i--) {
        const targetMonth = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const y = targetMonth.getFullYear();
        const m = targetMonth.getMonth();

        const monthSessions = sessions.filter((s) => {
          const date = new Date(s.date);
          return date.getFullYear() === y && date.getMonth() === m;
        });

        const mins = monthSessions.reduce((acc, s) => acc + s.duration / 60, 0);
        data.push({
          label: targetMonth.toLocaleDateString("en-US", { month: "short" }),
          dateLabel: targetMonth.toLocaleDateString("en-US", {
            year: "2-digit",
          }),
          minutes: mins,
          sessionsCount: monthSessions.length,
          isActive: i === 0,
        });
      }
      return data;
    }
  }, [sessions, timeRange]);

  const maxMinutes = useMemo(() => {
    const max = Math.max(...chartData.map((d) => d.minutes));
    return max < 10 ? 10 : Math.ceil(max / 5) * 5; // round up to multiple of 5, minimum 10
  }, [chartData]);

  const totalMinutesInRange = useMemo(() => {
    return Math.round(chartData.reduce((acc, d) => acc + d.minutes, 0));
  }, [chartData]);

  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);

  return (
    <div className="group relative w-full overflow-hidden rounded-[42px] border border-white/[0.06] bg-white/[0.02] p-6 shadow-2xl backdrop-blur-md md:p-8">
      {/* Glow Effect */}
      <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-white opacity-0 blur-[100px] transition-opacity duration-1000 group-hover:opacity-[0.03]" />

      <div className="relative z-10 mb-8 flex flex-col gap-4 px-1 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <span className="text-[10px] font-bold tracking-[0.3em] text-white/50 uppercase">
            {timeRange === "weekly"
              ? "Weekly Breathing Time"
              : timeRange === "monthly"
                ? "Monthly Consistency"
                : "Yearly Journey"}
          </span>
          <h3 className="text-xl font-light tracking-tight text-white capitalize">
            {timeRange} Activity Tracker
          </h3>
        </div>

        {/* Range Selector Controls */}
        <div className="flex self-start rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur-md sm:self-auto">
          {(["weekly", "monthly", "yearly"] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`rounded-full px-3 py-1 text-[8px] font-black tracking-widest uppercase transition-all duration-300 md:text-[9px] ${
                timeRange === range
                  ? "bg-white text-black shadow-lg"
                  : "text-white/40 hover:text-white"
              }`}
            >
              {range}
            </button>
          ))}
        </div>

        <div className="text-left sm:text-right">
          <span className="text-2xl font-light tracking-tight text-white">
            {totalMinutesInRange}{" "}
            <span className="text-xs font-bold text-white/40 uppercase">
              min
            </span>
          </span>
          <p className="mt-0.5 text-[8px] font-black tracking-widest text-white/30 uppercase">
            Total this{" "}
            {timeRange === "weekly"
              ? "week"
              : timeRange === "monthly"
                ? "month"
                : "year"}
          </p>
        </div>
      </div>

      {/* Bar Chart Container */}
      <div className="relative z-10 flex h-60 items-end justify-between gap-2 px-1 pt-10 pb-2">
        {/* Y-Axis Guideline values */}
        <div className="pointer-events-none absolute top-10 bottom-8 left-0 flex flex-col justify-between text-[8px] font-bold tracking-widest text-white/20 uppercase">
          <span>{maxMinutes}m</span>
          <span>{Math.round(maxMinutes / 2)}m</span>
          <span>0m</span>
        </div>

        {/* Vertical Bars - fully responsive via flex-1 max-w-[48px] */}
        <div className="ml-8 flex h-full flex-1 items-end justify-around gap-1">
          {chartData.map((d, index) => {
            const percentage = (d.minutes / maxMinutes) * 100;
            const isHovered = hoveredBarIndex === index;

            return (
              <div
                key={index}
                className="group/bar relative flex h-full max-w-[48px] flex-1 cursor-pointer flex-col items-center justify-end gap-3"
                onMouseEnter={() => setHoveredBarIndex(index)}
                onMouseLeave={() => setHoveredBarIndex(null)}
              >
                {/* Floating Tooltip/Value on top of Bar */}
                <AnimatePresence>
                  {(isHovered || d.minutes > 0) && (
                    <motion.div
                      initial={{ opacity: 0, y: 5, scale: 0.9 }}
                      animate={{ opacity: 1, y: -4, scale: 1 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="pointer-events-none absolute -top-6 z-50 flex flex-col items-center rounded-lg border border-white/10 bg-black/80 px-2 py-1 whitespace-nowrap shadow-xl"
                    >
                      <span className="text-[9px] font-black tracking-wider text-white">
                        {Math.round(d.minutes)}m
                      </span>
                      {isHovered && (
                        <span className="text-[7px] font-bold tracking-widest text-white/40 uppercase">
                          {d.sessionsCount}{" "}
                          {d.sessionsCount === 1 ? "session" : "sessions"}
                        </span>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Bar Track */}
                <div className="relative flex h-[75%] w-full max-w-[16px] items-end overflow-hidden rounded-full border border-white/[0.05] bg-white/[0.03] shadow-inner sm:max-w-[24px]">
                  {/* Active Bar with Premium Gradient and Glow */}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${percentage}%` }}
                    transition={{ type: "spring", stiffness: 60, damping: 15 }}
                    className={`w-full rounded-full transition-all duration-300 ${
                      d.isActive
                        ? "bg-gradient-to-t from-white/10 via-white/50 to-white shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                        : isHovered
                          ? "bg-gradient-to-t from-white/10 via-white/40 to-white/80 shadow-[0_0_15px_rgba(255,255,255,0.25)]"
                          : "bg-gradient-to-t from-white/[0.05] via-white/20 to-white/40"
                    }`}
                  />
                </div>

                {/* X-Axis labels */}
                <div className="mt-2 flex w-full min-w-0 flex-col items-center gap-0.5 text-center">
                  <span
                    className={`w-full truncate text-[8px] font-black tracking-widest uppercase transition-colors md:text-[9px] ${
                      d.isActive
                        ? "font-bold text-white"
                        : "text-white/40 group-hover/bar:text-white/80"
                    }`}
                  >
                    {d.label}
                  </span>
                  <span className="w-full truncate text-[6px] font-bold tracking-wider text-white/20">
                    {timeRange === "weekly"
                      ? d.dateLabel.split(" ")[1]
                      : d.dateLabel}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export function JournalView({ sessions, stats }: JournalViewProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft =
        scrollContainerRef.current.scrollWidth;
    }
  }, []);

  const activityMap = useMemo(() => {
    const map: Record<string, number> = {};
    sessions.forEach((s) => {
      const dateKey = s.date.split("T")[0];
      map[dateKey] = (map[dateKey] || 0) + s.duration;
    });
    return map;
  }, [sessions]);

  const { weeks, monthLabels } = useMemo(() => {
    const weeksList = [];
    const months = [];
    const now = new Date();
    const startDate = new Date(now);
    startDate.setDate(now.getDate() - now.getDay());
    startDate.setDate(startDate.getDate() - 51 * 7);

    let lastMonth = -1;

    for (let w = 0; w < 52; w++) {
      const weekDays = [];
      const firstDayOfWeek = new Date(startDate);
      firstDayOfWeek.setDate(startDate.getDate() + w * 7);

      const monthIndex = firstDayOfWeek.getMonth();
      if (monthIndex !== lastMonth) {
        months.push({
          label: firstDayOfWeek.toLocaleDateString("en-US", { month: "short" }),
          index: w,
        });
        lastMonth = monthIndex;
      }

      for (let d = 0; d < 7; d++) {
        const targetDate = new Date(firstDayOfWeek);
        targetDate.setDate(firstDayOfWeek.getDate() + d);

        if (targetDate > now) {
          weekDays.push({ date: "", level: -1, duration: 0 });
          continue;
        }

        const dateKey = targetDate.toISOString().split("T")[0];
        const duration = activityMap[dateKey] || 0;

        let level = 0;
        if (duration > 0 && duration < 300) level = 1;
        else if (duration >= 300 && duration < 600) level = 2;
        else if (duration >= 600 && duration < 900) level = 3;
        else if (duration >= 900 && duration < 1200) level = 4;
        else if (duration >= 1200) level = 5;

        weekDays.push({ date: dateKey, level, duration });
      }
      weeksList.push(weekDays);
    }
    return { weeks: weeksList, monthLabels: months };
  }, [activityMap]);

  const { modelBreakdown } = useMemo(() => {
    const breakdown: Record<string, number> = {};
    sessions.forEach((s) => {
      breakdown[s.exerciseId] = (breakdown[s.exerciseId] || 0) + s.duration;
    });
    return {
      modelBreakdown: Object.entries(breakdown)
        .map(([id, duration]) => ({
          exercise: exercises.find((e) => e.id === id) || exercises[0],
          minutes: Math.floor(duration / 60),
          duration,
        }))
        .sort((a, b) => b.duration - a.duration),
    };
  }, [sessions]);

  const recentSessions = [...sessions].reverse().slice(0, 5);

  const levelColors: Record<number, string> = {
    0: "bg-white/[0.03] border-transparent",
    1: "bg-white/10 border-white/5",
    2: "bg-white/20 border-white/10",
    3: "bg-white/40 border-white/15",
    4: "bg-white/60 border-white/20",
    5: "bg-white/80 border-white/25",
    "-1": "bg-transparent border-white/[0.05] pointer-events-none",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="w-full space-y-8 pb-10"
    >
      {/* Header */}
      <div className="mb-2 flex w-full items-start justify-between px-1">
        <div className="space-y-1">
          <h1 className="text-3xl font-light tracking-tight text-white/90">
            Journal
          </h1>
          <p className="text-[10px] font-bold tracking-[0.4em] text-white/40 uppercase">
            Progress Analytics
          </p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white">
          <Calendar size={20} />
        </div>
      </div>

      {/* Main Grid for Widescreen Desktop Layout */}
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        {/* Left Column (Wide Analytics & Breakdown widgets): takes 7 cols on lg, 8 cols on xl */}
        <div className="space-y-8 lg:col-span-7 xl:col-span-8">
          {/* Contribution Heatmap Card */}
          <div className="group relative w-full overflow-hidden rounded-[42px] border border-white/[0.06] bg-white/[0.02] p-6 shadow-2xl backdrop-blur-md">
            {/* iOS Style Inner Glow */}
            <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-white opacity-0 blur-[100px] transition-opacity duration-1000 group-hover:opacity-[0.03]" />

            <div className="mb-8 flex items-center justify-between px-1">
              <span className="text-[10px] font-bold tracking-[0.3em] text-white/50 uppercase">
                Yearly Activity
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[8px] font-bold tracking-widest text-white/40 uppercase">
                  Less
                </span>
                <div className="flex gap-1">
                  {[0, 1, 2, 3, 4, 5].map((l) => (
                    <div
                      key={l}
                      className={`h-2.5 w-2.5 rounded-sm ${levelColors[l]}`}
                    />
                  ))}
                </div>
                <span className="text-[8px] font-bold tracking-widest text-white/40 uppercase">
                  More
                </span>
              </div>
            </div>

            <div className="relative">
              <div
                ref={scrollContainerRef}
                className="scrollbar-hide mask-fade-edges flex gap-4 overflow-x-auto pb-4"
              >
                <div className="sticky left-0 z-20 grid grid-rows-7 gap-1.5 bg-transparent pt-6 pr-1">
                  {[0, 1, 2, 3, 4, 5, 6].map((d) => (
                    <div
                      key={d}
                      className="flex h-3.5 items-center justify-end"
                    >
                      {[1, 3, 5].includes(d) && (
                        <span className="mr-1 text-[8px] font-black tracking-tighter text-white/40 uppercase">
                          {["Mon", "Wed", "Fri"][Math.floor(d / 2)]}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-2">
                  <div className="relative h-4">
                    {monthLabels.map((m, i) => (
                      <span
                        key={i}
                        className="absolute text-[8px] font-black tracking-widest whitespace-nowrap text-white/50 uppercase"
                        style={{ left: `${m.index * 20}px` }}
                      >
                        {m.label}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-1.5">
                    {weeks.map((week, wi) => (
                      <div key={wi} className="grid grid-rows-7 gap-1.5">
                        {week.map((day, di) => (
                          <motion.div
                            key={di}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            className={`h-3.5 w-3.5 rounded-[5px] border-[0.5px] transition-all hover:z-50 hover:scale-150 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] ${levelColors[day.level]} relative overflow-hidden`}
                            title={
                              day.date
                                ? `${day.date}: ${Math.floor(day.duration / 60)} min`
                                : undefined
                            }
                          >
                            {day.level > 0 && (
                              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50" />
                            )}
                          </motion.div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-between border-t border-white/10 px-1 pt-6">
              <div className="flex flex-col">
                <span className="text-xl font-light text-white">
                  {stats.sessionCount}
                </span>
                <span className="text-[8px] font-bold tracking-widest text-white/40 uppercase">
                  Total Sessions
                </span>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-xl font-light text-white">
                  {stats.streak} Days
                </span>
                <span className="text-[8px] font-bold tracking-widest text-white/40 uppercase">
                  Current Streak
                </span>
              </div>
            </div>
          </div>

          {/* New Interactive Bar Based Activity Chart */}
          <DailyActivityBarChart sessions={sessions} />

          {/* Technique Breakdown Card */}
          <div className="group relative w-full overflow-hidden rounded-[42px] border border-white/[0.06] bg-white/[0.02] p-8 shadow-xl backdrop-blur-md">
            {/* iOS Style Inner Glow */}
            <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-white opacity-0 blur-[100px] transition-opacity duration-1000 group-hover:opacity-[0.03]" />
            <div className="pointer-events-none absolute inset-0 bg-white/[0.01]" />
            <div className="relative z-10 mb-8 flex items-center justify-between px-1">
              <span className="text-[10px] font-bold tracking-[0.3em] text-white/50 uppercase">
                Technique Breakdown
              </span>
              <PieChart size={14} className="text-white/40" />
            </div>
            <div className="relative z-10 space-y-8">
              {(() => {
                const totalDuration =
                  sessions.reduce((acc, s) => acc + s.duration, 0) || 1;
                return modelBreakdown.map((item) => {
                  const percentage = Math.round(
                    (item.duration / totalDuration) * 100,
                  );
                  return (
                    <div key={item.exercise.id} className="space-y-3">
                      <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-3">
                          <div className="h-1.5 w-1.5 rounded-full bg-white/40" />
                          <div className="flex items-baseline gap-2">
                            <span className="text-base font-light tracking-tight text-white/90">
                              {item.exercise.name}
                            </span>
                            <span className="text-[10px] font-black tracking-widest text-white/50 uppercase">
                              {percentage}%
                            </span>
                          </div>
                        </div>
                        <span className="text-sm font-bold tracking-tighter text-white/60">
                          {item.minutes} min
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full border border-white/10 bg-white/[0.04]">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{
                            duration: 0.8,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          className="h-full rounded-full bg-gradient-to-r from-white/20 to-white/60"
                        />
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </div>

        {/* Right Column (Focus Metric Detail & History widgets): takes 5 cols on lg, 4 cols on xl */}
        <div className="space-y-8 lg:col-span-5 xl:col-span-4">
          {/* Health Trend Graph (Interactive focus indicator dashboard) */}
          <HealthTrendGraph sessions={sessions} />

          {/* Session History list */}
          <div className="w-full space-y-6 pb-4">
            <div className="flex items-center justify-between px-2">
              <span className="text-[10px] font-bold tracking-[0.3em] text-white/50 uppercase">
                Recent Sessions
              </span>
              <Zap size={16} className="text-white/40" />
            </div>
            <div className="flex flex-col gap-4">
              {recentSessions.map((session, i) => {
                const ex =
                  exercises.find((e) => e.id === session.exerciseId) ||
                  exercises[0];
                const date = new Date(session.date);
                return (
                  <motion.div
                    key={i}
                    className="group relative flex items-center justify-between overflow-hidden rounded-[42px] border border-white/[0.06] bg-white/[0.02] p-6 shadow-xl backdrop-blur-md"
                  >
                    {/* iOS Style Inner Glow */}
                    <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-white opacity-0 blur-[100px] transition-opacity duration-1000 group-hover:opacity-[0.03]" />

                    <div className="flex items-center gap-4">
                      <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-[16px] border border-white/10 bg-white/[0.04]">
                        <Zap size={18} className="relative z-10 text-white" />
                        <div className="absolute inset-0 rounded-full bg-white opacity-10 blur-xl" />
                      </div>
                      <div>
                        <h4 className="mb-1 text-sm leading-none font-light tracking-tight text-white">
                          {ex.name}
                        </h4>
                        <p className="text-[9px] font-bold tracking-widest text-white/50 uppercase">
                          {date.toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-light tracking-tighter text-white">
                        {Math.floor(session.duration / 60)}:
                        {(session.duration % 60).toString().padStart(2, "0")}
                      </span>
                      <p className="mt-0.5 text-[8px] font-black tracking-[0.2em] text-white/40 uppercase">
                        Duration
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
