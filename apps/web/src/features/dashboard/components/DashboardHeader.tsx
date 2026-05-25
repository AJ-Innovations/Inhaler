import { Trophy } from "lucide-react";
import React from "react";

export function DashboardHeader() {
  return (
    <div className="mb-4 flex w-full items-start justify-between px-1">
      <div className="space-y-1">
        <h1 className="text-3xl font-light tracking-tight text-white/90">
          Zen Mastery
        </h1>
        <p className="text-[10px] font-black tracking-[0.4em] text-white/40 uppercase">
          Path to Resilience
        </p>
      </div>
      <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white">
        <Trophy size={20} />
      </div>
    </div>
  );
}
