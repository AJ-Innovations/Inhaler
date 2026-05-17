'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Plus, Minus, Info } from 'lucide-react';
import { Exercise, IconMap } from '../data';

interface CustomBuilderProps {
  onBack: () => void;
  onSave: (exercise: Exercise) => void;
}

const GRADIENTS = [
  { start: '#6366f1', end: '#a855f7', name: 'Mystic' },
  { start: '#0082ff', end: '#00ffd5', name: 'Zen' },
  { start: '#f43f5e', end: '#fb923c', name: 'Sunset' },
  { start: '#10b981', end: '#3b82f6', name: 'Forest' },
  { start: '#ec4899', end: '#8b5cf6', name: 'Lotus' },
  { start: '#4b5563', end: '#111827', name: 'Void' },
  { start: '#0ea5e9', end: '#2563eb', name: 'Ocean' },
  { start: '#fbcfe8', end: '#f472b6', name: 'Quartz' },
  { start: '#fbbf24', end: '#d97706', name: 'Gold' },
  { start: '#065f46', end: '#064e3b', name: 'Jungle' },
  { start: '#e9d5ff', end: '#a855f7', name: 'Mist' },
  { start: '#f97316', end: '#7c3aed', name: 'Nova' },
];

const ICONS = Object.keys(IconMap);

const DurationSelector = React.memo(({ label, value, setter }: { label: string, value: number, setter: (v: number) => void }) => {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-[10px] uppercase tracking-widest text-gray-500 font-medium px-1">{label}</span>
      <div className="flex items-center gap-3">
        <button 
          onClick={() => setter(Math.max(0, value - 1))}
          className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white transition-all active:scale-95"
        >
          <Minus size={18} />
        </button>
        
        <div className="flex-1 h-12 flex items-center justify-center rounded-2xl bg-white/[0.03] border border-white/5">
          <span className="text-xl font-light text-white">{value}</span>
          <span className="text-[10px] text-gray-500 ml-1.5 uppercase tracking-wide">sec</span>
        </div>

        <button 
          onClick={() => setter(value + 1)}
          className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white transition-all active:scale-95"
        >
          <Plus size={18} />
        </button>
      </div>
    </div>
  );
});

DurationSelector.displayName = 'DurationSelector';

export function CustomBuilder({ onBack, onSave }: CustomBuilderProps) {
  const [name, setName] = useState('');
  const [inhale, setInhale] = useState(4);
  const [hold1, setHold1] = useState(4);
  const [exhale, setExhale] = useState(4);
  const [hold2, setHold2] = useState(4);
  const [selectedIcon, setSelectedIcon] = useState('Activity');
  const [selectedGradient, setSelectedGradient] = useState(GRADIENTS[0]);

  const handleSave = () => {
    if (!name.trim()) return;

    const newExercise: Exercise = {
      id: `custom-${Date.now()}`,
      name: name,
      subtitle: 'My Journey',
      description: `Custom pattern: ${inhale}-${hold1}-${exhale}-${hold2}`,
      howTo: `Inhale for ${inhale}s, hold for ${hold1}s, exhale for ${exhale}s, and hold for ${hold2}s.`,
      why: 'This is your personalized breathing journey designed for your specific needs.',
      benefits: ['Personalized flow', 'Custom rhythm'],
      icon: selectedIcon,
      gradient: {
        start: selectedGradient.start,
        end: selectedGradient.end
      },
      pattern: { inhale, hold1, exhale, hold2 }
    };

    onSave(newExercise);
    onBack();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="w-full max-w-lg mx-auto"
    >
      <div className="flex items-center gap-4 mb-10">
        <button 
          onClick={onBack}
          className="p-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-gray-400 hover:text-white"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-3xl font-light tracking-tight text-white">Create Journey</h2>
          <p className="text-[10px] uppercase tracking-widest text-gray-500 mt-1">Design your own pattern</p>
        </div>
      </div>

      <div className="space-y-12 pb-24">
        {/* Name Input Section */}
        <div className="flex flex-col gap-4">
          <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-medium px-1">Journey Name</span>
          <input 
            type="text" 
            placeholder="e.g. Morning Focus"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full h-16 bg-white/[0.03] border border-white/10 rounded-[24px] px-6 text-white placeholder:text-gray-600 focus:outline-none focus:border-white/20 focus:bg-white/[0.05] transition-all"
          />
        </div>

        {/* Durations Section */}
        <div className="flex flex-col gap-8 bg-white/[0.02] border border-white/5 rounded-[32px] p-6">
          <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-medium px-1 -mb-2">Breath Ratios</span>
          <DurationSelector label="Inhale Duration" value={inhale} setter={setInhale} />
          <DurationSelector label="Hold (Full)" value={hold1} setter={setHold1} />
          <DurationSelector label="Exhale Duration" value={exhale} setter={setExhale} />
          <DurationSelector label="Hold (Empty)" value={hold2} setter={setHold2} />
        </div>

        {/* Visual Identity Section */}
        <div className="space-y-4">
          <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-medium px-1">Visual Identity</span>
          <div className="flex flex-col gap-8 p-8 bg-white/[0.03] border border-white/5 rounded-[32px]">
            {/* Icon Selector */}
            <div className="space-y-3">
              <span className="text-[10px] text-gray-600 uppercase tracking-widest px-1">Select Icon</span>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                {ICONS.map((iconName) => {
                  const Icon = IconMap[iconName as keyof typeof IconMap];
                  const isActive = selectedIcon === iconName;
                  return (
                    <button
                      key={iconName}
                      onClick={() => setSelectedIcon(iconName)}
                      className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-all ${
                        isActive ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]' : 'bg-white/5 text-gray-500 border-white/10 hover:bg-white/10'
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
              <span className="text-[10px] text-gray-600 uppercase tracking-widest px-1">Select Theme</span>
              <div className="grid grid-cols-3 gap-3">
                {GRADIENTS.map((g) => {
                  const isActive = selectedGradient.start === g.start;
                  return (
                    <button
                      key={g.name}
                      onClick={() => setSelectedGradient(g)}
                      className={`h-12 rounded-xl border flex items-center justify-center gap-2.5 px-3 transition-all ${
                        isActive ? 'border-white bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.1)]' : 'border-white/10 bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <div 
                        className="w-4 h-4 rounded-full shadow-sm" 
                        style={{ background: `linear-gradient(135deg, ${g.start}, ${g.end})` }}
                      />
                      <span className={`text-[10px] font-medium tracking-wide ${isActive ? 'text-white' : 'text-gray-500'}`}>{g.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="p-6 bg-white/[0.02] border border-white/5 rounded-[24px] flex gap-4">
          <Info size={20} className="text-gray-500 shrink-0 mt-0.5" />
          <p className="text-xs text-gray-500 leading-relaxed font-light">
            Customizing your visuals helps you mentally associate specific themes with your breathing states.
          </p>
        </div>

        <button 
          onClick={handleSave}
          disabled={!name.trim()}
          className={`w-full h-16 rounded-full flex items-center justify-center gap-3 font-medium text-lg transition-all active:scale-[0.98] shadow-xl ${
            name.trim() ? 'bg-white text-black hover:opacity-90' : 'bg-white/5 text-gray-600 border border-white/5 pointer-events-none'
          }`}
          style={{ 
            boxShadow: name.trim() ? `0 10px 30px ${selectedGradient.start}44` : 'none'
          }}
        >
          <Save size={20} />
          Save to My Journey
        </button>
      </div>
    </motion.div>
  );
}
