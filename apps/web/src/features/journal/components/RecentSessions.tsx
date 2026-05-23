import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import React from "react";
import { exercises } from "@features/breathing/data";
import { Session } from "../types";

interface RecentSessionsProps {
  sessions: Session[];
}

export function RecentSessions({ sessions }: RecentSessionsProps) {
  return (
    <div className="w-full space-y-6 pb-4">
      <div className="flex items-center justify-between px-2">
        <span className="text-[10px] font-bold tracking-[0.3em] text-white/50 uppercase">
          Recent Sessions
        </span>
        <Zap size={16} className="text-white/40" />
      </div>
      <div className="flex flex-col gap-4">
        {sessions.map((session, i) => {
          const ex =
            exercises.find((e) => e.id === session.exerciseId) || exercises[0];
          const date = new Date(session.date);
          return (
            <motion.div
              key={i}
              className="group relative flex items-center justify-between overflow-hidden rounded-[42px] border border-white/[0.06] bg-white/[0.02] p-6 shadow-xl backdrop-blur-md"
            >
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
  );
}
