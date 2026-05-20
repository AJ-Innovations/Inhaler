"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  Compass,
  Crown,
  Library,
  LucideIcon,
  UserRound,
  Wind,
} from "lucide-react";
import React, { useState } from "react";

export type TabType =
  | "explore"
  | "library"
  | "achievements"
  | "journal"
  | "profile";

interface SidebarNavProps {
  activeTab: TabType;
  setActiveTab: (t: TabType) => void;
}

// Custom Target Arrow Icon - Matches BottomNav
const TargetArrow = ({ size = 20, strokeWidth = 2, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
    <path d="M12 12l7-7" />
    <path d="M19 8V5h-3" />
  </svg>
);

export function SidebarNav({ activeTab, setActiveTab }: SidebarNavProps) {
  const [hoveredTab, setHoveredTab] = useState<TabType | null>(null);
  const [hoveredHeader, setHoveredHeader] = useState(false);
  const [hoveredFooter, setHoveredFooter] = useState(false);

  const tabs: {
    id: TabType;
    icon:
      | LucideIcon
      | React.ComponentType<{
          size?: number;
          strokeWidth?: number;
          className?: string;
        }>;
    label: string;
  }[] = [
    { id: "explore", icon: Compass, label: "Explore" },
    { id: "library", icon: Library, label: "Library" },
    { id: "achievements", icon: TargetArrow, label: "Goals" },
    { id: "journal", icon: BarChart3, label: "Journal" },
    { id: "profile", icon: UserRound, label: "Profile" },
  ];

  return (
    <div className="fixed top-1/2 left-6 z-50 hidden h-fit max-h-[85vh] w-[76px] -translate-y-1/2 flex-col items-center rounded-[38px] border border-white/10 bg-white/[0.02] px-2 py-8 shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-sm transition-all duration-300 md:flex">
      {/* Interactive Slim Logo Header */}
      <div
        onMouseEnter={() => setHoveredHeader(true)}
        onMouseLeave={() => setHoveredHeader(false)}
        className="relative mb-10 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/10 text-white transition-all hover:scale-105 hover:bg-white/20 active:scale-95"
      >
        <Wind size={22} className="animate-pulse text-white" />

        {/* Logo Detailed Popover */}
        <AnimatePresence>
          {hoveredHeader && (
            <motion.div
              initial={{ opacity: 0, x: -15, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -15, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              style={{
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
              }}
              className="pointer-events-none absolute left-[84px] z-[9999] flex w-max flex-col items-start gap-1 rounded-[20px] border border-white/10 bg-white/5 px-5 py-3 shadow-[0_20px_50px_rgba(0,0,0,0.25)]"
            >
              <span className="text-sm font-light tracking-wide whitespace-nowrap text-white">
                Spirox
              </span>
              <span className="text-[9px] font-black tracking-widest whitespace-nowrap text-white/40 uppercase">
                Breathing Companion
              </span>
              <span className="mt-0.5 text-[8.5px] font-light tracking-wide whitespace-nowrap text-white/60 italic">
                "One breath is all it takes"
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Tabs list */}
      <div className="flex w-full flex-col items-center gap-5">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <div key={tab.id} className="group relative">
              <button
                onClick={() => setActiveTab(tab.id)}
                onMouseEnter={() => setHoveredTab(tab.id)}
                onMouseLeave={() => setHoveredTab(null)}
                className={`relative flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300 ${
                  isActive
                    ? "text-white"
                    : "text-gray-200 hover:bg-white/5 hover:text-white"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-sidebar-tab-bg"
                    className="absolute inset-0 rounded-full border border-white/10 bg-white/10 shadow-lg"
                    transition={{ type: "spring", duration: 0.6, bounce: 0.2 }}
                  />
                )}
                <Icon
                  size={24}
                  strokeWidth={isActive ? 2 : 1.5}
                  className="relative z-10 transition-transform duration-300 group-hover:scale-110"
                />
              </button>

              {/* Glassmorphic Tooltip Popout Pill */}
              <AnimatePresence>
                {hoveredTab === tab.id && (
                  <motion.div
                    initial={{ opacity: 0, x: -15, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -15, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    className="pointer-events-none absolute top-1/2 left-[84px] z-[9999] flex w-max -translate-y-1/2 flex-col items-start gap-1 rounded-[20px] border border-white/10 bg-white/10 px-5 py-3 shadow-[0_20px_50px_rgba(0,0,0,0.25)]"
                  >
                    <span className="text-xs font-black tracking-widest whitespace-nowrap text-white uppercase">
                      {tab.label}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Premium Active Badge Footer */}
      <div
        onMouseEnter={() => setHoveredFooter(true)}
        onMouseLeave={() => setHoveredFooter(false)}
        className="relative mt-10 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-all hover:scale-105 hover:bg-white/10 active:scale-95"
      >
        <Crown size={20} className="animate-pulse" />

        {/* Footer Detailed Popover */}
        <AnimatePresence>
          {hoveredFooter && (
            <motion.div
              initial={{ opacity: 0, x: -15, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -15, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              style={{
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
              }}
              className="pointer-events-none absolute bottom-0 left-[84px] z-[9999] flex w-max flex-col items-start gap-1 rounded-[20px] border border-amber-500/20 bg-white/5 px-5 py-3 shadow-[0_20px_50px_rgba(0,0,0,0.25)]"
            >
              <span className="text-xs font-black tracking-widest whitespace-nowrap text-amber-400 uppercase">
                Premium Core
              </span>
              <span className="text-[9px] font-medium whitespace-nowrap text-white/50 lowercase">
                active pro subscription
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
