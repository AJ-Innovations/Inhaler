'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserRound,
  Target,
  Zap as ZapIcon,
  Trophy,
  ChevronRight,
  Edit2,
  Check,
  X,
  Bell,
  Shield,
  Trash2,
  Info,
  ExternalLink,
  Camera,
  Sparkles,
  Upload,
  Image as ImageIcon,
  Heart,
  Smartphone,
  ChevronLeft,
  Crown,
  Mail
} from 'lucide-react';

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

type SettingsType = 'notifications' | 'privacy' | 'goal' | 'about' | 'none';

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
  dailyReminderTime = '08:30',
  onToggleReminder,
  onUpdateTime
}: ProfileViewProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [isSelectingAvatar, setIsSelectingAvatar] = useState(false);
  const [tempName, setTempName] = useState(userName);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [activeSettings, setActiveSettings] = useState<SettingsType>('none');
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
        const canvas = document.createElement('canvas');
        const size = Math.min(img.width, img.height, 800);
        canvas.width = size;
        canvas.height = size;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const sourceSize = Math.min(img.width, img.height);
        const sourceX = (img.width - sourceSize) / 2;
        const sourceY = (img.height - sourceSize) / 2;

        ctx.drawImage(img, sourceX, sourceY, sourceSize, sourceSize, 0, 0, size, size);

        let quality = 0.85;
        let base64 = canvas.toDataURL('image/jpeg', quality);

        while (base64.length * 0.75 > 500000 && quality > 0.1) {
          quality -= 0.1;
          base64 = canvas.toDataURL('image/jpeg', quality);
        }

        onUpdateAvatar(base64);
        setIsSelectingAvatar(false);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const suggestedAvatars = [
    { id: 'zen_stones', path: '/avatars/zen_stones.png', label: 'Zen' },
    { id: 'lotus', path: '/avatars/lotus.png', label: 'Lotus' },
    { id: 'aurora', path: '/avatars/aurora.png', label: 'Aurora' },
    { id: 'meditator', path: '/avatars/meditator.png', label: 'Peace' },
    { id: 'paper_crane', path: '/avatars/paper_crane.png', label: 'Hope' },
  ];

  const menuGroups = [
    {
      title: 'Preferences',
      items: [
        { id: 'notifications' as SettingsType, icon: Bell, label: 'Notifications', value: dailyReminderEnabled ? dailyReminderTime : 'Off' },
        { id: 'privacy' as SettingsType, icon: Shield, label: 'Privacy & Health', value: 'Connected' },
        { id: 'goal' as SettingsType, icon: Target, label: 'Daily Goal', value: `${dailyGoal} Minutes` },
      ]
    },
    {
      title: 'Support',
      items: [
        { id: 'about' as SettingsType, icon: Info, label: 'About Spirox', value: 'v1.4.2' },
        { id: 'none' as SettingsType, icon: ExternalLink, label: 'Resource Center', isExternal: true },
      ]
    }
  ];

  const renderSettingsContent = () => {
    switch (activeSettings) {
      case 'notifications':
        return (
          <div className="space-y-8">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-sm font-light text-white">Daily Reminder</span>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">
                    {dailyReminderEnabled ? `Active at ${dailyReminderTime}` : 'Disabled'}
                  </p>
                </div>
                
                {/* Sleek iOS Switch */}
                <button
                  onClick={() => onToggleReminder?.(!dailyReminderEnabled)}
                  className={`w-12 h-6 rounded-full flex items-center px-1 transition-all duration-300 ${
                    dailyReminderEnabled ? 'bg-white' : 'bg-white/10'
                  }`}
                >
                  <motion.div 
                    layout
                    className="w-4 h-4 bg-black rounded-full shadow-md"
                    animate={{ x: dailyReminderEnabled ? 20 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>

              {dailyReminderEnabled && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 pt-4 border-t border-white/5"
                >
                  <label className="block text-[10px] uppercase tracking-widest font-black text-white/40">
                    Reminder Time
                  </label>
                  
                  {/* Styled Dark-Theme Input Time */}
                  <div className="relative">
                    <input
                      type="time"
                      value={dailyReminderTime}
                      onChange={(e) => onUpdateTime?.(e.target.value)}
                      className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-5 text-xl font-light text-white focus:outline-none focus:border-white/20 appearance-none cursor-pointer"
                    />
                  </div>
                </motion.div>
              )}
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] uppercase tracking-widest font-bold text-white/50 px-2">System Alerts</h4>
              <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 space-y-3">
                <p className="text-xs text-white/70 font-light">
                  Push status: <span className="text-white font-medium">Active</span>
                </p>
                <p className="text-[10px] text-white/40 leading-relaxed uppercase tracking-wider font-bold">
                  Enable system settings permissions to receive lock-screen alert popups.
                </p>
              </div>
            </div>
          </div>
        );
      case 'privacy':
        return (
          <div className="space-y-6">
            <div className="bg-white/[0.04] border border-white/10 rounded-3xl p-6 flex items-center gap-4">
              <Shield className="text-white" size={24} />
              <div>
                <h4 className="text-sm font-medium text-white">Local-First Storage</h4>
                <p className="text-xs text-white/50">Your data never leaves this device.</p>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-light text-white">Biometric Lock</span>
                <div className="w-12 h-6 bg-white/10 rounded-full flex items-center px-1">
                  <div className="w-4 h-4 bg-white/30 rounded-full" />
                </div>
              </div>
              <p className="text-[10px] text-white/40 leading-relaxed uppercase tracking-widest font-bold">Secure your session history with FaceID or TouchID</p>
            </div>
          </div>
        );
      case 'goal':
        return (
          <div className="space-y-12 py-6">
            <div className="text-center space-y-3">
              <motion.div 
                key={dailyGoal}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="inline-block"
              >
                <span className="text-7xl font-light text-white tracking-tighter tabular-nums">{dailyGoal}</span>
              </motion.div>
              <p className="text-[10px] text-white/50 font-black uppercase tracking-[0.3em]">Minutes Per Day</p>
            </div>

            <div className="relative px-2">
              {/* Custom Track Background */}
              <div className="absolute top-1/2 -translate-y-1/2 left-2 right-2 h-1 bg-white/10 rounded-full overflow-hidden">
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
                className="relative w-full h-10 appearance-none bg-transparent cursor-pointer z-10
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:w-6
                  [&::-webkit-slider-thumb]:h-6
                  [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:bg-white
                  [&::-webkit-slider-thumb]:shadow-[0_0_20px_rgba(255,255,255,0.4)]
                  [&::-webkit-slider-thumb]:border-4
                  [&::-webkit-slider-thumb]:border-black
                  [&::-webkit-slider-thumb]:transition-all
                  [&::-webkit-slider-thumb]:active:scale-125"
              />

              <div className="flex justify-between text-[8px] font-black text-white/40 uppercase tracking-[0.2em] mt-4 px-1">
                <span>5m</span>
                <span className="text-white/20">30m</span>
                <span>60m</span>
              </div>
            </div>

            <button
              onClick={() => setActiveSettings('none')}
              className="w-full h-16 rounded-[28px] bg-white text-black font-black text-[10px] uppercase tracking-[0.3em] hover:bg-white/90 active:scale-95 transition-all mt-4"
            >
              Set New Goal
            </button>
          </div>
        );
      case 'about':
        return (
          <div className="space-y-8">
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-[28px] bg-white/[0.04] border border-white/10 p-0.5 shadow-2xl">
                <div className="w-full h-full rounded-[26px] bg-transparent flex items-center justify-center overflow-hidden">
                  <ZapIcon size={32} className="text-white" />
                </div>
              </div>
              <div className="text-center">
                <h4 className="text-xl font-light text-white tracking-tight">Spirox Premium</h4>
                <p className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-bold mt-1">Version 1.4.2</p>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-[32px] p-6 space-y-4">
              <div className="flex items-center gap-4">
                <Heart size={18} className="text-white/60" />
                <span className="text-sm font-light text-white/80">Made with love in California</span>
              </div>
              <div className="flex items-center gap-4">
                <Smartphone size={18} className="text-white/60" />
                <span className="text-sm font-light text-white/80">Built for iOS & Android PWA</span>
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
      className="w-95 pb-10 space-y-10"
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
        <div className="relative group">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="w-40 h-40 rounded-full bg-white/[0.04] p-1 mb-6 shadow-2xl relative overflow-hidden cursor-pointer"
            onClick={() => setIsSelectingAvatar(true)}
          >
            <div className="w-full h-full rounded-full bg-transparent flex items-center justify-center border border-white/10 overflow-hidden relative">
              {userAvatar ? (
                <img src={userAvatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <UserRound size={80} strokeWidth={1} className="text-white/20" />
              )}

              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={32} className="text-white mb-1" />
                <span className="text-[10px] uppercase tracking-widest font-black text-white">Update Image</span>
              </div>
            </div>
            <div className="absolute inset-0 rounded-full bg-white/5 blur-3xl opacity-50 pointer-events-none" />
          </motion.div>

          <button
            className="absolute bottom-8 right-1 w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all z-20 border-4 border-black"
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
              className="flex items-center gap-2 mt-2"
            >
              <input
                autoFocus
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                className="bg-white/5 border border-white/20 rounded-2xl px-4 py-2 text-2xl font-light text-white focus:outline-none focus:border-white/40 w-56 text-center"
              />
              <button onClick={handleSaveName} className="p-3 rounded-2xl bg-white text-black">
                <Check size={20} />
              </button>
              <button onClick={() => { setIsEditingName(false); setTempName(userName); }} className="p-3 rounded-2xl bg-white/5 text-white/40">
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
              <h2 className="text-3xl font-light text-white tracking-tight">{userName}</h2>
              <div className="flex items-center justify-center gap-2 mt-2">
                <Sparkles size={12} className="text-white/60" />
                <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/40">Zen Practitioner • Elite Tier</p>
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
            className="fixed inset-0 z-[200] bg-black/85 backdrop-blur-xl flex items-center justify-center px-8"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-black/60 backdrop-blur-2xl border border-white/10 p-10 rounded-[48px] w-full max-w-md space-y-8 shadow-2xl relative"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-2xl font-light text-white tracking-tight">Identity</h3>
                  <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40">Choose your symbol</p>
                </div>
                <button
                  onClick={() => setIsSelectingAvatar(false)}
                  className="w-10 h-10 rounded-full bg-white/5 text-white/40 flex items-center justify-center hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 flex items-center justify-center gap-3 py-5 rounded-[24px] bg-white/[0.04] border border-white/10 text-white hover:bg-white/[0.08] transition-all group"
                >
                  <Upload size={18} className="group-hover:-translate-y-1 transition-transform" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Gallery</span>
                </button>
                <button
                  onClick={() => { onUpdateAvatar(null); setIsSelectingAvatar(false); }}
                  className="flex-1 flex items-center justify-center gap-3 py-5 rounded-[24px] bg-white/5 border border-white/10 text-white/40 hover:bg-white/10 transition-all"
                >
                  <ImageIcon size={18} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Default</span>
                </button>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-2">
                {suggestedAvatars.map((avatar) => (
                  <div key={avatar.id} className="flex flex-col items-center gap-3">
                    <button
                      onClick={() => { onUpdateAvatar(avatar.path); setIsSelectingAvatar(false); }}
                      className={`w-full aspect-square rounded-[24px] border-2 overflow-hidden transition-all relative ${userAvatar === avatar.path ? 'border-white scale-105 shadow-[0_0_30px_rgba(255,255,255,0.1)]' : 'border-white/5 opacity-40 hover:opacity-100'}`}
                    >
                      <img src={avatar.path} alt={avatar.label} className="w-full h-full object-cover" />
                      {userAvatar === avatar.path && (
                        <div className="absolute top-2 right-2 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                          <Check size={10} className="text-black" strokeWidth={4} />
                        </div>
                      )}
                    </button>
                    <span className={`text-[8px] uppercase tracking-widest font-black ${userAvatar === avatar.path ? 'text-white' : 'text-white/40'}`}>{avatar.label}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-white/5">
                <p className="text-[9px] text-white/40 font-medium text-center uppercase tracking-[0.2em] leading-relaxed">
                  Your identity is stored locally on your device for maximum privacy.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Modal (Universal) */}
      <AnimatePresence>
        {activeSettings !== 'none' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/85 backdrop-blur-xl flex items-center justify-center px-8"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-black/60 backdrop-blur-2xl border border-white/10 p-10 rounded-[48px] w-full max-w-md space-y-8 shadow-2xl relative"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                     onClick={() => setActiveSettings('none')}
                     className="w-10 h-10 rounded-full bg-white/5 text-white/40 flex items-center justify-center hover:text-white transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <div className="space-y-1">
                    <h3 className="text-2xl font-light text-white tracking-tight capitalize">{activeSettings}</h3>
                    <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40">Configuration</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveSettings('none')}
                  className="w-10 h-10 rounded-full bg-white/5 text-white/40 flex items-center justify-center hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="min-h-[200px]">
                {renderSettingsContent()}
              </div>

              <div className="pt-4 border-t border-white/5">
                <p className="text-[9px] text-white/40 font-medium text-center uppercase tracking-[0.2em] leading-relaxed">
                  Preferences are applied instantly and saved to your device.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Account Section */}
      <div className="space-y-4 mt-12">
        <h3 className="px-1 text-[10px] uppercase tracking-[0.2em] font-bold text-white/40">Account</h3>
        <div className="bg-white/[0.02] backdrop-blur-md border border-white/[0.06] rounded-[42px] overflow-hidden shadow-2xl relative group">
          {/* iOS Style Inner Glow */}
          <div
            className="absolute -right-20 -top-20 w-60 h-60 bg-white rounded-full blur-[100px] opacity-0 group-hover:opacity-[0.03] transition-opacity duration-1000"
          />
          <button 
            onClick={onLogin}
            className="w-full flex items-center justify-between px-8 py-6 hover:bg-white/[0.03] transition-all group/item relative z-10"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center group-hover/item:scale-110 transition-transform">
                <Mail size={18} className="text-white" />
              </div>
              <div className="text-left">
                <span className="block text-sm font-light text-white">Sign In or Create Account</span>
                <span className="block text-[10px] text-white/40 font-medium uppercase tracking-widest mt-0.5">Access cloud sync</span>
              </div>
            </div>
            <ChevronRight size={14} className="text-white/40 group-hover/item:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Premium Upgrade Card */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onUpgrade}
        className="w-full mt-8 relative overflow-hidden rounded-[36px] p-6 bg-white/[0.02] backdrop-blur-md border border-white/[0.06] group text-left"
      >
        {/* iOS Style Inner Glow */}
        <div
          className="absolute -right-20 -top-20 w-60 h-60 bg-white rounded-full blur-[100px] opacity-0 group-hover:opacity-[0.03] transition-opacity duration-1000"
        />
        <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
          <Crown size={40} className="text-white" />
        </div>
        <div className="relative z-10 flex flex-col items-start space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-white text-black text-[8px] font-black uppercase tracking-tighter">Premium</span>
            <h4 className="text-lg font-light text-white tracking-tight">Unlock Everything</h4>
          </div>
          <p className="text-xs text-white/50 font-light max-w-[200px]">Get all premium routines, custom builders, and cloud sync.</p>
          <div className="pt-2 flex items-center gap-2 text-white">
            <span className="text-[10px] font-black uppercase tracking-widest">Upgrade Now</span>
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
          className="w-full mt-6 relative overflow-hidden rounded-[36px] p-6 bg-white/[0.02] backdrop-blur-md border border-white/[0.06] group text-left"
        >
          {/* iOS Style Inner Glow */}
          <div
            className="absolute -right-20 -top-20 w-60 h-60 bg-white rounded-full blur-[100px] opacity-0 group-hover:opacity-[0.03] transition-opacity duration-1000"
          />
          <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
            <Smartphone size={40} className="text-white" />
          </div>
          <div className="relative z-10 flex flex-col items-start space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-white text-black text-[8px] font-black uppercase tracking-tighter">Fast Access</span>
              <h4 className="text-lg font-light text-white tracking-tight">Install Spirox App</h4>
            </div>
            <p className="text-xs text-white/50 font-light max-w-[240px]">Add Spirox to your home screen for quick offline access, premium performance, and immersive sessions.</p>
            <div className="pt-2 flex items-center gap-2 text-white">
              <span className="text-[10px] font-black uppercase tracking-widest">Install Now</span>
              <ChevronRight size={14} />
            </div>
          </div>
        </motion.button>
      )}

      {/* Stats Section */}
      <div className="w-full bg-white/[0.02] backdrop-blur-md border border-white/[0.06] rounded-[42px] p-8 shadow-2xl relative overflow-hidden group">
        {/* iOS Style Inner Glow */}
        <div
          className="absolute -right-20 -top-20 w-60 h-60 bg-white rounded-full blur-[100px] opacity-0 group-hover:opacity-[0.03] transition-opacity duration-1000"
        />
        <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/50 mb-6 px-1 relative z-10">Mindfulness Journey</h3>
        <div className="grid grid-cols-3 gap-4 relative z-10">
          {[
            { icon: Target, label: 'Minutes', value: Math.floor(stats.totalMinutes) },
            { icon: ZapIcon, label: 'Sessions', value: stats.sessionCount },
            { icon: Trophy, label: 'Streak', value: stats.streak },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center shadow-inner relative overflow-hidden">
                <div className="absolute inset-0 blur-xl opacity-10 bg-white rounded-full" />
                <stat.icon size={16} className="text-white relative z-10" />
              </div>
              <span className="text-xl font-light text-white">{stat.value}</span>
              <span className="text-[8px] uppercase tracking-widest text-white/40 font-bold">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Menu Groups */}
      <div className="space-y-6">
        {menuGroups.map((group) => (
          <div key={group.title} className="space-y-4">
            <h3 className="px-1 text-[10px] uppercase tracking-[0.2em] font-bold text-white/40">{group.title}</h3>
            <div className="bg-white/[0.02] backdrop-blur-md border border-white/[0.06] rounded-[42px] overflow-hidden shadow-2xl relative group">
              {/* iOS Style Inner Glow */}
              <div
                className="absolute -right-20 -top-20 w-60 h-60 bg-white rounded-full blur-[100px] opacity-0 group-hover:opacity-[0.03] transition-opacity duration-1000"
              />
              {group.items.map((item, idx) => (
                <button
                  key={item.label}
                  onClick={() => item.id !== 'none' && setActiveSettings(item.id)}
                  className={`w-full flex items-center justify-between px-8 py-6 hover:bg-white/[0.03] transition-all group/item relative z-10 ${idx !== group.items.length - 1 ? 'border-b border-white/[0.03]' : ''}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center group-hover/item:scale-110 transition-transform relative overflow-hidden shadow-black/20 shadow-lg">
                      <div className="absolute inset-0 blur-xl opacity-10 bg-white rounded-full" />
                      <item.icon size={18} className="text-white relative z-10" />
                    </div>
                    <span className="text-sm font-light text-white/80 group-hover/item:text-white transition-colors">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {item.value && <span className="text-xs text-white/40 font-medium group-hover/item:text-white/50 transition-colors">{item.value}</span>}
                    <ChevronRight size={14} className="text-white/40 group-hover/item:text-white/60 transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Danger Zone */}
        <div className="space-y-4">
          <h3 className="px-1 text-[10px] uppercase tracking-[0.2em] font-bold text-red-500/50">Danger Zone</h3>
          <div className="bg-red-500/[0.02] border border-red-500/10 rounded-[42px] shadow-2xl">
            <button
              onClick={() => setShowResetConfirm(true)}
              className="w-full flex items-center justify-between px-8 py-6 rounded-[42px] hover:bg-red-500/[0.05] transition-all text-red-400 group/item"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-red-500/20 flex items-center justify-center group-hover/item:scale-110 transition-transform">
                  <Trash2 size={18} />
                </div>
                <span className="text-sm font-light">Reset All Local Data</span>
              </div>
              <ChevronRight size={14} className="opacity-30 group-hover/item:opacity-100 transition-opacity" />
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
            className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center px-8"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-black/60 backdrop-blur-2xl border border-white/10 p-8 rounded-[40px] w-full max-w-sm text-center space-y-6 shadow-2xl relative"
            >
              <div className="w-16 h-16 rounded-3xl bg-red-500/20 text-red-500 flex items-center justify-center mx-auto mb-2">
                <Shield size={32} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-light text-white">Reset Application?</h3>
                <p className="text-sm text-white/40 font-light leading-relaxed">This will permanently delete all your custom exercises, favorites, and statistics. This cannot be undone.</p>
              </div>
              <div className="flex flex-col gap-3 pt-4">
                <button
                  onClick={onResetData}
                  className="w-full h-14 rounded-2xl bg-red-500 text-white font-bold text-sm uppercase tracking-widest shadow-lg shadow-red-500/20 active:scale-95 transition-all"
                >
                  Confirm Delete
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="w-full h-14 rounded-2xl bg-white/5 text-white/40 font-bold text-sm uppercase tracking-widest active:scale-95 transition-all"
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
            className="fixed inset-0 z-[200] bg-black/85 backdrop-blur-xl flex items-center justify-center px-8"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-black/60 backdrop-blur-2xl border border-white/10 p-10 rounded-[48px] w-full max-w-md space-y-8 shadow-2xl relative"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-2xl font-light text-white tracking-tight">Add to Home Screen</h3>
                  <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40">iOS Safari Setup</p>
                </div>
                <button
                  onClick={() => setShowIOSPrompt(false)}
                  className="w-10 h-10 rounded-full bg-white/5 text-white/40 flex items-center justify-center hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                <p className="text-sm text-white/50 font-light leading-relaxed">
                  Safari doesn't support automatic 1-click installations, but you can add Spirox to your home screen in 3 quick steps:
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">1</div>
                    <p className="text-sm text-white/70 font-light pt-0.5">
                      Tap the <span className="text-white font-medium">Share</span> button (looks like a square with an upward arrow) in Safari.
                    </p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">2</div>
                    <p className="text-sm text-white/70 font-light pt-0.5">
                      Scroll down the list of options and select <span className="text-white font-medium">"Add to Home Screen"</span>.
                    </p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">3</div>
                    <p className="text-sm text-white/70 font-light pt-0.5">
                      Confirm by tapping <span className="text-white font-medium">"Add"</span> in the top right corner!
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex flex-col gap-4">
                <button
                  onClick={() => setShowIOSPrompt(false)}
                  className="w-full h-14 rounded-2xl bg-white text-black font-bold text-sm uppercase tracking-widest active:scale-95 transition-all"
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
