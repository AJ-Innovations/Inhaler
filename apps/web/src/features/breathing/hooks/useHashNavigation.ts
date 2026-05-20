"use client";

import { useEffect, useRef, useState } from "react";

import { TabType } from "../components/BottomNav";

export type ViewType =
  | "home"
  | "exercise"
  | "details"
  | "setup"
  | "complete"
  | "builder"
  | "subscription"
  | "auth";

interface UseHashNavigationReturn {
  view: ViewType;
  setView: (v: ViewType) => void;
  activeTab: TabType;
  setActiveTab: (t: TabType) => void;
}

/**
 * Synchronizes browser URL hash with React state for seamless
 * hardware back gestures and deep linking.
 * Extracted from breathing/index.tsx for separation of concerns.
 */
export function useHashNavigation(): UseHashNavigationReturn {
  const [view, setView] = useState<ViewType>("home");
  const [activeTab, setActiveTab] = useState<TabType>("explore");
  const isPopStateRef = useRef(false);
  const wasExploreRef = useRef(true);

  // Synchronize browser URL hash with React state for seamless hardware back gestures
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");

      if (!hash || hash === "explore") {
        isPopStateRef.current = true;
        setView("home");
        setActiveTab("explore");
      } else if (
        hash === "library" ||
        hash === "journal" ||
        hash === "profile"
      ) {
        isPopStateRef.current = true;
        setView("home");
        setActiveTab(hash as TabType);
      } else if (
        hash === "exercise" ||
        hash === "details" ||
        hash === "setup" ||
        hash === "complete" ||
        hash === "builder" ||
        hash === "subscription" ||
        hash === "auth"
      ) {
        isPopStateRef.current = true;
        setView(hash as ViewType);
      }
    };

    // Set initial explore hash on load if not present
    if (!window.location.hash) {
      window.location.replace("#explore");
      wasExploreRef.current = true;
    } else {
      handleHashChange();
    }

    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  // Synchronize React state changes back to browser URL hash
  useEffect(() => {
    if (typeof window === "undefined") return;

    const currentHash = window.location.hash.replace("#", "");
    const expectedHash = view === "home" ? activeTab : view;

    const isAtExplore = expectedHash === "explore";

    if (isPopStateRef.current) {
      isPopStateRef.current = false;
      wasExploreRef.current = isAtExplore;
      return;
    }

    if (currentHash !== expectedHash) {
      if (isAtExplore) {
        window.location.replace("#explore");
      } else {
        if (wasExploreRef.current) {
          window.location.hash = "#" + expectedHash;
        } else {
          window.location.replace("#" + expectedHash);
        }
      }
    }

    wasExploreRef.current = isAtExplore;
  }, [view, activeTab]);

  return { view, setView, activeTab, setActiveTab };
}
