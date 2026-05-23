import { Exercise } from "@features/breathing/data";
import { motion } from "framer-motion";
import { CheckCircle2, ChevronLeft, Repeat, Zap } from "lucide-react";
import React from "react";
import { GOAL_ICONS } from "../data/goalIcons";

interface AddGoalModalProps {
  onClose: () => void;
  onAddGoal: () => void;
  newGoalName: string;
  setNewGoalName: (val: string) => void;
  newGoalTarget: string;
  setNewGoalTarget: (val: string) => void;
  selectedExerciseId: string;
  setSelectedExerciseId: (val: string) => void;
  frequency: "once" | "daily";
  setFrequency: (val: "once" | "daily") => void;
  selectedIconId: string;
  setSelectedIconId: (val: string) => void;
  allExercises: Exercise[];
}

export function AddGoalModal({
  onClose,
  onAddGoal,
  newGoalName,
  setNewGoalName,
  newGoalTarget,
  setNewGoalTarget,
  selectedExerciseId,
  setSelectedExerciseId,
  frequency,
  setFrequency,
  selectedIconId,
  setSelectedIconId,
  allExercises,
}: AddGoalModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="fixed inset-0 z-[300] flex flex-col bg-black/60 p-8 pb-32 backdrop-blur-2xl"
    >
      <div className="mb-12 flex items-center gap-6">
        <button
          onClick={onClose}
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
                className={`flex h-12 w-12 items-center justify-center rounded-2xl border transition-all ${
                  selectedIconId === id
                    ? "border-white bg-white text-black shadow-lg"
                    : "border-white/5 bg-white/5 text-gray-500 hover:border-white/10"
                }`}
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
                className={`group relative overflow-hidden rounded-[28px] border p-5 text-left transition-all ${
                  selectedExerciseId === ex.id
                    ? "border-white bg-white text-black"
                    : "border-white/5 bg-white/5 text-white"
                }`}
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
              className={`flex flex-col items-center justify-center gap-3 rounded-[32px] border p-6 transition-all ${
                frequency === "daily"
                  ? "border-white bg-white text-black shadow-xl"
                  : "border-white/5 bg-white/5 text-gray-500"
              }`}
            >
              <Repeat size={20} />
              <span className="text-[9px] font-black tracking-widest uppercase">
                Every Day
              </span>
            </button>
            <button
              onClick={() => setFrequency("once")}
              className={`flex flex-col items-center justify-center gap-3 rounded-[32px] border p-6 transition-all ${
                frequency === "once"
                  ? "border-white bg-white text-black shadow-xl"
                  : "border-white/5 bg-white/5 text-gray-500"
              }`}
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
          onClick={onAddGoal}
          className="w-full rounded-[32px] bg-white py-7 text-[10px] font-black tracking-[0.5em] text-black uppercase shadow-2xl transition-all hover:bg-rose-400 hover:text-white active:scale-95"
        >
          Activate Goal
        </button>
      </div>
    </motion.div>
  );
}
