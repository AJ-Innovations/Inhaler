import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import React from "react";

export function SuccessStep({
  chosenPlan,
  handleFinalRedirect,
}: {
  chosenPlan: string;
  handleFinalRedirect: () => void;
}) {
  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="flex h-full flex-col items-center justify-center space-y-12 text-center"
    >
      <div className="space-y-4">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 15 }}
          className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-[32px] bg-gradient-to-br from-emerald-400 to-green-600 shadow-[0_0_50px_rgba(16,185,129,0.3)]"
        >
          <CheckCircle2 size={40} className="text-white" />
        </motion.div>
      </div>

      <div className="space-y-3">
        <h2 className="text-3xl font-light tracking-tight text-white">
          Sanctuary Unlocked
        </h2>
        <p className="mx-auto max-w-[280px] text-xs leading-relaxed font-light text-gray-400">
          {chosenPlan === "free"
            ? "Welcome to Spirox! Your account is ready and free breathing cycles are unlocked."
            : `Welcome to Spirox Pro! Your premium billing is authorized and all masteries are unlocked.`}
        </p>
      </div>

      <button
        onClick={handleFinalRedirect}
        className="mt-8 flex h-14 w-full items-center justify-center gap-3 rounded-full bg-white text-[10px] font-black tracking-[0.2em] text-black uppercase shadow-2xl transition-all hover:scale-105 active:scale-95"
      >
        Enter Your Sanctuary
        <ArrowRight size={16} strokeWidth={3} />
      </button>
    </motion.div>
  );
}
