"use client";

import { useEffect, useState } from "react";
import { SecureStorage } from "@libs/secureStorage";

interface UseNotificationsReturn {
  dailyReminderEnabled: boolean;
  dailyReminderTime: string;
  handleToggleReminder: (enabled: boolean) => Promise<void>;
  handleUpdateTime: (time: string) => void;
  triggerNotification: (title: string, body: string) => Promise<void>;
}

/**
 * Manages push notification permissions, daily reminder scheduling,
 * and reminder persistence via localStorage.
 * Extracted from breathing/index.tsx for separation of concerns.
 */
export function useNotifications(): UseNotificationsReturn {
  const [dailyReminderEnabled, setDailyReminderEnabled] = useState(false);
  const [dailyReminderTime, setDailyReminderTime] = useState("08:30");

  // Load reminder settings from LocalStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      SecureStorage.getItem("spirox_daily_reminder_enabled").then((enabled) => {
        setDailyReminderEnabled(enabled === "true");
      });
      SecureStorage.getItem("spirox_daily_reminder_time").then((time) => {
        setDailyReminderTime(time || "08:30");
      });
    }
  }, []);

  const triggerNotification = async (title: string, body: string) => {
    if (!("Notification" in window)) return;
    if (Notification.permission === "granted") {
      if ("serviceWorker" in navigator) {
        const reg = await navigator.serviceWorker.ready;
        reg.showNotification(title, {
          body,
          icon: "/icon-192.png",
          badge: "/icon-192.png",
          vibrate: [100, 50, 100],
        } as any);
      } else {
        new Notification(title, { body, icon: "/icon-192.png" });
      }
    }
  };

  const handleToggleReminder = async (enabled: boolean) => {
    if (enabled) {
      if ("Notification" in window) {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          setDailyReminderEnabled(true);
          SecureStorage.setItem("spirox_daily_reminder_enabled", "true");
          triggerNotification(
            "Reminders Enabled! 🧘",
            "You will be notified daily at your scheduled breathing time.",
          );
        } else {
          alert(
            "Notification permission is required to enable daily reminders.",
          );
          setDailyReminderEnabled(false);
          SecureStorage.setItem("spirox_daily_reminder_enabled", "false");
        }
      } else {
        alert("Notifications are not supported in this browser.");
      }
    } else {
      setDailyReminderEnabled(false);
      SecureStorage.setItem("spirox_daily_reminder_enabled", "false");
    }
  };

  const handleUpdateTime = (time: string) => {
    setDailyReminderTime(time);
    SecureStorage.setItem("spirox_daily_reminder_time", time);
  };

  // Scheduled Reminder Background Checker (Runs every 30s)
  useEffect(() => {
    if (!dailyReminderEnabled) return;

    let lastNotifiedDate = "";

    const checkTimeAndNotify = () => {
      const now = new Date();
      const currentHourMin = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      const todayStr = now.toDateString();

      if (
        currentHourMin === dailyReminderTime &&
        lastNotifiedDate !== todayStr
      ) {
        lastNotifiedDate = todayStr;
        triggerNotification(
          "Mindfulness Time! 🧘",
          "It is time for your scheduled breathing exercise. Take a minute to center yourself.",
        );
      }
    };

    checkTimeAndNotify();
    const interval = setInterval(checkTimeAndNotify, 30000);
    return () => clearInterval(interval);
  }, [dailyReminderEnabled, dailyReminderTime]);

  return {
    dailyReminderEnabled,
    dailyReminderTime,
    handleToggleReminder,
    handleUpdateTime,
    triggerNotification,
  };
}
