"use client";

import {
  Exercise,
  exercises as defaultExercises,
} from "@features/breathing/data";
import {
  Badge,
  CustomGoal,
} from "@features/breathing/hooks/useCustomExercises";
import { motion } from "framer-motion";
import {
  Activity,
  Brain,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  Clock,
  Cloud,
  Heart,
  Lock,
  LucideIcon,
  Moon,
  Play,
  Plus,
  Repeat,
  Shield,
  Sparkles,
  Sun,
  Target,
  Trash2,
  Trophy,
  Wind,
  Zap,
} from "lucide-react";
import React, { useState } from "react";

interface AchievementsViewProps {
  stats: {
    totalMinutes: number;
    sessionCount: number;
    streak: number;
    badges: Badge[];
    todayMinutes: number;
    weekMinutes: number;
  };
  customGoals: CustomGoal[];
  customExercises: Exercise[];
  onAddGoal: (goal: {
    id: string;
    name: string;
    targetMinutes: number;
    exerciseId: string;
    frequency: "once" | "daily";
    iconId?: string;
  }) => void;
  onDeleteGoal: (id: string) => void;
  onStart: (ex: Exercise) => void;
}

// Icon mapping helper
const GOAL_ICONS: Record<string, LucideIcon> = {
  wind: Wind,
  heart: Heart,
  zap: Zap,
  brain: Brain,
  activity: Activity,
  sun: Sun,
  moon: Moon,
  cloud: Cloud,
  shield: Shield,
  trophy: Trophy,
  target: Target,
  calendar: Calendar,
};

const TargetArrow = ({ size = 20, strokeWidth = 2, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
    <path d="M12 12l7-7" />
    <path d="M19 8V5h-3" />
  </svg>
);

export function AchievementsView({
  stats,
  customExercises,
  onAddGoal,
  onDeleteGoal,
  onStart,
}: AchievementsViewProps) {
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [newGoalName, setNewGoalName] = useState("");
  const [newGoalTarget, setNewGoalTarget] = useState("2");
  const [selectedExerciseId, setSelectedExerciseId] = useState("box");
  const [frequency, setFrequency] = useState<"once" | "daily">("daily");
  const [selectedIconId, setSelectedIconId] = useState("wind");

  const allExercises = [...defaultExercises, ...customExercises];

  const categories = [
    { id: "daily", label: "Today's Focus", icon: Clock, color: "text-white" },
    { id: "weekly", label: "Consistency", icon: Calendar, color: "text-white" },
    {
      id: "milestone",
      label: "Lifetime Achievements",
      icon: Trophy,
      color: "text-white",
    },
    {
      id: "custom",
      label: "Personal Goals",
      icon: TargetArrow,
      color: "text-white",
    },
  ];

  const handleAddGoal = () => {
    if (!newGoalName) return;
    onAddGoal({
      id: Math.random().toString(36).substring(2, 11),
      name: newGoalName,
      targetMinutes: parseInt(newGoalTarget) || 2,
      exerciseId: selectedExerciseId,
      frequency,
      iconId: selectedIconId,
    });
    setNewGoalName("");
    setIsAddingGoal(false);
  };

  const handleBadgeClick = (badge: Badge) => {
    const isCustomGoal =
      badge.category === "custom" ||
      badge.type === "manual" ||
      !!badge.frequency;
    if (!isCustomGoal) return;

    const exercise = allExercises.find((e) => e.id === badge.exerciseId);
    if (exercise) onStart(exercise);
    else {
      const boxEx = allExercises.find((e) => e.id === "box");
      if (boxEx) onStart(boxEx);
    }
  };

  if (isAddingGoal) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        className="fixed inset-0 z-[300] flex flex-col bg-black/60 p-8 pb-32 backdrop-blur-2xl"
      >
        <div className="mb-12 flex items-center gap-6">
          <button
            onClick={() => setIsAddingGoal(false)}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="space-y-1">
            <h2 className="text-2xl font-light tracking-tight text-white">
              Set Goal
            </h2>
            <p className="text-[10px] font-black tracking-widest text-gray-500 uppercase">
              Design Your Routine
            </p>
          </div>
        </div>

        <div className="scrollbar-hide flex-1 space-y-10 overflow-y-auto pr-2">
          <div className="space-y-4">
            <label className="px-2 text-[10px] font-black tracking-[0.3em] text-gray-400 uppercase">
              Goal Name
            </label>
            <input
              type="text"
              autoFocus
              value={newGoalName}
              onChange={(e) => setNewGoalName(e.target.value)}
              placeholder="e.g. Peak Focus Routine"
              className="w-full rounded-none border-b border-white/10 bg-transparent py-4 text-3xl font-light text-white transition-all placeholder:text-gray-800 focus:border-rose-500 focus:outline-none"
            />
          </div>

          <div className="space-y-6">
            <label className="px-2 text-[10px] font-black tracking-[0.3em] text-gray-400 uppercase">
              Goal Identity (Icon)
            </label>
            <div className="flex flex-wrap gap-3">
              {Object.entries(GOAL_ICONS).map(([id, Icon]) => (
                <button
                  key={id}
                  onClick={() => setSelectedIconId(id)}
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl border transition-all ${selectedIconId === id ? "border-white bg-white text-black shadow-lg" : "border-white/5 bg-white/5 text-gray-500 hover:border-white/10"}`}
                >
                  <Icon size={20} />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <label className="px-2 text-[10px] font-black tracking-[0.3em] text-gray-400 uppercase">
              Practice Focus
            </label>
            <div className="grid grid-cols-2 gap-3">
              {allExercises.map((ex) => (
                <button
                  key={ex.id}
                  onClick={() => setSelectedExerciseId(ex.id)}
                  className={`group relative overflow-hidden rounded-[28px] border p-5 text-left transition-all ${selectedExerciseId === ex.id ? "border-white bg-white text-black" : "border-white/5 bg-white/5 text-white"}`}
                >
                  <div className="relative z-10 flex flex-col gap-2">
                    <div
                      className="h-5 w-5 rounded-full"
                      style={{
                        background: `linear-gradient(135deg, ${ex.gradient.start}, ${ex.gradient.end})`,
                      }}
                    />
                    <span className="truncate text-[10px] font-black tracking-widest uppercase">
                      {ex.name}
                    </span>
                  </div>
                  {selectedExerciseId === ex.id && (
                    <div className="absolute top-3 right-3">
                      <CheckCircle2 size={12} className="text-black" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <label className="px-2 text-[10px] font-black tracking-[0.3em] text-gray-400 uppercase">
              Training Frequency
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setFrequency("daily")}
                className={`flex flex-col items-center justify-center gap-3 rounded-[32px] border p-6 transition-all ${frequency === "daily" ? "border-white bg-white text-black shadow-xl" : "border-white/5 bg-white/5 text-gray-500"}`}
              >
                <Repeat size={20} />
                <span className="text-[9px] font-black tracking-widest uppercase">
                  Every Day
                </span>
              </button>
              <button
                onClick={() => setFrequency("once")}
                className={`flex flex-col items-center justify-center gap-3 rounded-[32px] border p-6 transition-all ${frequency === "once" ? "border-white bg-white text-black shadow-xl" : "border-white/5 bg-white/5 text-gray-500"}`}
              >
                <Zap size={20} />
                <span className="text-[9px] font-black tracking-widest uppercase">
                  One-time Milestone
                </span>
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <label className="px-2 text-[10px] font-black tracking-[0.3em] text-gray-400 uppercase">
              Biological Target
            </label>
            <div className="space-y-8 rounded-[42px] border border-white/5 bg-white/[0.03] p-8">
              <div className="flex items-baseline justify-between">
                <span className="text-6xl font-light tracking-tighter text-white tabular-nums">
                  {newGoalTarget}
                </span>
                <span className="text-sm font-bold tracking-widest text-gray-500 uppercase">
                  Minutes
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="60"
                step="1"
                value={newGoalTarget}
                onChange={(e) => setNewGoalTarget(e.target.value)}
                className="h-1 w-full appearance-none rounded-full bg-white/10 accent-white"
              />
              <div className="flex justify-between px-1 text-[8px] font-black tracking-widest text-gray-700 uppercase">
                <span>1m</span>
                <span>30m</span>
                <span>60m</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-10">
          <button
            onClick={handleAddGoal}
            className="w-full rounded-[32px] bg-white py-7 text-[10px] font-black tracking-[0.5em] text-black uppercase shadow-2xl transition-all hover:bg-rose-400 hover:text-white active:scale-95"
          >
            Activate Goal
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="w-full space-y-12 pb-10"
    >
      {/* Header */}
      <div className="mb-4 flex w-full items-start justify-between px-1">
        <div className="space-y-1">
          <h1 className="text-3xl font-light tracking-tight text-white/90">
            Zen Mastery
          </h1>
          <p className="text-[10px] font-black tracking-[0.4em] text-white/40 uppercase">
            Path to Resilience
          </p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white">
          <Trophy size={20} />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="space-y-14">
        {categories.map((cat) => {
          const catBadges = stats.badges.filter((b) => {
            if (cat.id === "daily") {
              return (
                b.category === "daily" ||
                (b.category === "custom" && b.frequency === "daily")
              );
            }
            if (cat.id === "custom") {
              return b.category === "custom";
            }
            return b.category === cat.id;
          });
          const CategoryIcon = cat.icon;

          return (
            <div key={cat.id} className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                  <div
                    className={`rounded-xl border border-white/10 bg-white/[0.04] p-2 ${cat.color}`}
                  >
                    <CategoryIcon size={16} />
                  </div>
                  <span className="text-[10px] font-black tracking-[0.3em] text-white/50 uppercase">
                    {cat.label}
                  </span>
                </div>
                {cat.id === "custom" && (
                  <button
                    onClick={() => setIsAddingGoal(true)}
                    className="rounded-xl border border-white/10 bg-white/[0.04] p-2 text-white transition-colors hover:bg-white/10"
                  >
                    <Plus size={16} />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {catBadges.length > 0 ? (
                  catBadges.map((badge) => {
                    const isCustom = badge.category === "custom";
                    const CustomIcon = badge.iconId
                      ? GOAL_ICONS[badge.iconId]
                      : null;
                    const DisplayIcon =
                      CustomIcon || (badge.unlocked ? Sparkles : Lock);

                    return (
                      <motion.div
                        key={`${cat.id}-${badge.id}`}
                        onClick={() => handleBadgeClick(badge)}
                        className={`group relative w-full overflow-hidden rounded-[42px] border border-white/[0.06] bg-white/[0.02] p-9 text-left shadow-2xl backdrop-blur-md ${!badge.unlocked && "opacity-50"} ${isCustom ? "cursor-pointer hover:border-white/10" : "cursor-default"}`}
                      >
                        {/* iOS Style Inner Glow */}
                        <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-white opacity-0 blur-[100px] transition-opacity duration-1000 group-hover:opacity-[0.03]" />

                        {/* Top: Identity Section */}
                        <div className="relative z-10 mb-10 flex items-start gap-7">
                          <div className="relative mt-1 flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-[22px] border border-white/10 bg-white/[0.04] transition-all duration-700">
                            <div className="absolute inset-0 rounded-full bg-white opacity-10 blur-xl" />
                            <DisplayIcon
                              size={DisplayIcon === CustomIcon ? 28 : 24}
                              strokeWidth={1.5}
                              className="relative z-10 text-white"
                            />
                          </div>
                          <div className="min-w-0 flex-1 space-y-3">
                            <div className="space-y-1">
                              <h4 className="truncate text-xl font-light tracking-tight text-white">
                                {badge.name}
                              </h4>
                              <p className="text-[10px] leading-relaxed font-bold tracking-widest text-white/60 uppercase">
                                {badge.description}
                              </p>
                            </div>

                            {badge.unlocked ? (
                              <div className="inline-flex items-center gap-2">
                                <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[8px] font-black tracking-[0.2em] text-white/90 uppercase shadow-inner">
                                  <CheckCircle2
                                    size={10}
                                    className="text-white"
                                  />
                                  {isCustom ? "GOAL MASTERED" : "EARNED"}
                                </div>
                              </div>
                            ) : (
                              <div className="inline-flex">
                                <div className="rounded-full border border-white/[0.05] bg-white/[0.02] px-3 py-1 text-[8px] font-black tracking-[0.2em] text-white/50 uppercase">
                                  IN PROGRESS
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Bottom: Progress & Action Section */}
                        <div className="relative z-10 mb-4 flex items-end justify-between gap-8">
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center justify-between px-1">
                              <span className="text-[8px] font-black tracking-widest text-white/40 uppercase">
                                Practice Goal
                              </span>
                              <span className="text-[8px] font-black tracking-widest text-white/40 uppercase">
                                {badge.requirement}m
                              </span>
                            </div>
                            {/* Progress System */}
                            {!badge.unlocked &&
                              badge.progress !== undefined && (
                                <div className="relative h-2 w-full overflow-hidden rounded-full border border-white/[0.05] bg-white/[0.03] p-[1px]">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${badge.progress}%` }}
                                    transition={{
                                      duration: 0.8,
                                      ease: [0.16, 1, 0.3, 1],
                                    }}
                                    className="h-full rounded-full bg-gradient-to-r from-white/30 to-white/60 shadow-[0_0_10px_rgba(255,255,255,0.1)]"
                                  />
                                </div>
                              )}
                          </div>

                          <div className="shrink-0 text-right">
                            <div className="flex flex-col items-end gap-2">
                              <span className="text-4xl leading-none font-light tracking-tighter text-white tabular-nums">
                                {Math.round(badge.progress || 0)}%
                              </span>
                              {isCustom && !badge.unlocked && (
                                <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 font-bold text-black shadow-lg transition-all active:scale-95">
                                  <Play
                                    size={10}
                                    className="fill-black text-black"
                                  />
                                  <span className="text-[8px] tracking-widest text-black uppercase">
                                    Begin
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {isCustom && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteGoal(badge.id);
                            }}
                            className="absolute top-4 right-4 z-20 p-3 text-white/40 opacity-40 transition-all hover:text-white hover:opacity-100"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="rounded-[42px] border border-dashed border-white/10 py-10 text-center opacity-20">
                    <p className="text-[10px] font-bold tracking-widest text-white uppercase">
                      No goals set
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
