import { motion } from "framer-motion";
import React from "react";

export function CalibrationStep({
  calibrationProgress,
  calibrationText,
}: {
  calibrationProgress: number;
  calibrationText: string;
}) {
  return (
    <motion.div
      key="calibrating"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      className="flex h-full flex-col items-center justify-center space-y-12 text-center"
    >
      {/* Pulsing Diaphragm Simulator */}
      <div className="relative flex h-44 w-44 items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{
            repeat: Infinity,
            duration: 3.5,
            ease: "easeInOut",
          }}
          className="absolute inset-0 rounded-full bg-emerald-500/10 blur-2xl"
        />
        <motion.div
          animate={{ scale: [0.8, 1.15, 0.8] }}
          transition={{
            repeat: Infinity,
            duration: 3.5,
            ease: "easeInOut",
          }}
          className="relative flex h-32 w-32 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/5 shadow-[0_0_30px_rgba(16,185,129,0.06)]"
        >
          <span className="text-2xl font-light text-emerald-400">
            {calibrationProgress}%
          </span>
        </motion.div>
      </div>

      <div className="space-y-3">
        <h3 className="text-xl font-light tracking-tight text-white">
          Generating Personalized Sanctuary
        </h3>
        <p className="text-md mx-auto h-10 max-w-[280px] leading-relaxed font-light text-gray-300 transition-all duration-300">
          {calibrationText}
        </p>
      </div>
    </motion.div>
  );
}
