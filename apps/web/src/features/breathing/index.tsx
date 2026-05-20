"use client";

import { AuthView } from "@features/auth/AuthView";
import { AchievementsView } from "@features/dashboard/AchievementsView";
import { JournalView } from "@features/journal/JournalView";
import { OnboardingView } from "@features/onboarding/OnboardingView";
import { ProfileView } from "@features/profile/ProfileView";
import { SubscriptionView } from "@features/subscription/SubscriptionView";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";

import { BottomNav } from "./components/BottomNav";
import { SidebarNav } from "./components/SidebarNav";
import { Exercise, getAmbientImage } from "./data";
import { useLibrary } from "./hooks/useCustomExercises";
import { useHashNavigation } from "./hooks/useHashNavigation";
import { useNotifications } from "./hooks/useNotifications";
import { usePWA } from "./hooks/usePWA";
import { useSoundscape } from "./hooks/useSoundscape";
import { CustomBuilder } from "./views/CustomBuilder";
import { DetailsView } from "./views/DetailsView";
import { ExerciseView } from "./views/ExerciseView";
import { ExploreView } from "./views/ExploreView";
import { LibraryView } from "./views/LibraryView";
import { SessionComplete } from "./views/SessionComplete";
import { SessionConfig, SessionSetup } from "./views/SessionSetup";

export function BreathingExercise() {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null,
  );
  const [sessionConfig, setSessionConfig] = useState<SessionConfig | null>(
    null,
  );
  const [sessionResults, setSessionResults] = useState<{
    duration: number;
    cycles: number;
  } | null>(null);
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);

  // Global Soundscape Controller
  const [isAmbientSoundOn, setIsAmbientSoundOn] = useState(false);
  const soundscape = useSoundscape(isAmbientSoundOn);

  // Extracted hooks
  const { view, setView, activeTab, setActiveTab } = useHashNavigation();
  const { isInstallable, isInstalled, isIOS, handleInstallPWA } = usePWA();
  const {
    dailyReminderEnabled,
    dailyReminderTime,
    handleToggleReminder,
    handleUpdateTime,
  } = useNotifications();

  const {
    customExercises,
    favorites,
    sessions,
    stats,
    customGoals,
    toggleFavorite,
    deleteExercise,
    addExercise,
    recordSession,
    addCustomGoal,
    deleteCustomGoal,
    userName,
    userAvatar,
    updateUserName,
    updateAvatar,
    updateUserCountry,
    clearAllData,
  } = useLibrary();

  // Persistence of selected ambient
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedAmbient = localStorage.getItem("spirox_active_ambient");
      if (savedAmbient && savedAmbient !== "leaf") {
        soundscape.setActiveSoundscape(savedAmbient as any);
      }
    }
  }, []);

  useEffect(() => {
    if (soundscape.activeSoundscape) {
      localStorage.setItem(
        "spirox_active_ambient",
        soundscape.activeSoundscape,
      );
    }
  }, [soundscape.activeSoundscape]);

  // Load onboarding state from LocalStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const completed =
        localStorage.getItem("spirox_onboarding_completed") === "true";
      setShowOnboarding(!completed);
    } else {
      setShowOnboarding(false);
    }
  }, []);

  // Pre-load speech synthesis voices
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () =>
        window.speechSynthesis.getVoices();
    }
  }, []);

  const handleCompleteOnboarding = (planId: string, name?: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("spirox_onboarding_completed", "true");
      localStorage.setItem("spirox_active_plan", planId);
      if (name) {
        updateUserName(name);
      }
      const savedCountry = localStorage.getItem("spirox_user_country");
      if (savedCountry) {
        updateUserCountry(savedCountry);
      }
    }
    setShowOnboarding(false);
    setView("home");
  };

  const handleStart = (ex: Exercise) => {
    setSelectedExercise(ex);
    setView("setup");
  };

  const handleConfirmSetup = (config: SessionConfig) => {
    setSessionConfig(config);
    setView("exercise");
  };

  const handleComplete = (duration: number, cycles: number) => {
    setSessionResults({ duration, cycles });
    setView("complete");
  };

  const handleDetails = (ex: Exercise) => {
    setSelectedExercise(ex);
    setView("details");
  };

  const handleBack = () => {
    setView("home");
    if (typeof window !== "undefined") window.speechSynthesis.cancel();
  };

  return (
    <div
      className="relative flex h-[100dvh] w-screen flex-col overflow-hidden bg-black bg-cover bg-center bg-no-repeat text-white transition-all duration-1000 selection:bg-white"
      style={{
        backgroundImage: `url(${getAmbientImage(soundscape.activeSoundscape || "leaf")})`,
      }}
    >
      {/* Dynamic Ambient Background Overlay to guarantee contrast and glassmorphic premium feel */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-black/25" />
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
        ) : view === "home" ? (
          <motion.div
            key="home-layout"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex h-full flex-1 flex-col overflow-hidden md:flex-row"
          >
            {/* Sidebar Navigation for Desktop and Large Screens */}
            <SidebarNav activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Scrollable Content Area */}
            <div
              id="breathing-scroll-container"
              className="flex-1 overflow-y-auto scroll-smooth pb-32 md:pl-28"
            >
              <div className="relative z-10 mx-auto flex w-full max-w-[480px] flex-col items-center px-4 pt-6 font-sans sm:px-0 md:max-w-[1000px] md:px-8 lg:max-w-[1200px]">
                <AnimatePresence mode="wait">
                  {activeTab === "explore" && (
                    <ExploreView
                      key="explore"
                      onStart={handleStart}
                      onDetails={handleDetails}
                      customExercises={customExercises}
                      favorites={favorites}
                      onToggleFavorite={toggleFavorite}
                      stats={stats}
                      userAvatar={userAvatar}
                      onProfileClick={() => setActiveTab("profile")}
                      soundscape={soundscape}
                      isAmbientSoundOn={isAmbientSoundOn}
                      setIsAmbientSoundOn={setIsAmbientSoundOn}
                    />
                  )}
                  {activeTab === "library" && (
                    <div className="w-full pt-12">
                      <LibraryView
                        key="library"
                        onStart={handleStart}
                        onDetails={handleDetails}
                        customExercises={customExercises}
                        favorites={favorites}
                        onToggleFavorite={toggleFavorite}
                        onDeleteCustom={deleteExercise}
                        onCreate={() => setView("builder")}
                      />
                    </div>
                  )}
                  {activeTab === "achievements" && (
                    <div className="w-full pt-12">
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
                  {activeTab === "journal" && (
                    <div className="w-full pt-12">
                      <JournalView
                        key="journal"
                        sessions={sessions}
                        stats={stats}
                      />
                    </div>
                  )}
                  {activeTab === "profile" && (
                    <div className="w-full pt-12">
                      <ProfileView
                        key="profile"
                        stats={stats}
                        userName={userName}
                        userAvatar={userAvatar}
                        onUpdateName={updateUserName}
                        onUpdateAvatar={updateAvatar}
                        onResetData={clearAllData}
                        onUpgrade={() => setView("subscription")}
                        onLogin={() => setView("auth")}
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
            className="h-full w-full flex-1 overflow-hidden"
          >
            {view === "subscription" && (
              <SubscriptionView
                key="subscription"
                onBack={() => setView("home")}
              />
            )}
            {view === "auth" && (
              <div className="h-full w-full overflow-y-auto">
                <AuthView
                  key="auth"
                  onBack={() => setView("home")}
                  onSuccess={() => setView("home")}
                />
              </div>
            )}
            {view === "builder" && (
              <div className="h-full w-full overflow-y-auto">
                <CustomBuilder
                  key="builder"
                  onBack={() => setView("home")}
                  onSave={(ex) => {
                    addExercise(ex);
                    setView("home");
                    setActiveTab("library");
                  }}
                />
              </div>
            )}
            {view === "setup" && selectedExercise && (
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
            {view === "exercise" && selectedExercise && sessionConfig && (
              <div className="fixed inset-0 z-[100] h-[100dvh] w-full overflow-hidden">
                <ExerciseView
                  key="exercise"
                  exercise={selectedExercise}
                  config={sessionConfig}
                  onBack={() => setView("setup")}
                  onComplete={handleComplete}
                  onRecordSession={recordSession}
                  soundscape={soundscape}
                  isAmbientSoundOn={isAmbientSoundOn}
                  setIsAmbientSoundOn={setIsAmbientSoundOn}
                />
              </div>
            )}
            {view === "complete" && selectedExercise && sessionResults && (
              <div className="h-full w-full overflow-y-auto">
                <SessionComplete
                  key="complete"
                  exercise={selectedExercise}
                  duration={sessionResults.duration}
                  cycles={sessionResults.cycles}
                  onHome={handleBack}
                  onRestart={() => setView("exercise")}
                />
              </div>
            )}
            {view === "details" && selectedExercise && (
              <div className="h-full w-full overflow-y-auto">
                <DetailsView
                  key="details"
                  exercise={selectedExercise}
                  onBack={handleBack}
                  onStart={() => setView("setup")}
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
