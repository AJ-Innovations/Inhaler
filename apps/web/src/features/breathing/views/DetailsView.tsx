"use client";

import { motion } from "framer-motion";
import {
  Activity,
  ArrowLeft,
  CheckCircle2,
  Heart,
  Info,
  Play,
  ShieldAlert,
  Zap,
} from "lucide-react";
import React from "react";

import { Exercise, IconMap } from "../data";

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
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="scrollbar-hide absolute inset-0 z-[200] overflow-y-auto bg-transparent"
    >
      {/* iOS Style Header */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-white/[0.05] bg-black/20 px-6 py-6 backdrop-blur-md">
        <button
          onClick={onBack}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white transition-all hover:bg-white/10"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-sm font-medium tracking-[0.2em] text-white/90 uppercase">
          {exercise.name}
        </h2>
        <div className="h-10 w-10" /> {/* Spacer */}
      </div>

      <div className="mx-auto max-w-[480px] pb-24">
        {/* iOS Style Hero */}
        <div className="px-6 pt-12 pb-10 text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="relative mx-auto mb-8 flex h-28 w-28 items-center justify-center rounded-[40px] border border-white/10 bg-white/[0.04] shadow-2xl"
          >
            <div className="absolute inset-0 rounded-full bg-white opacity-10 blur-3xl" />
            <Icon className="relative z-10 text-white" size={48} />
          </motion.div>
          <h1 className="mb-2 text-5xl font-light tracking-tight text-white">
            {exercise.name}
          </h1>
          <p className="text-sm font-medium tracking-[0.3em] text-white/60 uppercase">
            {exercise.subtitle}
          </p>
        </div>

        <div className="space-y-12 px-6">
          {/* Main Description (iOS Card) */}
          <section className="rounded-[40px] border border-white/[0.06] bg-white/[0.02] p-8 backdrop-blur-md">
            <p className="text-center text-lg leading-relaxed font-light text-white/90 italic">
              &quot;{exercise.description}&quot;
            </p>
          </section>

          {/* Grid Content */}
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-4 rounded-[40px] border border-white/[0.06] bg-white/[0.02] p-8 backdrop-blur-md">
              <div className="flex items-center gap-3 text-white/70">
                <Info size={20} className="text-indigo-400" />
                <h4 className="text-[11px] font-bold tracking-[0.2em] uppercase">
                  The Science
                </h4>
              </div>
              <p className="text-base leading-relaxed font-light text-white/80">
                {exercise.why}
              </p>
            </div>

            <div className="space-y-4 rounded-[40px] border border-white/[0.06] bg-white/[0.02] p-8 backdrop-blur-md">
              <div className="flex items-center gap-3 text-white/70">
                <Zap size={20} className="text-emerald-400" />
                <h4 className="text-[11px] font-bold tracking-[0.2em] uppercase">
                  Technique
                </h4>
              </div>
              <p className="text-base leading-relaxed font-light text-white/80">
                {exercise.howTo}
              </p>
            </div>
          </div>

          {/* Benefits List */}
          <section className="rounded-[40px] border border-white/[0.06] bg-white/[0.02] p-8 backdrop-blur-md">
            <h4 className="mb-6 flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] text-white/70 uppercase">
              <Heart size={16} className="text-pink-500" />
              Core Benefits
            </h4>
            <div className="grid grid-cols-1 gap-5">
              {exercise.benefits.map((b, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                >
                  <CheckCircle2
                    size={18}
                    className="shrink-0 text-emerald-500"
                  />
                  <span className="text-base font-light text-white/80">
                    {b}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Safety Warning */}
          {exercise.warning && (
            <section className="rounded-[40px] border border-orange-500/10 bg-orange-500/[0.02] p-8 backdrop-blur-md">
              <h4 className="mb-4 flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] text-orange-400 uppercase">
                <ShieldAlert size={16} />
                Safety Guidelines
              </h4>
              <p className="text-base leading-relaxed font-light text-orange-200">
                {exercise.warning}
              </p>
            </section>
          )}

          {/* Pattern Visualization */}
          <section className="flex items-center justify-around rounded-[40px] border border-white/[0.06] bg-white/[0.02] px-6 py-8 backdrop-blur-md">
            <div className="flex flex-col items-center">
              <span className="mb-1 text-[10px] tracking-widest text-white/50 uppercase">
                Inhale
              </span>
              <span className="text-2xl font-bold text-white">
                {exercise.pattern.inhale}s
              </span>
            </div>
            <div className="h-10 w-px bg-white/10" />
            <div className="flex flex-col items-center">
              <span className="mb-1 text-[10px] tracking-widest text-white/50 uppercase">
                Hold
              </span>
              <span className="text-2xl font-bold text-white">
                {exercise.pattern.hold1}s
              </span>
            </div>
            <div className="h-10 w-px bg-white/10" />
            <div className="flex flex-col items-center">
              <span className="mb-1 text-[10px] tracking-widest text-white/50 uppercase">
                Exhale
              </span>
              <span className="text-2xl font-bold text-white">
                {exercise.pattern.exhale}s
              </span>
            </div>
          </section>

          {/* Start This Journey CTA Button - Non-sticky & Rounded-Full */}
          <div className="pt-6">
            <button
              onClick={onStart}
              className="flex h-18 w-full items-center justify-center gap-4 rounded-full bg-white text-lg font-bold text-black shadow-[0_20px_50px_rgba(255,255,255,0.2)] transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Play size={20} fill="currentColor" />
              Start This Journey
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
