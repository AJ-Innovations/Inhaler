import { ChevronRight } from "lucide-react";
import React from "react";

import { SettingsType } from "./ProfileSettingsContent";

interface MenuSection {
  title: string;
  items: MenuItem[];
}

interface MenuItem {
  id: SettingsType;
  icon: any;
  label: string;
  value?: string;
  isExternal?: boolean;
}

interface PreferencesMenuProps {
  menuGroups: MenuSection[];
  setActiveSettings: (val: SettingsType) => void;
}

export function PreferencesMenu({
  menuGroups,
  setActiveSettings,
}: PreferencesMenuProps) {
  return (
    <div className="space-y-6">
      {menuGroups.map((group) => (
        <div key={group.title} className="space-y-4">
          <h3 className="px-1 text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase">
            {group.title}
          </h3>
          <div className="group relative overflow-hidden rounded-[42px] border border-white/[0.06] bg-white/[0.02] shadow-2xl backdrop-blur-md">
            <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-white opacity-0 blur-[100px] transition-opacity duration-1000 group-hover:opacity-[0.03]" />
            {group.items.map((item, idx) => (
              <button
                key={item.label}
                onClick={() => item.id !== "none" && setActiveSettings(item.id)}
                className={`group/item relative z-10 flex w-full items-center justify-between px-8 py-6 transition-all hover:bg-white/[0.03] ${
                  idx !== group.items.length - 1
                    ? "border-b border-white/[0.03]"
                    : ""
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-lg shadow-black/20 transition-transform group-hover/item:scale-110">
                    <div className="absolute inset-0 rounded-full bg-white opacity-10 blur-xl" />
                    <item.icon size={18} className="relative z-10 text-white" />
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
    </div>
  );
}
