'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Sparkles, Zap, Sunrise, Moon, Brain, Wind, Search, X, UserRound, Volume2, VolumeX, Compass } from 'lucide-react';
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
  const [progress, setProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const cycleTime = 5000;

  const [isAmbientSelectorOpen, setIsAmbientSelectorOpen] = useState(false);

  const ambientList = [
    { id: 'zen-river', name: 'Zen River', image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=300&auto=format&fit=crop' },
    { id: 'zen-fountain', name: 'Zen Fountain', image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=300&auto=format&fit=crop' },
    { id: 'winter-rain', name: 'Winter Rain', image: 'https://images.unsplash.com/photo-1485594050903-8e8ee7b071a8?q=80&w=300&auto=format&fit=crop' },
    { id: 'light-rain', name: 'Light Rain', image: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?q=80&w=300&auto=format&fit=crop' },
    { id: 'nature-birds', name: 'Nature Birds', image: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=300&auto=format&fit=crop' },
    { id: 'hz-transformation', name: '528Hz Transform', image: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=300&auto=format&fit=crop' },
    { id: 'white-noise', name: 'White Noise', image: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?q=80&w=300&auto=format&fit=crop' },
    { id: 'pink-noise', name: 'Pink Noise', image: 'https://images.unsplash.com/photo-1532767154073-93e5065788f4?q=80&w=300&auto=format&fit=crop' },
    { id: 'brown-noise', name: 'Deep Brownian', image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=300&auto=format&fit=crop' },
    { id: 'none', name: 'None (Silent Space)', image: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=300&auto=format&fit=crop' }
  ];

  const handleToggleSound = () => {
    if (isAmbientSoundOn) {
      setIsAmbientSoundOn(false);
    } else {
      if (soundscape.activeSoundscape === 'none') {
        soundscape.setActiveSoundscape('zen-river');
      }
      setIsAmbientSoundOn(true);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Good Morning';
    if (hour >= 12 && hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const currentDayIndex = new Date().getDay(); // 0 is Sunday, 1 is Monday, etc.
  const weekDays = [
    { name: 'Monday', label: 'M', value: 1 },
    { name: 'Tuesday', label: 'T', value: 2 },
    { name: 'Wednesday', label: 'W', value: 3 },
    { name: 'Thursday', label: 'T', value: 4 },
    { name: 'Friday', label: 'F', value: 5 },
    { name: 'Saturday', label: 'S', value: 6 },
    { name: 'Sunday', label: 'S', value: 0 }
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
      className="w-full"
    >
      {/* Dynamic Greeting & Weekly Calendar Widget */}
      <div className="pt-6 pb-4 px-1 flex flex-col gap-3">
        <div className="flex justify-between items-center w-full">
          <h1 className="text-3xl font-light text-white tracking-tight drop-shadow-md">
            {getGreeting()}
          </h1>

          {/* Quick Ambient Sanctuary Icons in the same row */}
          <div className="flex items-center gap-2">
            {/* Sound Toggle Button (Icon only) */}
            <button 
              onClick={handleToggleSound}
              className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all active:scale-90 shadow-md backdrop-blur-md ${
                isAmbientSoundOn 
                  ? 'bg-white/10 border-white/20 text-white' 
                  : 'bg-white/[0.03] border-white/5 text-white/40 hover:text-white hover:bg-white/[0.06]'
              }`}
              title={`Ambient Sound: ${isAmbientSoundOn ? 'ON' : 'OFF'}`}
            >
              {isAmbientSoundOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>

            {/* Selector Button (Icon only) */}
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
        <div className="flex gap-2">
          {weekDays.map((day) => {
            const isToday = currentDayIndex === day.value;
            return (
              <div 
                key={day.name} 
                className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                  isToday 
                    ? 'bg-gradient-to-br from-emerald-400 to-teal-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)] scale-110 font-black' 
                    : 'bg-white/[0.03] border border-white/5 text-gray-400 hover:text-white hover:bg-white/[0.08]'
                }`}
              >
                {day.label}
              </div>
            );
          })}
        </div>
      </div>
      {/* Sticky Top Bar containing Search & Rounded Profile Icon with Streak Badge */}
      <div className="sticky top-0 z-50 pt-4 pb-2 bg-black/20 backdrop-blur-md flex items-center gap-3 w-full border-b border-white/[0.04]">
        {/* Search Bar */}
        <div className="relative flex-1">
          <div className="relative flex items-center group">
            <Search
              className="absolute left-4 text-white/40 transition-colors group-focus-within:text-white"
              size={18}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search practices, benefits, or goals..."
              className="w-full h-12 pl-12 pr-10 rounded-full bg-white/[0.02] backdrop-blur-md border border-white/[0.06] text-white placeholder-white/30 text-sm focus:outline-none focus:border-white/20 focus:bg-white/[0.05] transition-all duration-300 shadow-inner"
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

      {/* Normal View: Hero & Standard Collections */}
      {!hasActiveSearch && (
        <div className="space-y-10 mt-4 w-full">
          {/* Hero Section - Static Positioned Gestures (Pan-based navigation) */}
          <section className="relative w-full h-[480px] rounded-[48px] overflow-hidden group bg-white/[0.01] backdrop-blur-md touch-pan-y">
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
                className="absolute inset-0 bg-white/[0.02] backdrop-blur-md border border-white/[0.08] rounded-[48px] p-12 flex flex-col items-center justify-center text-center gap-8 shadow-2xl overflow-hidden z-10"
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
                  <div className="absolute inset-0 blur-3xl opacity-10 bg-white rounded-full" />
                </motion.div>

                <div className="space-y-4 relative z-10 pointer-events-none">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/50">
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
                  className="group relative h-14 px-12 rounded-full bg-white text-black font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-[0_25px_50px_rgba(255,255,255,0.15)] hover:scale-105 active:scale-95 transition-all mt-2 z-20"
                >
                  <Play size={16} fill="currentColor" />
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
        </div>
      )}

      {/* Search Results View */}
      {hasActiveSearch && (
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
              {/* Header */}
              <div className="flex justify-between items-center mb-8">
                <div className="space-y-1">
                  <h2 className="text-2xl font-light text-white tracking-tight">Ambient Sanctuary</h2>
                  <p className="text-xs text-gray-500 font-light">Set your visual & auditory environment</p>
                </div>
                <button
                  onClick={() => setIsAmbientSelectorOpen(false)}
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all active:scale-90"
                >
                  <X size={18} className="text-white" />
                </button>
              </div>

              {/* Grid of Ambients */}
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
                      className={`group relative rounded-[28px] overflow-hidden border aspect-[4/3] flex flex-col text-left transition-all duration-300 active:scale-95 shadow-md ${
                        isActive 
                          ? 'border-emerald-400 ring-1 ring-emerald-400/30 shadow-[0_0_15px_rgba(52,211,153,0.2)]' 
                          : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      {/* Wallpaper image background */}
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-60 group-hover:opacity-80" 
                      />
                      {/* Subtle dark gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                      
                      {/* Selection dot */}
                      {isActive && (
                        <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-emerald-400 flex items-center justify-center shadow-lg">
                          <Sparkles size={10} className="text-black font-black" />
                        </div>
                      )}

                      {/* Name */}
                      <div className="mt-auto p-3.5 relative z-10 space-y-0.5">
                        <span className="text-[10px] font-bold text-white tracking-wide block truncate">
                          {item.name}
                        </span>
                        <span className="text-[8px] text-gray-400 font-medium uppercase tracking-widest block">
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
