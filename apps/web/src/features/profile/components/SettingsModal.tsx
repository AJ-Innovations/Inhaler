import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, X } from "lucide-react";
import React from "react";

import { ProfileSettingsContent, SettingsType } from "./ProfileSettingsContent";

interface SettingsModalProps {
  activeSettings: SettingsType;
  setActiveSettings: (val: SettingsType) => void;
  dailyReminderEnabled: boolean;
  dailyReminderTime: string;
  dailyGoal: number;
  onToggleReminder?: (enabled: boolean) => void;
  onUpdateTime?: (time: string) => void;
  setDailyGoal: (val: number) => void;
}

export function SettingsModal({
  activeSettings,
  setActiveSettings,
  dailyReminderEnabled,
  dailyReminderTime,
  dailyGoal,
  onToggleReminder,
  onUpdateTime,
  setDailyGoal,
}: SettingsModalProps) {
  if (activeSettings === "none") return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 px-8 backdrop-blur-xl"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="relative w-full max-w-md space-y-8 rounded-[48px] border border-white/10 bg-black/60 p-10 shadow-2xl backdrop-blur-2xl"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setActiveSettings("none")}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white/40 transition-colors hover:text-white"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="space-y-1">
                <h3 className="text-2xl font-light tracking-tight text-white capitalize">
                  {activeSettings}
                </h3>
                <p className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase">
                  Configuration
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveSettings("none")}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white/40 transition-colors hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          <div className="min-h-[200px]">
            <ProfileSettingsContent
              activeSettings={activeSettings}
              dailyReminderEnabled={dailyReminderEnabled}
              dailyReminderTime={dailyReminderTime}
              dailyGoal={dailyGoal}
              onToggleReminder={onToggleReminder}
              onUpdateTime={onUpdateTime}
              setDailyGoal={setDailyGoal}
              setActiveSettings={setActiveSettings}
            />
          </div>

          <div className="border-t border-white/5 pt-4">
            <p className="text-center text-[9px] leading-relaxed font-medium tracking-[0.2em] text-white/40 uppercase">
              Preferences are applied instantly and saved to your device.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
