'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { Exercise } from './data';
import { useLibrary } from './hooks/useCustomExercises';
import { CustomBuilder } from './components/CustomBuilder';
import { BottomNav, TabType } from './components/BottomNav';
import { ExploreView } from './components/ExploreView';
import { LibraryView } from './components/LibraryView';
import { ProfileView } from './components/ProfileView';
import { ExerciseView } from './components/ExerciseView';
import { DetailsView } from './components/DetailsView';
import { SessionSetup, SessionConfig } from './components/SessionSetup';
import { SessionComplete } from './components/SessionComplete';
import { JournalView } from './components/JournalView';
import { AchievementsView } from './components/AchievementsView';
import { SubscriptionView } from './components/SubscriptionView';
import { AuthView } from './components/AuthView';

type ViewType = 'home' | 'exercise' | 'details' | 'setup' | 'complete' | 'builder' | 'subscription' | 'auth';

export function BreathingExercise() {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [view, setView] = useState<ViewType>('home');
  const [activeTab, setActiveTab] = useState<TabType>('explore');
  const [sessionConfig, setSessionConfig] = useState<SessionConfig | null>(null);
  const [sessionResults, setSessionResults] = useState<{ duration: number; cycles: number } | null>(null);

  // Advanced PWA States & Hooks
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  const {
    customExercises, favorites, sessions, stats, customGoals,
    toggleFavorite, deleteExercise, addExercise, recordSession, addCustomGoal, deleteCustomGoal,
    userName, userAvatar, updateUserName, updateAvatar, clearAllData
  } = useLibrary();

  // Register service worker and capture PWA installers
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Register cache-first advanced service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((reg) => console.log('Service Worker registered successfully:', reg.scope))
        .catch((err) => console.error('Service Worker registration failed:', err));
    }

    // 2. Detect Apple iOS Device
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isApple = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isApple);

    // 3. Detect if already running in standalone/installed mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    setIsInstalled(!!isStandalone);

    // 4. Capture native beforeinstallprompt event for Chromium/Chrome/Edge
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    // 5. Capture successful installation completion
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Fallback: If it's iOS and not running in standalone, mark as installable (to show iOS tutorial modal)
    if (isApple && !isStandalone) {
      setIsInstallable(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallPWA = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User PWA Choice outcome: ${outcome}`);
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
    }
  }, []);

  const handleStart = (ex: Exercise) => {
    setSelectedExercise(ex);
    setView('setup');
  };

  const handleConfirmSetup = (config: SessionConfig) => {
    setSessionConfig(config);
    setView('exercise');
  };

  const handleComplete = (duration: number, cycles: number) => {
    setSessionResults({ duration, cycles });
    setView('complete');
  };

  const handleDetails = (ex: Exercise) => {
    setSelectedExercise(ex);
    setView('details');
  };

  const handleBack = () => {
    setView('home');
    if (typeof window !== 'undefined') window.speechSynthesis.cancel();
  };

  return (
    <div className="h-screen bg-black text-white selection:bg-white/20 flex flex-col overflow-hidden">
      {/* Scrollable Content Area */}
      <div id="breathing-scroll-container" className="flex-1 overflow-y-auto pb-32 scroll-smooth">
        <div className="flex flex-col items-center w-full px-4 sm:px-0 max-w-[480px] mx-auto font-sans relative z-10">
          <AnimatePresence mode="wait">
            {view === 'home' && (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full"
              >
                {activeTab === 'explore' && (
                  <ExploreView
                    key="explore"
                    onStart={handleStart}
                    onDetails={handleDetails}
                    customExercises={customExercises}
                    favorites={favorites}
                    onToggleFavorite={toggleFavorite}
                    stats={stats}
                    userAvatar={userAvatar}
                    onProfileClick={() => setActiveTab('profile')}
                  />
                )}
                {activeTab === 'library' && (
                  <div className="pt-12 w-full">
                    <LibraryView
                      key="library"
                      onStart={handleStart}
                      onDetails={handleDetails}
                      customExercises={customExercises}
                      favorites={favorites}
                      onToggleFavorite={toggleFavorite}
                      onDeleteCustom={deleteExercise}
                      onCreate={() => setView('builder')}
                    />
                  </div>
                )}
                {activeTab === 'achievements' && (
                  <div className="pt-12 w-full">
                    <AchievementsView
                      key="achievements"
                      stats={stats}
                      customGoals={customGoals}
                      customExercises={customExercises}
                      onAddGoal={addCustomGoal}
                      onDeleteGoal={deleteCustomGoal}
                      onStart={handleStart}
                    />
                  </div>
                )}
                {activeTab === 'journal' && (
                  <div className="pt-12 w-full">
                    <JournalView
                      key="journal"
                      sessions={sessions}
                      stats={stats}
                    />
                  </div>
                )}
                {activeTab === 'profile' && (
                  <div className="pt-12 w-full">
                    <ProfileView
                      key="profile"
                      stats={stats}
                      userName={userName}
                      userAvatar={userAvatar}
                      onUpdateName={updateUserName}
                      onUpdateAvatar={updateAvatar}
                      onResetData={clearAllData}
                      onUpgrade={() => setView('subscription')}
                      onLogin={() => setView('auth')}
                      isInstallable={isInstallable && !isInstalled}
                      isIOS={isIOS}
                      onInstallPWA={handleInstallPWA}
                    />
                  </div>
                )}
              </motion.div>
            )}
            {view === 'subscription' && (
              <div className="pt-12 w-full">
                <SubscriptionView
                  key="subscription"
                  onBack={() => setView('home')}
                />
              </div>
            )}
            {view === 'auth' && (
              <div className="pt-12 w-full">
                <AuthView
                  key="auth"
                  onBack={() => setView('home')}
                  onSuccess={() => setView('home')}
                />
              </div>
            )}
            {view === 'builder' && (
              <div className="pt-12 w-full">
                <CustomBuilder
                  key="builder"
                  onBack={() => setView('home')}
                  onSave={(ex) => { addExercise(ex); setView('home'); setActiveTab('library'); }}
                />
              </div>
            )}
            {view === 'setup' && selectedExercise && (
              <div className="pt-12 w-full">
                <SessionSetup
                  key="setup"
                  exercise={selectedExercise}
                  onBack={handleBack}
                  onConfirm={handleConfirmSetup}
                />
              </div>
            )}
            {view === 'exercise' && selectedExercise && sessionConfig && (
              <div className="pt-12 w-full flex flex-col items-center">
                <ExerciseView
                  key="exercise"
                  exercise={selectedExercise}
                  config={sessionConfig}
                  onBack={() => setView('setup')}
                  onComplete={handleComplete}
                  onRecordSession={recordSession}
                />
              </div>
            )}
            {view === 'complete' && selectedExercise && sessionResults && (
              <div className="pt-12 w-full">
                <SessionComplete
                  key="complete"
                  exercise={selectedExercise}
                  duration={sessionResults.duration}
                  cycles={sessionResults.cycles}
                  onHome={handleBack}
                  onRestart={() => setView('exercise')}
                />
              </div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {view === 'details' && selectedExercise && (
              <div className="pt-12 w-full">
                <DetailsView key="details" exercise={selectedExercise} onBack={handleBack} onStart={() => setView('setup')} />
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {view === 'home' && (
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      )}
    </div>
  );
}
