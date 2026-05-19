"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  Compass,
  Library,
  LucideIcon,
  UserRound,
} from "lucide-react";
import React from "react";

export type TabType =
  | "explore"
  | "library"
  | "achievements"
  | "journal"
  | "profile";

interface BottomNavProps {
  activeTab: TabType;
  setActiveTab: (t: TabType) => void;
}

// Custom Target Arrow Icon - Corrected Direction (Points into center from top-left)
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
    {/* Arrow pointing to center from top-right */}
    <path d="M12 12l7-7" />
    <path d="M19 8V5h-3" />
  </svg>
);

export function BottomNav({ activeTab, setActiveTab }: BottomNavProps) {
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
    <div className="fixed bottom-2 left-1/2 z-[100] w-full max-w-[500px] -translate-x-1/2 px-4">
      <div className="bg-white/ flex items-center justify-between rounded-full border border-white/10 p-1.5 shadow-[0_25px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex h-12 w-full items-center justify-center rounded-full transition-all duration-500 ${
                isActive ? "text-white" : "text-gray-200 hover:text-gray-300"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="active-tab-bg"
                  className="absolute inset-0 rounded-full border border-white/10 bg-white/10 shadow-lg"
                  transition={{ type: "spring", duration: 0.6, bounce: 0.3 }}
                />
              )}
              <Icon
                size={26}
                strokeWidth={isActive ? 2 : 1.5}
                className="relative z-10"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
