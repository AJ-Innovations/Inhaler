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

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[480px] flex-col px-6 py-12 md:max-w-[540px]">
        {/* Header */}
        <div className="mb-12 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white shadow-xl transition-all hover:bg-white/10"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex flex-col items-center">
            <span className="mb-1 text-[10px] font-bold tracking-[0.4em] text-white/40 uppercase">
              Configuration
            </span>
            <h2 className="text-xl font-light tracking-tight text-white">
              {exercise.name}
            </h2>
          </div>
          <div className="h-12 w-12" /> {/* Spacer */}
        </div>

        {/* Hero Illustration / Icon */}
        <div className="mb-16 flex flex-col items-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative flex h-24 w-24 items-center justify-center rounded-full border border-white bg-white shadow-[0_0_50px_rgba(255,255,255,0.4)] backdrop-blur-2xl"
          >
            <Sparkles
              className="relative z-10 animate-pulse text-black"
              size={40}
              strokeWidth={1.5}
            />
          </motion.div>
          <h1 className="mt-8 text-4xl font-light tracking-tight text-white">
            Set Your Goal
          </h1>
        </div>

        {/* Mode Selector (iOS Sliding Tab) */}
        <div className="mb-10 flex items-center rounded-full border border-white/[0.05] bg-white/[0.03] p-1.5 shadow-2xl backdrop-blur-3xl">
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
                  isActive ? "text-white" : "text-gray-400 hover:text-white"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="setup-mode-bg"
                    className="absolute inset-0 rounded-full border border-white/10 bg-white/10 shadow-lg"
                    transition={{ type: "spring", duration: 0.6, bounce: 0.2 }}
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

        {/* Value Grid */}
        <div className="flex-1 space-y-12">
          {mode !== "infinite" ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="flex flex-col items-center gap-2">
                <span className="text-[10px] font-black tracking-[0.4em] text-gray-600 uppercase">
                  Practice Intensity
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl leading-none font-light text-white">
                    {value}
                  </span>
                  <span className="text-lg font-light text-gray-500 lowercase">
                    {mode === "duration" ? "minutes" : "rounds"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-5 gap-3">
                {(mode === "duration" ? durationOptions : cycleOptions).map(
                  (opt) => (
                    <button
                      key={opt}
                      onClick={() => setValue(opt)}
                      className={`flex aspect-square items-center justify-center rounded-full border text-sm font-medium backdrop-blur-md transition-all duration-500 ${
                        value === opt
                          ? "scale-110 border-white bg-white text-black shadow-[0_0_30px_rgba(255,255,255,0.4)]"
                          : "border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:bg-white/10"
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
              className="flex flex-col items-center gap-6 rounded-[36px] border border-white/10 bg-white/[0.03] p-12 text-center backdrop-blur-2xl"
            >
              <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white">
                <Infinity size={40} strokeWidth={1} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-light text-white">
                  Unrestricted Flow
                </h3>
                <p className="max-w-[240px] text-sm leading-relaxed font-light text-gray-500">
                  Experience a session without boundaries. You decide when to
                  conclude your journey.
                </p>
              </div>
            </motion.div>
          )}
        </div>

        {/* CTA Button */}
        <div className="pt-12 pb-8">
          <button
            onClick={() => onConfirm({ mode, value })}
            className="group relative flex h-16 w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-white text-sm font-black tracking-[0.2em] text-black uppercase shadow-[0_20px_40px_rgba(255,255,255,0.15)] transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="relative z-10">Confirm Journey</span>
            <Check
              size={20}
              className="relative z-10 transition-transform group-hover:scale-110"
            />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
