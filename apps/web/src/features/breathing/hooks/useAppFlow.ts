"use client";

import { useAuthStore } from "@features/auth/store/useAuthStore";
import { SecureStorage } from "@libs/secureStorage";
import { verifyOfflinePremium } from "@libs/offlineAuth";
import { useEffect, useState } from "react";

export type AppFlowView =
  | "loading"
  | "version"
  | "starter"
  | "paywall"
  | "auth"
  | "onboarding"
  | "home";

export function useAppFlow(isAuthSyncing: boolean) {
  const [currentView, setCurrentView] = useState<AppFlowView>("loading");
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthSyncing) return;

    async function determineFlow() {
      const hasCompletedOnboarding = await SecureStorage.getItem(
        "spirox_onboarding_completed",
      );
      const hasCompletedStarter = await SecureStorage.getItem(
        "spirox_starter_completed",
      );

      if (!isAuthenticated) {
        if (hasCompletedStarter === "true") {
          setCurrentView("auth");
        } else {
          setCurrentView("version");
        }
      } else {
        const hasSeenPaywall = await SecureStorage.getItem(
          "spirox_paywall_seen",
        );
        const plan = await verifyOfflinePremium();

        if (plan === "free" && hasSeenPaywall !== "true") {
          setCurrentView("paywall");
        } else if (hasCompletedOnboarding !== "true") {
          setCurrentView("onboarding");
        } else {
          setCurrentView("home");
        }
      }
    }

    determineFlow();
  }, [isAuthenticated, isAuthSyncing]);

  const finishVersion = () => {
    setCurrentView("starter");
  };

  const finishStarter = () => {
    SecureStorage.setItem("spirox_starter_completed", "true");
    setCurrentView("auth");
  };

  const finishPaywall = () => {
    SecureStorage.setItem("spirox_paywall_seen", "true");
    SecureStorage.getItem("spirox_onboarding_completed").then((done) => {
      if (done !== "true") setCurrentView("onboarding");
      else setCurrentView("home");
    });
  };

  const finishOnboarding = () => {
    SecureStorage.setItem("spirox_onboarding_completed", "true");
    setCurrentView("home");
  };

  return {
    currentView,
    setCurrentView,
    finishVersion,
    finishStarter,
    finishPaywall,
    finishOnboarding,
  };
}
