'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind } from 'lucide-react';

import { Exercise } from './data';
import { useLibrary } from './hooks/useCustomExercises';
import { CustomBuilder } from './views/CustomBuilder';
import { BottomNav, TabType } from './components/BottomNav';
import { ExploreView } from './views/ExploreView';
import { LibraryView } from './views/LibraryView';
import { ProfileView } from '../profile/ProfileView';
import { ExerciseView } from './views/ExerciseView';
import { DetailsView } from './views/DetailsView';
import { SessionSetup, SessionConfig } from './views/SessionSetup';
import { SessionComplete } from './views/SessionComplete';
import { JournalView } from '../journal/JournalView';
import { AchievementsView } from '../dashboard/AchievementsView';
import { SubscriptionView } from '../subscription/SubscriptionView';
import { AuthView } from '../auth/AuthView';
import { OnboardingView } from '../onboarding/OnboardingView';
import { useSoundscape } from './hooks/useSoundscape';

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
    case 'leaf':
    default:
      return '/image/ambients/leaf.png';
  }
};

type ViewType = 'home' | 'exercise' | 'details' | 'setup' | 'complete' | 'builder' | 'subscription' | 'auth';

export function BreathingExercise() {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [view, setView] = useState<ViewType>('home');
  const [activeTab, setActiveTab] = useState<TabType>('explore');
  const [sessionConfig, setSessionConfig] = useState<SessionConfig | null>(null);
  const [sessionResults, setSessionResults] = useState<{ duration: number; cycles: number } | null>(null);
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);
  const isPopStateRef = useRef(false);
  const wasExploreRef = useRef(true);

  // Global Soundscape Controller
  const [isAmbientSoundOn, setIsAmbientSoundOn] = useState(false);
  const soundscape = useSoundscape(isAmbientSoundOn);

  // Persistence of selected ambient
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedAmbient = localStorage.getItem('spirox_active_ambient');
      if (savedAmbient && savedAmbient !== 'leaf') {
        soundscape.setActiveSoundscape(savedAmbient as any);
      }
    }
  }, []);

  useEffect(() => {
    if (soundscape.activeSoundscape) {
      localStorage.setItem('spirox_active_ambient', soundscape.activeSoundscape);
    }
  }, [soundscape.activeSoundscape]);

  // Advanced PWA States & Hooks
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  // Dynamic Push & Daily Routine Reminders
  const [dailyReminderEnabled, setDailyReminderEnabled] = useState(false);
  const [dailyReminderTime, setDailyReminderTime] = useState('08:30');

  const {
    customExercises, favorites, sessions, stats, customGoals,
    toggleFavorite, deleteExercise, addExercise, recordSession, addCustomGoal, deleteCustomGoal,
    userName, userAvatar, updateUserName, updateAvatar, updateUserCountry, clearAllData
  } = useLibrary();

  // Load reminder settings from LocalStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const enabled = localStorage.getItem('spirox_daily_reminder_enabled') === 'true';
      const time = localStorage.getItem('spirox_daily_reminder_time') || '08:30';
      setDailyReminderEnabled(enabled);
      setDailyReminderTime(time);

      const completed = localStorage.getItem('spirox_onboarding_completed') === 'true';
      setShowOnboarding(!completed);
    } else {
      setShowOnboarding(false);
    }
  }, []);

  const triggerNotification = async (title: string, body: string) => {
    if (!('Notification' in window)) return;
    if (Notification.permission === 'granted') {
      if ('serviceWorker' in navigator) {
        const reg = await navigator.serviceWorker.ready;
        reg.showNotification(title, {
          body,
          icon: '/icon-192.png',
          badge: '/icon-192.png',
          vibrate: [100, 50, 100],
        } as any);
      } else {
        new Notification(title, { body, icon: '/icon-192.png' });
      }
    }
  };

  const handleToggleReminder = async (enabled: boolean) => {
    if (enabled) {
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          setDailyReminderEnabled(true);
          localStorage.setItem('spirox_daily_reminder_enabled', 'true');
          triggerNotification('Reminders Enabled! 🧘', 'You will be notified daily at your scheduled breathing time.');
        } else {
          alert('Notification permission is required to enable daily reminders.');
          setDailyReminderEnabled(false);
          localStorage.setItem('spirox_daily_reminder_enabled', 'false');
        }
      } else {
        alert('Notifications are not supported in this browser.');
      }
    } else {
      setDailyReminderEnabled(false);
      localStorage.setItem('spirox_daily_reminder_enabled', 'false');
    }
  };

  const handleUpdateTime = (time: string) => {
    setDailyReminderTime(time);
    localStorage.setItem('spirox_daily_reminder_time', time);
  };

  // Scheduled Reminder Background Checker (Runs every 30s)
  useEffect(() => {
    if (!dailyReminderEnabled) return;

    let lastNotifiedDate = '';

    const checkTimeAndNotify = () => {
      const now = new Date();
      const currentHourMin = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const todayStr = now.toDateString();

      if (currentHourMin === dailyReminderTime && lastNotifiedDate !== todayStr) {
        lastNotifiedDate = todayStr;
        triggerNotification(
          'Mindfulness Time! 🧘',
          'It is time for your scheduled breathing exercise. Take a minute to center yourself.'
        );
      }
    };

    checkTimeAndNotify();
    const interval = setInterval(checkTimeAndNotify, 30000);
    return () => clearInterval(interval);
  }, [dailyReminderEnabled, dailyReminderTime]);

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

  // Synchronize browser URL hash with React state for seamless hardware back gestures
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      
      if (!hash || hash === 'explore') {
        isPopStateRef.current = true;
        setView('home');
        setActiveTab('explore');
      } else if (hash === 'library' || hash === 'journal' || hash === 'profile') {
        isPopStateRef.current = true;
        setView('home');
        setActiveTab(hash as TabType);
      } else if (
        hash === 'exercise' ||
        hash === 'details' ||
        hash === 'setup' ||
        hash === 'complete' ||
        hash === 'builder' ||
        hash === 'subscription' ||
        hash === 'auth'
      ) {
        isPopStateRef.current = true;
        setView(hash as ViewType);
      }
    };

    // Set initial explore hash on load if not present
    if (!window.location.hash) {
      window.location.replace('#explore');
      wasExploreRef.current = true;
    } else {
      handleHashChange();
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Synchronize React state changes back to browser URL hash
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const currentHash = window.location.hash.replace('#', '');
    const expectedHash = view === 'home' ? activeTab : view;

    const isAtExplore = expectedHash === 'explore';

    if (isPopStateRef.current) {
      isPopStateRef.current = false;
      wasExploreRef.current = isAtExplore;
      return;
    }

    if (currentHash !== expectedHash) {
      if (isAtExplore) {
        window.location.replace('#explore');
      } else {
        if (wasExploreRef.current) {
          window.location.hash = '#' + expectedHash;
        } else {
          window.location.replace('#' + expectedHash);
        }
      }
    }

    wasExploreRef.current = isAtExplore;
  }, [view, activeTab]);

  const handleCompleteOnboarding = (planId: string, name?: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('spirox_onboarding_completed', 'true');
      localStorage.setItem('spirox_active_plan', planId);
      if (name) {
        updateUserName(name);
      }
      const savedCountry = localStorage.getItem('spirox_user_country');
      if (savedCountry) {
        updateUserCountry(savedCountry);
      }
    }
    setShowOnboarding(false);
    setView('home');
  };

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
    <div
      className="h-screen w-full text-white selection:bg-white flex flex-col overflow-hidden relative bg-cover bg-center transition-all duration-1000 bg-black"
      style={{
        backgroundImage: `url(${getAmbientImage(soundscape.activeSoundscape || 'leaf')})`
      }}
    >
      {/* Dynamic Ambient Background Overlay to guarantee contrast and glassmorphic premium feel */}
      <div className="absolute inset-0 bg-black/50 z-0 pointer-events-none" />
      <AnimatePresence mode="wait">
        {showOnboarding === null ? (
          <motion.div
            key="onboarding-loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 bg-black"
          />
        ) : showOnboarding === true ? (
          <OnboardingView
            key="onboarding-flow"
            onComplete={handleCompleteOnboarding}
          />
        ) : view === 'home' ? (
          <motion.div
            key="home-layout"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col overflow-hidden h-full"
          >
            {/* Scrollable Content Area */}
            <div id="breathing-scroll-container" className="flex-1 overflow-y-auto pb-32 scroll-smooth">
              <div className="flex flex-col items-center w-full px-4 sm:px-0 max-w-[480px] mx-auto font-sans relative z-10">
                <AnimatePresence mode="wait">
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
                      soundscape={soundscape}
                      isAmbientSoundOn={isAmbientSoundOn}
                      setIsAmbientSoundOn={setIsAmbientSoundOn}
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
                        dailyReminderEnabled={dailyReminderEnabled}
                        dailyReminderTime={dailyReminderTime}
                        onToggleReminder={handleToggleReminder}
                        onUpdateTime={handleUpdateTime}
                      />
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
          </motion.div>
        ) : (
          <motion.div
            key={view}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 h-full w-full overflow-hidden"
          >
            {view === 'subscription' && (
              <SubscriptionView
                key="subscription"
                onBack={() => setView('home')}
              />
            )}
            {view === 'auth' && (
              <div className="h-full w-full overflow-y-auto">
                <AuthView
                  key="auth"
                  onBack={() => setView('home')}
                  onSuccess={() => setView('home')}
                />
              </div>
            )}
            {view === 'builder' && (
              <div className="h-full w-full overflow-y-auto">
                <CustomBuilder
                  key="builder"
                  onBack={() => setView('home')}
                  onSave={(ex) => { addExercise(ex); setView('home'); setActiveTab('library'); }}
                />
              </div>
            )}
            {view === 'setup' && selectedExercise && (
              <div className="h-full w-full overflow-y-auto">
                <SessionSetup
                  key="setup"
                  exercise={selectedExercise}
                  onBack={handleBack}
                  onConfirm={handleConfirmSetup}
                  soundscape={soundscape}
                />
              </div>
            )}
            {view === 'exercise' && selectedExercise && sessionConfig && (
              <div className="fixed inset-0 overflow-hidden z-[100] w-full h-[100dvh]">
                <ExerciseView
                  key="exercise"
                  exercise={selectedExercise}
                  config={sessionConfig}
                  onBack={() => setView('setup')}
                  onComplete={handleComplete}
                  onRecordSession={recordSession}
                  soundscape={soundscape}
                  isAmbientSoundOn={isAmbientSoundOn}
                  setIsAmbientSoundOn={setIsAmbientSoundOn}
                />
              </div>
            )}
            {view === 'complete' && selectedExercise && sessionResults && (
              <div className="h-full w-full overflow-y-auto">
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
            {view === 'details' && selectedExercise && (
              <div className="h-full w-full overflow-y-auto">
                <DetailsView
                  key="details"
                  exercise={selectedExercise}
                  onBack={handleBack}
                  onStart={() => setView('setup')}
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
