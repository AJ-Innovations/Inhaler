"use client";

import { useAuthStore } from "@features/auth/store/useAuthStore";
import { verifyOfflinePremium } from "@libs/offlineAuth";
import { SecureStorage } from "@libs/secureStorage";
import { supabase } from "@libs/supabaseClient";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import React, { useCallback, useEffect, useState } from "react";

import { getAmbientImage } from "../data/ambientImages";
import { useAppFlow } from "../hooks/useAppFlow";
import { useSoundscape } from "../hooks/useSoundscape";

// Dynamically import heavy views for code splitting
const AuthView = dynamic(() =>
  import("@features/auth").then((m) => m.AuthView),
);
const OnboardingFlow = dynamic(() =>
  import("@features/onboarding").then((m) => m.OnboardingFlow),
);
const SubscriptionView = dynamic(() =>
  import("@features/subscription").then((m) => m.SubscriptionView),
);
const BreathingDashboard = dynamic(() =>
  import("./BreathingDashboard").then((m) => m.BreathingDashboard),
);
const StarterExercise = dynamic(() =>
  import("./StarterExercise").then((m) => m.StarterExercise),
);
const VersionView = dynamic(() =>
  import("./VersionView").then((m) => m.VersionView),
);

export function AppRouter() {
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isOfflineLocked, setIsOfflineLocked] = useState(false);
  const [isAmbientSoundOn, _setIsAmbientSoundOn] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      SecureStorage.getItem("spirox_is_ambient_sound_on").then((saved) => {
        if (saved !== null) {
          _setIsAmbientSoundOn(saved === "true");
        }
      });
    }
  }, []);

  const setIsAmbientSoundOn = useCallback(
    (val: boolean | ((prevState: boolean) => boolean)) => {
      _setIsAmbientSoundOn((prev) => {
        const newVal = typeof val === "function" ? val(prev) : val;
        if (typeof window !== "undefined") {
          SecureStorage.setItem(
            "spirox_is_ambient_sound_on",
            newVal.toString(),
          );
        }
        return newVal;
      });
    },
    [],
  );
  const { isAuthenticated, user, login, logout, setPremiumPlan } =
    useAuthStore();
  const {
    currentView,
    setCurrentView,
    finishVersion,
    finishStarter,
    finishPaywall,
    finishOnboarding,
  } = useAppFlow(isAuthLoading);

  const isStarted = currentView !== "loading";
  const soundscape = useSoundscape(isAmbientSoundOn);

  useEffect(() => {
    if (typeof window !== "undefined") {
      SecureStorage.getItem("spirox_active_ambient").then((savedAmbient) => {
        if (savedAmbient && savedAmbient !== "silent-focus") {
          soundscape.setActiveSoundscape(savedAmbient as any);
        } else {
          soundscape.setActiveSoundscape("nature-birds");
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (soundscape.activeSoundscape) {
      SecureStorage.setItem(
        "spirox_active_ambient",
        soundscape.activeSoundscape,
      );
    }
  }, [soundscape.activeSoundscape]);

  // ... rest of use effects ...
  useEffect(() => {
    if (!navigator.onLine) {
      // ...
      if (!isAuthenticated || !user) {
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
          supabase.auth
            .getUser()
            .then(({ data: { user }, error: userError }) => {
              if (
                userError &&
                (userError.status === 401 ||
                  userError.status === 403 ||
                  userError.status === 404 ||
                  userError.status === 400)
              ) {
                logout();
              } else if (!user && userError) {
                login({
                  id: session.user.id,
                  email: session.user.email || "",
                  name: session.user.user_metadata?.full_name,
                });
              } else if (user) {
                login({
                  id: user.id,
                  email: user.email || "",
                  name: user.user_metadata?.full_name,
                });
              } else {
                logout();
              }
              setIsAuthLoading(false);
            })
            .catch(() => {
              login({
                id: session.user.id,
                email: session.user.email || "",
                name: session.user.user_metadata?.full_name,
              });
              setIsAuthLoading(false);
            });
        } else {
          logout();
          setIsAuthLoading(false);
        }
      })
      .catch(() => {
        if (isAuthenticated && user) {
          setIsAuthLoading(false);
        } else {
          logout();
          setIsOfflineLocked(true);
          setIsAuthLoading(false);
        }
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
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

    return () => subscription.unsubscribe();
  }, [login, logout]);

  useEffect(() => {
    if (isAuthLoading) return;
    if (!isAuthenticated) {
      setPremiumPlan("free");
      return;
    }
    verifyOfflinePremium().then(setPremiumPlan);
  }, [isAuthenticated, isAuthLoading, setPremiumPlan]);

  if (isAuthLoading || currentView === "loading") {
    return (
      <div className="flex h-[100dvh] w-full items-center justify-center bg-black">
        <div className="h-8 w-8 animate-spin rounded-full border-t-2 border-white" />
      </div>
    );
  }

  if (isOfflineLocked) {
    return (
      <div className="flex h-[100dvh] w-full flex-col items-center justify-center bg-black p-8 text-center text-white">
        <h2 className="mb-4 text-3xl font-bold">Offline</h2>
        <p className="mb-8 max-w-sm text-gray-400">
          Please connect to the internet to log in.
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

  return (
    <div
      className="relative h-[100dvh] w-full overflow-hidden bg-black"
      style={{
        backgroundImage: `url(${getAmbientImage(soundscape.activeSoundscape || "silent-focus")})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 h-full w-full">
        <AnimatePresence mode="wait">
          {currentView === "version" && (
            <motion.div
              key="version"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full w-full"
            >
              <VersionView onComplete={finishVersion} />
            </motion.div>
          )}
          {currentView === "starter" && (
            <motion.div
              key="starter"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full w-full"
            >
              <StarterExercise onComplete={finishStarter} />
            </motion.div>
          )}
          {currentView === "paywall" && (
            <motion.div
              key="paywall"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full w-full"
            >
              <SubscriptionView
                onBack={finishPaywall}
                onPlanSelected={finishPaywall}
              />
            </motion.div>
          )}
          {currentView === "auth" && (
            <motion.div
              key="auth"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-[100dvh] w-full overflow-y-auto"
            >
              <AuthView onSuccess={() => {}} />
            </motion.div>
          )}
          {currentView === "onboarding" && (
            <motion.div
              key="onboarding"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full w-full"
            >
              <OnboardingFlow onComplete={finishOnboarding} />
            </motion.div>
          )}
          {currentView === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full w-full"
            >
              <BreathingDashboard
                onLogin={() => setCurrentView("auth")}
                soundscape={soundscape}
                isAmbientSoundOn={isAmbientSoundOn}
                setIsAmbientSoundOn={setIsAmbientSoundOn}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
