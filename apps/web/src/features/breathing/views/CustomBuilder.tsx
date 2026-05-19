"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Info, Minus, Plus, Save } from "lucide-react";
import React, { useState } from "react";

import { Exercise, IconMap } from "../data";

interface CustomBuilderProps {
  onBack: () => void;
  onSave: (exercise: Exercise) => void;
}

const GRADIENTS = [
  { start: "#6366f1", end: "#a855f7", name: "Mystic" },
  { start: "#0082ff", end: "#00ffd5", name: "Zen" },
  { start: "#f43f5e", end: "#fb923c", name: "Sunset" },
  { start: "#10b981", end: "#3b82f6", name: "Forest" },
  { start: "#ec4899", end: "#8b5cf6", name: "Lotus" },
  { start: "#4b5563", end: "#111827", name: "Void" },
  { start: "#0ea5e9", end: "#2563eb", name: "Ocean" },
  { start: "#fbcfe8", end: "#f472b6", name: "Quartz" },
  { start: "#fbbf24", end: "#d97706", name: "Gold" },
  { start: "#065f46", end: "#064e3b", name: "Jungle" },
  { start: "#e9d5ff", end: "#a855f7", name: "Mist" },
  { start: "#f97316", end: "#7c3aed", name: "Nova" },
];

const ICONS = Object.keys(IconMap);

const DurationSelector = React.memo(
  ({
    label,
    value,
    setter,
  }: {
    label: string;
    value: number;
    setter: (v: number) => void;
  }) => {
    return (
      <div className="flex flex-col gap-3">
        <span className="px-1 text-[10px] font-medium tracking-widest text-gray-500 uppercase">
          {label}
        </span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setter(Math.max(0, value - 1))}
            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-gray-400 transition-all hover:bg-white/10 hover:text-white active:scale-95"
          >
            <Minus size={18} />
          </button>

          <div className="flex h-12 flex-1 items-center justify-center rounded-2xl border border-white/5 bg-white/[0.03]">
            <span className="text-xl font-light text-white">{value}</span>
            <span className="ml-1.5 text-[10px] tracking-wide text-gray-500 uppercase">
              sec
            </span>
          </div>

          <button
            onClick={() => setter(value + 1)}
            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-gray-400 transition-all hover:bg-white/10 hover:text-white active:scale-95"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>
    );
  },
);

DurationSelector.displayName = "DurationSelector";

export function CustomBuilder({ onBack, onSave }: CustomBuilderProps) {
  const [name, setName] = useState("");
  const [inhale, setInhale] = useState(4);
  const [hold1, setHold1] = useState(4);
  const [exhale, setExhale] = useState(4);
  const [hold2, setHold2] = useState(4);
  const [selectedIcon, setSelectedIcon] = useState("Activity");
  const [selectedGradient, setSelectedGradient] = useState(GRADIENTS[0]);

  const handleSave = () => {
    if (!name.trim()) return;

    const newExercise: Exercise = {
      id: `custom-${Date.now()}`,
      name: name,
      subtitle: "My Journey",
      description: `Custom pattern: ${inhale}-${hold1}-${exhale}-${hold2}`,
      howTo: `Inhale for ${inhale}s, hold for ${hold1}s, exhale for ${exhale}s, and hold for ${hold2}s.`,
      why: "This is your personalized breathing journey designed for your specific needs.",
      benefits: ["Personalized flow", "Custom rhythm"],
      icon: selectedIcon,
      gradient: {
        start: selectedGradient.start,
        end: selectedGradient.end,
      },
      pattern: { inhale, hold1, exhale, hold2 },
    };

    onSave(newExercise);
    onBack();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="mx-auto w-full max-w-lg"
    >
      <div className="mb-10 flex items-center gap-4">
        <button
          onClick={onBack}
          className="rounded-full border border-white/10 bg-white/5 p-4 text-gray-400 transition-all hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-3xl font-light tracking-tight text-white">
            Create Journey
          </h2>
          <p className="mt-1 text-[10px] tracking-widest text-gray-500 uppercase">
            Design your own pattern
          </p>
        </div>
      </div>

      <div className="space-y-12 pb-24">
        {/* Name Input Section */}
        <div className="flex flex-col gap-4">
          <span className="px-1 text-[10px] font-medium tracking-[0.2em] text-gray-500 uppercase">
            Journey Name
          </span>
          <input
            type="text"
            placeholder="e.g. Morning Focus"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-16 w-full rounded-[24px] border border-white/10 bg-white/[0.03] px-6 text-white transition-all placeholder:text-gray-600 focus:border-white/20 focus:bg-white/[0.05] focus:outline-none"
          />
        </div>

        {/* Durations Section */}
        <div className="flex flex-col gap-8 rounded-[32px] border border-white/5 bg-white/[0.02] p-6">
          <span className="-mb-2 px-1 text-[10px] font-medium tracking-[0.2em] text-gray-500 uppercase">
            Breath Ratios
          </span>
          <DurationSelector
            label="Inhale Duration"
            value={inhale}
            setter={setInhale}
          />
          <DurationSelector
            label="Hold (Full)"
            value={hold1}
            setter={setHold1}
          />
          <DurationSelector
            label="Exhale Duration"
            value={exhale}
            setter={setExhale}
          />
          <DurationSelector
            label="Hold (Empty)"
            value={hold2}
            setter={setHold2}
          />
        </div>

        {/* Visual Identity Section */}
        <div className="space-y-4">
          <span className="px-1 text-[10px] font-medium tracking-[0.2em] text-gray-500 uppercase">
            Visual Identity
          </span>
          <div className="flex flex-col gap-8 rounded-[32px] border border-white/5 bg-white/[0.03] p-8">
            {/* Icon Selector */}
            <div className="space-y-3">
              <span className="px-1 text-[10px] tracking-widest text-gray-600 uppercase">
                Select Icon
              </span>
              <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
                {ICONS.map((iconName) => {
                  const Icon = IconMap[iconName as keyof typeof IconMap];
                  const isActive = selectedIcon === iconName;
                  return (
                    <button
                      key={iconName}
                      onClick={() => setSelectedIcon(iconName)}
                      className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all ${
                        isActive
                          ? "border-white bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                          : "border-white/10 bg-white/5 text-gray-500 hover:bg-white/10"
                      }`}
                    >
                      <Icon size={18} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Gradient Selector */}
            <div className="space-y-3">
              <span className="px-1 text-[10px] tracking-widest text-gray-600 uppercase">
                Select Theme
              </span>
              <div className="grid grid-cols-3 gap-3">
                {GRADIENTS.map((g) => {
                  const isActive = selectedGradient.start === g.start;
                  return (
                    <button
                      key={g.name}
                      onClick={() => setSelectedGradient(g)}
                      className={`flex h-12 items-center justify-center gap-2.5 rounded-xl border px-3 transition-all ${
                        isActive
                          ? "border-white bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                          : "border-white/10 bg-white/5 hover:border-white/20"
                      }`}
                    >
                      <div
                        className="h-4 w-4 rounded-full shadow-sm"
                        style={{
                          background: `linear-gradient(135deg, ${g.start}, ${g.end})`,
                        }}
                      />
                      <span
                        className={`text-[10px] font-medium tracking-wide ${isActive ? "text-white" : "text-gray-500"}`}
                      >
                        {g.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="flex gap-4 rounded-[24px] border border-white/5 bg-white/[0.02] p-6">
          <Info size={20} className="mt-0.5 shrink-0 text-gray-500" />
          <p className="text-xs leading-relaxed font-light text-gray-500">
            Customizing your visuals helps you mentally associate specific
            themes with your breathing states.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={!name.trim()}
          className={`flex h-16 w-full items-center justify-center gap-3 rounded-full text-lg font-medium shadow-xl transition-all active:scale-[0.98] ${
            name.trim()
              ? "bg-white text-black hover:opacity-90"
              : "pointer-events-none border border-white/5 bg-white/5 text-gray-600"
          }`}
          style={{
            boxShadow: name.trim()
              ? `0 10px 30px ${selectedGradient.start}44`
              : "none",
          }}
        >
          <Save size={20} />
          Save to My Journey
        </button>
      </div>
    </motion.div>
  );
}
