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

  const {
    customExercises, favorites, sessions, stats, customGoals,
    toggleFavorite, deleteExercise, addExercise, recordSession, addCustomGoal, deleteCustomGoal,
    userName, userAvatar, updateUserName, updateAvatar, clearAllData
  } = useLibrary();

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
      <div className="flex-1 overflow-y-auto pt-12 pb-32 scroll-smooth">
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
                )}
                {activeTab === 'achievements' && (
                  <AchievementsView
                    key="achievements"
                    stats={stats}
                    customGoals={customGoals}
                    customExercises={customExercises}
                    onAddGoal={addCustomGoal}
                    onDeleteGoal={deleteCustomGoal}
                    onStart={handleStart}
                  />
                )}
                {activeTab === 'journal' && (
                  <JournalView
                    key="journal"
                    sessions={sessions}
                    stats={stats}
                  />
                )}
                {activeTab === 'profile' && (
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
                  />
                )}
              </motion.div>
            )}
            {view === 'subscription' && (
              <SubscriptionView
                key="subscription"
                onBack={() => setView('home')}
              />
            )}
            {view === 'auth' && (
              <AuthView
                key="auth"
                onBack={() => setView('home')}
                onSuccess={() => setView('home')}
              />
            )}
            {view === 'builder' && (
              <CustomBuilder
                key="builder"
                onBack={() => setView('home')}
                onSave={(ex) => { addExercise(ex); setView('home'); setActiveTab('library'); }}
              />
            )}
            {view === 'setup' && selectedExercise && (
              <SessionSetup
                key="setup"
                exercise={selectedExercise}
                onBack={handleBack}
                onConfirm={handleConfirmSetup}
              />
            )}
            {view === 'exercise' && selectedExercise && sessionConfig && (
              <ExerciseView
                key="exercise"
                exercise={selectedExercise}
                config={sessionConfig}
                onBack={() => setView('setup')}
                onComplete={handleComplete}
                onRecordSession={recordSession}
              />
            )}
            {view === 'complete' && selectedExercise && sessionResults && (
              <SessionComplete
                key="complete"
                exercise={selectedExercise}
                duration={sessionResults.duration}
                cycles={sessionResults.cycles}
                onHome={handleBack}
                onRestart={() => setView('exercise')}
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {view === 'details' && selectedExercise && (
              <DetailsView key="details" exercise={selectedExercise} onBack={handleBack} onStart={() => setView('setup')} />
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
