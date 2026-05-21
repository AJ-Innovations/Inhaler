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
import { useAuthStore } from "../auth/store/useAuthStore";
import { ProfileDangerZone } from "./components/ProfileDangerZone";
import { ProfileHeader } from "./components/ProfileHeader";
import {
  ProfileSettingsContent,
  SettingsType,
} from "./components/ProfileSettingsContent";
import { ProfileStats } from "./components/ProfileStats";

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
  const [showDesktopInstallPrompt, setShowDesktopInstallPrompt] =
    useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { isAuthenticated, user, logout } = useAuthStore();

  const handleInstallClick = () => {
    if (isIOS) {
      setShowIOSPrompt(true);
    } else {
      setShowDesktopInstallPrompt(true);
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

  const renderSettingsContent = () => (
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
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="mx-auto w-full max-w-5xl space-y-10 px-4 pb-20 md:px-8"
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileUpload}
      />

      {/* Profile Header */}
      {isAuthenticated && (
        <ProfileHeader
          userName={userName}
          userAvatar={userAvatar}
          tempName={tempName}
          isEditingName={isEditingName}
          setTempName={setTempName}
          setIsEditingName={setIsEditingName}
          handleSaveName={handleSaveName}
          setIsSelectingAvatar={setIsSelectingAvatar}
          isAuthenticated={isAuthenticated}
          authUserName={user?.name || user?.email}
          isPremium={user?.isPremium}
        />
      )}

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

      {/* 2-Column Responsive Dashboard for Profile Metrics and Settings */}
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
        {/* Left Column: Stats & Promotional Cards */}
        <div className="space-y-6">
          {/* Stats Section */}
          <ProfileStats stats={stats} />

          {/* Account Section - Only show when NOT authenticated */}
          {!isAuthenticated && (
            <div className="space-y-4">
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
          )}

          {/* Premium Upgrade Card - Hide if user is premium */}
          {!user?.isPremium && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onUpgrade}
              className="group relative w-full overflow-hidden rounded-[36px] border border-white/[0.06] bg-white/[0.02] p-6 text-left backdrop-blur-md"
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
          )}

          {/* PWA Install Button */}
          {isInstallable && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleInstallClick}
              className="group relative w-full overflow-hidden rounded-[36px] border border-white/[0.06] bg-white/[0.02] p-6 text-left backdrop-blur-md"
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
                  Add Spirox to your home screen for quick offline access,
                  premium performance, and immersive sessions.
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
        </div>

        {/* Right Column: Settings Groups & Danger Zone */}
        <div className="space-y-8">
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
            <ProfileDangerZone
              isAuthenticated={isAuthenticated}
              user={user}
              onResetDataClick={() => setShowResetConfirm(true)}
              onLogoutClick={() => {
                logout();
                window.location.reload();
              }}
            />
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
      <AnimatePresence>
        {showDesktopInstallPrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/20 px-8 backdrop-blur-2xl"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="relative w-full max-w-md space-y-8 rounded-[48px] border border-white/10 bg-white/5 p-10 shadow-[0_0_40px_rgba(255,255,255,0.05)] backdrop-blur-3xl"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-2xl font-light tracking-tight text-white">
                    Install Spirox
                  </h3>
                  <p className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase">
                    Native App Experience
                  </p>
                </div>
                <button
                  onClick={() => setShowDesktopInstallPrompt(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white/40 transition-colors hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4 rounded-[28px] border border-white/10 bg-white/5 p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-[20px] bg-white text-black shadow-lg">
                    <ZapIcon size={24} />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white">
                      Lightning Fast
                    </h4>
                    <p className="text-xs text-white/50">
                      Starts instantly, no loading screens
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-[28px] border border-white/10 bg-white/5 p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-[20px] bg-white text-black shadow-lg">
                    <Shield size={24} />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white">
                      Works Offline
                    </h4>
                    <p className="text-xs text-white/50">
                      Breathe anywhere without internet
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4 border-t border-white/5 pt-6">
                <button
                  onClick={() => {
                    setShowDesktopInstallPrompt(false);
                    onInstallPWA?.();
                  }}
                  className="h-14 w-full rounded-[28px] bg-white text-sm font-bold tracking-widest text-black uppercase shadow-xl transition-all hover:scale-105 active:scale-95"
                >
                  Install App
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
