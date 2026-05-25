import { motion } from "framer-motion";
import { PieChart } from "lucide-react";
import React from "react";

import { BreakdownItem } from "../types";

interface TechniqueBreakdownProps {
  modelBreakdown: BreakdownItem[];
  totalDuration: number;
}

export function TechniqueBreakdown({
  modelBreakdown,
  totalDuration,
}: TechniqueBreakdownProps) {
  const safeTotal = totalDuration || 1;

  return (
    <div className="group relative w-full overflow-hidden rounded-[42px] border border-white/[0.06] bg-white/[0.02] p-8 shadow-xl backdrop-blur-md">
      <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-white opacity-0 blur-[100px] transition-opacity duration-1000 group-hover:opacity-[0.03]" />
      <div className="pointer-events-none absolute inset-0 bg-white/[0.01]" />

      <div className="relative z-10 mb-8 flex items-center justify-between px-1">
        <span className="text-[10px] font-bold tracking-[0.3em] text-white/50 uppercase">
          Technique Breakdown
        </span>
        <PieChart size={14} className="text-white/40" />
      </div>

      <div className="relative z-10 space-y-8">
        {modelBreakdown.map((item) => {
          const percentage = Math.round((item.duration / safeTotal) * 100);
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
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full rounded-full bg-gradient-to-r from-white/20 to-white/60"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
