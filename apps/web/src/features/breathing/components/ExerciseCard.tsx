'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Bookmark, Trash2, Play } from 'lucide-react';
import { Exercise, IconMap } from '../data';

interface ExerciseCardProps {
  exercise: Exercise;
  onStart: () => void;
  onDetails: () => void;
  onDelete?: () => void;
  isCustom?: boolean;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export function ExerciseCard({
  exercise,
  onStart,
  onDetails,
  onDelete,
  isCustom,
  isFavorite,
  onToggleFavorite
}: ExerciseCardProps) {
  const Icon = IconMap[exercise.icon as keyof typeof IconMap] || Activity;
  const level = exercise.isAdvanced ? 'Advanced' : 'Beginner';

  return (
    <>
      <svg width="0" height="0" className="absolute pointer-events-none" style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <linearGradient id="bookmark-red-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ff6c22ff" /> {/* iOS bright red */}
            <stop offset="100%" stopColor="#ff0000ff" /> {/* Deep crimson red */}
          </linearGradient>
        </defs>
      </svg>
      <motion.div
        whileHover={{ y: -6, scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        onClick={onDetails}
        className="relative w-full bg-white/[0.02] backdrop-blur-md border border-white/[0.06] rounded-[42px] p-8 cursor-pointer group transition-all duration-700 shadow-2xl overflow-hidden"
      >
        {/* iOS Style Inner Glow */}
        <div
          className="absolute -right-20 -top-20 w-60 h-60 bg-white rounded-full blur-[100px] opacity-0 group-hover:opacity-[0.03] transition-opacity duration-1000"
        />

        <div className="flex flex-col gap-8 relative z-10">
          {/* Header: Icon, Titles, and Actions */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-5">
              <div
                className="w-16 h-16 rounded-[22px] bg-white/[0.04] border border-white/10 flex items-center justify-center shadow-2xl relative transition-transform duration-700 group-hover:scale-105"
              >
                <div className="absolute inset-0 blur-xl opacity-10 bg-white rounded-full" />
                <Icon className="text-white relative z-10" size={28} />
              </div>

              <div className="flex flex-col">
                <h3 className="text-2xl font-light text-white tracking-tight group-hover:text-white transition-colors">
                  {exercise.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold">
                    {exercise.subtitle}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {onToggleFavorite && (
                <button
                  onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
                  className={`w-10 h-10 flex items-center justify-center transition-all duration-300 ${isFavorite
                    ? 'text-red-500 hover:text-red-400'
                    : 'text-gray-400 hover:text-white'
                    }`}
                >
                  <Bookmark
                    size={24}
                    style={{
                      fill: isFavorite ? 'url(#bookmark-red-gradient)' : 'none',
                      stroke: isFavorite ? 'url(#bookmark-red-gradient)' : 'currentColor'
                    }}
                    strokeWidth={2}
                  />
                </button>
              )}
              {isCustom && (
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete?.(); }}
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:bg-red-500/10 hover:text-red-500 transition-all duration-300 flex items-center justify-center"
                >
                  <Trash2 size={16} strokeWidth={2} />
                </button>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-400 text-sm leading-relaxed font-light line-clamp-2 pr-4 opacity-60 group-hover:opacity-100 transition-opacity">
            {exercise.description}
          </p>

          {/* Bottom Row: Level (Left) and Start Button (Right) */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <div className="px-4 py-2 rounded-full bg-white/[0.04] border border-white/10 shadow-inner">
                <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-white/60">
                  {level}
                </span>
              </div>
            </div>

            <button
              onClick={(e) => { e.stopPropagation(); onStart(); }}
              className="h-12 px-6 rounded-full bg-white text-black font-bold text-[10px] uppercase tracking-[0.15em] flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(255,255,255,0.15)] hover:scale-105 active:scale-95 transition-all"
            >
              <Play size={12} fill="currentColor" />
              Start
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
