'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Trophy, Clock, Zap, Home, RotateCcw, TrendingUp } from 'lucide-react';
import { Exercise } from '../data';

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
  const points = data.map((d, i) => `${(i / (data.length - 1)) * 100},${100 - d}`).join(' ');

  return (
    <div className="w-full bg-white/[0.03] border border-white/5 rounded-[32px] p-6 space-y-4">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center">
            <TrendingUp size={16} className="text-emerald-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest font-black text-gray-500">Health Index</span>
            <span className="text-sm font-light text-white">+12% Improvement</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-lg font-light text-white tracking-tight">84.2</span>
        </div>
      </div>
      
      <div className="h-16 w-full relative group">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#10b981" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="1" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
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

export function SessionComplete({ exercise, duration, cycles, onHome, onRestart }: SessionCompleteProps) {
  const stats = [
    { label: 'Time Mindful', value: `${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')}`, icon: Clock, color: 'text-blue-400' },
    { label: 'Total Cycles', value: cycles.toString(), icon: RotateCcw, color: 'text-indigo-400' },
    { label: 'Focus Points', value: (cycles * 10).toString(), icon: Zap, color: 'text-amber-400' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black z-[300] flex flex-col items-center justify-center p-6 overflow-y-auto scrollbar-hide"
    >
      <div className="max-w-[480px] w-full space-y-8 py-10">
        {/* Lottie Celebration */}
        <div className="relative h-64 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent pointer-events-none" />
          <DotLottieReact
            src="https://lottie.host/8e6c46a6-f286-4f40-8b65-63567840139b/1O4FfO6lG1.lottie"
            loop={false}
            autoplay
            className="w-full h-full scale-125"
          />
          <div className="absolute bottom-4 flex flex-col items-center space-y-1">
            <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-2">
              <Trophy className="text-white" size={24} />
            </div>
            <h2 className="text-2xl font-light text-white tracking-tight">Session Complete</h2>
            <p className="text-[10px] text-gray-500 uppercase tracking-[0.4em] font-bold">{exercise.name} Mastery</p>
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
              className="bg-white/[0.03] border border-white/5 rounded-[28px] p-4 flex flex-col items-center text-center space-y-2"
            >
              <stat.icon className={stat.color} size={16} />
              <div className="space-y-0.5">
                <p className="text-lg font-light text-white">{stat.value}</p>
                <p className="text-[8px] text-gray-500 uppercase tracking-widest font-bold leading-none">{stat.label}</p>
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
            className="w-full h-16 rounded-[28px] bg-white text-black font-bold text-sm uppercase tracking-widest shadow-xl shadow-white/5 active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            <RotateCcw size={18} />
            Restart Session
          </motion.button>
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            onClick={onHome}
            className="w-full h-16 rounded-[28px] bg-white/5 text-white/60 font-bold text-sm uppercase tracking-widest hover:bg-white/10 active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            <Home size={18} />
            Return Home
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
