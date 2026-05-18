'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Sparkles, Zap, Sunrise, Moon, Brain, Wind, Search, X, UserRound, Volume2, VolumeX, Compass, ChevronDown } from 'lucide-react';
import { Exercise, exercises } from '../data';
import { ExerciseCard } from '../components/ExerciseCard';

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
  soundscape: any;
  isAmbientSoundOn: boolean;
  setIsAmbientSoundOn: (on: boolean) => void;
}

export function ExploreView({
  onStart,
  onDetails,
  customExercises,
  favorites,
  onToggleFavorite,
  stats,
  userAvatar,
  onProfileClick,
  soundscape,
  isAmbientSoundOn,
  setIsAmbientSoundOn
}: ExploreViewProps) {
  const [heroIndex, setHeroIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const [isAmbientSelectorOpen, setIsAmbientSelectorOpen] = useState(false);

  const ambientList = [
    { id: 'zen-river', name: 'Zen River', image: '/image/ambients/river.png' },
    { id: 'zen-fountain', name: 'Zen Fountain', image: '/image/ambients/whaterfalls.png' },
    { id: 'winter-rain', name: 'Winter Rain', image: '/image/ambients/rain.png' },
    { id: 'light-rain', name: 'Light Rain', image: '/image/ambients/rain2.png' },
    { id: 'nature-birds', name: 'Nature Birds', image: '/image/ambients/nature2.png' },
    { id: 'hz-transformation', name: '528Hz Transform', image: '/image/ambients/galaxy.png' },
    { id: 'white-noise', name: 'White Noise', image: '/image/ambients/galaxy2.png' },
    { id: 'pink-noise', name: 'Pink Noise', image: '/image/ambients/galaxy3.png' },
    { id: 'brown-noise', name: 'Deep Brownian', image: '/image/ambients/nature.png' },
    { id: 'beach', name: 'Sunset Beach', image: '/image/ambients/beach.png' },
    { id: 'lake', name: 'Calm Lake', image: '/image/ambients/lake4.png' },
    { id: 'marine', name: 'Marine Depths', image: '/image/ambients/marain.png' },
    { id: 'desert', name: 'Desert Breeze', image: '/image/ambients/desert3.png' },
    { id: 'ethereal', name: 'Ethereal Loop', image: '/image/ambients/loop.png' },
    { id: 'forest', name: 'Oak Forest', image: '/image/ambients/forest.png' },
    { id: 'leaf', name: 'Leaf', image: '/image/ambients/leaf.png' }
  ];

  const handleToggleSound = () => {
    if (isAmbientSoundOn) {
      setIsAmbientSoundOn(false);
    } else {
      if (soundscape.activeSoundscape === 'leaf') {
        soundscape.setActiveSoundscape('zen-river');
      }
      setIsAmbientSoundOn(true);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Good Morning';
    if (hour >= 12 && hour < 17) return 'Good Afternoon';
    if (hour >= 17 && hour < 21) return 'Good Evening';
    return 'Good Night';
  };

  const currentDayIndex = new Date().getDay();
  const weekDays = [
    { name: 'Monday', label: 'M', value: 1 },
    { name: 'Tuesday', label: 'T', value: 2 },
    { name: 'Wednesday', label: 'W', value: 3 },
    { name: 'Thursday', label: 'T', value: 4 },
    { name: 'Friday', label: 'F', value: 5 },
    { name: 'Saturday', label: 'S', value: 6 },
    { name: 'Sunday', label: 'S', value: 0 }
  ];

  const categories = [
    {
      id: 'stress-relief',
      title: 'Stress Relief & Reset',
      desc: 'Soothe the nervous system instantly',
      exerciseIds: ['calm', '478', 'bhramari', 'anulom']
    },
    {
      id: 'sleep-calm',
      title: 'Sleep & Calm',
      desc: 'Slow down and drift into deep peace',
      exerciseIds: ['478', 'calm', 'bhramari', 'sitali']
    },
    {
      id: 'focus-balance',
      title: 'Focus & Balance',
      desc: 'Align your mind and center your cognitive state',
      exerciseIds: ['box', 'nadi', 'anulom', 'buteyko']
    },
    {
      id: 'athletic-performance',
      title: 'Athletic Performance',
      desc: 'Expand lung capacity and boost oxygen efficiency',
      exerciseIds: ['box', 'deep-hold', 'wim-hof', 'buteyko']
    },
    {
      id: 'pranayama-mastery',
      title: 'Pranayama Mastery',
      desc: 'Traditional yogic breathing techniques',
      exerciseIds: ['nadi', 'kapalbhati', 'anulom', 'bhastrika', 'sitali', 'sudarshan']
    },
    {
      id: 'advanced-power',
      title: 'Advanced & Power',
      desc: 'Build endurance, heat, and internal force',
      exerciseIds: ['kapalbhati', 'ibuki', 'deep-hold', 'bhastrika', 'wim-hof']
    }
  ];

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
        color: "text-white",
        bg: "from-white/10 to-transparent"
      });
    } else if (hour >= 12 && hour < 18) {
      slides.push({
        id: 'time-afternoon',
        exercise: exercises.find(e => e.id === 'equal') || exercises[2],
        title: "Afternoon Balance",
        subtitle: "Maintain focus and reduce stress.",
        label: "Recommended for Afternoon",
        icon: Sparkles,
        color: "text-white",
        bg: "from-white/10 to-transparent"
      });
    } else {
      slides.push({
        id: 'time-evening',
        exercise: exercises.find(e => e.id === '478') || exercises[1],
        title: "Evening Calm",
        subtitle: "Prepare your mind for deep rest.",
        label: "Recommended for Evening",
        icon: Moon,
        color: "text-white",
        bg: "from-white/10 to-transparent"
      });
    }

    slides.push({
      id: 'feat-brain',
      exercise: exercises.find(e => e.id === 'box') || exercises[0],
      title: "Mental Edge",
      subtitle: "Optimize cognitive performance.",
      label: "Scientific Choice",
      icon: Brain,
      color: "text-white",
      bg: "from-white/10 to-transparent"
    });

    slides.push({
      id: 'feat-deep',
      exercise: exercises.find(e => e.id === '478') || exercises[1],
      title: "Deep Presence",
      subtitle: "Go beyond the surface level.",
      label: "Mastery Class",
      icon: Wind,
      color: "text-white",
      bg: "from-white/10 to-transparent"
    });

    return slides;
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) return;

    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [heroIndex, heroSlides.length, searchQuery]);

  const handleManualNav = (dir: number) => {
    if (dir > 0) {
      setHeroIndex((prev) => (prev + 1) % heroSlides.length);
    } else {
      setHeroIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    }
  };

  const activeSlide = heroSlides[heroIndex];

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
      className="w-full animate-fadeIn"
    >
      {/* Dynamic Greeting & Weekly Calendar Widget */}
      {!hasActiveSearch && (
        <div className="pt-6 pb-4 px-1 flex flex-col gap-3">
          <div className="flex justify-between items-center w-full">
            <h1 className="text-3xl font-light text-white tracking-tight drop-shadow-md">
              {getGreeting()}
            </h1>

            {/* Quick Ambient Sanctuary Icons in the same row */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleSound}
                className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all active:scale-90 shadow-md backdrop-blur-md ${isAmbientSoundOn
                  ? 'bg-white/10 border-white/20 text-white'
                  : 'bg-white/[0.03] border-white/5 text-white/40 hover:text-white hover:bg-white/[0.06]'
                  }`}
                title={`Ambient Sound: ${isAmbientSoundOn ? 'ON' : 'OFF'}`}
              >
                {isAmbientSoundOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>

              <button
                onClick={() => setIsAmbientSelectorOpen(true)}
                className="w-10 h-10 rounded-full bg-white/[0.03] border border-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.06] transition-all active:scale-90 shadow-md backdrop-blur-md"
                title="Change Ambient Sanctuary"
              >
                <Compass size={16} />
              </button>
            </div>
          </div>

          {/* Weekly Calendar Tracker */}
          <div className="flex gap-4 pt-1.5 px-0.5">
            {weekDays.map((day) => {
              const isToday = currentDayIndex === day.value;
              return (
                <div
                  key={day.name}
                  className={`text-xs transition-all relative ${isToday
                    ? 'text-white scale-110'
                    : 'text-white/20 font-medium'
                    }`}
                >
                  {day.label}
                </div>
              );
            })}
          </div>
        </div>
      )}
      {/* Sticky Top Bar containing Search & Rounded Profile Icon */}
      <div className="sticky top-0 z-50 pt-4 pb-2 flex items-center gap-3 w-full">
        {/* Search Bar */}
        <div className="relative flex-1 z-50">
          <div className="relative flex items-center group">
            <Search
              className="absolute left-4 text-white/50 transition-colors group-focus-within:text-white z-50"
              size={18}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search practices, benefits, or goals..."
              className="w-full h-12 pl-12 pr-10 rounded-full bg-white/5 border border-white/10 text-white placeholder-white/50 text-sm focus:outline-none focus:border-white/20 focus:bg-white/[0.02] transition-all duration-300 shadow-inner backdrop-blur-xs"
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
        </motion.button>
      </div>
      {!hasActiveSearch ? (
        <div className="w-full">
          {/* Explore Hero Section Fold */}
          <div className="flex flex-col pb-40 h-[calc(100vh-200px)] min-h-[400px] relative">

            {/* Hero Section */}
            <section className="relative w-full flex-1 rounded-[48px] overflow-hidden group touch-pan-y mt-4">
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
                  className="absolute inset-0 rounded-[48px] p-8 flex flex-col items-center justify-center text-center gap-6 shadow-2xl overflow-hidden z-10"
                >
                  <div
                    className={`absolute inset-0 opacity-30 blur-[120px] transition-all duration-1000 bg-gradient-to-br ${activeSlide.bg}`}
                  />

                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className={`w-20 h-20 rounded-[28px] flex items-center justify-center shadow-inner relative z-10 ${activeSlide.color}`}
                  >
                    <activeSlide.icon size={36} strokeWidth={1.5} />
                    <div className="absolute inset-0 blur-3xl opacity-10 bg-white rounded-full" />
                  </motion.div>

                  <div className="space-y-4 relative z-10 pointer-events-none mt-2">
                    <div className="overflow-hidden">
                      <motion.div
                        initial={{ y: "100%", opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
                        className="text-[11px] font-black uppercase tracking-[0.4em] text-white/70"
                      >
                        {activeSlide.label}
                      </motion.div>
                    </div>

                    <div className="overflow-hidden py-1">
                      <motion.h2
                        initial={{ y: "100%", opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="text-5xl font-light text-white tracking-tight leading-tight"
                      >
                        {activeSlide.title}
                      </motion.h2>
                    </div>

                    <div className="overflow-hidden">
                      <motion.p
                        initial={{ y: "100%", opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="text-white/80 text-sm font-light max-w-[320px] leading-relaxed mx-auto"
                      >
                        {activeSlide.subtitle}
                      </motion.p>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onStart(activeSlide.exercise);
                    }}
                    className="group relative h-10 px-8 rounded-full bg-white text-black font-bold text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-[0_20px_40px_rgba(255,255,255,0.12)] hover:scale-105 active:scale-95 transition-all mt-1 z-20"
                  >
                    <Play size={10} fill="currentColor" />
                    <span>Begin Session</span>
                  </button>
                </motion.div>
              </AnimatePresence>
            </section>

            {/* Bouncing Scroll Indicator */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="absolute bottom-30 left-1/2 -translate-x-1/2 z-50 text-white/50 pointer-events-none"
            >
              <ChevronDown size={32} />
            </motion.div>
          </div>

          {/* Scrollable category-based carousels below the 100vh fold */}
          <div className="space-y-8 mt-8 w-full pb-8">
            {/* Personal Journeys Carousel */}
            {customExercises.length > 0 && (
              <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] uppercase tracking-[0.3em] font-black text-white/80">Personal Journeys</span>
                    <span className="text-[8px] uppercase tracking-widest text-white/30 font-bold">Your custom practices</span>
                  </div>
                  <span className="text-[9px] text-white/40 font-bold uppercase tracking-widest">{customExercises.length} sessions</span>
                </div>

                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory mask-fade-edges -mx-1 px-1">
                  {customExercises.map((ex) => (
                    <div key={ex.id} className="snap-center shrink-0 w-[95vw] sm:w-[420px]">
                      <ExerciseCard
                        exercise={ex}
                        onStart={() => onStart(ex)}
                        onDetails={() => onDetails(ex)}
                        isFavorite={favorites.includes(ex.id)}
                        onToggleFavorite={() => onToggleFavorite(ex.id)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Category Carousels */}
            {categories.map((cat) => {
              const catExercises = exercises.filter(ex => cat.exerciseIds.includes(ex.id));
              if (catExercises.length === 0) return null;

              return (
                <div key={cat.id} className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] uppercase tracking-[0.3em] font-black text-white">{cat.title}</span>
                      <span className="text-[8px] uppercase tracking-widest text-white/40 font-bold">{cat.desc}</span>
                    </div>
                    <span className="text-[9px] text-white/40 font-bold uppercase tracking-widest">{catExercises.length} practices</span>
                  </div>

                  <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory mask-fade-edges -mx-1 px-1">
                    {catExercises.map((ex) => (
                      <div key={ex.id} className="snap-center shrink-0 w-[95vw] sm:w-[420px]">
                        <ExerciseCard
                          exercise={ex}
                          onStart={() => onStart(ex)}
                          onDetails={() => onDetails(ex)}
                          isFavorite={favorites.includes(ex.id)}
                          onToggleFavorite={() => onToggleFavorite(ex.id)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Search Results View */
        <div className="space-y-10 mt-4 w-full">
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
                    <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/50">Personal Journeys</span>
                    <span className="text-[10px] text-white/40 font-medium">{filteredCustomExercises.length} found</span>
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
                    <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/50">Global Collection</span>
                    <span className="text-[10px] text-white/40 font-medium">{filteredGlobalExercises.length} found</span>
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

      {/* Fullscreen Ambient Selection Modal */}
      <AnimatePresence>
        {isAmbientSelectorOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[600] bg-black/85 backdrop-blur-3xl flex flex-col p-6 overflow-y-auto"
          >
            <div className="max-w-[480px] mx-auto w-full flex-1 flex flex-col pt-8">
              <div className="flex justify-between items-center mb-8">
                <div className="space-y-1">
                  <h2 className="text-2xl font-light text-white tracking-tight">Ambient Sanctuary</h2>
                  <p className="text-xs text-white/40 font-light">Set your visual & auditory environment</p>
                </div>
                <button
                  onClick={() => setIsAmbientSelectorOpen(false)}
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all active:scale-90"
                >
                  <X size={18} className="text-white" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 pb-12">
                {ambientList.map((item) => {
                  const isActive = soundscape.activeSoundscape === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        soundscape.setActiveSoundscape(item.id);
                        if (item.id !== 'none') {
                          setIsAmbientSoundOn(true);
                        } else {
                          setIsAmbientSoundOn(false);
                        }
                      }}
                      className={`group relative rounded-2xl overflow-hidden border aspect-[3/4] flex flex-col text-left transition-all duration-300 active:scale-95 shadow-md ${isActive
                        ? 'border-white ring-1 ring-white/30 shadow-[0_0_15px_rgba(255,255,255,0.15)]'
                        : 'border-white/10 hover:border-white/20'
                        }`}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-60 group-hover:opacity-80"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                      <div className="mt-auto p-3.5 relative z-10 space-y-0.5">
                        <span className="text-[10px] font-bold text-white tracking-wide block truncate">
                          {item.name}
                        </span>
                        <span className="text-[8px] text-white/40 font-medium uppercase tracking-widest block">
                          {item.id === 'none' ? 'Silent' : 'Audio + Visual'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
