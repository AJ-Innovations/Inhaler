"use client";

import { exercises } from "@features/breathing/data";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  Brain,
  ChevronRight,
  Info,
  ShieldCheck,
  Timer,
  Wind,
} from "lucide-react";
import React, { useMemo, useState } from "react";

interface Session {
  exerciseId: string;
  date: string;
  duration: number;
  cycles?: number;
}

/**
 * Multi-metric health trend SVG chart with interactive legend.
 * Tracks Vagal Tone, Coherence, Lung Capacity, CO2 Tolerance, and Neural Calm.
 * Extracted from JournalView.tsx for modularity.
 */
export const HealthTrendGraph = ({ sessions }: { sessions: Session[] }) => {
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
