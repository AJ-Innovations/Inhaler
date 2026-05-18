'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Timer, RotateCcw, Infinity, Check, Sparkles } from 'lucide-react';
import { Exercise } from '../data';

const getAmbientImage = (activeSoundscape: string) => {
  switch (activeSoundscape) {
    case 'zen-river': return '/image/ambients/river.png';
    case 'zen-fountain': return '/image/ambients/whaterfalls.png';
    case 'winter-rain': return '/image/ambients/rain.png';
    case 'light-rain': return '/image/ambients/rain2.png';
    case 'nature-birds': return '/image/ambients/nature2.png';
    case 'hz-transformation': return '/image/ambients/galaxy.png';
    case 'white-noise': return '/image/ambients/galaxy2.png';
    case 'pink-noise': return '/image/ambients/galaxy3.png';
    case 'brown-noise': return '/image/ambients/nature.png';
    case 'beach': return '/image/ambients/beach.png';
    case 'lake': return '/image/ambients/lake4.png';
    case 'marine': return '/image/ambients/marain.png';
    case 'desert': return '/image/ambients/desert3.png';
    case 'ethereal': return '/image/ambients/loop.png';
    case 'forest': return '/image/ambients/forest.png';
    case 'leaf':
    default: return '/image/ambients/leaf.png';
  }
};

interface SessionSetupProps {
  exercise: Exercise;
  onBack: () => void;
  onConfirm: (config: SessionConfig) => void;
  soundscape: any;
}

export interface SessionConfig {
  mode: 'duration' | 'cycles' | 'infinite';
  value: number;
}

export function SessionSetup({ exercise, onBack, onConfirm, soundscape }: SessionSetupProps) {
  const [mode, setMode] = useState<'duration' | 'cycles' | 'infinite'>('duration');
  const [value, setValue] = useState(5);

  const durationOptions = [2, 5, 10, 15, 20];
  const cycleOptions = [10, 20, 30, 50, 100];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] overflow-y-auto scrollbar-hide bg-black text-white"
    >
      {/* Cinematic Natural Background */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-black">
        <AnimatePresence mode="wait">
          <motion.div
            key={soundscape.activeSoundscape}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1.0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.8, ease: "easeInOut" }}
            className="absolute inset-0 bg-cover bg-center transition-all duration-1000 scale-110 blur-[10px]"
            style={{
              backgroundImage: `url(${getAmbientImage(soundscape.activeSoundscape)})`
            }}
          />
        </AnimatePresence>
      </div>
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/20 via-black/40 to-black/80 pointer-events-none" />

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
            className="w-24 h-24 rounded-full flex items-center justify-center relative shadow-[0_0_50px_rgba(255,255,255,0.4)] border border-white bg-white backdrop-blur-2xl"
          >
            <Sparkles className="text-black relative z-10 animate-pulse" size={40} strokeWidth={1.5} />
          </motion.div>
          <h1 className="text-4xl font-light text-white mt-8 tracking-tight">Set Your Goal</h1>
        </div>

        {/* Mode Selector (iOS Sliding Tab) */}
        <div className="bg-white/[0.03] border border-white/[0.05] rounded-full p-1.5 flex items-center mb-10 shadow-2xl backdrop-blur-3xl">
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
                className={`flex-1 relative py-4 rounded-full flex flex-col items-center gap-1.5 transition-all duration-500 ${
                  isActive ? 'text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="setup-mode-bg"
                    className="absolute inset-0 bg-white/10 border border-white/10 rounded-full shadow-lg"
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
                    className={`aspect-square rounded-full flex items-center justify-center text-sm font-medium transition-all duration-500 border backdrop-blur-md ${
                      value === opt 
                        ? 'bg-white border-white text-black shadow-[0_0_30px_rgba(255,255,255,0.4)] scale-110' 
                        : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20'
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
              className="bg-white/[0.03] border border-white/10 rounded-[36px] p-12 flex flex-col items-center text-center gap-6 backdrop-blur-2xl"
            >
              <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center text-white border border-white/20">
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
            className="w-full h-16 rounded-full bg-white text-black font-black text-sm uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-[0_20px_40px_rgba(255,255,255,0.15)] group relative overflow-hidden"
          >
            <span className="relative z-10">Confirm Journey</span>
            <Check size={20} className="relative z-10 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
