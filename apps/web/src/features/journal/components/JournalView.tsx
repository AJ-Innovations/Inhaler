"use client";

import { motion } from "framer-motion";
import React from "react";

import { DailyActivityBarChart } from "./DailyActivityBarChart";
import { HealthTrendGraph } from "./HealthTrendGraph";
import { JournalHeader } from "./JournalHeader";
import { ContributionHeatmap } from "./ContributionHeatmap";
import { TechniqueBreakdown } from "./TechniqueBreakdown";
import { RecentSessions } from "./RecentSessions";
import { useJournalStats } from "../hooks/useJournalStats";
import { JournalViewProps } from "../types";

export function JournalView({ sessions, stats }: JournalViewProps) {
  const { weeks, monthLabels, modelBreakdown, recentSessions } =
    useJournalStats(sessions);

  const totalDuration = sessions.reduce((acc, s) => acc + s.duration, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="w-full space-y-8 pb-10"
    >
      <JournalHeader />

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        <div className="space-y-8 lg:col-span-7 xl:col-span-8">
          <ContributionHeatmap
            sessionCount={stats.sessionCount}
            streak={stats.streak}
            weeks={weeks}
            monthLabels={monthLabels}
          />

          <DailyActivityBarChart sessions={sessions} />

          <TechniqueBreakdown
            modelBreakdown={modelBreakdown}
            totalDuration={totalDuration}
          />
        </div>

        <div className="space-y-8 lg:col-span-5 xl:col-span-4">
          <HealthTrendGraph sessions={sessions} />

          <RecentSessions sessions={recentSessions} />
        </div>
      </div>
    </motion.div>
  );
}
