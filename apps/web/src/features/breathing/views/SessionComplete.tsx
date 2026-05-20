"use client";

import { motion } from "framer-motion";
import { Clock, Home, RotateCcw, TrendingUp, Trophy, Zap } from "lucide-react";
import React from "react";

import { Exercise } from "../data";

interface SessionCompleteProps {
  exercise: Exercise;
  duration: number;
  cycles: number;
  onHome: () => void;
  onRestart: () => void;
}

const HealthSparkline = () => {
  // Mock trend data for visualization
  const data = [20, 35, 25, 45, 40, 65, 55, 80];
  const points = data
    .map((d, i) => `${(i / (data.length - 1)) * 100},${100 - d}`)
    .join(" ");

  return (
    <div className="w-full space-y-3 pt-2">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <TrendingUp size={15} className="text-white/60" />
          <div className="flex flex-col">
            <span className="text-[8.5px] font-bold tracking-widest text-white/40 uppercase">
              Health Index
            </span>
            <span className="text-[10px] font-light text-white/60">
              +12% Improvement
            </span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-lg font-light tracking-tight text-white">
            84.2
          </span>
        </div>
      </div>

      <div className="group relative h-12 w-full px-1">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="h-full w-full overflow-visible"
        >
          <defs>
            <linearGradient
              id="whiteLineGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
            </linearGradient>
          </defs>
          <motion.polyline
            fill="none"
            stroke="url(#whiteLineGradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.path
            d={`M 0 100 L ${points} L 100 100 Z`}
            fill="url(#whiteLineGradient)"
            className="opacity-[0.02]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.02 }}
            transition={{ delay: 1 }}
          />
        </svg>
      </div>
    </div>
  );
};

export function SessionComplete({
  exercise,
  duration,
  cycles,
  onHome,
  onRestart,
}: SessionCompleteProps) {
  const stats = [
    {
      label: "Time Mindful",
      value: `${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, "0")}`,
      icon: Clock,
    },
    {
      label: "Total Cycles",
      value: cycles.toString(),
      icon: RotateCcw,
    },
    {
      label: "Focus Points",
      value: (cycles * 10).toString(),
      icon: Zap,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="scrollbar-hide fixed inset-0 z-[300] flex flex-col items-center justify-start overflow-y-auto bg-black/20 p-4 backdrop-blur-sm sm:justify-center sm:p-6"
    >
      {/* Decorative Premium Subtle Glow Elements */}
      <div className="pointer-events-none absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-white/5 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-[600px] w-[600px] rounded-full bg-white/5 blur-[140px]" />

      {/* Main Glassmorphic Wrapper Card */}
      <div className="relative z-10 my-auto w-full max-w-[420px] space-y-7 rounded-[40px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.2)] backdrop-blur-md sm:space-y-8 sm:p-8">
        {/* Premium Visual Celebration Beacon */}
        <div className="relative flex h-52 w-full items-center justify-center overflow-hidden">
          {/* Pulsing Concentric Rings */}
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.3, 0.1] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute h-44 w-44 rounded-full border border-white/10 bg-white/5"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.4, 0.15] }}
            transition={{
              repeat: Infinity,
              duration: 3,
              ease: "easeInOut",
              delay: 0.5,
            }}
            className="absolute h-32 w-32 rounded-full border border-white/10 bg-white/5"
          />
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.5, 0.2] }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute h-20 w-20 rounded-full border border-white/10 bg-white/5"
          />

          {/* Floating Sparkles & Particles */}
          <div className="absolute inset-0 z-0">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: "50%",
                  y: "50%",
                  scale: 0,
                  opacity: 0,
                }}
                animate={{
                  x: `${50 + (Math.random() - 0.5) * 80}%`,
                  y: `${50 + (Math.random() - 0.5) * 80}%`,
                  scale: [0, Math.random() * 1.5 + 0.5, 0],
                  opacity: [0, 0.6, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: Math.random() * 3 + 2,
                  delay: Math.random() * 2,
                  ease: "easeOut",
                }}
                className="absolute h-1 w-1 rounded-full bg-white/40 blur-[0.2px]"
              />
            ))}
          </div>

          {/* Centered Trophy Badge */}
          <motion.div
            initial={{ scale: 0.8, rotate: -15, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="absolute z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-gradient-to-br from-white/15 to-white/5 shadow-lg"
          >
            <Trophy className="relative z-10 h-5 w-5 text-white" />
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0, 0.3, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 rounded-full bg-white"
            />
          </motion.div>

          {/* Text Stack */}
          <div className="absolute right-0 bottom-1 left-0 z-10 flex flex-col items-center justify-center text-center">
            <h2 className="text-xl font-light tracking-tight text-white">
              Session Complete
            </h2>
            <p className="mt-0.5 text-[9px] font-bold tracking-[0.4em] text-white/40 uppercase">
              {exercise.name} Mastery
            </p>
          </div>
        </div>

        {/* Stats Grid (Minimalist, No Boxes, Pure White) */}
        <div className="grid grid-cols-3 gap-2 border-t border-white/5 pt-2">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 + 0.5 }}
              className="flex flex-col items-center justify-center space-y-1.5 text-center"
            >
              <stat.icon className="text-white/60" size={16} />
              <span className="text-lg font-light tracking-tight text-white sm:text-xl">
                {stat.value}
              </span>
              <span className="text-[7.5px] leading-none font-bold tracking-widest text-white/40 uppercase sm:text-[8.5px]">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Health Improvement Line Graph (Minimalist, No Boxes, Pure White) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="border-t border-white/5 pt-1"
        >
          <HealthSparkline />
        </motion.div>

        {/* Actions */}
        <div className="flex flex-col gap-3 pt-2">
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            onClick={onRestart}
            className="relative flex h-14 w-full cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-full bg-white text-[12px] font-black tracking-[0.2em] text-black uppercase shadow-[0_0_30px_rgba(255,255,255,0.15)] transition-all duration-300 hover:shadow-[0_0_35px_rgba(255,255,255,0.25)] active:scale-95"
          >
            <span className="relative z-10 flex items-center gap-2">
              <RotateCcw size={15} strokeWidth={3} />
              Restart Session
            </span>
            {/* Animated Premium Gloss Shimmer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{
                repeat: Infinity,
                repeatType: "loop",
                duration: 2.5,
                ease: "linear",
              }}
              className="pointer-events-none absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-black/5 to-transparent"
            />
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            onClick={onHome}
            className="flex h-14 w-full cursor-pointer items-center justify-center gap-3 rounded-full border border-white/15 bg-white/5 text-[12px] font-black tracking-[0.2em] text-white uppercase transition-all duration-300 hover:bg-white/10 active:scale-95"
          >
            <Home size={15} strokeWidth={2.5} />
            Return Home
          </motion.button>
        </div>

        {/* Elegant Brand Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 1.2 }}
          className="flex flex-col items-center justify-center pt-2 text-center"
        >
          <span className="text-[9px] font-medium tracking-[0.15em] text-white uppercase">
            "One breath is all it takes"
          </span>
          <span className="mt-1 text-[8px] font-light tracking-wider text-white/70">
            © 2026 Spirox. All rights reserved.
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}
