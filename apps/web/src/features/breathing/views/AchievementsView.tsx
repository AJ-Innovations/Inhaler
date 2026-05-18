'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, Plus, Trash2, Lock, Clock, Calendar, Sparkles, 
  CheckCircle2, Play, ChevronLeft, Target, Wind, Repeat, Zap, 
  Heart, Brain, Activity, Sun, Moon, Cloud, Shield, LucideIcon
} from 'lucide-react';
import { Badge, CustomGoal } from '../hooks/useCustomExercises';
import { Exercise, exercises as defaultExercises } from '../data';

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
  onAddGoal: (goal: { id: string; name: string; targetMinutes: number; exerciseId: string; frequency: 'once' | 'daily'; iconId?: string }) => void;
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
  calendar: Calendar
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

export function AchievementsView({ stats, customExercises, onAddGoal, onDeleteGoal, onStart }: AchievementsViewProps) {
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState('2');
  const [selectedExerciseId, setSelectedExerciseId] = useState('box');
  const [frequency, setFrequency] = useState<'once' | 'daily'>('daily');
  const [selectedIconId, setSelectedIconId] = useState('wind');

  const allExercises = [...defaultExercises, ...customExercises];

  const categories = [
    { id: 'daily', label: 'Today\'s Focus', icon: Clock, color: 'text-white' },
    { id: 'weekly', label: 'Consistency', icon: Calendar, color: 'text-white' },
    { id: 'milestone', label: 'Lifetime Achievements', icon: Trophy, color: 'text-white' },
    { id: 'custom', label: 'Personal Goals', icon: TargetArrow, color: 'text-white' }
  ];

  const handleAddGoal = () => {
    if (!newGoalName) return;
    onAddGoal({
      id: Math.random().toString(36).substring(2, 11),
      name: newGoalName,
      targetMinutes: parseInt(newGoalTarget) || 2,
      exerciseId: selectedExerciseId,
      frequency,
      iconId: selectedIconId
    });
    setNewGoalName('');
    setIsAddingGoal(false);
  };

  const handleBadgeClick = (badge: Badge) => {
    const isCustomGoal = badge.category === 'custom' || badge.type === 'manual' || !!badge.frequency;
    if (!isCustomGoal) return;

    const exercise = allExercises.find(e => e.id === badge.exerciseId);
    if (exercise) onStart(exercise);
    else {
      const boxEx = allExercises.find(e => e.id === 'box');
      if (boxEx) onStart(boxEx);
    }
  };

  if (isAddingGoal) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        className="fixed inset-0 z-[300] bg-black/60 backdrop-blur-2xl flex flex-col p-8 pb-32"
      >
        <div className="flex items-center gap-6 mb-12">
          <button 
            onClick={() => setIsAddingGoal(false)}
            className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="space-y-1">
            <h2 className="text-2xl font-light text-white tracking-tight">Set Goal</h2>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Design Your Routine</p>
          </div>
        </div>

        <div className="flex-1 space-y-10 overflow-y-auto pr-2 scrollbar-hide">
          <div className="space-y-4">
            <label className="text-[10px] uppercase tracking-[0.3em] font-black text-gray-400 px-2">Goal Name</label>
            <input 
              type="text" 
              autoFocus
              value={newGoalName}
              onChange={(e) => setNewGoalName(e.target.value)}
              placeholder="e.g. Peak Focus Routine"
              className="w-full bg-transparent border-b border-white/10 rounded-none py-4 text-3xl font-light text-white placeholder:text-gray-800 focus:outline-none focus:border-rose-500 transition-all"
            />
          </div>

          <div className="space-y-6">
            <label className="text-[10px] uppercase tracking-[0.3em] font-black text-gray-400 px-2">Goal Identity (Icon)</label>
            <div className="flex flex-wrap gap-3">
              {Object.entries(GOAL_ICONS).map(([id, Icon]) => (
                <button
                  key={id}
                  onClick={() => setSelectedIconId(id)}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${selectedIconId === id ? 'bg-white text-black border-white shadow-lg' : 'bg-white/5 border-white/5 text-gray-500 hover:border-white/10'}`}
                >
                  <Icon size={20} />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <label className="text-[10px] uppercase tracking-[0.3em] font-black text-gray-400 px-2">Practice Focus</label>
            <div className="grid grid-cols-2 gap-3">
              {allExercises.map(ex => (
                <button
                  key={ex.id}
                  onClick={() => setSelectedExerciseId(ex.id)}
                  className={`p-5 rounded-[28px] border transition-all text-left relative overflow-hidden group ${selectedExerciseId === ex.id ? 'bg-white text-black border-white' : 'bg-white/5 border-white/5 text-white'}`}
                >
                  <div className="flex flex-col gap-2 relative z-10">
                    <div className="w-5 h-5 rounded-full" style={{ background: `linear-gradient(135deg, ${ex.gradient.start}, ${ex.gradient.end})` }} />
                    <span className="text-[10px] font-black uppercase tracking-widest truncate">{ex.name}</span>
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
            <label className="text-[10px] uppercase tracking-[0.3em] font-black text-gray-400 px-2">Training Frequency</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setFrequency('daily')}
                className={`flex flex-col items-center justify-center p-6 rounded-[32px] border transition-all gap-3 ${frequency === 'daily' ? 'bg-white text-black border-white shadow-xl' : 'bg-white/5 border-white/5 text-gray-500'}`}
              >
                <Repeat size={20} />
                <span className="text-[9px] font-black uppercase tracking-widest">Every Day</span>
              </button>
              <button
                onClick={() => setFrequency('once')}
                className={`flex flex-col items-center justify-center p-6 rounded-[32px] border transition-all gap-3 ${frequency === 'once' ? 'bg-white text-black border-white shadow-xl' : 'bg-white/5 border-white/5 text-gray-500'}`}
              >
                <Zap size={20} />
                <span className="text-[9px] font-black uppercase tracking-widest">One-time Milestone</span>
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <label className="text-[10px] uppercase tracking-[0.3em] font-black text-gray-400 px-2">Biological Target</label>
            <div className="bg-white/[0.03] border border-white/5 rounded-[42px] p-8 space-y-8">
              <div className="flex justify-between items-baseline">
                <span className="text-6xl font-light text-white tabular-nums tracking-tighter">{newGoalTarget}</span>
                <span className="text-sm text-gray-500 font-bold uppercase tracking-widest">Minutes</span>
              </div>
              <input 
                type="range"
                min="1"
                max="60"
                step="1"
                value={newGoalTarget}
                onChange={(e) => setNewGoalTarget(e.target.value)}
                className="w-full h-1 bg-white/10 rounded-full appearance-none accent-white"
              />
              <div className="flex justify-between text-[8px] font-black text-gray-700 uppercase tracking-widest px-1">
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
            className="w-full py-7 rounded-[32px] text-[10px] font-black uppercase tracking-[0.5em] text-black bg-white hover:bg-rose-400 hover:text-white transition-all shadow-2xl active:scale-95"
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
      <div className="w-full flex justify-between items-start mb-4 px-1">
        <div className="space-y-1">
          <h1 className="text-3xl font-light tracking-tight text-white/90">Zen Mastery</h1>
          <p className="text-white/40 text-[10px] uppercase tracking-[0.4em] font-black">Path to Resilience</p>
        </div>
        <div className="w-11 h-11 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center text-white">
          <Trophy size={20} />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="space-y-14">
        {categories.map((cat) => {
          const catBadges = stats.badges.filter(b => {
            if (cat.id === 'daily') {
              return b.category === 'daily' || (b.category === 'custom' && b.frequency === 'daily');
            }
            if (cat.id === 'custom') {
              return b.category === 'custom';
            }
            return b.category === cat.id;
          });
          const CategoryIcon = cat.icon;

          return (
            <div key={cat.id} className="space-y-6">
              <div className="flex justify-between items-center px-2">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl bg-white/[0.04] border border-white/10 ${cat.color}`}>
                    <CategoryIcon size={16} />
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.3em] font-black text-white/50">{cat.label}</span>
                </div>
                {cat.id === 'custom' && (
                  <button 
                    onClick={() => setIsAddingGoal(true)}
                    className="p-2 rounded-xl bg-white/[0.04] border border-white/10 text-white hover:bg-white/10 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4">
                {catBadges.length > 0 ? (
                  catBadges.map((badge) => {
                    const isCustom = badge.category === 'custom';
                    const CustomIcon = badge.iconId ? GOAL_ICONS[badge.iconId] : null;
                    const DisplayIcon = CustomIcon || (badge.unlocked ? Sparkles : Lock);

                    return (
                      <motion.div
                        key={`${cat.id}-${badge.id}`}
                        onClick={() => handleBadgeClick(badge)}
                        className={`relative w-full bg-white/[0.02] backdrop-blur-md border border-white/[0.06] rounded-[42px] p-9 shadow-2xl overflow-hidden group text-left ${!badge.unlocked && 'opacity-50'} ${isCustom ? 'cursor-pointer hover:border-white/10' : 'cursor-default'}`}
                      >
                        {/* iOS Style Inner Glow */}
                        <div
                          className="absolute -right-20 -top-20 w-60 h-60 bg-white rounded-full blur-[100px] opacity-0 group-hover:opacity-[0.03] transition-opacity duration-1000"
                        />
                        
                        {/* Top: Identity Section */}
                        <div className="relative z-10 flex items-start gap-7 mb-10">
                          <div className="w-16 h-16 rounded-[22px] bg-white/[0.04] border border-white/10 flex items-center justify-center shrink-0 relative overflow-hidden transition-all duration-700 mt-1">
                            <div className="absolute inset-0 blur-xl opacity-10 bg-white rounded-full" />
                            <DisplayIcon size={DisplayIcon === CustomIcon ? 28 : 24} strokeWidth={1.5} className="text-white relative z-10" />
                          </div>
                          <div className="min-w-0 flex-1 space-y-3">
                            <div className="space-y-1">
                              <h4 className="text-xl font-light tracking-tight text-white truncate">
                                {badge.name}
                              </h4>
                              <p className="text-[10px] text-white/60 font-bold uppercase tracking-widest leading-relaxed">
                                {badge.description}
                              </p>
                            </div>
                            
                            {badge.unlocked ? (
                              <div className="inline-flex items-center gap-2">
                                <div className="px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-[0.2em] flex items-center gap-1.5 text-white/90 bg-white/[0.04] border border-white/10 shadow-inner">
                                  <CheckCircle2 size={10} className="text-white" />
                                  {isCustom ? 'GOAL MASTERED' : 'EARNED'}
                                </div>
                              </div>
                            ) : (
                              <div className="inline-flex">
                                <div className="px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em] text-white/50 bg-white/[0.02] border border-white/[0.05]">
                                  IN PROGRESS
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Bottom: Progress & Action Section */}
                        <div className="relative z-10 flex items-end justify-between gap-8 mb-4">
                          <div className="flex-1 space-y-3">
                             <div className="flex justify-between items-center px-1">
                                <span className="text-[8px] font-black uppercase tracking-widest text-white/40">Practice Goal</span>
                                <span className="text-[8px] font-black uppercase tracking-widest text-white/40">{badge.requirement}m</span>
                             </div>
                             {/* Progress System */}
                            {!badge.unlocked && badge.progress !== undefined && (
                              <div className="relative h-2 w-full bg-white/[0.03] rounded-full overflow-hidden border border-white/[0.05] p-[1px]">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${badge.progress}%` }}
                                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                  className="h-full rounded-full bg-gradient-to-r from-white/30 to-white/60 shadow-[0_0_10px_rgba(255,255,255,0.1)]"
                                />
                              </div>
                            )}
                          </div>

                          <div className="text-right shrink-0">
                            <div className="flex flex-col items-end gap-2">
                              <span className="text-4xl font-light tabular-nums tracking-tighter leading-none text-white">
                                {Math.round(badge.progress || 0)}%
                              </span>
                              {isCustom && !badge.unlocked && (
                                <div className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full active:scale-95 transition-all shadow-lg font-bold">
                                  <Play size={10} className="text-black fill-black" />
                                  <span className="text-[8px] text-black uppercase tracking-widest">Begin</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {isCustom && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); onDeleteGoal(badge.id); }}
                            className="absolute top-4 right-4 p-3 text-white/40 hover:text-white transition-all opacity-40 hover:opacity-100 z-20"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="text-center py-10 opacity-20 border border-dashed border-white/10 rounded-[42px]">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-white">No goals set</p>
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
