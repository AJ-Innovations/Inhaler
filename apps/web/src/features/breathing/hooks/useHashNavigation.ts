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
 * Synchronizes browser History API with React state for seamless
 * hardware back gestures without changing the visible URL.
 */
export function useHashNavigation(): UseHashNavigationReturn {
  const [view, setView] = useState<ViewType>("home");
  const [activeTab, setActiveTab] = useState<TabType>("explore");
  const isPopStateRef = useRef(false);

  // Synchronize browser history popstate with React state
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handlePopState = (event: PopStateEvent) => {
      isPopStateRef.current = true;
      const state = event.state;

      if (!state || !state.view) {
        setView("home");
        setActiveTab("explore");
        return;
      }

      const viewState = state.view;
      if (
        viewState === "explore" ||
        viewState === "library" ||
        viewState === "journal" ||
        viewState === "profile"
      ) {
        setView("home");
        setActiveTab(viewState as TabType);
      } else {
        setView(viewState as ViewType);
      }
    };

    // Set initial state on load without changing URL
    if (!window.history.state || !window.history.state.view) {
      window.history.replaceState(
        { view: "explore" },
        "",
        window.location.pathname,
      );
    } else {
      // If there's existing state (e.g. from refresh), load it
      handlePopState({ state: window.history.state } as PopStateEvent);
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Synchronize React state changes back to browser history
  useEffect(() => {
    if (typeof window === "undefined") return;

    const expectedState = view === "home" ? activeTab : view;

    if (isPopStateRef.current) {
      isPopStateRef.current = false;
      return;
    }

    const currentState = window.history.state?.view;
    if (currentState !== expectedState) {
      window.history.pushState(
        { view: expectedState },
        "",
        window.location.pathname,
      );
    }
  }, [view, activeTab]);

  return { view, setView, activeTab, setActiveTab };
}
