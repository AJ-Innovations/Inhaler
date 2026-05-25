import { exercises } from "@features/breathing/data";
import { useMemo } from "react";

import { BreakdownItem, HeatmapDay, Session } from "../types";

export function useJournalStats(sessions: Session[]) {
  const activityMap = useMemo(() => {
    const map: Record<string, number> = {};
    sessions.forEach((s) => {
      const dateKey = s.date.split("T")[0];
      map[dateKey] = (map[dateKey] || 0) + s.duration;
    });
    return map;
  }, [sessions]);

  const { weeks, monthLabels } = useMemo(() => {
    const weeksList: HeatmapDay[][] = [];
    const months: { label: string; index: number }[] = [];
    const now = new Date();
    const startDate = new Date(now);
    startDate.setDate(now.getDate() - now.getDay());
    startDate.setDate(startDate.getDate() - 51 * 7);

    let lastMonth = -1;

    for (let w = 0; w < 52; w++) {
      const weekDays: HeatmapDay[] = [];
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
        .sort((a, b) => b.duration - a.duration) as BreakdownItem[],
    };
  }, [sessions]);

  const recentSessions = useMemo(() => {
    return [...sessions].reverse().slice(0, 5);
  }, [sessions]);

  return {
    activityMap,
    weeks,
    monthLabels,
    modelBreakdown,
    recentSessions,
  };
}
