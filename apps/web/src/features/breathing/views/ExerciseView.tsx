"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Music, Pause, Play, RotateCcw } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

import { BreathingCircle } from "../components/BreathingCircle";
import { SessionSettings } from "../components/SessionSettings";
import { Exercise } from "../data";
import { useBinauralBeats } from "../hooks/useBinauralBeats";
import { useBreathingTimer } from "../hooks/useBreathingTimer";
import { useSoundscape } from "../hooks/useSoundscape";
import { useVoiceAssistant } from "../hooks/useVoiceAssistant";
import { SessionConfig } from "./SessionSetup";

const getAmbientImage = (activeSoundscape: string) => {
  switch (activeSoundscape) {
    case "zen-river":
      return "/image/ambients/river.png";
    case "zen-fountain":
      return "/image/ambients/whaterfalls.png";
    case "winter-rain":
      return "/image/ambients/rain.png";
    case "light-rain":
      return "/image/ambients/rain2.png";
    case "nature-birds":
      return "/image/ambients/nature2.png";
    case "hz-transformation":
      return "/image/ambients/galaxy.png";
    case "white-noise":
      return "/image/ambients/galaxy2.png";
    case "pink-noise":
      return "/image/ambients/galaxy3.png";
    case "brown-noise":
      return "/image/ambients/nature.png";
    case "beach":
      return "/image/ambients/beach.png";
    case "lake":
      return "/image/ambients/lake4.png";
    case "marine":
      return "/image/ambients/marain.png";
    case "desert":
      return "/image/ambients/desert3.png";
    case "ethereal":
      return "/image/ambients/loop.png";
    case "forest":
      return "/image/ambients/forest.png";
    case "leaf":
    default:
      return "/image/ambients/leaf.png";
  }
};

interface ExerciseViewProps {
  exercise: Exercise;
  config: SessionConfig;
  onBack: () => void;
  onComplete: (duration: number, cycles: number) => void;
  onRecordSession: (id: string, duration: number) => void;
  soundscape: any;
  isAmbientSoundOn: boolean;
  setIsAmbientSoundOn: (on: boolean) => void;
}

export function ExerciseView({
  exercise,
  config,
  onBack,
  onComplete,
  onRecordSession,
  soundscape,
  isAmbientSoundOn,
  setIsAmbientSoundOn,
}: ExerciseViewProps) {
  // Local settings state (Moved up so it can be used by hooks)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [voiceVolume, setVoiceVolume] = useState(0.8);
  const [selectedVoiceId, setSelectedVoiceId] = useState("lauren");

  const timer = useBreathingTimer(exercise.pattern);

  // Use a ref to avoid infinite loops with onComplete/onRecordSession
  const hasCompletedRef = useRef(false);
  const totalTimeRef = useRef(0);

  useEffect(() => {
    totalTimeRef.current = timer.totalTime;
  }, [timer.totalTime]);

  // Synchronize the ambient audio playback state with the breathing session activity
  useEffect(() => {
    setIsAmbientSoundOn(timer.isActive || isSettingsOpen);
  }, [timer.isActive, isSettingsOpen, setIsAmbientSoundOn]);

  // Audio hooks now play if session is active OR if settings are open (for testing)
  const voiceAssistant = useVoiceAssistant(timer.phase, timer.isActive, {
    profileId: selectedVoiceId,
    isEnabled: isVoiceEnabled,
    volume: voiceVolume,
  });
  const binaural = useBinauralBeats(timer.isActive || isSettingsOpen);

  // Check for completion
  useEffect(() => {
    if (hasCompletedRef.current) return;

    if (config.mode === "duration" && timer.totalTime >= config.value * 60) {
      hasCompletedRef.current = true;
      if (timer.isActive) timer.toggle();
      onRecordSession(exercise.id, timer.totalTime);
      onComplete(timer.totalTime, timer.cycles);
    } else if (config.mode === "cycles" && timer.cycles >= config.value) {
      hasCompletedRef.current = true;
      if (timer.isActive) timer.toggle();
      onRecordSession(exercise.id, timer.totalTime);
      onComplete(timer.totalTime, timer.cycles);
    }
  }, [timer.totalTime, timer.cycles, config, onComplete, timer.isActive]);

  // Haptic Feedback for mobile
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "vibrate" in navigator &&
      timer.isActive
    ) {
      if (timer.phase === "Inhale") {
        navigator.vibrate(100);
      } else if (timer.phase === "Exhale") {
        navigator.vibrate(100);
      } else if (timer.phase.includes("Hold")) {
        navigator.vibrate(50);
      }
    }
  }, [timer.phase, timer.isActive]);

  // Use refs for onRecordSession and exercise.id to prevent infinite loops in cleanup
  const onRecordSessionRef = useRef(onRecordSession);
  const exerciseIdRef = useRef(exercise.id);

  useEffect(() => {
    onRecordSessionRef.current = onRecordSession;
    exerciseIdRef.current = exercise.id;
  }, [onRecordSession, exercise.id]);

  // Record session on leave if any time was spent
  useEffect(() => {
    return () => {
      // Use the ref value to get the latest time without triggering the effect on change
      if (totalTimeRef.current > 10 && !hasCompletedRef.current) {
        onRecordSessionRef.current(exerciseIdRef.current, totalTimeRef.current);
      }
    };
  }, []);

  const handleReset = () => {
    timer.reset();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex h-[100dvh] w-full flex-col overflow-hidden bg-black text-white selection:bg-white/20"
    >
      {/* Immersive Ambient Background Layer */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-black">
        <AnimatePresence mode="wait">
          <motion.div
            key={soundscape.activeSoundscape}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1.0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.8, ease: "easeInOut" }}
            className="absolute inset-0 scale-105 bg-cover bg-center transition-all duration-1000"
            style={{
              backgroundImage: `url(${getAmbientImage(soundscape.activeSoundscape)})`,
            }}
          />
        </AnimatePresence>
      </div>

      {/* Header - Fixed Top */}
      <div className="relative z-10 flex items-center justify-between bg-gradient-to-b from-black/40 to-transparent px-6 pt-8 pb-3">
        <button
          onClick={onBack}
          className="rounded-full border border-white/15 bg-white/[0.04] p-3 text-gray-300 shadow-lg backdrop-blur-md transition-all hover:bg-white/[0.08] hover:text-white active:scale-95"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="text-center">
          <h2 className="text-xl font-light tracking-tight text-white drop-shadow-md">
            {exercise.name}
          </h2>
          <p className="mt-1 text-[10px] font-semibold tracking-widest text-white/70 uppercase drop-shadow-sm">
            {timer.phase}
          </p>
        </div>
        <div className="w-12" /> {/* Spacer to maintain title centering */}
      </div>

      {/* Main Content Area - Scrollable or Centered */}
      <div className="scrollbar-hide relative z-10 flex w-full flex-1 flex-col items-center justify-center overflow-y-auto px-6 py-4">
        <div className="mb-4"></div>

        <BreathingCircle
          phase={timer.phase}
          timer={timer.timeLeft}
          duration={timer.duration}
          isActive={timer.isActive}
          gradient={exercise.gradient}
          activeSoundscape={soundscape.activeSoundscape}
        />

        {/* Progress Bar - Now dynamically shows either duration or cycles */}
        <div className="mt-12 w-full max-w-[340px]">
          {config.mode === "duration" && (
            <div className="flex flex-col gap-3">
              <div className="flex items-end justify-between">
                <span className="text-[9px] font-bold tracking-widest text-white/50 uppercase">
                  Duration
                </span>
                <span className="text-xl font-light text-white">
                  {Math.floor(timer.totalTime / 60)}:
                  {(timer.totalTime % 60).toString().padStart(2, "0")}{" "}
                  <span className="text-sm text-white/40">
                    / {config.value}:00
                  </span>
                </span>
              </div>
              <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/10 shadow-lg">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-white"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.min((timer.totalTime / (config.value * 60)) * 100, 100)}%`,
                  }}
                  transition={{ ease: "linear", duration: 1 }}
                />
              </div>
            </div>
          )}

          {config.mode === "cycles" && (
            <div className="flex flex-col gap-3">
              <div className="flex items-end justify-between">
                <span className="text-[9px] font-bold tracking-widest text-white/50 uppercase">
                  Cycles
                </span>
                <span className="text-xl font-light text-white">
                  {timer.cycles}{" "}
                  <span className="text-sm text-white/40">
                    / {config.value}
                  </span>
                </span>
              </div>
              <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/10 shadow-lg">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-white"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.min((timer.cycles / config.value) * 100, 100)}%`,
                  }}
                  transition={{ ease: "easeInOut", duration: 0.5 }}
                />
              </div>
            </div>
          )}

          {config.mode === "infinite" && (
            <div className="flex flex-col items-center gap-1">
              <span className="text-[9px] font-bold tracking-widest text-white/50 uppercase">
                Duration
              </span>
              <span className="text-2xl font-light text-white">
                {Math.floor(timer.totalTime / 60)}:
                {(timer.totalTime % 60).toString().padStart(2, "0")}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Bottom Controls */}
      <div className="relative z-10 bg-gradient-to-t from-black/50 via-black/20 to-transparent px-8 pt-4 pb-6">
        <div className="mx-auto flex max-w-[400px] items-center justify-center gap-10">
          <button
            onClick={handleReset}
            className="flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-gray-300 shadow-lg backdrop-blur-md transition-all hover:bg-white/[0.08] hover:text-white active:scale-95"
          >
            <RotateCcw size={22} />
          </button>

          <button
            onClick={timer.toggle}
            className="flex h-24 w-24 items-center justify-center rounded-full border border-white/30 bg-white/[0.12] text-white shadow-[0_8px_32px_rgba(255,255,255,0.08)] backdrop-blur-lg transition-all hover:scale-105 hover:bg-white/[0.18] active:scale-95"
          >
            {timer.isActive ? (
              <Pause size={32} fill="white" />
            ) : (
              <Play size={32} className="ml-1" fill="white" />
            )}
          </button>

          <button
            onClick={() => setIsSettingsOpen(true)}
            className="flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-gray-300 shadow-lg backdrop-blur-md transition-all hover:bg-white/[0.08] hover:text-white active:scale-95"
          >
            <Music size={22} />
          </button>
        </div>
      </div>

      <SessionSettings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        activeSoundscape={soundscape.activeSoundscape}
        onSelectSoundscape={soundscape.toggleSoundscape}
        soundscapeVolume={soundscape.volume}
        onSetSoundscapeVolume={soundscape.setVolume}
        isVoiceEnabled={isVoiceEnabled}
        onSetVoiceEnabled={setIsVoiceEnabled}
        selectedVoiceId={selectedVoiceId}
        onSelectVoice={setSelectedVoiceId}
        voiceVolume={voiceVolume}
        onSetVoiceVolume={setVoiceVolume}
        onTestVoice={voiceAssistant.testVoice}
        activeBinaural={binaural.activeBinaural}
        onSelectBinaural={binaural.toggleBinaural}
        binauralVolume={binaural.binauralVolume}
        onSetBinauralVolume={binaural.setBinauralVolume}
        isAmbientSoundOn={isAmbientSoundOn}
        setIsAmbientSoundOn={setIsAmbientSoundOn}
        pauseSoundscape={soundscape.pauseSoundscape}
        setActiveSoundscape={soundscape.setActiveSoundscape}
      />
    </motion.div>
  );
}
