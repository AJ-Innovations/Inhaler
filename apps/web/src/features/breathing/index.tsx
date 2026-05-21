"use client";

import { supabase } from "@libs/supabaseClient";
import { verifyOfflinePremium } from "@libs/offlineAuth";
import { SecureStorage } from "@libs/secureStorage";
import { AuthView } from "@features/auth/AuthView";
import { useAuthStore } from "@features/auth/store/useAuthStore";
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
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isOfflineLocked, setIsOfflineLocked] = useState(false);

  // Global Soundscape Controller
  const [isAmbientSoundOn, setIsAmbientSoundOn] = useState(false);
  const soundscape = useSoundscape(isAmbientSoundOn);

  // Extracted hooks
  const { view, setView, activeTab, setActiveTab } = useHashNavigation();
  const { isAuthenticated, user, login, logout, setPremiumPlan } =
    useAuthStore();
  const { isInstallable, isInstalled, isIOS, handleInstallPWA } = usePWA();
  const {
    dailyReminderEnabled,
    dailyReminderTime,
    handleToggleReminder,
    handleUpdateTime,
  } = useNotifications();

  // Sync Supabase Auth with Zustand Store
  useEffect(() => {
    // If we are offline, do NOT call Supabase because it will trigger a network fetch and crash.
    // Trust local state (whether they are logged in or out).
    if (!navigator.onLine) {
      if (isAuthenticated && user) {
        // They have local data, trust it
      } else {
        // They are offline and have no local data, treat as logged out
        logout();
        setIsOfflineLocked(true);
      }
      setIsAuthLoading(false);
      return;
    }

    supabase.auth
      .getSession()
      .then(({ data: { session }, error }) => {
        if (session?.user) {
          if (navigator.onLine) {
            // STRICT CHECK: Ask the backend if the user still exists
            supabase.auth
              .getUser()
              .then(({ data: { user }, error: userError }) => {
                if (userError) {
                  // Only log out if it's explicitly an auth rejection (banned, deleted, invalid)
                  if (
                    userError.status === 401 ||
                    userError.status === 403 ||
                    userError.status === 404 ||
                    userError.status === 400
                  ) {
                    console.warn(
                      "User strictly rejected by backend:",
                      userError.message,
                    );
                    logout();
                  } else {
                    // Network error or timeout: trust the local session
                    console.warn(
                      "Network error during strict check, trusting local session:",
                      userError.message,
                    );
                    login({
                      id: session.user.id,
                      email: session.user.email || "",
                      name: session.user.user_metadata?.full_name,
                    });
                  }
                } else if (!user) {
                  logout();
                } else {
                  login({
                    id: user.id,
                    email: user.email || "",
                    name: user.user_metadata?.full_name,
                  });
                }
                setIsAuthLoading(false);
              })
              .catch((err) => {
                console.warn(
                  "Unhandled exception in strict auth check, trusting local session:",
                  err,
                );
                login({
                  id: session.user.id,
                  email: session.user.email || "",
                  name: session.user.user_metadata?.full_name,
                });
                setIsAuthLoading(false);
              });
          } else {
            // OFFLINE: Trust the local session
            login({
              id: session.user.id,
              email: session.user.email || "",
              name: session.user.user_metadata?.full_name,
            });
            setIsAuthLoading(false);
          }
        } else if (!error) {
          logout();
          setIsAuthLoading(false);
        } else {
          setIsAuthLoading(false);
        }
      })
      .catch((err) => {
        console.warn(
          "getSession fetch failed, trusting offline state if available:",
          err,
        );
        if (isAuthenticated && user) {
          setIsAuthLoading(false);
        } else {
          logout();
          setIsAuthLoading(false);
        }
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      // Ignore auth state changes if we are offline (prevents forced logouts on failed refresh)
      if (!navigator.onLine) return;

      if (session?.user) {
        login({
          id: session.user.id,
          email: session.user.email || "",
          name: session.user.user_metadata?.full_name,
        });
      } else if (event === "SIGNED_OUT") {
        logout();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [login, logout]);

  // Offline Premium Verification — runs after auth sync
  useEffect(() => {
    if (isAuthLoading) return;
    if (!isAuthenticated) {
      setPremiumPlan("free");
      return;
    }

    verifyOfflinePremium().then((plan) => {
      setPremiumPlan(plan);
    });
  }, [isAuthenticated, isAuthLoading, setPremiumPlan]);

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

  // Global Auth Guard: if not authenticated, force view to auth
  useEffect(() => {
    if (
      !isAuthLoading &&
      !isAuthenticated &&
      view !== "auth" &&
      !showOnboarding
    ) {
      setView("auth");
    }
  }, [isAuthenticated, view, showOnboarding, setView, isAuthLoading]);

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
      SecureStorage.getItem("spirox_active_ambient").then((savedAmbient) => {
        if (savedAmbient && savedAmbient !== "leaf") {
          soundscape.setActiveSoundscape(savedAmbient as any);
        }
      });
    }
  }, []);

  useEffect(() => {
    if (soundscape.activeSoundscape) {
      SecureStorage.setItem(
        "spirox_active_ambient",
        soundscape.activeSoundscape,
      );
    }
  }, [soundscape.activeSoundscape]);

  // Load onboarding state from LocalStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      SecureStorage.getItem("spirox_onboarding_completed").then((completed) => {
        setShowOnboarding(completed !== "true");
      });
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

  if (isAuthLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <div className="h-8 w-8 animate-spin rounded-full border-t-2 border-white" />
      </div>
    );
  }

  if (isOfflineLocked) {
    return (
      <div className="flex h-[100dvh] w-full flex-col items-center justify-center bg-black p-8 text-center text-white">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-500/20 text-red-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="1" y1="1" x2="23" y2="23"></line>
            <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"></path>
            <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"></path>
            <path d="M10.71 5.05A16 16 0 0 1 22.58 9"></path>
            <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"></path>
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
            <line x1="12" y1="20" x2="12.01" y2="20"></line>
          </svg>
        </div>
        <h2 className="mb-4 text-3xl font-bold">Offline</h2>
        <p className="mb-8 max-w-sm text-gray-400">
          You are currently offline and don't have a secure session saved on
          this device. Please connect to the internet to log in and unlock the
          app.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-xl bg-white px-8 py-3 font-semibold text-black transition-transform hover:scale-105 active:scale-95"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  const handleCompleteOnboarding = (planId: string, name?: string) => {
    if (typeof window !== "undefined") {
      SecureStorage.setItem("spirox_onboarding_completed", "true");
      SecureStorage.setItem("spirox_active_plan", planId);
      if (name) {
        updateUserName(name);
      }
      SecureStorage.getItem("spirox_user_country").then((savedCountry) => {
        if (savedCountry) {
          updateUserCountry(savedCountry);
        }
      });
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
                <AuthView key="auth" onSuccess={() => setView("home")} />
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
