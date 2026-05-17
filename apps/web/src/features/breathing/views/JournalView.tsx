'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Zap, Calendar, Activity, Wind, Brain, ShieldCheck, ChevronRight, Info, Timer } from 'lucide-react';
import { exercises } from '../data';
import { Badge } from '../hooks/useCustomExercises';

interface JournalViewProps {
  sessions: { exerciseId: string; date: string; duration: number; cycles?: number }[];
  stats: {
    totalMinutes: number;
    sessionCount: number;
    streak: number;
    badges: Badge[];
  };
}

interface Session {
  exerciseId: string;
  date: string;
  duration: number;
  cycles?: number;
}

const HealthTrendGraph = ({ sessions }: { sessions: Session[] }) => {
  const [activeMetric, setActiveMetric] = useState<'vagal' | 'cardiac' | 'lung' | 'focus' | 'apnea'>('vagal');

  const multiTrendData = useMemo(() => {
    const now = new Date();
    const vagal = [];
    const cardiac = [];
    const lung = [];
    const focus = [];
    const apnea = [];
    
    for (let i = 11; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay() - (i * 7));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      
      const weekStartStr = weekStart.toISOString().split('T')[0];
      const weekEndStr = weekEnd.toISOString().split('T')[0];
      
      const weeklySessions = sessions.filter(s => {
        const sessionDate = s.date.split('T')[0];
        return sessionDate >= weekStartStr && sessionDate <= weekEndStr;
      });

      const totalMinutes = weeklySessions.reduce((acc, s) => acc + (s.duration / 60), 0);
      const totalCycles = weeklySessions.reduce((acc, s) => acc + (s.cycles || (s.duration / 15)), 0);
      const sessionCount = weeklySessions.length;
      const uniqueExercises = new Set(weeklySessions.map(s => s.exerciseId)).size;

      const holdSessions = weeklySessions.filter(s => {
        const ex = exercises.find(e => e.id === s.exerciseId);
        return ex && (ex.pattern.hold1 > 0 || ex.pattern.hold2 > 0);
      });
      const holdIntensity = holdSessions.reduce((acc, s) => {
        const ex = exercises.find(e => e.id === s.exerciseId)!;
        return acc + (ex.pattern.hold1 + ex.pattern.hold2);
      }, 0);

      const baseline = 22;
      
      vagal.push(Math.max(baseline, Math.min(100, (sessionCount / 5) * 50 + (totalMinutes / 100) * 50)));
      cardiac.push(Math.max(baseline + 5, Math.min(100, (totalCycles / 150) * 40 + (totalMinutes / 120) * 60)));
      lung.push(Math.max(baseline - 5, Math.min(100, (totalCycles / 200) * 85 + (sessionCount / 7) * 15)));
      focus.push(Math.max(baseline + 10, Math.min(100, (uniqueExercises / 3) * 60 + (totalMinutes / 90) * 40)));
      apnea.push(Math.max(baseline, Math.min(100, (holdIntensity / 40) * 70 + (totalMinutes / 150) * 30)));
    }

    return { vagal, cardiac, lung, focus, apnea };
  }, [sessions]);

  const metrics = [
    { id: 'vagal', label: 'Vagal Tone', icon: ShieldCheck, color: '#A5B4FC', desc: 'Stress Resilience', longDesc: 'Vagal Tone measures your nervous system\'s "braking" speed. A higher score means your body recovers from stress faster.' },
    { id: 'cardiac', label: 'Coherence', icon: Activity, color: '#F87171', desc: 'Heart Balance', longDesc: 'Cardiac Coherence tracks the synchronization of heart rhythm and breath, reducing emotional volatility.' },
    { id: 'lung', label: 'Lung Capacity', icon: Wind, color: '#34D399', desc: 'Oxygen Uptake', longDesc: 'Physical lung elasticity and diaphragm strength, allowing for deeper oxygen saturation in tissues.' },
    { id: 'apnea', label: 'CO2 Tolerance', icon: Timer, color: '#F472B6', desc: 'Breath Hold Stamina', longDesc: 'Measures your resilience to CO2 buildup. Training this increases red blood cell count and cellular energy production.' },
    { id: 'focus', label: 'Neural Calm', icon: Brain, color: '#FBBF24', desc: 'Focus Clarity', longDesc: 'The reduction of cortisol-induced brain fog, improving your ability to maintain single-pointed focus.' }
  ] as const;

  const currentMetric = metrics.find(m => m.id === activeMetric)!;
  const currentScore = Math.round(multiTrendData[activeMetric][11] || 0);
  const isNewUser = sessions.length < 3;

  const getPoints = (data: number[]) => data.map((d, i) => `${(i / (data.length - 1)) * 100},${100 - d}`).join(' ');

  return (
    <div className="w-full bg-[#0D0D0D] border border-white/[0.06] rounded-[42px] p-8 shadow-2xl relative overflow-hidden group">
      {/* Dynamic Headline */}
      <div className="flex justify-between items-start mb-10 px-1 relative z-10">
        <div className="flex items-center gap-5">
          <motion.div 
            key={currentMetric.id}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center shadow-2xl"
          >
            <currentMetric.icon size={28} style={{ color: currentMetric.color }} />
          </motion.div>
          <div className="space-y-1">
            <AnimatePresence mode="wait">
              <motion.h3 
                key={currentMetric.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-2xl font-light text-white tracking-tight"
              >
                {currentMetric.label}
              </motion.h3>
            </AnimatePresence>
            <p className="text-[10px] uppercase tracking-[0.3em] font-black text-gray-600">{currentMetric.desc}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center justify-end gap-2">
            <motion.span 
              key={currentScore}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-light text-white tracking-tighter"
            >
              {currentScore}
            </motion.span>
            <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-2">pts</span>
          </div>
          <p className={`text-[8px] uppercase tracking-[0.2em] font-black mt-1 ${isNewUser ? 'text-blue-400' : 'text-emerald-400'}`}>
            {isNewUser ? 'Baseline State' : 'Improving'}
          </p>
        </div>
      </div>
      
      {/* Refined Thin-Line Multi-Graph */}
      <div className="h-44 w-full relative group z-10 px-2 mb-10">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
          {metrics.map(m => {
            const isActive = activeMetric === m.id;
            return (
              <motion.polyline
                key={m.id}
                fill="none"
                stroke={m.color}
                strokeWidth={isActive ? 2 : 0.75}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={m.id === 'apnea' ? '4 2' : 'none'}
                points={getPoints(multiTrendData[m.id])}
                className={`transition-all duration-700 ${isActive ? 'opacity-100' : 'opacity-30'}`}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              />
            );
          })}
          
          <motion.polyline
            key={`${activeMetric}-glow`}
            fill="none"
            stroke={currentMetric.color}
            strokeWidth={4}
            strokeLinecap="round"
            strokeLinejoin="round"
            points={getPoints(multiTrendData[activeMetric])}
            className="opacity-10 blur-[6px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
          />
        </svg>
      </div>

      {/* Interactive Legend (Clickable Items) */}
      <div className="space-y-8 relative z-10">
        <div className="grid grid-cols-2 gap-3">
          {metrics.map((m) => {
            const isActive = activeMetric === m.id;
            return (
              <button 
                key={m.id} 
                onClick={() => setActiveMetric(m.id)}
                className={`flex items-center gap-3 p-3.5 rounded-[28px] border transition-all duration-500 text-left ${isActive ? 'bg-white/[0.05] border-white/20 shadow-xl' : 'bg-transparent border-transparent opacity-40 hover:opacity-100'}`}
              >
                <div className={`w-9 h-9 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center shadow-inner shrink-0`}>
                  <m.icon size={16} style={{ color: m.color }} />
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5 overflow-hidden">
                    <div className="w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: m.color }} />
                    <span className="text-[8px] uppercase tracking-widest font-black text-gray-500 truncate">{m.label}</span>
                  </div>
                  <span className="text-[10px] font-medium text-white tracking-tight leading-none mt-1">{isActive ? 'Active' : 'Analyze'}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Dynamic Insight Box */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeMetric}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white/[0.02] border border-white/[0.05] rounded-[36px] p-7 space-y-4 shadow-inner"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Info size={14} style={{ color: currentMetric.color }} />
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600">Training Insight</span>
              </div>
              <ChevronRight size={14} className="text-gray-700" />
            </div>
            <p className="text-[11px] text-gray-400 font-light leading-relaxed">
              {isNewUser ? `Welcome. Your current ${currentMetric.label} is at a baseline of ${currentScore}pts. Complete 3 sessions of breath-holding exercises to see your training curve evolve.` : currentMetric.longDesc}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute inset-0 bg-white/[0.01] pointer-events-none" />
    </div>
  );
};

export function JournalView({ sessions, stats }: JournalViewProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth;
    }
  }, []);

  const activityMap = useMemo(() => {
    const map: Record<string, number> = {};
    sessions.forEach(s => {
      const dateKey = s.date.split('T')[0];
      map[dateKey] = (map[dateKey] || 0) + s.duration;
    });
    return map;
  }, [sessions]);

  const { weeks, monthLabels } = useMemo(() => {
    const weeksList = [];
    const months = [];
    const now = new Date();
    const startDate = new Date(now);
    startDate.setDate(now.getDate() - now.getDay());
    startDate.setDate(startDate.getDate() - (51 * 7));
    
    let lastMonth = -1;

    for (let w = 0; w < 52; w++) {
      const weekDays = [];
      const firstDayOfWeek = new Date(startDate);
      firstDayOfWeek.setDate(startDate.getDate() + (w * 7));
      
      const monthIndex = firstDayOfWeek.getMonth();
      if (monthIndex !== lastMonth) {
        months.push({
          label: firstDayOfWeek.toLocaleDateString('en-US', { month: 'short' }),
          index: w
        });
        lastMonth = monthIndex;
      }

      for (let d = 0; d < 7; d++) {
        const targetDate = new Date(firstDayOfWeek);
        targetDate.setDate(firstDayOfWeek.getDate() + d);
        
        if (targetDate > now) {
          weekDays.push({ date: '', level: -1, duration: 0 });
          continue;
        }

        const dateKey = targetDate.toISOString().split('T')[0];
        const duration = activityMap[dateKey] || 0;
        
        // UPDATED LEVEL LOGIC:
        // Level 1: > 0 (Started)
        // Level 2: >= 5 min (300s)
        // Level 3: >= 10 min (600s)
        // Level 4: >= 15 min (900s)
        // Level 5: >= 20 min (1200s)
        let level = 0;
        if (duration > 0 && duration < 300) level = 1;
        else if (duration >= 300 && duration < 600) level = 2;
        else if (duration >= 600 && duration < 900) level = 3;
        else if (duration >= 900 && duration < 1200) level = 4;
        else if (duration >= 1200) level = 5;
        
        weekDays.push({ date: dateKey, level, duration });
      }
      weeksList.push(weekDays);
    }
    return { weeks: weeksList, monthLabels: months };
  }, [activityMap]);

  const { modelBreakdown } = useMemo(() => {
    const breakdown: Record<string, number> = {};
    sessions.forEach(s => {
      breakdown[s.exerciseId] = (breakdown[s.exerciseId] || 0) + s.duration;
    });
    return {
      modelBreakdown: Object.entries(breakdown)
        .map(([id, duration]) => ({
          exercise: exercises.find(e => e.id === id) || exercises[0],
          minutes: Math.floor(duration / 60),
          duration
        }))
        .sort((a, b) => b.duration - a.duration)
    };
  }, [sessions]);

  const recentSessions = [...sessions].reverse().slice(0, 5);

  const levelColors: Record<number, string> = {
    0: 'bg-white/[0.03] border-transparent',
    1: 'bg-indigo-900 border-indigo-500/10',
    2: 'bg-indigo-700 border-indigo-400/20',
    3: 'bg-indigo-500 border-indigo-300/30',
    4: 'bg-indigo-400 border-indigo-200/40',
    5: 'bg-indigo-300 border-indigo-100/50',
    '-1': 'bg-transparent border-white/[0.05] pointer-events-none'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="w-95 pb-10 space-y-6"
    >
      {/* Header */}
      <div className="w-full flex justify-between items-start mb-2 px-1">
        <div className="space-y-1">
          <h1 className="text-3xl font-light tracking-tight text-white/90">Journal</h1>
          <p className="text-gray-500 text-[10px] uppercase tracking-[0.4em] font-bold">Progress Analytics</p>
        </div>
        <div className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400">
          <Calendar size={20} />
        </div>
      </div>

      {/* Contribution Heatmap Card */}
      <div className="w-full bg-[#0D0D0D] border border-white/[0.06] rounded-[42px] p-5 shadow-2xl relative overflow-hidden group">
        <div className="flex justify-between items-center mb-8 px-1">
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-600">Yearly Activity</span>
          <div className="flex items-center gap-2">
            <span className="text-[8px] uppercase tracking-widest text-gray-700 font-bold">Less</span>
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4, 5].map(l => (
                <div key={l} className={`w-2.5 h-2.5 rounded-sm ${levelColors[l]}`} />
              ))}
            </div>
            <span className="text-[8px] uppercase tracking-widest text-gray-700 font-bold">More</span>
          </div>
        </div>

        <div className="relative">
          <div 
            ref={scrollContainerRef}
            className="overflow-x-auto pb-4 scrollbar-hide flex gap-4 mask-fade-edges"
          >
            <div className="grid grid-rows-7 gap-1.5 pt-6 pr-1 sticky left-0 bg-[#0D0D0D] z-20">
              {[0, 1, 2, 3, 4, 5, 6].map(d => (
                <div key={d} className="h-3.5 flex items-center justify-end">
                  {[1, 3, 5].includes(d) && (
                    <span className="text-[8px] font-black uppercase tracking-tighter text-gray-700 mr-1">
                      {['Mon', 'Wed', 'Fri'][Math.floor(d / 2)]}
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2">
              <div className="h-4 relative">
                {monthLabels.map((m, i) => (
                  <span 
                    key={i} 
                    className="absolute text-[8px] font-black uppercase tracking-widest text-gray-600 whitespace-nowrap"
                    style={{ left: `${m.index * 20}px` }}
                  >
                    {m.label}
                  </span>
                ))}
              </div>
              <div className="flex gap-1.5">
                {weeks.map((week, wi) => (
                  <div key={wi} className="grid grid-rows-7 gap-1.5">
                    {week.map((day, di) => (
                      <motion.div
                        key={di}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className={`w-3.5 h-3.5 rounded-[5px] border-[0.5px] transition-all hover:scale-150 hover:z-50 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] ${levelColors[day.level]} relative overflow-hidden`}
                        title={day.date ? `${day.date}: ${Math.floor(day.duration / 60)} min` : undefined}
                      >
                        {day.level > 0 && (
                          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50" />
                        )}
                      </motion.div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-between px-1 border-t border-white/5 pt-6">
          <div className="flex flex-col">
            <span className="text-xl font-light text-white">{stats.sessionCount}</span>
            <span className="text-[8px] uppercase tracking-widest text-gray-600 font-bold">Total Sessions</span>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-xl font-light text-white">{stats.streak} Days</span>
            <span className="text-[8px] uppercase tracking-widest text-gray-600 font-bold">Current Streak</span>
          </div>
        </div>
      </div>

      {/* Health Trend Graph */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
      >
        <HealthTrendGraph sessions={sessions} />
      </motion.div>

      {/* Model Breakdown Section */}
      <div className="w-full bg-[#0D0D0D] border border-white/[0.06] rounded-[42px] p-8 shadow-xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-white/[0.01] pointer-events-none" />
        <div className="flex justify-between items-center mb-8 px-1 relative z-10">
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-600">Technique Breakdown</span>
          <PieChart size={14} className="text-gray-700" />
        </div>
        <div className="space-y-8 relative z-10">
          {(() => {
            const totalDuration = sessions.reduce((acc, s) => acc + s.duration, 0) || 1;
            return modelBreakdown.map((item) => {
              const percentage = Math.round((item.duration / totalDuration) * 100);
              return (
                <div key={item.exercise.id} className="space-y-3">
                  <div className="flex justify-between items-center px-1">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.exercise.gradient.start }} />
                      <div className="flex items-baseline gap-2">
                        <span className="text-base font-light text-white/90 tracking-tight">{item.exercise.name}</span>
                        <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{percentage}%</span>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-gray-500 tracking-tighter">{item.minutes} min</span>
                  </div>
                  <div className="w-full h-2 bg-white/[0.04] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, ${item.exercise.gradient.start}, ${item.exercise.gradient.end})` }}
                    />
                  </div>
                </div>
              );
            });
          })()}
        </div>
      </div>

      {/* Session History */}
      <div className="space-y-6 pb-4 w-full">
        <div className="flex justify-between items-center px-2">
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-600">Recent Sessions</span>
          <Zap size={16} className="text-gray-800" />
        </div>
        <div className="flex flex-col gap-4">
          {recentSessions.map((session, i) => {
            const ex = exercises.find(e => e.id === session.exerciseId) || exercises[0];
            const date = new Date(session.date);
            return (
              <motion.div key={i} className="bg-[#0D0D0D] border border-white/[0.06] rounded-[42px] p-8 flex items-center justify-between group shadow-xl">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-[22px] flex items-center justify-center relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${ex.gradient.start}, ${ex.gradient.end})` }}>
                    <Zap size={24} className="text-white relative z-10" />
                    <div className="absolute inset-0 blur-xl opacity-30 bg-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-light text-white tracking-tight leading-none mb-1">{ex.name}</h4>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xl font-light text-white tracking-tighter">{Math.floor(session.duration / 60)}:{(session.duration % 60).toString().padStart(2, '0')}</span>
                  <p className="text-[9px] text-gray-700 uppercase tracking-[0.2em] font-black mt-1">Duration</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
