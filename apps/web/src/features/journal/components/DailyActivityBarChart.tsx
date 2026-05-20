"use client";

import { AnimatePresence, motion } from "framer-motion";
import React, { useMemo, useState } from "react";

interface Session {
  exerciseId: string;
  date: string;
  duration: number;
  cycles?: number;
}

/**
 * Interactive bar chart with weekly/monthly/yearly time range selector.
 * Displays breathing session minutes with animated bars and hover tooltips.
 * Extracted from JournalView.tsx for modularity.
 */
export const DailyActivityBarChart = ({
  sessions,
}: {
  sessions: Session[];
}) => {
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
