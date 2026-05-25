import { Badge } from "@features/breathing/hooks/useCustomExercises";
import { motion } from "framer-motion";
import { CheckCircle2, Lock, Play, Sparkles, Trash2 } from "lucide-react";
import React from "react";

import { GOAL_ICONS } from "../data/goalIcons";

interface BadgeCardProps {
  badge: Badge;
  category: string;
  onClick: (badge: Badge) => void;
  onDelete: (id: string) => void;
}

export function BadgeCard({
  badge,
  category,
  onClick,
  onDelete,
}: BadgeCardProps) {
  const isCustom = badge.category === "custom";
  const CustomIcon = badge.iconId
    ? GOAL_ICONS[badge.iconId as keyof typeof GOAL_ICONS]
    : null;
  const DisplayIcon = CustomIcon || (badge.unlocked ? Sparkles : Lock);

  return (
    <motion.div
      onClick={() => onClick(badge)}
      className={`group relative w-full overflow-hidden rounded-[42px] border border-white/[0.06] bg-white/[0.02] p-9 text-left shadow-2xl backdrop-blur-md ${
        !badge.unlocked && "opacity-50"
      } ${isCustom ? "cursor-pointer hover:border-white/10" : "cursor-default"}`}
    >
      <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-white opacity-0 blur-[100px] transition-opacity duration-1000 group-hover:opacity-[0.03]" />

      <div className="relative z-10 mb-10 flex items-start gap-7">
        <div className="relative mt-1 flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-[22px] border border-white/10 bg-white/[0.04] transition-all duration-700">
          <div className="absolute inset-0 rounded-full bg-white opacity-10 blur-xl" />
          <DisplayIcon
            size={DisplayIcon === CustomIcon ? 28 : 24}
            strokeWidth={1.5}
            className="relative z-10 text-white"
          />
        </div>
        <div className="min-w-0 flex-1 space-y-3">
          <div className="space-y-1">
            <h4 className="truncate text-xl font-light tracking-tight text-white">
              {badge.name}
            </h4>
            <p className="text-[10px] leading-relaxed font-bold tracking-widest text-white/60 uppercase">
              {badge.description}
            </p>
          </div>

          {badge.unlocked ? (
            <div className="inline-flex items-center gap-2">
              <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[8px] font-black tracking-[0.2em] text-white/90 uppercase shadow-inner">
                <CheckCircle2 size={10} className="text-white" />
                {isCustom ? "GOAL MASTERED" : "EARNED"}
              </div>
            </div>
          ) : (
            <div className="inline-flex">
              <div className="rounded-full border border-white/[0.05] bg-white/[0.02] px-3 py-1 text-[8px] font-black tracking-[0.2em] text-white/50 uppercase">
                IN PROGRESS
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="relative z-10 mb-4 flex items-end justify-between gap-8">
        <div className="flex-1 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-[8px] font-black tracking-widest text-white/40 uppercase">
              Practice Goal
            </span>
            <span className="text-[8px] font-black tracking-widest text-white/40 uppercase">
              {badge.requirement}m
            </span>
          </div>
          {!badge.unlocked && badge.progress !== undefined && (
            <div className="relative h-2 w-full overflow-hidden rounded-full border border-white/[0.05] bg-white/[0.03] p-[1px]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${badge.progress}%` }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="h-full rounded-full bg-gradient-to-r from-white/30 to-white/60 shadow-[0_0_10px_rgba(255,255,255,0.1)]"
              />
            </div>
          )}
        </div>

        <div className="shrink-0 text-right">
          <div className="flex flex-col items-end gap-2">
            <span className="text-4xl leading-none font-light tracking-tighter text-white tabular-nums">
              {Math.round(badge.progress || 0)}%
            </span>
            {isCustom && !badge.unlocked && (
              <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 font-bold text-black shadow-lg transition-all active:scale-95">
                <Play size={10} className="fill-black text-black" />
                <span className="text-[8px] tracking-widest text-black uppercase">
                  Begin
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {isCustom && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(badge.id);
          }}
          className="absolute top-4 right-4 z-20 p-3 text-white/40 opacity-40 transition-all hover:text-white hover:opacity-100"
        >
          <Trash2 size={16} />
        </button>
      )}
    </motion.div>
  );
}
