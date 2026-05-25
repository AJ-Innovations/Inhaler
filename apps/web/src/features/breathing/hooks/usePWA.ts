"use client";

import { useEffect, useState } from "react";

interface UsePWAReturn {
  isInstallable: boolean;
  isInstalled: boolean;
  isIOS: boolean;
  handleInstallPWA: () => Promise<void>;
}

/**
 * Manages PWA installation state, service worker registration, and platform detection.
 * Extracted from breathing/index.tsx for separation of concerns.
 */
export function usePWA(): UsePWAReturn {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  // Register service worker and capture PWA installers
  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Register cache-first advanced service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("Service Worker registered successfully:", reg.scope);
          // Proactively check for Service Worker updates
          reg.update();
        })
        .catch((err) =>
          console.error("Service Worker registration failed:", err),
        );

      // Listen for new service worker taking control and reload automatically to apply updates
      let refreshing = false;
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });
    }

    // 2. Detect Apple iOS Device
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isApple = /iphone|ipad|ipod/.test(userAgent);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsIOS(isApple);

    // 3. Detect if already running in standalone/installed mode
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone;
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

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    // Fallback: If it's iOS and not running in standalone, mark as installable (to show iOS tutorial modal)
    if (isApple && !isStandalone) {
      setIsInstallable(true);
    }

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallPWA = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User PWA Choice outcome: ${outcome}`);
    if (outcome === "accepted") {
      setIsInstalled(true);
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

  return { isInstallable, isInstalled, isIOS, handleInstallPWA };
}
