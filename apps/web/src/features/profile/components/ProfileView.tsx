"use client";

import { motion } from "framer-motion";
import React from "react";

import { ProfileDangerZone } from "./ProfileDangerZone";
import { ProfileHeader } from "./ProfileHeader";
import { ProfileStats } from "./ProfileStats";

import { AccountSignInCard } from "./AccountSignInCard";
import { AvatarSelectionModal } from "./AvatarSelectionModal";
import {
  DesktopInstallPromptModal,
  IOSInstallPromptModal,
} from "./InstallPromptModals";
import { PreferencesMenu } from "./PreferencesMenu";
import { PremiumUpgradeCard } from "./PremiumUpgradeCard";
import { PWAInstallCard } from "./PWAInstallCard";
import { ResetConfirmationModal } from "./ResetConfirmationModal";
import { SettingsModal } from "./SettingsModal";

import { getMenuGroups } from "../data/constants";
import { useProfileState } from "../hooks/useProfileState";
import { ProfileViewProps } from "../types";

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
  const {
    isEditingName,
    setIsEditingName,
    isSelectingAvatar,
    setIsSelectingAvatar,
    showResetConfirm,
    setShowResetConfirm,
    activeSettings,
    setActiveSettings,
    dailyGoal,
    setDailyGoal,
    showIOSPrompt,
    setShowIOSPrompt,
    showDesktopInstallPrompt,
    setShowDesktopInstallPrompt,
    fileInputRef,
    isAuthenticated,
    user,
    logout,
    tempName,
    setTempName,
    handleSaveName,
    handleFileUpload,
    handleInstallClick,
  } = useProfileState(userName, onUpdateName, onUpdateAvatar);

  const menuGroups = getMenuGroups(
    dailyReminderEnabled,
    dailyReminderTime,
    dailyGoal,
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
          authUserName={user?.name || user?.email || "Active Account"}
          isPremium={user?.isPremium}
        />
      )}

      <AvatarSelectionModal
        isSelectingAvatar={isSelectingAvatar}
        setIsSelectingAvatar={setIsSelectingAvatar}
        userAvatar={userAvatar}
        onUpdateAvatar={onUpdateAvatar}
        fileInputRef={fileInputRef}
      />

      <SettingsModal
        activeSettings={activeSettings}
        setActiveSettings={setActiveSettings}
        dailyReminderEnabled={dailyReminderEnabled}
        dailyReminderTime={dailyReminderTime}
        dailyGoal={dailyGoal}
        onToggleReminder={onToggleReminder}
        onUpdateTime={onUpdateTime}
        setDailyGoal={setDailyGoal}
      />

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
        {/* Left Column: Stats & Promotional Cards */}
        <div className="space-y-6">
          <ProfileStats stats={stats} />

          <AccountSignInCard
            isAuthenticated={isAuthenticated}
            onLogin={onLogin}
          />

          <PremiumUpgradeCard
            isPremium={user?.isPremium}
            onUpgrade={onUpgrade}
          />

          <PWAInstallCard
            isInstallable={isInstallable}
            onInstallClick={() => handleInstallClick(isIOS)}
          />
        </div>

        {/* Right Column: Settings Groups & Danger Zone */}
        <div className="space-y-8">
          <PreferencesMenu
            menuGroups={menuGroups}
            setActiveSettings={setActiveSettings}
          />

          <ProfileDangerZone
            isAuthenticated={isAuthenticated}
            user={user}
            onResetDataClick={() => setShowResetConfirm(true)}
            onLogoutClick={async () => {
              await import("@libs/supabaseClient").then(({ supabase }) =>
                supabase.auth.signOut(),
              );
              logout();
              window.location.reload();
            }}
          />
        </div>
      </div>

      <ResetConfirmationModal
        showResetConfirm={showResetConfirm}
        setShowResetConfirm={setShowResetConfirm}
        onResetData={onResetData}
      />

      <IOSInstallPromptModal
        showIOSPrompt={showIOSPrompt}
        setShowIOSPrompt={setShowIOSPrompt}
      />

      <DesktopInstallPromptModal
        showDesktopInstallPrompt={showDesktopInstallPrompt}
        setShowDesktopInstallPrompt={setShowDesktopInstallPrompt}
        onInstallPWA={onInstallPWA}
      />
    </motion.div>
  );
}
