'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Sparkles, Zap, Sunrise, Moon, Brain, Wind, Search, X, UserRound } from 'lucide-react';
import { Exercise, exercises } from '../data';
import { ExerciseCard } from './ExerciseCard';

interface ExploreViewProps {
  onStart: (ex: Exercise) => void;
  onDetails: (ex: Exercise) => void;
  customExercises: Exercise[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  stats: {
    totalMinutes: number;
    sessionCount: number;
    streak: number;
  };
  userAvatar: string | null;
  onProfileClick: () => void;
}

export function ExploreView({ 
  onStart, 
  onDetails, 
  customExercises, 
  favorites, 
  onToggleFavorite,
  stats,
  userAvatar,
  onProfileClick
}: ExploreViewProps) {
  const [heroIndex, setHeroIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const cycleTime = 5000;

  const heroSlides = useMemo(() => {
    const hour = new Date().getHours();
    const slides = [];

    if (hour >= 5 && hour < 12) {
      slides.push({
        id: 'time-morning',
        exercise: exercises.find(e => e.id === 'box') || exercises[0],
        title: "Morning Focus",
        subtitle: "Kickstart your day with clarity.",
        label: "Recommended for Morning",
        icon: Sunrise,
        color: "text-orange-400",
        bg: "from-orange-500/20 to-transparent"
      });
    } else if (hour >= 12 && hour < 18) {
      slides.push({
        id: 'time-afternoon',
        exercise: exercises.find(e => e.id === 'equal') || exercises[2],
        title: "Afternoon Balance",
        subtitle: "Maintain focus and reduce stress.",
        label: "Recommended for Afternoon",
        icon: Sparkles,
        color: "text-emerald-400",
        bg: "from-emerald-500/20 to-transparent"
      });
    } else {
      slides.push({
        id: 'time-evening',
        exercise: exercises.find(e => e.id === '478') || exercises[1],
        title: "Evening Calm",
        subtitle: "Prepare your mind for deep rest.",
        label: "Recommended for Evening",
        icon: Moon,
        color: "text-indigo-400",
        bg: "from-indigo-500/20 to-transparent"
      });
    }

    slides.push({
      id: 'feat-brain',
      exercise: exercises.find(e => e.id === 'box') || exercises[0],
      title: "Mental Edge",
      subtitle: "Optimize cognitive performance.",
      label: "Scientific Choice",
      icon: Brain,
      color: "text-purple-400",
      bg: "from-purple-500/20 to-transparent"
    });

    slides.push({
      id: 'feat-deep',
      exercise: exercises.find(e => e.id === '478') || exercises[1],
      title: "Deep Presence",
      subtitle: "Go beyond the surface level.",
      label: "Mastery Class",
      icon: Wind,
      color: "text-blue-400",
      bg: "from-blue-500/20 to-transparent"
    });

    return slides;
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) return; // Don't run the hero slider if searching

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = (elapsed / cycleTime) * 100;
      
      if (newProgress >= 100) {
        setProgress(0);
        setHeroIndex((prev) => (prev + 1) % heroSlides.length);
        clearInterval(interval);
      } else {
        setProgress(newProgress);
      }
    }, 16);

    return () => clearInterval(interval);
  }, [heroIndex, heroSlides.length, searchQuery]);

  const handleManualNav = (dir: number) => {
    setProgress(0);
    if (dir > 0) {
      setHeroIndex((prev) => (prev + 1) % heroSlides.length);
    } else {
      setHeroIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    }
  };

  const activeSlide = heroSlides[heroIndex];

  // Filtering logic
  const filteredCustomExercises = useMemo(() => {
    if (!searchQuery.trim()) return customExercises;
    const query = searchQuery.toLowerCase().trim();
    return customExercises.filter(ex => 
      ex.name.toLowerCase().includes(query) ||
      ex.subtitle.toLowerCase().includes(query) ||
      ex.description.toLowerCase().includes(query) ||
      ex.benefits.some(b => b.toLowerCase().includes(query))
    );
  }, [customExercises, searchQuery]);

  const filteredGlobalExercises = useMemo(() => {
    if (!searchQuery.trim()) return exercises;
    const query = searchQuery.toLowerCase().trim();
    return exercises.filter(ex => 
      ex.name.toLowerCase().includes(query) ||
      ex.subtitle.toLowerCase().includes(query) ||
      ex.description.toLowerCase().includes(query) ||
      ex.benefits.some(b => b.toLowerCase().includes(query))
    );
  }, [searchQuery]);

  const hasActiveSearch = searchQuery.trim().length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="w-full space-y-10"
    >
      {/* Sticky Top Bar containing Search & Rounded Profile Icon with Streak Badge */}
      <div className="sticky top-0 z-50 bg-black/90 backdrop-blur-md py-4 flex items-center gap-3 w-full border-b border-white/[0.04]">
        {/* Search Bar */}
        <div className="relative flex-1">
          <div className="relative flex items-center group">
            <Search 
              className="absolute left-4 text-gray-500 transition-colors group-focus-within:text-white" 
              size={18} 
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search practices, benefits, or goals..."
              className="w-full h-12 pl-12 pr-10 rounded-full bg-white/[0.04] border border-white/[0.08] text-white placeholder-gray-500 text-sm focus:outline-none focus:border-white/20 focus:bg-white/[0.07] transition-all duration-300 shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 p-1 rounded-full hover:bg-white/10 text-gray-500 hover:text-white transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Profile Avatar Trigger Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onProfileClick}
          className="relative w-12 h-12 rounded-full border border-white/10 bg-white/[0.03] flex items-center justify-center flex-shrink-0 cursor-pointer overflow-visible shadow-lg hover:border-white/20 transition-all"
        >
          <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center">
            {userAvatar ? (
              <img src={userAvatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <UserRound size={22} className="text-white/40" />
            )}
          </div>

          {/* Streak Overlaid Badge */}
          {stats.streak > 0 && (
            <div className="absolute -top-1 -right-1 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-orange-500 border border-black shadow-[0_0_10px_rgba(249,115,22,0.45)]">
              <Zap className="text-white fill-white animate-pulse" size={8} />
              <span className="text-[8px] font-black text-white leading-none">{stats.streak}</span>
            </div>
          )}
        </motion.button>
      </div>

      {/* Normal View: Hero & Standard Collections */}
      {!hasActiveSearch && (
        <>
          {/* Hero Section - Static Positioned Gestures (Pan-based navigation) */}
          <section className="relative w-full h-[480px] rounded-[48px] overflow-hidden group bg-[#0D0D0D] touch-pan-y">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                onPanEnd={(_, info) => {
                  if (info.offset.x > 50) handleManualNav(-1);
                  else if (info.offset.x < -50) handleManualNav(1);
                }}
                className="absolute inset-0 bg-[#0D0D0D] border border-white/[0.08] rounded-[48px] p-12 flex flex-col items-center justify-center text-center gap-8 shadow-2xl overflow-hidden z-10"
              >
                {/* Background Glow */}
                <div 
                  className={`absolute inset-0 opacity-30 blur-[120px] transition-all duration-1000 bg-gradient-to-br ${activeSlide.bg}`}
                />

                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className={`w-28 h-28 rounded-[36px] bg-white/[0.03] border border-white/10 flex items-center justify-center shadow-inner relative z-10 ${activeSlide.color}`}
                >
                  <activeSlide.icon size={48} strokeWidth={1.5} />
                  <div className="absolute inset-0 blur-3xl opacity-30 bg-current rounded-full" />
                </motion.div>

                <div className="space-y-4 relative z-10 pointer-events-none">
                  <span className={`text-[10px] font-black uppercase tracking-[0.4em] ${activeSlide.color}`}>
                    {activeSlide.label}
                  </span>
                  <h2 className="text-4xl font-light text-white tracking-tight leading-tight">
                    {activeSlide.title}
                  </h2>
                  <p className="text-gray-400 text-sm font-light max-w-[300px] leading-relaxed mx-auto">
                    {activeSlide.subtitle}
                  </p>
                </div>

                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onStart(activeSlide.exercise);
                  }}
                  className="group relative h-16 px-12 rounded-full bg-white text-black font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-[0_25px_50px_rgba(255,255,255,0.15)] hover:scale-105 active:scale-95 transition-all mt-4 z-20"
                >
                  <Play size={18} fill="currentColor" />
                  <span>Begin Session</span>
                </button>
              </motion.div>
            </AnimatePresence>

            {/* Persistent Activation Signal Container */}
            <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3 z-40 pointer-events-none">
              {heroSlides.map((_, i) => (
                <div 
                  key={i} 
                  className={`relative h-1.5 rounded-full bg-white/10 overflow-hidden transition-all duration-500 ${heroIndex === i ? 'w-20' : 'w-5'}`}
                >
                  {heroIndex === i && (
                    <motion.div 
                      className="absolute inset-y-0 left-0 bg-white"
                      initial={false}
                      animate={{ width: `${progress}%` }}
                      transition={{ ease: "linear", duration: 0.016 }}
                    />
                  )}
                </div>
              ))}
            </div>
          </section>
          
          {/* Custom Section */}
          {customExercises.length > 0 && (
            <div className="space-y-6">
              <div className="flex justify-between items-center px-1">
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-600">Personal Journeys</span>
                <span className="text-[10px] text-gray-500 font-medium">{customExercises.length} sessions</span>
              </div>

              <div className="flex flex-col gap-5">
                {customExercises.map((ex) => (
                  <ExerciseCard 
                    key={ex.id} 
                    exercise={ex} 
                    onStart={() => onStart(ex)} 
                    onDetails={() => onDetails(ex)}
                    isFavorite={favorites.includes(ex.id)}
                    onToggleFavorite={() => onToggleFavorite(ex.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Global Collection */}
          <div className="space-y-6">
            <div className="flex justify-between items-center px-1">
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-600">Global Collection</span>
              <span className="text-[10px] text-gray-500 font-medium">{exercises.length} practices</span>
            </div>
            
            <div className="flex flex-col gap-5">
              {exercises.map((ex: Exercise) => (
                <ExerciseCard 
                  key={ex.id} 
                  exercise={ex} 
                  onStart={() => onStart(ex)} 
                  onDetails={() => onDetails(ex)}
                  isFavorite={favorites.includes(ex.id)}
                  onToggleFavorite={() => onToggleFavorite(ex.id)}
                />
              ))}
            </div>
          </div>
        </>
      )}

      {/* Search Results View */}
      {hasActiveSearch && (
        <div className="space-y-8">
          {filteredCustomExercises.length === 0 && filteredGlobalExercises.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <Search size={48} strokeWidth={1} className="mb-4 text-gray-500" />
              <p className="text-sm font-light text-gray-400">No practices found matching "{searchQuery}"</p>
            </motion.div>
          ) : (
            <>
              {filteredCustomExercises.length > 0 && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-600">Personal Journeys</span>
                    <span className="text-[10px] text-gray-500 font-medium">{filteredCustomExercises.length} found</span>
                  </div>
                  <div className="flex flex-col gap-5">
                    {filteredCustomExercises.map((ex) => (
                      <ExerciseCard 
                        key={ex.id} 
                        exercise={ex} 
                        onStart={() => onStart(ex)} 
                        onDetails={() => onDetails(ex)}
                        isFavorite={favorites.includes(ex.id)}
                        onToggleFavorite={() => onToggleFavorite(ex.id)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {filteredGlobalExercises.length > 0 && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-600">Global Collection</span>
                    <span className="text-[10px] text-gray-500 font-medium">{filteredGlobalExercises.length} found</span>
                  </div>
                  <div className="flex flex-col gap-5">
                    {filteredGlobalExercises.map((ex) => (
                      <ExerciseCard 
                        key={ex.id} 
                        exercise={ex} 
                        onStart={() => onStart(ex)} 
                        onDetails={() => onDetails(ex)}
                        isFavorite={favorites.includes(ex.id)}
                        onToggleFavorite={() => onToggleFavorite(ex.id)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </motion.div>
  );
}
