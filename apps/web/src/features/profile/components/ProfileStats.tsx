import { Target, Trophy, Zap as ZapIcon } from "lucide-react";
import React from "react";

interface ProfileStatsProps {
  stats: {
    totalMinutes: number;
    sessionCount: number;
    streak: number;
  };
}

export function ProfileStats({ stats }: ProfileStatsProps) {
  return (
    <div className="group relative w-full overflow-hidden rounded-[42px] border border-white/[0.06] bg-white/[0.02] p-8 shadow-2xl backdrop-blur-md">
      {/* iOS Style Inner Glow */}
      <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-white opacity-0 blur-[100px] transition-opacity duration-1000 group-hover:opacity-[0.03]" />
      <h3 className="relative z-10 mb-6 px-1 text-[10px] font-bold tracking-[0.3em] text-white/50 uppercase">
        Mindfulness Journey
      </h3>
      <div className="relative z-10 grid grid-cols-3 gap-4">
        {[
          {
            icon: Target,
            label: "Minutes",
            value: Math.floor(stats.totalMinutes),
          },
          { icon: ZapIcon, label: "Sessions", value: stats.sessionCount },
          { icon: Trophy, label: "Streak", value: stats.streak },
        ].map((stat) => (
          <div key={stat.label} className="flex flex-col items-center gap-2">
            <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] shadow-inner">
              <div className="absolute inset-0 rounded-full bg-white opacity-10 blur-xl" />
              <stat.icon size={16} className="relative z-10 text-white" />
            </div>
            <span className="text-xl font-light text-white">{stat.value}</span>
            <span className="text-[8px] font-bold tracking-widest text-white/40 uppercase">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
