'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RotateCcw, Pause, Play, Music } from 'lucide-react';
import { Exercise } from '../data';
import { useBreathingTimer } from '../hooks/useBreathingTimer';
import { useSoundscape } from '../hooks/useSoundscape';
import { useVoiceAssistant } from '../hooks/useVoiceAssistant';
import { useBinauralBeats } from '../hooks/useBinauralBeats';
import { BreathingCircle } from '../components/BreathingCircle';
import { SessionSettings } from '../components/SessionSettings';
import { SessionConfig } from './SessionSetup';

const getAmbientImage = (activeSoundscape: string) => {
  switch (activeSoundscape) {
    case 'zen-river':
      return '/image/ambients/river.png';
    case 'zen-fountain':
      return '/image/ambients/whaterfalls.png';
    case 'winter-rain':
      return '/image/ambients/rain.png';
    case 'light-rain':
      return '/image/ambients/rain2.png';
    case 'nature-birds':
      return '/image/ambients/nature2.png';
    case 'hz-transformation':
      return '/image/ambients/galaxy.png';
    case 'white-noise':
      return '/image/ambients/galaxy2.png';
    case 'pink-noise':
      return '/image/ambients/galaxy3.png';
    case 'brown-noise':
      return '/image/ambients/nature.png';
    case 'beach':
      return '/image/ambients/beach.png';
    case 'lake':
      return '/image/ambients/lake4.png';
    case 'marine':
      return '/image/ambients/marain.png';
    case 'desert':
      return '/image/ambients/desert3.png';
    case 'ethereal':
      return '/image/ambients/loop.png';
    case 'forest':
      return '/image/ambients/forest.png';
    case 'none':
    default:
      return '/image/ambients/leaf.png';
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
  setIsAmbientSoundOn
}: ExerciseViewProps) {
  // Local settings state (Moved up so it can be used by hooks)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [voiceVolume, setVoiceVolume] = useState(0.8);
  const [selectedVoiceId, setSelectedVoiceId] = useState('luna');

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
    volume: voiceVolume
  });
  const binaural = useBinauralBeats(timer.isActive || isSettingsOpen);

  // Check for completion
  useEffect(() => {
    if (hasCompletedRef.current) return;

    if (config.mode === 'duration' && timer.totalTime >= config.value * 60) {
      hasCompletedRef.current = true;
      if (timer.isActive) timer.toggle();
      onRecordSession(exercise.id, timer.totalTime);
      onComplete(timer.totalTime, timer.cycles);
    } else if (config.mode === 'cycles' && timer.cycles >= config.value) {
      hasCompletedRef.current = true;
      if (timer.isActive) timer.toggle();
      onRecordSession(exercise.id, timer.totalTime);
      onComplete(timer.totalTime, timer.cycles);
    }
  }, [timer.totalTime, timer.cycles, config, onComplete, timer.isActive]);

  // Haptic Feedback for mobile
  useEffect(() => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator && timer.isActive) {
      if (timer.phase === 'Inhale') {
        navigator.vibrate(100);
      } else if (timer.phase === 'Exhale') {
        navigator.vibrate(100);
      } else if (timer.phase.includes('Hold')) {
        navigator.vibrate(50);
      }
    }
  }, [timer.phase, timer.isActive]);

  // Record session on leave if any time was spent
  useEffect(() => {
    return () => {
      // Use the ref value to get the latest time without triggering the effect on change
      if (totalTimeRef.current > 10 && !hasCompletedRef.current) {
        onRecordSession(exercise.id, totalTimeRef.current);
      }
    };
  }, [exercise.id, onRecordSession]);

  const handleReset = () => {
    timer.reset();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex flex-col overflow-hidden w-full h-[100dvh] bg-black text-white selection:bg-white/20"
    >
      {/* Immersive Ambient Background Layer */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-black">
        <AnimatePresence mode="wait">
          <motion.div
            key={soundscape.activeSoundscape}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1.0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.8, ease: "easeInOut" }}
            className="absolute inset-0 bg-cover bg-center transition-all duration-1000 scale-105"
            style={{
              backgroundImage: `url(${getAmbientImage(soundscape.activeSoundscape)})`
            }}
          />
        </AnimatePresence>
      </div>

      {/* Header - Fixed Top */}
      <div className="px-6 pt-8 pb-3 flex justify-between items-center bg-gradient-to-b from-black/40 to-transparent relative z-10">
        <button
          onClick={onBack}
          className="p-3 rounded-full bg-white/[0.04] backdrop-blur-md border border-white/15 text-gray-300 hover:text-white hover:bg-white/[0.08] transition-all active:scale-95 shadow-lg"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="text-center">
          <h2 className="text-xl font-light text-white tracking-tight drop-shadow-md">{exercise.name}</h2>
          <p className="text-[10px] uppercase tracking-widest text-white/70 mt-1 drop-shadow-sm font-semibold">{timer.phase}</p>
        </div>
        <div className="w-12" /> {/* Spacer to maintain title centering */}
      </div>

      {/* Main Content Area - Scrollable or Centered */}
      <div className="flex-1 flex flex-col items-center justify-center w-full px-6 relative z-10 overflow-y-auto scrollbar-hide py-4">
        <div className="mb-4">
          {config.mode !== 'infinite' && (
            <div className="px-4 py-1.5 rounded-full bg-black/45 backdrop-blur-md border border-white/10 flex items-center gap-2 shadow-lg">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
              <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest">
                Goal: {config.value} {config.mode === 'duration' ? 'min' : 'cycles'}
              </span>
            </div>
          )}
        </div>

        <BreathingCircle
          phase={timer.phase}
          timer={timer.timeLeft}
          duration={timer.duration}
          isActive={timer.isActive}
          gradient={exercise.gradient}
          activeSoundscape={soundscape.activeSoundscape}
        />

        {/* Stats Grid - Now in the center flow */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-[340px] mt-8">
          <div className="bg-black/45 backdrop-blur-[16px] border border-white/10 p-5 rounded-[28px] flex flex-col items-center gap-1 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
            <span className="text-[9px] uppercase tracking-widest text-white/50 font-bold">Cycles</span>
            <span className="text-2xl font-light text-white">{timer.cycles}</span>
          </div>
          <div className="bg-black/45 backdrop-blur-[16px] border border-white/10 p-5 rounded-[28px] flex flex-col items-center gap-1 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
            <span className="text-[9px] uppercase tracking-widest text-white/50 font-bold">Duration</span>
            <span className="text-2xl font-light text-white">
              {Math.floor(timer.totalTime / 60)}:{(timer.totalTime % 60).toString().padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Controls */}
      <div className="px-8 pt-4 pb-6 bg-gradient-to-t from-black/50 via-black/20 to-transparent relative z-10">
        <div className="max-w-[400px] mx-auto flex items-center justify-center gap-10">
          <button
            onClick={handleReset}
            className="w-14 h-14 flex items-center justify-center rounded-full bg-white/[0.04] backdrop-blur-md border border-white/15 text-gray-300 hover:text-white hover:bg-white/[0.08] transition-all active:scale-95 shadow-lg"
          >
            <RotateCcw size={22} />
          </button>

          <button
            onClick={timer.toggle}
            className="w-24 h-24 flex items-center justify-center rounded-full bg-white/[0.12] backdrop-blur-lg border border-white/30 text-white hover:scale-105 active:scale-95 hover:bg-white/[0.18] transition-all shadow-[0_8px_32px_rgba(255,255,255,0.08)]"
          >
            {timer.isActive ? <Pause size={32} fill="white" /> : <Play size={32} className="ml-1" fill="white" />}
          </button>

          <button
            onClick={() => setIsSettingsOpen(true)}
            className="w-14 h-14 flex items-center justify-center rounded-full bg-white/[0.04] backdrop-blur-md border border-white/15 text-gray-300 hover:text-white hover:bg-white/[0.08] transition-all active:scale-95 shadow-lg"
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
      />
    </motion.div>
  );
}
