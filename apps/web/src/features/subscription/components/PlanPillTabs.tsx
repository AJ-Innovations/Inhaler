import React from "react";
import { PlanType } from "../types";

interface PlanPillTabsProps {
  plans: PlanType[];
  activeIndex: number;
  setActiveIndex: (index: number) => void;
}

export function PlanPillTabs({
  plans,
  activeIndex,
  setActiveIndex,
}: PlanPillTabsProps) {
  return (
    <div className="flex shrink-0 items-center justify-center px-6 pt-4 pb-2 lg:hidden">
      <div className="flex w-full gap-1 rounded-full border border-white/[0.06] bg-white/[0.04] p-1">
        {plans.map((plan, index) => {
          const isSelected = index === activeIndex;
          const PlanIcon = plan.icon;

          const selectedClass =
            plan.color === "blue"
              ? "bg-blue-600 text-white shadow-[0_0_16px_rgba(37,99,235,0.35)]"
              : plan.color === "gold"
                ? "bg-amber-400 text-black shadow-[0_0_16px_rgba(245,158,11,0.40)]"
                : "bg-emerald-500 text-black shadow-[0_0_16px_rgba(16,185,129,0.35)]";

          return (
            <button
              key={plan.id}
              onClick={() => setActiveIndex(index)}
              className={`flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full text-[10px] font-black tracking-[0.15em] uppercase transition-all duration-300 ${
                isSelected
                  ? selectedClass
                  : "text-gray-300 hover:bg-white/[0.04] hover:text-white"
              }`}
            >
              <PlanIcon size={11} />
              {plan.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
