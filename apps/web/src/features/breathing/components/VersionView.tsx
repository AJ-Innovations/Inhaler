"use client";

import { motion } from "framer-motion";
import { Activity, HeartPulse, Wind } from "lucide-react";
import React from "react";

export function VersionView({ onComplete }: { onComplete: () => void }) {
  return (
    <div className="relative flex h-[100dvh] w-full flex-col text-white">
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-black/30 to-black/80" />

      <div className="relative z-10 flex h-full flex-col items-center justify-between px-8 pt-16 pb-10">
        <div className="flex flex-col items-center space-y-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-7xl font-light tracking-tighter"
          >
            V 0.1.0
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-2"
          >
            <h2 className="text-2xl font-medium tracking-tight">
              Breathe Better. Live Better.
            </h2>
            <p className="max-w-[280px] text-xs leading-relaxed text-gray-300">
              From guided exercises to lung capacity tracking—your breathing
              space is now more immersive and effective.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 mb-4 w-full max-w-sm space-y-6"
        >
          <div className="flex gap-5">
            <Wind className="mt-1 shrink-0 text-white" size={24} />
            <div className="space-y-1">
              <h3 className="font-semibold text-white">Breathing Reimagined</h3>
              <p className="text-xs leading-relaxed text-gray-400">
                Experience our new fluid interface designed for perfect breath
                control and relaxation.
              </p>
            </div>
          </div>

          <div className="flex gap-5">
            <Activity className="mt-1 shrink-0 text-white" size={24} />
            <div className="space-y-1">
              <h3 className="font-semibold text-white">
                Visual & Audio Harmony
              </h3>
              <p className="text-xs leading-relaxed text-gray-400">
                Immerse yourself in our updated soundscapes and visual cues
                synced to your breath.
              </p>
            </div>
          </div>

          <div className="flex gap-5">
            <HeartPulse className="mt-1 shrink-0 text-white" size={24} />
            <div className="space-y-1">
              <h3 className="font-semibold text-white">Better Lung Health</h3>
              <p className="text-xs leading-relaxed text-gray-400">
                Track your progress with new insights, personalized routines,
                and capacity metrics.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          onClick={onComplete}
          className="h-14 w-full max-w-sm shrink-0 rounded-full bg-white text-[13px] font-bold tracking-wide text-black shadow-xl transition-transform active:scale-95"
        >
          Got it
        </motion.button>
      </div>
    </div>
  );
}
