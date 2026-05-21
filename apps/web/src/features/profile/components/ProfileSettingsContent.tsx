import { motion } from "framer-motion";
import { Heart, Shield, Smartphone, Zap as ZapIcon } from "lucide-react";
import React from "react";

export type SettingsType =
  | "notifications"
  | "privacy"
  | "goal"
  | "about"
  | "none";

interface ProfileSettingsContentProps {
  activeSettings: SettingsType;
  dailyReminderEnabled: boolean;
  dailyReminderTime: string;
  dailyGoal: number;
  onToggleReminder?: (enabled: boolean) => void;
  onUpdateTime?: (time: string) => void;
  setDailyGoal: (goal: number) => void;
  setActiveSettings: (settings: SettingsType) => void;
}

export function ProfileSettingsContent({
  activeSettings,
  dailyReminderEnabled,
  dailyReminderTime,
  dailyGoal,
  onToggleReminder,
  onUpdateTime,
  setDailyGoal,
  setActiveSettings,
}: ProfileSettingsContentProps) {
  switch (activeSettings) {
    case "notifications":
      return (
        <div className="space-y-8">
          <div className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-sm font-light text-white">
                  Daily Reminder
                </span>
                <p className="text-[10px] font-bold tracking-widest text-white/40 uppercase">
                  {dailyReminderEnabled
                    ? `Active at ${dailyReminderTime}`
                    : "Disabled"}
                </p>
              </div>

              {/* Sleek iOS Switch */}
              <button
                onClick={() => onToggleReminder?.(!dailyReminderEnabled)}
                className={`flex h-6 w-12 items-center rounded-full px-1 transition-all duration-300 ${
                  dailyReminderEnabled ? "bg-white" : "bg-white/10"
                }`}
              >
                <motion.div
                  layout
                  className="h-4 w-4 rounded-full bg-black shadow-md"
                  animate={{ x: dailyReminderEnabled ? 20 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
            </div>

            {dailyReminderEnabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 border-t border-white/5 pt-4"
              >
                <label className="block text-[10px] font-black tracking-widest text-white/40 uppercase">
                  Reminder Time
                </label>

                {/* Styled Dark-Theme Input Time */}
                <div className="relative">
                  <input
                    type="time"
                    value={dailyReminderTime}
                    onChange={(e) => onUpdateTime?.(e.target.value)}
                    className="h-14 w-full cursor-pointer appearance-none rounded-2xl border border-white/10 bg-white/5 px-5 text-xl font-light text-white focus:border-white/20 focus:outline-none"
                  />
                </div>
              </motion.div>
            )}
          </div>

          <div className="space-y-4">
            <h4 className="px-2 text-[10px] font-bold tracking-widest text-white/50 uppercase">
              System Alerts
            </h4>
            <div className="space-y-3 rounded-3xl border border-white/5 bg-white/[0.02] p-6">
              <p className="text-xs font-light text-white/70">
                Push status:{" "}
                <span className="font-medium text-white">Active</span>
              </p>
              <p className="text-[10px] leading-relaxed font-bold tracking-wider text-white/40 uppercase">
                Enable system settings permissions to receive lock-screen alert
                popups.
              </p>
            </div>
          </div>
        </div>
      );
    case "privacy":
      return (
        <div className="space-y-6">
          <div className="flex items-center gap-4 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <Shield className="text-white" size={24} />
            <div>
              <h4 className="text-sm font-medium text-white">
                Local-First Storage
              </h4>
              <p className="text-xs text-white/50">
                Your data never leaves this device.
              </p>
            </div>
          </div>
          <div className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-light text-white">
                Biometric Lock
              </span>
              <div className="flex h-6 w-12 items-center rounded-full bg-white/10 px-1">
                <div className="h-4 w-4 rounded-full bg-white/30" />
              </div>
            </div>
            <p className="text-[10px] leading-relaxed font-bold tracking-widest text-white/40 uppercase">
              Secure your session history with FaceID or TouchID
            </p>
          </div>
        </div>
      );
    case "goal":
      return (
        <div className="space-y-12 py-6">
          <div className="space-y-3 text-center">
            <motion.div
              key={dailyGoal}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-block"
            >
              <span className="text-7xl font-light tracking-tighter text-white tabular-nums">
                {dailyGoal}
              </span>
            </motion.div>
            <p className="text-[10px] font-black tracking-[0.3em] text-white/50 uppercase">
              Minutes Per Day
            </p>
          </div>

          <div className="relative px-2">
            {/* Custom Track Background */}
            <div className="absolute top-1/2 right-2 left-2 h-1 -translate-y-1/2 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full bg-white"
                animate={{ width: `${((dailyGoal - 5) / (60 - 5)) * 100}%` }}
              />
            </div>

            {/* Actual Range Input (Hidden Thumb, transparent track) */}
            <input
              type="range"
              min="5"
              max="60"
              step="5"
              value={dailyGoal}
              onChange={(e) => setDailyGoal(parseInt(e.target.value))}
              className="relative z-10 h-10 w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-black [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-[0_0_20px_rgba(255,255,255,0.4)] [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:active:scale-125"
            />

            <div className="mt-4 flex justify-between px-1 text-[8px] font-black tracking-[0.2em] text-white/40 uppercase">
              <span>5m</span>
              <span className="text-white/20">30m</span>
              <span>60m</span>
            </div>
          </div>

          <button
            onClick={() => setActiveSettings("none")}
            className="mt-4 h-16 w-full rounded-[28px] bg-white text-[10px] font-black tracking-[0.3em] text-black uppercase transition-all hover:bg-white/90 active:scale-95"
          >
            Set New Goal
          </button>
        </div>
      );
    case "about":
      return (
        <div className="space-y-8">
          <div className="flex flex-col items-center gap-4">
            <div className="h-20 w-20 rounded-[28px] border border-white/10 bg-white/[0.04] p-0.5 shadow-2xl">
              <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-[26px] bg-transparent">
                <ZapIcon size={32} className="text-white" />
              </div>
            </div>
            <div className="text-center">
              <h4 className="text-xl font-light tracking-tight text-white">
                Spirox Premium
              </h4>
              <p className="mt-1 text-[10px] font-bold tracking-[0.3em] text-white/40 uppercase">
                Version 1.4.2
              </p>
            </div>
          </div>
          <div className="space-y-4 rounded-[32px] border border-white/10 bg-white/5 p-6">
            <div className="flex items-center gap-4">
              <Heart size={18} className="text-white/60" />
              <span className="text-sm font-light text-white/80">
                Made with love in California
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Smartphone size={18} className="text-white/60" />
              <span className="text-sm font-light text-white/80">
                Built for iOS & Android PWA
              </span>
            </div>
          </div>
        </div>
      );
    default:
      return null;
  }
}
