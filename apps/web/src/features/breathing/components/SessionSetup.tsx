"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  Infinity,
  RotateCcw,
  Sparkles,
  Timer,
} from "lucide-react";
import React, { useState } from "react";

import { Exercise } from "../data";

const getAmbientImage = (activeSoundscape: string) => {
  switch (activeSoundscape) {
    case "zen-river":
      return "/image/ambients/river.png";
    case "zen-fountain":
      return "/image/ambients/whaterfalls.png";
    case "winter-rain":
      return "/image/ambients/rain.png";
    case "light-rain":
      return "/image/ambients/rain2.png";
    case "nature-birds":
      return "/image/ambients/nature2.png";
    case "hz-transformation":
      return "/image/ambients/galaxy.png";
    case "white-noise":
      return "/image/ambients/galaxy2.png";
    case "pink-noise":
      return "/image/ambients/galaxy3.png";
    case "brown-noise":
      return "/image/ambients/nature.png";
    case "beach":
      return "/image/ambients/beach.png";
    case "lake":
      return "/image/ambients/lake4.png";
    case "marine":
      return "/image/ambients/marain.png";
    case "desert":
      return "/image/ambients/desert3.png";
    case "ethereal":
      return "/image/ambients/loop.png";
    case "forest":
      return "/image/ambients/forest.png";
    case "leaf":
    default:
      return "/image/ambients/leaf.png";
  }
};

interface SessionSetupProps {
  exercise: Exercise;
  onBack: () => void;
  onConfirm: (config: SessionConfig) => void;
  soundscape: any;
}

export interface SessionConfig {
  mode: "duration" | "cycles" | "infinite";
  value: number;
}

export function SessionSetup({
  exercise,
  onBack,
  onConfirm,
  soundscape,
}: SessionSetupProps) {
  const [mode, setMode] = useState<"duration" | "cycles" | "infinite">(
    "duration",
  );
  const [value, setValue] = useState(5);

  const durationOptions = [2, 5, 10, 15, 20];
  const cycleOptions = [10, 20, 30, 50, 100];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="scrollbar-hide fixed inset-0 z-[200] overflow-y-auto bg-black text-white"
    >
      {/* Cinematic Natural Background */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-black">
        <AnimatePresence mode="wait">
          <motion.div
            key={soundscape.activeSoundscape}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1.0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.8, ease: "easeInOut" }}
            className="absolute inset-0 scale-110 bg-cover bg-center blur-[10px] transition-all duration-1000"
            style={{
              backgroundImage: `url(${getAmbientImage(soundscape.activeSoundscape)})`,
            }}
          />
        </AnimatePresence>
      </div>
      <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-black/20 via-black/40 to-black/80" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[480px] flex-col items-center justify-center px-6 py-8 md:max-w-[700px] md:px-8 lg:max-w-7xl lg:px-12 lg:py-12">
        {/* Header - Full Width */}
        <div className="mb-8 flex w-full items-center justify-between lg:mb-12">
          <button
            onClick={onBack}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white shadow-xl transition-all hover:border-white/30 hover:bg-white/20"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex flex-col items-center">
            <span className="mb-1 text-[10px] font-bold tracking-[0.4em] text-gray-200 uppercase">
              Configuration
            </span>
            <h2 className="text-xl font-light tracking-tight text-white">
              {exercise.name}
            </h2>
          </div>
          <div className="h-12 w-12" /> {/* Spacer */}
        </div>

        {/* Responsive Grid Layout */}
        <div className="flex w-full flex-col md:my-auto md:grid md:grid-cols-12 md:items-center md:gap-8 lg:gap-12">
          {/* Left Column: Visual Highlight (Sparkles & Title) */}
          <div className="mb-10 flex flex-col items-center text-center md:col-span-5 md:mb-0 md:items-start md:text-left">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative flex h-24 w-24 items-center justify-center rounded-full border border-white bg-white shadow-[0_0_50px_rgba(255,255,255,0.4)] backdrop-blur-2xl md:h-28 md:w-28 lg:h-32 lg:w-32"
            >
              <Sparkles
                className="relative z-10 animate-pulse text-black"
                size={40}
                strokeWidth={1.5}
              />
            </motion.div>
            <h1 className="mt-8 text-4xl leading-tight font-light tracking-tight text-white md:text-[2.75rem] lg:text-5xl">
              Set Your Goal
            </h1>
            <p className="mt-4 hidden max-w-[320px] text-sm leading-relaxed font-light text-gray-200 md:block">
              Customize your breathing experience. Select standard durations,
              set a target number of breath rounds, or flow without boundaries
              in a free session.
            </p>
          </div>

          {/* Right Column: Interactive Configuration Form Box */}
          <div className="mx-auto flex w-full max-w-[460px] flex-col justify-between rounded-[36px] border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-3xl sm:rounded-[40px] sm:p-8 md:col-span-7 md:max-w-[480px] md:p-8 lg:p-10">
            {/* Mode Selector (iOS Sliding Tab) */}
            <div className="mb-8 flex items-center rounded-full border border-white/[0.08] bg-white/[0.05] p-1.5 shadow-2xl backdrop-blur-3xl">
              {[
                { id: "duration", icon: Timer, label: "Duration" },
                { id: "cycles", icon: RotateCcw, label: "Cycles" },
                { id: "infinite", icon: Infinity, label: "Free" },
              ].map((item) => {
                const isActive = mode === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setMode(item.id as typeof mode);
                      if (item.id === "duration") setValue(5);
                      if (item.id === "cycles") setValue(20);
                    }}
                    className={`relative flex flex-1 flex-col items-center gap-1.5 rounded-full py-4 transition-all duration-500 ${
                      isActive ? "text-white" : "text-gray-200 hover:text-white"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="setup-mode-bg"
                        className="absolute inset-0 rounded-full border border-white/10 bg-white/10 shadow-lg"
                        transition={{
                          type: "spring",
                          duration: 0.6,
                          bounce: 0.2,
                        }}
                      />
                    )}
                    <item.icon
                      size={18}
                      className="relative z-10"
                      strokeWidth={isActive ? 2 : 1.5}
                    />
                    <span className="relative z-10 text-[9px] font-black tracking-[0.15em] uppercase">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Value Selector Area */}
            <div className="flex min-h-[160px] flex-col justify-center">
              {mode !== "infinite" ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-[10px] font-black tracking-[0.4em] text-gray-200 uppercase">
                      Practice Intensity
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-6xl leading-none font-light text-white">
                        {value}
                      </span>
                      <span className="text-lg font-light text-gray-200 lowercase">
                        {mode === "duration" ? "minutes" : "rounds"}
                      </span>
                    </div>
                  </div>

                  <div className="mx-auto grid w-full max-w-[320px] grid-cols-5 gap-3">
                    {(mode === "duration" ? durationOptions : cycleOptions).map(
                      (opt) => (
                        <button
                          key={opt}
                          onClick={() => setValue(opt)}
                          className={`flex aspect-square items-center justify-center rounded-full border text-sm font-medium backdrop-blur-md transition-all duration-500 ${
                            value === opt
                              ? "scale-110 border-white bg-white text-black shadow-[0_0_30px_rgba(255,255,255,0.4)]"
                              : "border-white/30 bg-white/10 text-gray-200 hover:border-white/60 hover:bg-white/20 hover:text-white"
                          }`}
                        >
                          {opt}
                        </button>
                      ),
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-6 rounded-[28px] border border-white/15 bg-white/[0.06] p-8 text-center backdrop-blur-2xl"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/30 bg-white/15 text-white">
                    <Infinity size={32} strokeWidth={1} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-light text-white">
                      Unrestricted Flow
                    </h3>
                  </div>
                </motion.div>
              )}
            </div>

            {/* CTA Button */}
            <div className="pt-6">
              <button
                onClick={() => onConfirm({ mode, value })}
                className="group relative flex h-14 w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-white text-sm font-black tracking-[0.2em] text-black uppercase shadow-[0_20px_40px_rgba(255,255,255,0.15)] transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span className="relative z-10">Confirm Journey</span>
                <Check
                  size={20}
                  className="relative z-10 transition-transform group-hover:scale-110"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
