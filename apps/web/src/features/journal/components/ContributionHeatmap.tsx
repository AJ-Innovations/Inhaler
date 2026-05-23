import { motion } from "framer-motion";
import React, { useEffect, useRef } from "react";
import { LEVEL_COLORS } from "../data/constants";
import { HeatmapDay } from "../types";

interface ContributionHeatmapProps {
  sessionCount: number;
  streak: number;
  weeks: HeatmapDay[][];
  monthLabels: { label: string; index: number }[];
}

export function ContributionHeatmap({
  sessionCount,
  streak,
  weeks,
  monthLabels,
}: ContributionHeatmapProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft =
        scrollContainerRef.current.scrollWidth;
    }
  }, []);

  return (
    <div className="group relative w-full overflow-hidden rounded-[42px] border border-white/[0.06] bg-white/[0.02] p-6 shadow-2xl backdrop-blur-md">
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
                className={`h-2.5 w-2.5 rounded-sm ${LEVEL_COLORS[l]}`}
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
              <div key={d} className="flex h-3.5 items-center justify-end">
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
                      className={`h-3.5 w-3.5 rounded-[5px] border-[0.5px] transition-all hover:z-50 hover:scale-150 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] ${LEVEL_COLORS[day.level]} relative overflow-hidden`}
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
          <span className="text-xl font-light text-white">{sessionCount}</span>
          <span className="text-[8px] font-bold tracking-widest text-white/40 uppercase">
            Total Sessions
          </span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-xl font-light text-white">{streak} Days</span>
          <span className="text-[8px] font-bold tracking-widest text-white/40 uppercase">
            Current Streak
          </span>
        </div>
      </div>
    </div>
  );
}
