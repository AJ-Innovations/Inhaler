'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, RotateCcw, Pause, Play, Music } from 'lucide-react';
import { Exercise } from '../data';
import { useBreathingTimer } from '../hooks/useBreathingTimer';
import { useSoundscape } from '../hooks/useSoundscape';
import { useVoiceAssistant } from '../hooks/useVoiceAssistant';
import { useBinauralBeats } from '../hooks/useBinauralBeats';
import { BreathingCircle } from './BreathingCircle';
import { SessionSettings } from './SessionSettings';
import { SessionConfig } from './SessionSetup';

interface ExerciseViewProps {
  exercise: Exercise;
  config: SessionConfig;
  onBack: () => void;
  onComplete: (duration: number, cycles: number) => void;
  onRecordSession: (id: string, duration: number) => void;
}

export function ExerciseView({ exercise, config, onBack, onComplete, onRecordSession }: ExerciseViewProps) {
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

  // Audio hooks now play if session is active OR if settings are open (for testing)
  const soundscape = useSoundscape(timer.isActive || isSettingsOpen);
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
      className="fixed inset-0 bg-black z-[100] flex flex-col"
    >
      {/* Header - Fixed Top */}
      <div className="px-6 pt-12 pb-6 flex justify-between items-center bg-gradient-to-b from-black to-transparent">
        <button onClick={onBack} className="p-3 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all">
          <ArrowLeft size={20} />
        </button>
        <div className="text-center">
          <h2 className="text-xl font-light text-white tracking-tight">{exercise.name}</h2>
          <p className="text-[10px] uppercase tracking-widest text-gray-500 mt-1">{timer.phase}</p>
        </div>
        <div className="w-12" /> {/* Spacer to maintain title centering */}
      </div>

      {/* Main Content Area - Scrollable or Centered */}
      <div className="flex-1 flex flex-col items-center justify-center w-full px-6 relative overflow-y-auto scrollbar-hide py-10">
        <div className="mb-12">
           {config.mode !== 'infinite' && (
             <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
               <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                 Goal: {config.value} {config.mode === 'duration' ? 'min' : 'cycles'}
               </span>
             </div>
           )}
        </div>
        
        <BreathingCircle 
          phase={timer.phase} 
          timer={timer.timeLeft}
          gradient={exercise.gradient}
        />

        {/* Stats Grid - Now in the center flow */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-[340px] mt-16">
          <div className="bg-white/[0.03] border border-white/5 p-5 rounded-[28px] flex flex-col items-center gap-1 shadow-lg">
            <span className="text-[9px] uppercase tracking-widest text-gray-600 font-bold">Cycles</span>
            <span className="text-2xl font-light text-white">{timer.cycles}</span>
          </div>
          <div className="bg-white/[0.03] border border-white/5 p-5 rounded-[28px] flex flex-col items-center gap-1 shadow-lg">
            <span className="text-[9px] uppercase tracking-widest text-gray-600 font-bold">Duration</span>
            <span className="text-2xl font-light text-white">
              {Math.floor(timer.totalTime / 60)}:{(timer.totalTime % 60).toString().padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Controls */}
      <div className="px-8 pt-8 pb-12 bg-gradient-to-t from-black via-black/90 to-transparent">
        <div className="max-w-[400px] mx-auto flex items-center justify-center gap-10">
          <button 
            onClick={handleReset}
            className="w-14 h-14 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all active:scale-95 shadow-xl"
          >
            <RotateCcw size={22} />
          </button>
          
          <button 
            onClick={timer.toggle}
            className="w-24 h-24 flex items-center justify-center rounded-full bg-white text-black hover:scale-105 active:scale-95 transition-all shadow-[0_20px_50px_rgba(255,255,255,0.2)]"
          >
            {timer.isActive ? <Pause size={36} fill="black" /> : <Play size={36} className="ml-1" fill="black" />}
          </button>

          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="w-14 h-14 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all active:scale-95 shadow-xl"
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
