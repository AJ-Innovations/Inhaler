'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Activity, Info, ShieldAlert, Zap, Heart, CheckCircle2 } from 'lucide-react';
import { Exercise, IconMap } from '../data';

interface DetailsViewProps {
  exercise: Exercise;
  onBack: () => void;
  onStart: () => void;
}

export function DetailsView({ exercise, onBack, onStart }: DetailsViewProps) {
  const Icon = IconMap[exercise.icon as keyof typeof IconMap] || Activity;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 bg-black z-[200] overflow-y-auto scrollbar-hide"
    >
      {/* iOS Style Header */}
      <div className="sticky top-0 z-30 px-6 py-6 flex items-center justify-between bg-black/80 backdrop-blur-xl border-b border-white/[0.05]">
        <button 
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-all"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-sm font-medium text-white/60 uppercase tracking-[0.2em]">{exercise.name}</h2>
        <div className="w-10 h-10" /> {/* Spacer */}
      </div>

      <div className="max-w-[480px] mx-auto pb-24">
        {/* iOS Style Hero */}
        <div className="px-6 pt-12 pb-10 text-center">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="w-28 h-28 rounded-[40px] mx-auto flex items-center justify-center shadow-2xl relative mb-8"
            style={{ background: `linear-gradient(135deg, ${exercise.gradient.start}, ${exercise.gradient.end})` }}
          >
            <div className="absolute inset-0 blur-3xl opacity-30" style={{ background: exercise.gradient.start }} />
            <Icon className="text-white relative z-10" size={48} />
          </motion.div>
          <h1 className="text-5xl font-light text-white tracking-tight mb-2">{exercise.name}</h1>
          <p className="text-gray-500 text-sm font-medium uppercase tracking-[0.3em]">{exercise.subtitle}</p>
        </div>

        <div className="px-6 space-y-12">
          {/* Main Description (iOS Card) */}
          <section className="bg-white/[0.03] border border-white/[0.05] rounded-[40px] p-8">
            <p className="text-gray-300 text-lg leading-relaxed font-light italic text-center">
              &quot;{exercise.description}&quot;
            </p>
          </section>

          {/* Grid Content */}
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-white/[0.03] border border-white/[0.05] rounded-[40px] p-8 space-y-4">
              <div className="flex items-center gap-3 text-indigo-400">
                <Info size={20} />
                <h4 className="text-[11px] uppercase tracking-[0.2em] font-bold">The Science</h4>
              </div>
              <p className="text-gray-400 text-base leading-relaxed font-light">
                {exercise.why}
              </p>
            </div>

            <div className="bg-white/[0.03] border border-white/[0.05] rounded-[40px] p-8 space-y-4">
              <div className="flex items-center gap-3 text-emerald-400">
                <Zap size={20} />
                <h4 className="text-[11px] uppercase tracking-[0.2em] font-bold">Technique</h4>
              </div>
              <p className="text-gray-400 text-base leading-relaxed font-light">
                {exercise.howTo}
              </p>
            </div>
          </div>

          {/* Benefits List */}
          <section className="bg-white/[0.03] border border-white/[0.05] rounded-[40px] p-8">
            <h4 className="text-[11px] uppercase tracking-[0.2em] font-bold text-gray-500 mb-6 flex items-center gap-2">
              <Heart size={16} className="text-pink-500" />
              Core Benefits
            </h4>
            <div className="grid grid-cols-1 gap-5">
              {exercise.benefits.map((b, i) => (
                <div key={i} className="flex items-center gap-4 bg-white/[0.02] p-4 rounded-2xl border border-white/[0.03]">
                  <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                  <span className="text-base text-gray-300 font-light">{b}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Safety Warning */}
          {exercise.warning && (
            <section className="bg-orange-500/[0.03] border border-orange-500/10 rounded-[40px] p-8">
              <h4 className="text-[11px] uppercase tracking-[0.2em] font-bold text-orange-500 mb-4 flex items-center gap-2">
                <ShieldAlert size={16} />
                Safety Guidelines
              </h4>
              <p className="text-base text-orange-200/60 leading-relaxed font-light">
                {exercise.warning}
              </p>
            </section>
          )}

          {/* Pattern Visualization */}
          <section className="flex items-center justify-around py-8 px-6 bg-white/[0.03] border border-white/[0.05] rounded-[40px]">
            <div className="flex flex-col items-center">
              <span className="text-[10px] uppercase tracking-widest text-gray-600 mb-1">Inhale</span>
              <span className="text-2xl font-light text-white">{exercise.pattern.inhale}s</span>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="flex flex-col items-center">
              <span className="text-[10px] uppercase tracking-widest text-gray-600 mb-1">Hold</span>
              <span className="text-2xl font-light text-white">{exercise.pattern.hold1}s</span>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="flex flex-col items-center">
              <span className="text-[10px] uppercase tracking-widest text-gray-600 mb-1">Exhale</span>
              <span className="text-2xl font-light text-white">{exercise.pattern.exhale}s</span>
            </div>
          </section>
        </div>
      </div>

      {/* iOS Style Floating CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/90 to-transparent pt-12 z-40">
        <div className="max-w-[480px] mx-auto">
          <button 
            onClick={onStart}
            className="w-full h-18 rounded-[30px] bg-white text-black font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 shadow-[0_20px_50px_rgba(255,255,255,0.2)]"
          >
            <Play size={20} fill="currentColor" />
            Start This Journey
          </button>
        </div>
      </div>
    </motion.div>
  );
}
