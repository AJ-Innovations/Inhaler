import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import React from "react";

import { experienceLevels } from "../data/onboardingSteps";

export function ExperienceStep({
  selectedExperience,
  setSelectedExperience,
  onNext,
  onBack,
}: {
  selectedExperience: string | null;
  setSelectedExperience: (id: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <motion.div
      key="q_experience"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="mx-auto flex w-full max-w-[480px] flex-col justify-center space-y-8 text-center"
    >
      <div className="space-y-2">
        <span className="text-[9px] font-black tracking-[0.3em] text-white/50 uppercase">
          Step 3 of 4
        </span>
        <h2 className="text-3xl leading-tight font-light tracking-tight text-white">
          What is your experience level?
        </h2>
        <p className="text-sm font-light text-gray-400">
          Determines inhale/hold intervals and unlocking advanced options.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {experienceLevels.map((e) => (
          <button
            key={e.id}
            onClick={() => {
              setSelectedExperience(e.id);
              setTimeout(onNext, 300);
            }}
            className={`flex w-full items-center gap-4 rounded-full border p-5 text-left transition-all duration-300 ${
              selectedExperience === e.id
                ? "scale-[1.02] border-emerald-500/50 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.06)]"
                : "border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04]"
            }`}
          >
            <div className="space-y-1">
              <h4 className="text-md leading-none font-semibold text-white">
                {e.title}
              </h4>
              <p className="mt-1 text-[12px] font-light text-gray-400">
                {e.desc}
              </p>
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={onBack}
        className="mx-auto inline-flex items-center gap-2 text-xs text-gray-500 transition-colors hover:text-white"
      >
        <ChevronLeft size={16} /> Back
      </button>
    </motion.div>
  );
}
