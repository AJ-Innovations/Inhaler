'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Timer, RotateCcw, Infinity, Check, Sparkles } from 'lucide-react';
import { Exercise } from '../data';

interface SessionSetupProps {
  exercise: Exercise;
  onBack: () => void;
  onConfirm: (config: SessionConfig) => void;
}

export interface SessionConfig {
  mode: 'duration' | 'cycles' | 'infinite';
  value: number;
}

export function SessionSetup({ exercise, onBack, onConfirm }: SessionSetupProps) {
  const [mode, setMode] = useState<'duration' | 'cycles' | 'infinite'>('duration');
  const [value, setValue] = useState(5);

  const durationOptions = [2, 5, 10, 15, 20];
  const cycleOptions = [10, 20, 30, 50, 100];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black z-[200] overflow-y-auto scrollbar-hide"
    >
      {/* Dynamic Background */}
      <div 
        className="fixed inset-0 opacity-20 blur-[120px] pointer-events-none"
        style={{ 
          background: `radial-gradient(circle at 50% 20%, ${exercise.gradient.start} 0%, transparent 60%)` 
        }}
      />

      <div className="relative z-10 max-w-[480px] mx-auto px-6 py-12 flex flex-col min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <button 
            onClick={onBack}
            className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all shadow-xl"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex flex-col items-center">
            <span className="text-[10px] uppercase tracking-[0.4em] text-white/40 font-bold mb-1">Configuration</span>
            <h2 className="text-xl font-light text-white tracking-tight">{exercise.name}</h2>
          </div>
          <div className="w-12 h-12" /> {/* Spacer */}
        </div>

        {/* Hero Illustration / Icon */}
        <div className="flex flex-col items-center mb-16">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-24 h-24 rounded-[32px] flex items-center justify-center relative shadow-2xl"
            style={{ background: `linear-gradient(135deg, ${exercise.gradient.start}, ${exercise.gradient.end})` }}
          >
            <div className="absolute inset-0 blur-2xl opacity-40" style={{ background: exercise.gradient.start }} />
            <Sparkles className="text-white relative z-10" size={40} strokeWidth={1.5} />
          </motion.div>
          <h1 className="text-4xl font-light text-white mt-8 tracking-tight">Set Your Goal</h1>
        </div>

        {/* Mode Selector (iOS Sliding Tab) */}
        <div className="bg-white/[0.03] border border-white/[0.05] rounded-[36px] p-1.5 flex items-center mb-10 shadow-2xl backdrop-blur-3xl">
          {[
            { id: 'duration', icon: Timer, label: 'Duration' },
            { id: 'cycles', icon: RotateCcw, label: 'Cycles' },
            { id: 'infinite', icon: Infinity, label: 'Free' },
          ].map((item) => {
            const isActive = mode === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setMode(item.id as typeof mode);
                  if (item.id === 'duration') setValue(5);
                  if (item.id === 'cycles') setValue(20);
                }}
                className={`flex-1 relative py-4 rounded-[30px] flex flex-col items-center gap-1.5 transition-all duration-500 ${
                  isActive ? 'text-white' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="setup-mode-bg"
                    className="absolute inset-0 bg-white/10 border border-white/10 rounded-[30px] shadow-lg"
                    transition={{ type: 'spring', duration: 0.6, bounce: 0.2 }}
                  />
                )}
                <item.icon size={18} className="relative z-10" strokeWidth={isActive ? 2 : 1.5} />
                <span className="text-[9px] font-black uppercase tracking-[0.15em] relative z-10">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Value Grid */}
        <div className="flex-1 space-y-12">
          {mode !== 'infinite' ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="flex flex-col items-center gap-2">
                <span className="text-[10px] uppercase tracking-[0.4em] text-gray-600 font-black">Practice Intensity</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-light text-white leading-none">{value}</span>
                  <span className="text-lg text-gray-500 font-light lowercase">
                    {mode === 'duration' ? 'minutes' : 'rounds'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-5 gap-3">
                {(mode === 'duration' ? durationOptions : cycleOptions).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setValue(opt)}
                    className={`aspect-square rounded-3xl flex items-center justify-center text-sm font-medium transition-all duration-500 border ${
                      value === opt 
                        ? 'bg-white border-white text-black shadow-[0_15px_30px_rgba(255,255,255,0.2)] scale-110' 
                        : 'bg-white/5 border-white/10 text-gray-500 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/[0.03] border border-white/[0.05] rounded-[48px] p-12 flex flex-col items-center text-center gap-6"
            >
              <div className="w-20 h-20 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                <Infinity size={40} strokeWidth={1} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-light text-white">Unrestricted Flow</h3>
                <p className="text-gray-500 text-sm leading-relaxed font-light max-w-[240px]">
                  Experience a session without boundaries. You decide when to conclude your journey.
                </p>
              </div>
            </motion.div>
          )}
        </div>

        {/* CTA Button */}
        <div className="pt-12 pb-8">
          <button 
            onClick={() => onConfirm({ mode, value })}
            className="w-full h-20 rounded-[36px] bg-white text-black font-black text-lg uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 shadow-[0_30px_60px_rgba(255,255,255,0.25)] group"
          >
            Confirm Journey
            <Check size={24} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
