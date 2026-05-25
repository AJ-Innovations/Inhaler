import { Badge } from "@features/breathing/hooks/useCustomExercises";
import { Plus } from "lucide-react";
import React from "react";

import { BadgeCard } from "./BadgeCard";

interface CategorySectionProps {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
  badges: Badge[];
  onAddGoalClick?: () => void;
  onBadgeClick: (badge: Badge) => void;
  onDeleteGoal: (id: string) => void;
}

export function CategorySection({
  id,
  label,
  icon: CategoryIcon,
  color,
  badges,
  onAddGoalClick,
  onBadgeClick,
  onDeleteGoal,
}: CategorySectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div
            className={`rounded-xl border border-white/10 bg-white/[0.04] p-2 ${color}`}
          >
            <CategoryIcon size={16} />
          </div>
          <span className="text-[10px] font-black tracking-[0.3em] text-white/50 uppercase">
            {label}
          </span>
        </div>
        {id === "custom" && onAddGoalClick && (
          <button
            onClick={onAddGoalClick}
            className="rounded-xl border border-white/10 bg-white/[0.04] p-2 text-white transition-colors hover:bg-white/10"
          >
            <Plus size={16} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {badges.length > 0 ? (
          badges.map((badge) => (
            <BadgeCard
              key={`${id}-${badge.id}`}
              badge={badge}
              category={id}
              onClick={onBadgeClick}
              onDelete={onDeleteGoal}
            />
          ))
        ) : (
          <div className="rounded-[42px] border border-dashed border-white/10 py-10 text-center opacity-20">
            <p className="text-[10px] font-bold tracking-widest text-white uppercase">
              No goals set
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
