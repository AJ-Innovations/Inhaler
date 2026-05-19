"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";
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
    <div className="w-full space-y-4 rounded-[32px] border border-white/5 bg-white/[0.03] p-6">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10">
            <TrendingUp size={16} className="text-emerald-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black tracking-widest text-gray-500 uppercase">
              Health Index
            </span>
            <span className="text-sm font-light text-white">
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

      <div className="group relative h-16 w-full">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="h-full w-full overflow-visible"
        >
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#10b981" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="1" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <motion.polyline
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
            filter="url(#glow)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          />
          {/* Subtle area fill */}
          <motion.path
            d={`M 0 100 L ${points} L 100 100 Z`}
            fill="url(#lineGradient)"
            className="opacity-[0.05]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.05 }}
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
      color: "text-blue-400",
    },
    {
      label: "Total Cycles",
      value: cycles.toString(),
      icon: RotateCcw,
      color: "text-indigo-400",
    },
    {
      label: "Focus Points",
      value: (cycles * 10).toString(),
      icon: Zap,
      color: "text-amber-400",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="scrollbar-hide fixed inset-0 z-[300] flex flex-col items-center justify-center overflow-y-auto bg-black/95 p-6 backdrop-blur-md"
    >
      {/* Decorative Premium Glow Elements */}
      <div className="pointer-events-none absolute -top-20 -right-20 h-80 w-80 rounded-full bg-indigo-500/10 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-emerald-500/10 blur-[100px]" />

      <div className="relative z-10 w-full max-w-[480px] space-y-8 py-10">
        {/* Lottie Celebration */}
        <div className="relative flex h-64 items-center justify-center">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent" />
          <DotLottieReact
            src="https://lottie.host/8e6c46a6-f286-4f40-8b65-63567840139b/1O4FfO6lG1.lottie"
            loop={false}
            autoplay
            className="h-full w-full scale-125"
          />
          <div className="absolute bottom-4 flex flex-col items-center space-y-1">
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500 shadow-lg shadow-indigo-500/20">
              <Trophy className="text-white" size={24} />
            </div>
            <h2 className="text-2xl font-light tracking-tight text-white">
              Session Complete
            </h2>
            <p className="text-[10px] font-bold tracking-[0.4em] text-gray-500 uppercase">
              {exercise.name} Mastery
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 + 0.5 }}
              className="flex flex-col items-center space-y-2 rounded-[28px] border border-white/5 bg-white/[0.03] p-4 text-center"
            >
              <stat.icon className={stat.color} size={16} />
              <div className="space-y-0.5">
                <p className="text-lg font-light text-white">{stat.value}</p>
                <p className="text-[8px] leading-none font-bold tracking-widest text-gray-500 uppercase">
                  {stat.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Health Improvement Line Graph */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <HealthSparkline />
        </motion.div>

        {/* Actions */}
        <div className="flex flex-col gap-3 pt-4">
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            onClick={onRestart}
            className="relative flex h-16 w-full cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-full bg-white text-[12px] font-black tracking-[0.2em] text-black uppercase shadow-[0_0_30px_rgba(255,255,255,0.15)] transition-all duration-300 hover:shadow-[0_0_35px_rgba(255,255,255,0.25)] active:scale-95"
          >
            <span className="relative z-10 flex items-center gap-2">
              <RotateCcw size={16} strokeWidth={3} />
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
            className="flex h-16 w-full cursor-pointer items-center justify-center gap-3 rounded-full border border-white/10 bg-white/[0.04] text-[12px] font-black tracking-[0.2em] text-white/80 uppercase transition-all duration-300 hover:bg-white/[0.08] hover:text-white active:scale-95"
          >
            <Home size={16} strokeWidth={2.5} />
            Return Home
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
