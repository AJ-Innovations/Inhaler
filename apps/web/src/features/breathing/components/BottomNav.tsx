'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Library, BarChart3, UserRound, LucideIcon } from 'lucide-react';

export type TabType = 'explore' | 'library' | 'achievements' | 'journal' | 'profile';

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
  const tabs: { id: TabType, icon: LucideIcon | React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>, label: string }[] = [
    { id: 'explore', icon: Compass, label: 'Explore' },
    { id: 'library', icon: Library, label: 'Library' },
    { id: 'achievements', icon: TargetArrow, label: 'Goals' },
    { id: 'journal', icon: BarChart3, label: 'Journal' },
    { id: 'profile', icon: UserRound, label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-2 left-1/2 -translate-x-1/2 w-full max-w-[500px] px-4 z-[100]">
      <div className="bg-white/ backdrop-blur-xl border border-white/10 rounded-full p-1.5 flex items-center justify-between shadow-[0_25px_50px_rgba(0,0,0,0.6)]">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center justify-center w-full h-12 rounded-full transition-all duration-500 ${isActive ? 'text-white' : 'text-gray-200 hover:text-gray-300'
                }`}
            >
              {isActive && (
                <motion.div
                  layoutId="active-tab-bg"
                  className="absolute inset-0 bg-white/10 rounded-full border border-white/10 shadow-lg"
                  transition={{ type: 'spring', duration: 0.6, bounce: 0.3 }}
                />
              )}
              <Icon size={26} strokeWidth={isActive ? 2 : 1.5} className="relative z-10" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
