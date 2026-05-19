"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  Camera,
  Check,
  ChevronLeft,
  ChevronRight,
  Crown,
  Edit2,
  ExternalLink,
  Heart,
  Image as ImageIcon,
  Info,
  Mail,
  Shield,
  Smartphone,
  Sparkles,
  Target,
  Trash2,
  Trophy,
  Upload,
  UserRound,
  X,
  Zap as ZapIcon,
} from "lucide-react";
import React, { useRef, useState } from "react";

interface ProfileViewProps {
  stats: {
    totalMinutes: number;
    sessionCount: number;
    streak: number;
  };
  userName: string;
  userAvatar: string | null;
  onUpdateName: (name: string) => void;
  onUpdateAvatar: (avatar: string | null) => void;
  onResetData: () => void;
  onUpgrade: () => void;
  onLogin: () => void;
  isInstallable?: boolean;
  isIOS?: boolean;
  onInstallPWA?: () => void;
  dailyReminderEnabled?: boolean;
  dailyReminderTime?: string;
  onToggleReminder?: (enabled: boolean) => void;
  onUpdateTime?: (time: string) => void;
}

type SettingsType = "notifications" | "privacy" | "goal" | "about" | "none";

export function ProfileView({
  stats,
  userName,
  userAvatar,
  onUpdateName,
  onUpdateAvatar,
  onResetData,
  onUpgrade,
  onLogin,
  isInstallable = false,
  isIOS = false,
  onInstallPWA,
  dailyReminderEnabled = false,
  dailyReminderTime = "08:30",
  onToggleReminder,
  onUpdateTime,
}: ProfileViewProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [isSelectingAvatar, setIsSelectingAvatar] = useState(false);
  const [tempName, setTempName] = useState(userName);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [activeSettings, setActiveSettings] = useState<SettingsType>("none");
  const [dailyGoal, setDailyGoal] = useState(15);
  const [showIOSPrompt, setShowIOSPrompt] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInstallClick = () => {
    if (isIOS) {
      setShowIOSPrompt(true);
    } else if (onInstallPWA) {
      onInstallPWA();
    }
  };

  const handleSaveName = () => {
    if (tempName.trim()) {
      onUpdateName(tempName);
      setIsEditingName(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("Image is too large. Please select an image under 1MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const size = Math.min(img.width, img.height, 800);
        canvas.width = size;
        canvas.height = size;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const sourceSize = Math.min(img.width, img.height);
        const sourceX = (img.width - sourceSize) / 2;
        const sourceY = (img.height - sourceSize) / 2;

        ctx.drawImage(
          img,
          sourceX,
          sourceY,
          sourceSize,
          sourceSize,
          0,
          0,
          size,
          size,
        );

        let quality = 0.85;
        let base64 = canvas.toDataURL("image/jpeg", quality);

        while (base64.length * 0.75 > 500000 && quality > 0.1) {
          quality -= 0.1;
          base64 = canvas.toDataURL("image/jpeg", quality);
        }

        onUpdateAvatar(base64);
        setIsSelectingAvatar(false);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const suggestedAvatars = [
    { id: "zen_stones", path: "/avatars/zen_stones.png", label: "Zen" },
    { id: "lotus", path: "/avatars/lotus.png", label: "Lotus" },
    { id: "aurora", path: "/avatars/aurora.png", label: "Aurora" },
    { id: "meditator", path: "/avatars/meditator.png", label: "Peace" },
    { id: "paper_crane", path: "/avatars/paper_crane.png", label: "Hope" },
  ];

  const menuGroups = [
    {
      title: "Preferences",
      items: [
        {
          id: "notifications" as SettingsType,
          icon: Bell,
          label: "Notifications",
          value: dailyReminderEnabled ? dailyReminderTime : "Off",
        },
        {
          id: "privacy" as SettingsType,
          icon: Shield,
          label: "Privacy & Health",
          value: "Connected",
        },
        {
          id: "goal" as SettingsType,
          icon: Target,
          label: "Daily Goal",
          value: `${dailyGoal} Minutes`,
        },
      ],
    },
    {
      title: "Support",
      items: [
        {
          id: "about" as SettingsType,
          icon: Info,
          label: "About Spirox",
          value: "v1.4.2",
        },
        {
          id: "none" as SettingsType,
          icon: ExternalLink,
          label: "Resource Center",
          isExternal: true,
        },
      ],
    },
  ];

  const renderSettingsContent = () => {
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
                  Enable system settings permissions to receive lock-screen
                  alert popups.
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
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="w-95 space-y-10 pb-10"
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileUpload}
      />

      {/* Profile Header */}
      <div className="flex flex-col items-center pt-4">
        <div className="group relative">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative mb-6 h-40 w-40 cursor-pointer overflow-hidden rounded-full bg-white/[0.04] p-1 shadow-2xl"
            onClick={() => setIsSelectingAvatar(true)}
          >
            <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full border border-white/10 bg-transparent">
              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt="Avatar"
                  className="h-full w-full object-cover"
                />
              ) : (
                <UserRound
                  size={80}
                  strokeWidth={1}
                  className="text-white/20"
                />
              )}

              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                <Camera size={32} className="mb-1 text-white" />
                <span className="text-[10px] font-black tracking-widest text-white uppercase">
                  Update Image
                </span>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-0 rounded-full bg-white/5 opacity-50 blur-3xl" />
          </motion.div>

          <button
            className="absolute right-1 bottom-8 z-20 flex h-10 w-10 items-center justify-center rounded-full border-4 border-black bg-white text-black shadow-lg transition-all hover:scale-110 active:scale-95"
            onClick={() => setIsEditingName(true)}
          >
            <Edit2 size={16} />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {isEditingName ? (
            <motion.div
              key="edit"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mt-2 flex items-center gap-2"
            >
              <input
                autoFocus
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
                className="w-56 rounded-2xl border border-white/20 bg-white/5 px-4 py-2 text-center text-2xl font-light text-white focus:border-white/40 focus:outline-none"
              />
              <button
                onClick={handleSaveName}
                className="rounded-2xl bg-white p-3 text-black"
              >
                <Check size={20} />
              </button>
              <button
                onClick={() => {
                  setIsEditingName(false);
                  setTempName(userName);
                }}
                className="rounded-2xl bg-white/5 p-3 text-white/40"
              >
                <X size={20} />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="display"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center"
            >
              <h2 className="text-3xl font-light tracking-tight text-white">
                {userName}
              </h2>
              <div className="mt-2 flex items-center justify-center gap-2">
                <Sparkles size={12} className="text-white/60" />
                <p className="text-[10px] font-bold tracking-[0.3em] text-white/40 uppercase">
                  Zen Practitioner • Elite Tier
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Avatar Selection Modal */}
      <AnimatePresence>
        {isSelectingAvatar && (
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
                <div className="space-y-1">
                  <h3 className="text-2xl font-light tracking-tight text-white">
                    Identity
                  </h3>
                  <p className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase">
                    Choose your symbol
                  </p>
                </div>
                <button
                  onClick={() => setIsSelectingAvatar(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white/40 transition-colors hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="group flex flex-1 items-center justify-center gap-3 rounded-[24px] border border-white/10 bg-white/[0.04] py-5 text-white transition-all hover:bg-white/[0.08]"
                >
                  <Upload
                    size={18}
                    className="transition-transform group-hover:-translate-y-1"
                  />
                  <span className="text-[10px] font-black tracking-widest uppercase">
                    Gallery
                  </span>
                </button>
                <button
                  onClick={() => {
                    onUpdateAvatar(null);
                    setIsSelectingAvatar(false);
                  }}
                  className="flex flex-1 items-center justify-center gap-3 rounded-[24px] border border-white/10 bg-white/5 py-5 text-white/40 transition-all hover:bg-white/10"
                >
                  <ImageIcon size={18} />
                  <span className="text-[10px] font-black tracking-widest uppercase">
                    Default
                  </span>
                </button>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-2">
                {suggestedAvatars.map((avatar) => (
                  <div
                    key={avatar.id}
                    className="flex flex-col items-center gap-3"
                  >
                    <button
                      onClick={() => {
                        onUpdateAvatar(avatar.path);
                        setIsSelectingAvatar(false);
                      }}
                      className={`relative aspect-square w-full overflow-hidden rounded-[24px] border-2 transition-all ${userAvatar === avatar.path ? "scale-105 border-white shadow-[0_0_30px_rgba(255,255,255,0.1)]" : "border-white/5 opacity-40 hover:opacity-100"}`}
                    >
                      <img
                        src={avatar.path}
                        alt={avatar.label}
                        className="h-full w-full object-cover"
                      />
                      {userAvatar === avatar.path && (
                        <div className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-white">
                          <Check
                            size={10}
                            className="text-black"
                            strokeWidth={4}
                          />
                        </div>
                      )}
                    </button>
                    <span
                      className={`text-[8px] font-black tracking-widest uppercase ${userAvatar === avatar.path ? "text-white" : "text-white/40"}`}
                    >
                      {avatar.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/5 pt-4">
                <p className="text-center text-[9px] leading-relaxed font-medium tracking-[0.2em] text-white/40 uppercase">
                  Your identity is stored locally on your device for maximum
                  privacy.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Modal (Universal) */}
      <AnimatePresence>
        {activeSettings !== "none" && (
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

              <div className="min-h-[200px]">{renderSettingsContent()}</div>

              <div className="border-t border-white/5 pt-4">
                <p className="text-center text-[9px] leading-relaxed font-medium tracking-[0.2em] text-white/40 uppercase">
                  Preferences are applied instantly and saved to your device.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Account Section */}
      <div className="mt-12 space-y-4">
        <h3 className="px-1 text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase">
          Account
        </h3>
        <div className="group relative overflow-hidden rounded-[42px] border border-white/[0.06] bg-white/[0.02] shadow-2xl backdrop-blur-md">
          {/* iOS Style Inner Glow */}
          <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-white opacity-0 blur-[100px] transition-opacity duration-1000 group-hover:opacity-[0.03]" />
          <button
            onClick={onLogin}
            className="group/item relative z-10 flex w-full items-center justify-between px-8 py-6 transition-all hover:bg-white/[0.03]"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] transition-transform group-hover/item:scale-110">
                <Mail size={18} className="text-white" />
              </div>
              <div className="text-left">
                <span className="block text-sm font-light text-white">
                  Sign In or Create Account
                </span>
                <span className="mt-0.5 block text-[10px] font-medium tracking-widest text-white/40 uppercase">
                  Access cloud sync
                </span>
              </div>
            </div>
            <ChevronRight
              size={14}
              className="text-white/40 transition-transform group-hover/item:translate-x-1"
            />
          </button>
        </div>
      </div>

      {/* Premium Upgrade Card */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onUpgrade}
        className="group relative mt-8 w-full overflow-hidden rounded-[36px] border border-white/[0.06] bg-white/[0.02] p-6 text-left backdrop-blur-md"
      >
        {/* iOS Style Inner Glow */}
        <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-white opacity-0 blur-[100px] transition-opacity duration-1000 group-hover:opacity-[0.03]" />
        <div className="absolute top-0 right-0 p-4 opacity-20 transition-opacity group-hover:opacity-40">
          <Crown size={40} className="text-white" />
        </div>
        <div className="relative z-10 flex flex-col items-start space-y-2">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-white px-2 py-0.5 text-[8px] font-black tracking-tighter text-black uppercase">
              Premium
            </span>
            <h4 className="text-lg font-light tracking-tight text-white">
              Unlock Everything
            </h4>
          </div>
          <p className="max-w-[200px] text-xs font-light text-white/50">
            Get all premium routines, custom builders, and cloud sync.
          </p>
          <div className="flex items-center gap-2 pt-2 text-white">
            <span className="text-[10px] font-black tracking-widest uppercase">
              Upgrade Now
            </span>
            <ChevronRight size={14} />
          </div>
        </div>
      </motion.button>

      {/* PWA Install Button */}
      {isInstallable && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleInstallClick}
          className="group relative mt-6 w-full overflow-hidden rounded-[36px] border border-white/[0.06] bg-white/[0.02] p-6 text-left backdrop-blur-md"
        >
          {/* iOS Style Inner Glow */}
          <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-white opacity-0 blur-[100px] transition-opacity duration-1000 group-hover:opacity-[0.03]" />
          <div className="absolute top-0 right-0 p-4 opacity-20 transition-opacity group-hover:opacity-40">
            <Smartphone size={40} className="text-white" />
          </div>
          <div className="relative z-10 flex flex-col items-start space-y-2">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-white px-2 py-0.5 text-[8px] font-black tracking-tighter text-black uppercase">
                Fast Access
              </span>
              <h4 className="text-lg font-light tracking-tight text-white">
                Install Spirox App
              </h4>
            </div>
            <p className="max-w-[240px] text-xs font-light text-white/50">
              Add Spirox to your home screen for quick offline access, premium
              performance, and immersive sessions.
            </p>
            <div className="flex items-center gap-2 pt-2 text-white">
              <span className="text-[10px] font-black tracking-widest uppercase">
                Install Now
              </span>
              <ChevronRight size={14} />
            </div>
          </div>
        </motion.button>
      )}

      {/* Stats Section */}
      <div className="group relative w-full overflow-hidden rounded-[42px] border border-white/[0.06] bg-white/[0.02] p-8 shadow-2xl backdrop-blur-md">
        {/* iOS Style Inner Glow */}
        <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-white opacity-0 blur-[100px] transition-opacity duration-1000 group-hover:opacity-[0.03]" />
        <h3 className="relative z-10 mb-6 px-1 text-[10px] font-bold tracking-[0.3em] text-white/50 uppercase">
          Mindfulness Journey
        </h3>
        <div className="relative z-10 grid grid-cols-3 gap-4">
          {[
            {
              icon: Target,
              label: "Minutes",
              value: Math.floor(stats.totalMinutes),
            },
            { icon: ZapIcon, label: "Sessions", value: stats.sessionCount },
            { icon: Trophy, label: "Streak", value: stats.streak },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-2">
              <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] shadow-inner">
                <div className="absolute inset-0 rounded-full bg-white opacity-10 blur-xl" />
                <stat.icon size={16} className="relative z-10 text-white" />
              </div>
              <span className="text-xl font-light text-white">
                {stat.value}
              </span>
              <span className="text-[8px] font-bold tracking-widest text-white/40 uppercase">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Menu Groups */}
      <div className="space-y-6">
        {menuGroups.map((group) => (
          <div key={group.title} className="space-y-4">
            <h3 className="px-1 text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase">
              {group.title}
            </h3>
            <div className="group relative overflow-hidden rounded-[42px] border border-white/[0.06] bg-white/[0.02] shadow-2xl backdrop-blur-md">
              {/* iOS Style Inner Glow */}
              <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-white opacity-0 blur-[100px] transition-opacity duration-1000 group-hover:opacity-[0.03]" />
              {group.items.map((item, idx) => (
                <button
                  key={item.label}
                  onClick={() =>
                    item.id !== "none" && setActiveSettings(item.id)
                  }
                  className={`group/item relative z-10 flex w-full items-center justify-between px-8 py-6 transition-all hover:bg-white/[0.03] ${idx !== group.items.length - 1 ? "border-b border-white/[0.03]" : ""}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-lg shadow-black/20 transition-transform group-hover/item:scale-110">
                      <div className="absolute inset-0 rounded-full bg-white opacity-10 blur-xl" />
                      <item.icon
                        size={18}
                        className="relative z-10 text-white"
                      />
                    </div>
                    <span className="text-sm font-light text-white/80 transition-colors group-hover/item:text-white">
                      {item.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {item.value && (
                      <span className="text-xs font-medium text-white/40 transition-colors group-hover/item:text-white/50">
                        {item.value}
                      </span>
                    )}
                    <ChevronRight
                      size={14}
                      className="text-white/40 transition-colors group-hover/item:text-white/60"
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Danger Zone */}
        <div className="space-y-4">
          <h3 className="px-1 text-[10px] font-bold tracking-[0.2em] text-red-500/50 uppercase">
            Danger Zone
          </h3>
          <div className="rounded-[42px] border border-red-500/10 bg-red-500/[0.02] shadow-2xl">
            <button
              onClick={() => setShowResetConfirm(true)}
              className="group/item flex w-full items-center justify-between rounded-[42px] px-8 py-6 text-red-400 transition-all hover:bg-red-500/[0.05]"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-500/20 transition-transform group-hover/item:scale-110">
                  <Trash2 size={18} />
                </div>
                <span className="text-sm font-light">Reset All Local Data</span>
              </div>
              <ChevronRight
                size={14}
                className="opacity-30 transition-opacity group-hover/item:opacity-100"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Overlay */}
      <AnimatePresence>
        {showResetConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 px-8 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="relative w-full max-w-sm space-y-6 rounded-[40px] border border-white/10 bg-black/60 p-8 text-center shadow-2xl backdrop-blur-2xl"
            >
              <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-3xl bg-red-500/20 text-red-500">
                <Shield size={32} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-light text-white">
                  Reset Application?
                </h3>
                <p className="text-sm leading-relaxed font-light text-white/40">
                  This will permanently delete all your custom exercises,
                  favorites, and statistics. This cannot be undone.
                </p>
              </div>
              <div className="flex flex-col gap-3 pt-4">
                <button
                  onClick={onResetData}
                  className="h-14 w-full rounded-2xl bg-red-500 text-sm font-bold tracking-widest text-white uppercase shadow-lg shadow-red-500/20 transition-all active:scale-95"
                >
                  Confirm Delete
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="h-14 w-full rounded-2xl bg-white/5 text-sm font-bold tracking-widest text-white/40 uppercase transition-all active:scale-95"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* iOS PWA Installation Helper Overlay */}
      <AnimatePresence>
        {showIOSPrompt && (
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
                <div className="space-y-1">
                  <h3 className="text-2xl font-light tracking-tight text-white">
                    Add to Home Screen
                  </h3>
                  <p className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase">
                    iOS Safari Setup
                  </p>
                </div>
                <button
                  onClick={() => setShowIOSPrompt(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white/40 transition-colors hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                <p className="text-sm leading-relaxed font-light text-white/50">
                  Safari doesn't support automatic 1-click installations, but
                  you can add Spirox to your home screen in 3 quick steps:
                </p>

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs font-bold text-white">
                      1
                    </div>
                    <p className="pt-0.5 text-sm font-light text-white/70">
                      Tap the{" "}
                      <span className="font-medium text-white">Share</span>{" "}
                      button (looks like a square with an upward arrow) in
                      Safari.
                    </p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs font-bold text-white">
                      2
                    </div>
                    <p className="pt-0.5 text-sm font-light text-white/70">
                      Scroll down the list of options and select{" "}
                      <span className="font-medium text-white">
                        "Add to Home Screen"
                      </span>
                      .
                    </p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs font-bold text-white">
                      3
                    </div>
                    <p className="pt-0.5 text-sm font-light text-white/70">
                      Confirm by tapping{" "}
                      <span className="font-medium text-white">"Add"</span> in
                      the top right corner!
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4 border-t border-white/5 pt-4">
                <button
                  onClick={() => setShowIOSPrompt(false)}
                  className="h-14 w-full rounded-2xl bg-white text-sm font-bold tracking-widest text-black uppercase transition-all active:scale-95"
                >
                  Got It
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
