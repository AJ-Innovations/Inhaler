"use client";

import { motion } from "framer-motion";
import { Activity, Bookmark, Play, Trash2 } from "lucide-react";
import React from "react";

import { Exercise, IconMap } from "../data";

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
  onToggleFavorite,
}: ExerciseCardProps) {
  const Icon = IconMap[exercise.icon as keyof typeof IconMap] || Activity;
  const level = exercise.isAdvanced ? "Advanced" : "Beginner";

  return (
    <>
      <svg
        width="0"
        height="0"
        className="pointer-events-none absolute"
        style={{ position: "absolute", width: 0, height: 0 }}
      >
        <defs>
          <linearGradient
            id="bookmark-red-gradient"
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#ff6c22ff" />
            <stop offset="100%" stopColor="#ff0000ff" />
          </linearGradient>
        </defs>
      </svg>
      <motion.div
        whileHover={{ y: -4, scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        onClick={onDetails}
        className="group relative w-full cursor-pointer overflow-hidden rounded-[32px] border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-md transition-all duration-500"
      >
        {/* iOS Style Inner Glow */}
        <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-white opacity-0 blur-[100px] transition-opacity duration-1000 group-hover:opacity-[0.03]" />

        <div className="relative z-10 flex flex-col gap-4">
          {/* Header: Icon, Titles, and Actions */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="relative flex h-12 w-12 items-center justify-center rounded-[18px] border border-white/10 bg-white/[0.04] transition-transform duration-500 group-hover:scale-105">
                <div className="absolute inset-0 rounded-full bg-white opacity-10 blur-xl" />
                <Icon className="relative z-10 text-white" size={20} />
              </div>

              <div className="flex flex-col">
                <h3 className="text-xl font-light tracking-tight text-white transition-colors group-hover:text-white">
                  {exercise.name}
                </h3>
                <div className="mt-0.5 flex items-center gap-2">
                  <span className="text-[9px] font-bold tracking-[0.2em] text-white/50 uppercase">
                    {exercise.subtitle}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {onToggleFavorite && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite();
                  }}
                  className={`flex h-9 w-9 items-center justify-center transition-all duration-300 ${
                    isFavorite
                      ? "font-bold text-white"
                      : "text-white/40 hover:text-white"
                  }`}
                >
                  <Bookmark
                    size={20}
                    style={{
                      fill: isFavorite ? "#ffffff" : "none",
                      stroke: "#ffffff",
                    }}
                    strokeWidth={2}
                  />
                </button>
              )}
              {isCustom && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete?.();
                  }}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-400 transition-all duration-300 hover:bg-red-500/10 hover:text-red-500"
                >
                  <Trash2 size={14} strokeWidth={2} />
                </button>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="line-clamp-2 pr-2 text-xs leading-relaxed font-light text-white/70 transition-colors duration-300">
            {exercise.description}
          </p>

          {/* Bottom Row: Level (Left) and Start Button (Right) */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <div className="rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 shadow-inner">
                <span className="text-[8px] font-bold tracking-[0.2em] text-white/80 uppercase">
                  {level}
                </span>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onStart();
              }}
              className="flex h-10 items-center justify-center gap-2 rounded-full bg-white px-5 text-[9px] font-bold tracking-[0.15em] text-black uppercase transition-all hover:scale-105 active:scale-95"
            >
              <Play size={10} fill="currentColor" />
              Start
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
