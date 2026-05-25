"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Brain,
  ChevronDown,
  Compass,
  Moon,
  Play,
  Search,
  Sparkles,
  Sunrise,
  UserRound,
  Volume2,
  VolumeX,
  Wind,
  X,
  Zap,
} from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";

import { ExerciseCard } from "../components/ExerciseCard";
import { Exercise, exercises, ambientList } from "../data";

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
  setIsAmbientSoundOn,
}: ExploreViewProps) {
  const [heroIndex, setHeroIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const [isAmbientSelectorOpen, setIsAmbientSelectorOpen] = useState(false);
  const handleToggleSound = () => {
    if (isAmbientSoundOn) {
      setIsAmbientSoundOn(false);
    } else {
      if (soundscape.activeSoundscape === "silent-focus") {
        soundscape.setActiveSoundscape("zen-river");
      }
      setIsAmbientSoundOn(true);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 17) return "Good Afternoon";
    if (hour >= 17 && hour < 21) return "Good Evening";
    return "Good Night";
  };

  const currentDayIndex = new Date().getDay();
  const weekDays = [
    { name: "Monday", label: "M", value: 1 },
    { name: "Tuesday", label: "T", value: 2 },
    { name: "Wednesday", label: "W", value: 3 },
    { name: "Thursday", label: "T", value: 4 },
    { name: "Friday", label: "F", value: 5 },
    { name: "Saturday", label: "S", value: 6 },
    { name: "Sunday", label: "S", value: 0 },
  ];

  const categories = [
    {
      id: "stress-relief",
      title: "Stress Relief & Reset",
      desc: "Soothe the nervous system instantly",
      exerciseIds: ["calm", "478", "bhramari", "anulom"],
    },
    {
      id: "sleep-calm",
      title: "Sleep & Calm",
      desc: "Slow down and drift into deep peace",
      exerciseIds: ["478", "calm", "bhramari", "sitali"],
    },
    {
      id: "focus-balance",
      title: "Focus & Balance",
      desc: "Align your mind and center your cognitive state",
      exerciseIds: ["box", "nadi", "anulom", "buteyko"],
    },
    {
      id: "athletic-performance",
      title: "Athletic Performance",
      desc: "Expand lung capacity and boost oxygen efficiency",
      exerciseIds: ["box", "deep-hold", "wim-hof", "buteyko"],
    },
    {
      id: "pranayama-mastery",
      title: "Pranayama Mastery",
      desc: "Traditional yogic breathing techniques",
      exerciseIds: [
        "nadi",
        "kapalbhati",
        "anulom",
        "bhastrika",
        "sitali",
        "sudarshan",
      ],
    },
    {
      id: "advanced-power",
      title: "Advanced & Power",
      desc: "Build endurance, heat, and internal force",
      exerciseIds: ["kapalbhati", "ibuki", "deep-hold", "bhastrika", "wim-hof"],
    },
  ];

  const heroSlides = useMemo(() => {
    const hour = new Date().getHours();
    const slides = [];

    if (hour >= 5 && hour < 12) {
      slides.push({
        id: "time-morning",
        exercise: exercises.find((e) => e.id === "box") || exercises[0],
        title: "Morning Focus",
        subtitle: "Kickstart your day with clarity.",
        label: "Recommended for Morning",
        icon: Sunrise,
        color: "text-white",
        bg: "from-white/10 to-transparent",
      });
    } else if (hour >= 12 && hour < 18) {
      slides.push({
        id: "time-afternoon",
        exercise: exercises.find((e) => e.id === "equal") || exercises[2],
        title: "Afternoon Balance",
        subtitle: "Maintain focus and reduce stress.",
        label: "Recommended for Afternoon",
        icon: Sparkles,
        color: "text-white",
        bg: "from-white/10 to-transparent",
      });
    } else {
      slides.push({
        id: "time-evening",
        exercise: exercises.find((e) => e.id === "478") || exercises[1],
        title: "Evening Calm",
        subtitle: "Prepare your mind for deep rest.",
        label: "Recommended for Evening",
        icon: Moon,
        color: "text-white",
        bg: "from-white/10 to-transparent",
      });
    }

    slides.push({
      id: "feat-brain",
      exercise: exercises.find((e) => e.id === "box") || exercises[0],
      title: "Mental Edge",
      subtitle: "Optimize cognitive performance.",
      label: "Scientific Choice",
      icon: Brain,
      color: "text-white",
      bg: "from-white/10 to-transparent",
    });

    slides.push({
      id: "feat-deep",
      exercise: exercises.find((e) => e.id === "478") || exercises[1],
      title: "Deep Presence",
      subtitle: "Go beyond the surface level.",
      label: "Mastery Class",
      icon: Wind,
      color: "text-white",
      bg: "from-white/10 to-transparent",
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
      setHeroIndex(
        (prev) => (prev - 1 + heroSlides.length) % heroSlides.length,
      );
    }
  };

  const activeSlide = heroSlides[heroIndex];

  const filteredCustomExercises = useMemo(() => {
    if (!searchQuery.trim()) return customExercises;
    const query = searchQuery.toLowerCase().trim();
    return customExercises.filter(
      (ex) =>
        ex.name.toLowerCase().includes(query) ||
        ex.subtitle.toLowerCase().includes(query) ||
        ex.description.toLowerCase().includes(query) ||
        ex.benefits.some((b) => b.toLowerCase().includes(query)),
    );
  }, [customExercises, searchQuery]);

  const filteredGlobalExercises = useMemo(() => {
    if (!searchQuery.trim()) return exercises;
    const query = searchQuery.toLowerCase().trim();
    return exercises.filter(
      (ex) =>
        ex.name.toLowerCase().includes(query) ||
        ex.subtitle.toLowerCase().includes(query) ||
        ex.description.toLowerCase().includes(query) ||
        ex.benefits.some((b) => b.toLowerCase().includes(query)),
    );
  }, [searchQuery]);

  const hasActiveSearch = searchQuery.trim().length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="animate-fadeIn w-full"
    >
      {/* Dynamic Greeting & Weekly Calendar Widget + Unified Desktop Search */}
      <div className="top-0 right-0 left-0 z-50 flex flex-col gap-6 bg-transparent px-4 pt-6 pb-4 sm:fixed sm:px-8 md:left-28 md:flex-row md:items-center md:justify-between md:px-12">
        {/* Greeting & Weekly Calendar Widget */}
        <div className="flex flex-col gap-2 md:max-w-[45%]">
          <div className="flex items-center justify-between gap-4 md:justify-start">
            <h1 className="text-3xl font-light tracking-tight text-white drop-shadow-md">
              {getGreeting()}
            </h1>

            {/* Quick Ambient Sanctuary Icons - Mobile Only */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={handleToggleSound}
                className={`flex h-10 w-10 items-center justify-center rounded-full border shadow-md backdrop-blur-md transition-all active:scale-90 ${
                  soundscape.isActuallyPlaying
                    ? "border-white/20 bg-white/10 text-white"
                    : "border-white/5 bg-white/[0.03] text-white/40 hover:bg-white/[0.06] hover:text-white"
                }`}
                title={`Ambient Sound: ${soundscape.isActuallyPlaying ? "ON" : "OFF"}`}
              >
                {soundscape.isActuallyPlaying ? (
                  <Volume2 size={16} />
                ) : (
                  <VolumeX size={16} />
                )}
              </button>

              <button
                onClick={() => setIsAmbientSelectorOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/5 bg-white/[0.03] text-white/40 shadow-md backdrop-blur-md transition-all hover:bg-white/[0.06] hover:text-white active:scale-90"
                title="Change Ambient Sanctuary"
              >
                <Compass size={16} />
              </button>
            </div>
          </div>

          {/* Weekly Calendar Tracker */}
          <div className="flex gap-4 px-0.5 pt-1.5">
            {weekDays.map((day) => {
              const isToday = currentDayIndex === day.value;
              return (
                <div
                  key={day.name}
                  className={`relative text-xs transition-all ${
                    isToday
                      ? "scale-110 font-semibold text-white"
                      : "font-medium text-white/20"
                  }`}
                >
                  {day.label}
                </div>
              );
            })}
          </div>
        </div>

        {/* Unified Desktop Controls (Sanctuary controls, Search, Profile Avatar) */}
        <div className="flex w-full flex-1 items-center gap-3 md:max-w-[50%]">
          {/* Quick Ambient Sanctuary Icons - Desktop Only */}
          <div className="hidden items-center gap-2 md:flex">
            <button
              onClick={handleToggleSound}
              className={`flex h-12 w-12 items-center justify-center rounded-full border shadow-md backdrop-blur-md transition-all active:scale-90 ${
                soundscape.isActuallyPlaying
                  ? "border-white/20 bg-white/10 text-white"
                  : "border-white/5 bg-white/[0.03] text-white/40 hover:bg-white/[0.06] hover:text-white"
              }`}
              title={`Ambient Sound: ${soundscape.isActuallyPlaying ? "ON" : "OFF"}`}
            >
              {soundscape.isActuallyPlaying ? (
                <Volume2 size={18} />
              ) : (
                <VolumeX size={18} />
              )}
            </button>

            <button
              onClick={() => setIsAmbientSelectorOpen(true)}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white/5 bg-white/[0.03] text-white/40 shadow-md backdrop-blur-md transition-all hover:bg-white/[0.06] hover:text-white active:scale-90"
              title="Change Ambient Sanctuary"
            >
              <Compass size={18} />
            </button>
          </div>

          <div className="top-0 right-0 left-0 flex w-full justify-between gap-2 max-sm:sticky">
            {/* Search Bar */}
            <div className="relative flex-1">
              <div className="group relative flex items-center">
                <Search
                  className="absolute left-4 z-50 text-white/50 transition-colors group-focus-within:text-white"
                  size={18}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search practices, benefits, or goals..."
                  className="h-12 w-full rounded-full border border-white/10 bg-white/5 pr-10 pl-12 text-sm text-white placeholder-white/50 shadow-inner backdrop-blur-xs transition-all duration-300 focus:border-white/20 focus:bg-white/[0.02] focus:outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 rounded-full p-1 text-gray-500 transition-colors hover:bg-white/10 hover:text-white"
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
              className="relative flex h-12 w-12 flex-shrink-0 cursor-pointer items-center justify-center overflow-visible rounded-full border border-white/10 bg-white/[0.03] shadow-lg transition-all hover:border-white/20"
            >
              <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full">
                {userAvatar ? (
                  <img
                    src={userAvatar}
                    alt="Avatar"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UserRound size={22} className="text-white/40" />
                )}
              </div>
            </motion.button>
          </div>
        </div>
      </div>
      {!hasActiveSearch ? (
        <div className="w-full">
          {/* Explore Hero Section Fold */}
          <div className="relative flex h-[calc(100vh-200px)] min-h-[540px] flex-col items-center justify-center max-sm:pb-[200px] md:h-[calc(100vh-60px)] md:min-h-[580px]">
            {/* Hero Section */}
            <section className="group relative w-full flex-1 touch-pan-y overflow-hidden">
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
                  className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 overflow-hidden text-center sm:gap-6 sm:p-8"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br opacity-30 blur-[120px] transition-all duration-1000 ${activeSlide.bg}`}
                  />

                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className={`relative z-10 flex h-14 w-14 items-center justify-center rounded-[20px] shadow-inner sm:h-20 sm:w-20 sm:rounded-[28px] ${activeSlide.color}`}
                  >
                    <activeSlide.icon
                      className="relative z-10 h-7 w-7 text-white sm:h-9 sm:w-9"
                      strokeWidth={1.5}
                    />
                    <div className="absolute inset-0 rounded-full bg-white opacity-10 blur-3xl" />
                  </motion.div>

                  <div className="pointer-events-none relative z-10 mt-1 space-y-2 sm:mt-2 sm:space-y-4">
                    <div className="overflow-hidden">
                      <motion.div
                        initial={{ y: "100%", opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{
                          delay: 0.3,
                          duration: 0.5,
                          ease: "easeOut",
                        }}
                        className="text-[10px] font-black tracking-[0.4em] text-white/70 uppercase sm:text-[11px]"
                      >
                        {activeSlide.label}
                      </motion.div>
                    </div>

                    <div className="overflow-hidden py-0.5 sm:py-1">
                      <motion.h2
                        initial={{ y: "100%", opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{
                          delay: 0.4,
                          duration: 1,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        className="text-5xl leading-tight font-light tracking-tight text-white lg:text-8xl"
                      >
                        {activeSlide.title}
                      </motion.h2>
                    </div>

                    <div className="overflow-hidden">
                      <motion.p
                        initial={{ y: "100%", opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{
                          delay: 0.5,
                          duration: 1,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        className="mx-auto max-w-[280px] text-sm leading-relaxed font-light text-white/80 sm:max-w-[500px] md:text-2xl"
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
                    className="group relative z-20 mt-2 flex h-11 items-center justify-center gap-3 overflow-hidden rounded-full bg-white px-6 text-[10px] font-black tracking-[0.2em] text-black uppercase shadow-[0_20px_40px_rgba(255,255,255,0.15)] transition-all duration-300 hover:scale-105 hover:shadow-[0_25px_50px_rgba(255,255,255,0.25)] active:scale-95 sm:mt-3 sm:h-14 sm:px-10 md:text-[11px]"
                  >
                    <span className="relative z-10 flex items-center gap-2.5">
                      <Play
                        size={12}
                        fill="currentColor"
                        strokeWidth={0}
                        className="transition-transform group-hover:scale-110"
                      />
                      Begin Session
                    </span>
                    {/* Animated premium sheen effect */}
                    <motion.div
                      initial={{ x: "-100%" }}
                      animate={{ x: "100%" }}
                      transition={{
                        repeat: Infinity,
                        repeatType: "loop",
                        duration: 3,
                        ease: "linear",
                      }}
                      className="pointer-events-none absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-black/[0.05] to-transparent"
                    />
                  </button>
                </motion.div>
              </AnimatePresence>
            </section>

            {/* Bouncing Scroll Indicator - Lowered on Desktop */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: "easeInOut",
              }}
              className="pointer-events-none absolute bottom-30 left-1/2 z-50 -translate-x-1/2 text-white/50 md:bottom-8"
            >
              <ChevronDown size={32} />
            </motion.div>
          </div>

          {/* Scrollable category-based carousels below the 100vh fold */}
          <div className="mt-8 w-full space-y-8 pb-8">
            {/* Personal Journeys Carousel */}
            {customExercises.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-black tracking-[0.3em] text-white/80 uppercase">
                      Personal Journeys
                    </span>
                    <span className="text-[8px] font-bold tracking-widest text-white/30 uppercase">
                      Your custom practices
                    </span>
                  </div>
                  <span className="text-[9px] font-bold tracking-widest text-white/40 uppercase">
                    {customExercises.length} sessions
                  </span>
                </div>

                <div className="scrollbar-hide mask-fade-edges -mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-4 md:grid md:snap-none md:grid-cols-2 md:overflow-x-visible md:pb-0 lg:grid-cols-3">
                  {customExercises.map((ex) => (
                    <div
                      key={ex.id}
                      className="w-[95vw] shrink-0 snap-center sm:w-[420px] md:w-full md:shrink md:snap-align-none"
                    >
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
              const catExercises = exercises.filter((ex) =>
                cat.exerciseIds.includes(ex.id),
              );
              if (catExercises.length === 0) return null;

              return (
                <div key={cat.id} className="space-y-4">
                  <div className="flex items-center justify-between px-1">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] font-black tracking-[0.3em] text-white uppercase">
                        {cat.title}
                      </span>
                      <span className="text-[8px] font-bold tracking-widest text-white/40 uppercase">
                        {cat.desc}
                      </span>
                    </div>
                    <span className="text-[9px] font-bold tracking-widest text-white/40 uppercase">
                      {catExercises.length} practices
                    </span>
                  </div>

                  <div className="scrollbar-hide mask-fade-edges -mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-4 md:grid md:snap-none md:grid-cols-2 md:overflow-x-visible md:pb-0 lg:grid-cols-3">
                    {catExercises.map((ex) => (
                      <div
                        key={ex.id}
                        className="w-[95vw] shrink-0 snap-center sm:w-[420px] md:w-full md:shrink md:snap-align-none"
                      >
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
        <div className="mt-4 w-full space-y-10">
          {filteredCustomExercises.length === 0 &&
          filteredGlobalExercises.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <Search
                size={48}
                strokeWidth={1}
                className="mb-4 text-gray-500"
              />
              <p className="text-sm font-light text-gray-400">
                No practices found matching "{searchQuery}"
              </p>
            </motion.div>
          ) : (
            <>
              {filteredCustomExercises.length > 0 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] font-bold tracking-[0.3em] text-white/50 uppercase">
                      Personal Journeys
                    </span>
                    <span className="text-[10px] font-medium text-white/40">
                      {filteredCustomExercises.length} found
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] font-bold tracking-[0.3em] text-white/50 uppercase">
                      Global Collection
                    </span>
                    <span className="text-[10px] font-medium text-white/40">
                      {filteredGlobalExercises.length} found
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
            style={{
              backdropFilter: "blur(40px)",
              WebkitBackdropFilter: "blur(40px)",
            }}
            className="fixed inset-0 z-[600] flex flex-col overflow-hidden bg-black/25 md:pl-28"
          >
            {/* Sticky Header - Pinned at the top */}
            <div className="w-full flex-shrink-0 bg-transparent px-6 py-4 md:px-12 md:pt-8">
              <div className="mx-auto flex w-full max-w-[480px] items-center justify-between md:max-w-[1000px] lg:max-w-[1200px]">
                <div className="space-y-1">
                  <h2 className="text-2xl font-light tracking-tight text-white drop-shadow-md">
                    Ambient Sanctuary
                  </h2>
                  <p className="text-xs font-light text-white/60 drop-shadow-sm">
                    Set your visual & auditory environment
                  </p>
                </div>
                <button
                  onClick={() => setIsAmbientSelectorOpen(false)}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-sm transition-all hover:scale-105 hover:bg-white/15 active:scale-90"
                >
                  <X size={24} className="text-white" />
                </button>
              </div>
            </div>

            {/* GPU-Accelerated CSS for Butter-Smooth Soundwaves */}
            <style>{`
              @keyframes wave-dance {
                0%, 100% { height: 4px; }
                50% { height: 16px; }
              }
              .animate-wave-1 { animation: wave-dance 1.2s infinite ease-in-out; }
              .animate-wave-2 { animation: wave-dance 1.2s infinite ease-in-out 0.25s; }
              .animate-wave-3 { animation: wave-dance 1.2s infinite ease-in-out 0.5s; }
              .animate-wave-4 { animation: wave-dance 1.2s infinite ease-in-out 0.75s; }
              .animate-wave-5 { animation: wave-dance 1.2s infinite ease-in-out 1.0s; }
            `}</style>

            {/* Scrollable Content Area - Rest of screen */}
            <div className="w-full flex-1 overflow-y-auto px-6 pb-16 md:px-12">
              <div className="mx-auto flex w-full max-w-[480px] flex-col md:max-w-[1000px] lg:max-w-[1200px]">
                <div className="grid grid-cols-2 gap-5 pt-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {ambientList.map((item) => {
                    const isActive = soundscape.activeSoundscape === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          if (isActive) {
                            if (isAmbientSoundOn) {
                              setIsAmbientSoundOn(false);
                              soundscape.pauseSoundscape();
                            } else {
                              setIsAmbientSoundOn(true);
                              soundscape.setActiveSoundscape(item.id);
                            }
                          } else {
                            soundscape.setActiveSoundscape(item.id);
                            setIsAmbientSoundOn(true);
                          }
                        }}
                        className={`group relative flex aspect-[2/3] w-full flex-col overflow-hidden rounded-[1.5rem] border text-left transition-all duration-500 active:scale-95 ${
                          isActive
                            ? "border-emerald-500/50 bg-black shadow-[0_0_30px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/50"
                            : "border-white/10 bg-black hover:border-white/20 hover:shadow-2xl"
                        }`}
                      >
                        {/* Background Image full height to avoid any cutoffs */}
                        <img
                          src={item.image}
                          alt={item.name}
                          className={`absolute inset-0 h-full w-full object-cover transition-transform duration-700 ${
                            isActive
                              ? "scale-105"
                              : "scale-100 group-hover:scale-110"
                          }`}
                        />

                        {/* Hover overlay cutting visibility */}
                        <div
                          className={`duration-500"} absolute inset-0 transition-colors`}
                        />

                        {/* Double gradient for smooth blend to black at the bottom */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/90 to-transparent" />

                        {/* Top-left tag based on ambient type */}
                        <div className="absolute top-4 left-4 z-10">
                          <span className="text-[9px] tracking-widest text-white/80 uppercase mix-blend-overlay">
                            {item.id.includes("rain") ||
                            item.id.includes("river") ||
                            item.id.includes("lake") ||
                            item.id.includes("beach") ||
                            item.id.includes("marain")
                              ? "Water Element"
                              : item.id.includes("galaxy")
                                ? "Cosmic Element"
                                : item.id.includes("forest") ||
                                    item.id.includes("nature") ||
                                    item.id.includes("leaf") ||
                                    item.id.includes("desert")
                                  ? "Earth Element"
                                  : "Ambient Sound"}
                          </span>
                        </div>

                        {/* Content Section */}
                        <div className="relative z-10 flex h-full flex-col justify-between px-4 pt-1 pb-4 sm:px-5 sm:pb-5">
                          {/* Top part where animation sits */}
                          <div className="flex flex-1 items-center justify-center">
                            {isActive && soundscape.isActuallyPlaying && (
                              <div className="flex h-8 items-end justify-center gap-[4px] opacity-80 mix-blend-overlay">
                                <div
                                  className="animate-wave-1 w-[4px] rounded-full bg-white"
                                  style={{ height: "4px" }}
                                />
                                <div
                                  className="animate-wave-2 w-[4px] rounded-full bg-white"
                                  style={{ height: "4px" }}
                                />
                                <div
                                  className="animate-wave-3 w-[4px] rounded-full bg-white"
                                  style={{ height: "4px" }}
                                />
                                <div
                                  className="animate-wave-4 w-[4px] rounded-full bg-white"
                                  style={{ height: "4px" }}
                                />
                                <div
                                  className="animate-wave-5 w-[4px] rounded-full bg-white"
                                  style={{ height: "4px" }}
                                />
                              </div>
                            )}
                          </div>

                          {/* Bottom part for Text */}
                          <div className="flex flex-col">
                            <h3
                              className={`text-lg tracking-tight transition-colors duration-300 sm:text-xl ${
                                isActive
                                  ? "font-medium text-emerald-400"
                                  : "font-normal text-white"
                              }`}
                            >
                              {item.name}
                            </h3>

                            {/* Tags instead of button */}
                            <p className="mt-1 text-[10px] text-white/60">
                              {item.id.includes("rain")
                                ? "Deep sleep & relaxation"
                                : item.id.includes("galaxy")
                                  ? "Deep focus & meditation"
                                  : item.id.includes("forest")
                                    ? "Calm & stress relief"
                                    : item.id === "leaf"
                                      ? "Pure focus & reading"
                                      : "Immersive ambiance"}
                            </p>
                          </div>

                          {/* Footer Text */}
                          <div className="mt-4 flex w-full items-center justify-between text-[8px] tracking-[0.15em] text-white/30 uppercase sm:text-[9px]">
                            <span>spirox.app</span>
                            <span>
                              {item.id === "silent-focus"
                                ? "silent"
                                : "audio + visual"}
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
