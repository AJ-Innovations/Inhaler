"use client";

import { exercises } from "@features/breathing/data";
import { Badge } from "@features/breathing/hooks/useCustomExercises";
import { AnimatePresence, motion } from "framer-motion";
import { Activity, Calendar, PieChart, Wind, Zap } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";

import { DailyActivityBarChart } from "./components/DailyActivityBarChart";
import { HealthTrendGraph } from "./components/HealthTrendGraph";

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
