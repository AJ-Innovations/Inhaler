"use client";

import { SecureStorage } from "@libs/secureStorage";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { ScrollArea } from "../../../components/ScrollArea";
import { useLenis } from "lenis/react";

function ScrollReset({ activeTab }: { activeTab: string }) {
  const lenis = useLenis();
  useEffect(() => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    }
  }, [activeTab, lenis]);
  return null;
}

// Dynamically import heavy views for code splitting
const AchievementsView = dynamic(() =>
  import("@features/dashboard").then((m) => m.AchievementsView),
);
const JournalView = dynamic(() =>
  import("@features/journal").then((m) => m.JournalView),
);
const ProfileView = dynamic(() =>
  import("@features/profile").then((m) => m.ProfileView),
);
const SubscriptionView = dynamic(() =>
  import("@features/subscription").then((m) => m.SubscriptionView),
);

import {
  Exercise,
  exercises as predefinedExercises,
  getAmbientImage,
} from "../data";
import { useLibrary } from "../hooks/useCustomExercises";
import { useHashNavigation } from "../hooks/useHashNavigation";
import { useNotifications } from "../hooks/useNotifications";
import { usePWA } from "../hooks/usePWA";
import { useSoundscape } from "../hooks/useSoundscape";
import { BottomNav } from "./BottomNav";
import { SessionConfig } from "./SessionSetup";
import { SidebarNav } from "./SidebarNav";

// Dynamically import local heavy components
const CustomBuilder = dynamic(() =>
  import("./CustomBuilder").then((m) => m.CustomBuilder),
);
const DetailsView = dynamic(() =>
  import("./DetailsView").then((m) => m.DetailsView),
);
const ExerciseView = dynamic(() =>
  import("./ExerciseView").then((m) => m.ExerciseView),
);
const ExploreView = dynamic(() =>
  import("./ExploreView").then((m) => m.ExploreView),
);
const LibraryView = dynamic(() =>
  import("./LibraryView").then((m) => m.LibraryView),
);
const SessionComplete = dynamic(() =>
  import("./SessionComplete").then((m) => m.SessionComplete),
);
const SessionSetup = dynamic(() =>
  import("./SessionSetup").then((m) => m.SessionSetup),
);

interface BreathingDashboardProps {
  onLogin?: () => void;
  onLogout?: () => void;
  soundscape: any;
  isAmbientSoundOn: boolean;
  setIsAmbientSoundOn: (on: boolean) => void;
}

export function BreathingDashboard({
  onLogin,
  onLogout,
  soundscape,
  isAmbientSoundOn,
  setIsAmbientSoundOn,
}: BreathingDashboardProps) {
  // Use a custom hook to safely initialize state from sessionStorage only on the client
  const [isClient, setIsClient] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null,
  );

  // Extracted hooks
  const { view, setView, activeTab, setActiveTab } = useHashNavigation();

  useEffect(() => {
    setIsClient(true);
    const savedExerciseId = sessionStorage.getItem("spirox_dashboard_exercise");

    if (savedExerciseId) {
      const allExercises = [...predefinedExercises];
      const found = allExercises.find((e) => e.id === savedExerciseId);
      if (found) setSelectedExercise(found);
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      if (selectedExercise) {
        sessionStorage.setItem(
          "spirox_dashboard_exercise",
          selectedExercise.id,
        );
      } else {
        sessionStorage.removeItem("spirox_dashboard_exercise");
      }
    }
  }, [selectedExercise, isClient]);
  const [sessionConfig, setSessionConfig] = useState<SessionConfig | null>(
    null,
  );
  const [sessionResults, setSessionResults] = useState<{
    duration: number;
    cycles: number;
  } | null>(null);

  // Extracted hooks
  const { isInstallable, isInstalled, isIOS, handleInstallPWA } = usePWA();
  const {
    dailyReminderEnabled,
    dailyReminderTime,
    handleToggleReminder,
    handleUpdateTime,
  } = useNotifications();

  // Migrate existing plain-text localStorage to encrypted storage
  useEffect(() => {
    if (typeof window === "undefined") return;

    const MIGRATION_FLAG = "spirox_storage_migrated_v1";
    if (localStorage.getItem(MIGRATION_FLAG)) return;

    const keysToMigrate = [
      "spirox_custom_exercises",
      "spirox_favorites",
      "spirox_sessions",
      "spirox_custom_goals",
      "spirox_user_name",
      "spirox_user_avatar",
      "spirox_user_country",
    ];

    SecureStorage.migrateAll(keysToMigrate).then(() => {
      localStorage.setItem(MIGRATION_FLAG, "true");
    });
  }, []);

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
    clearAllData,
  } = useLibrary();

  // Pre-load speech synthesis voices
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () =>
        window.speechSynthesis.getVoices();
    }
  }, []);

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
    <div className="relative flex h-[100dvh] w-screen flex-col overflow-hidden bg-transparent text-white transition-all duration-1000 selection:bg-white">
      {/* Dynamic Ambient Background Overlay to guarantee contrast and glassmorphic premium feel */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-black/25" />
      <AnimatePresence mode="wait">
        {view === "home" ? (
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
            <ScrollArea className="flex-1 overflow-y-auto pb-32 md:pl-28">
              <ScrollReset activeTab={activeTab} />
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
                        onLogin={onLogin || (() => {})}
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
            </ScrollArea>
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
