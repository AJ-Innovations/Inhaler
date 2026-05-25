import { ChevronRight, Trash2, UserRound } from "lucide-react";
import React from "react";

import { User } from "../../auth/store/useAuthStore";

interface ProfileDangerZoneProps {
  isAuthenticated: boolean;
  user: User | null;
  onResetDataClick: () => void;
  onLogoutClick: () => void;
}

export function ProfileDangerZone({
  isAuthenticated,
  user,
  onResetDataClick,
  onLogoutClick,
}: ProfileDangerZoneProps) {
  return (
    <div className="space-y-4">
      <h3 className="px-1 text-[10px] font-bold tracking-[0.2em] text-red-500/50 uppercase">
        Danger Zone
      </h3>
      <div className="group relative overflow-hidden rounded-[42px] border border-red-500/10 bg-red-500/[0.02] shadow-2xl backdrop-blur-md">
        {/* iOS Style Inner Glow */}
        <div className="pointer-events-none absolute -top-20 -right-20 h-60 w-60 rounded-full bg-red-500 opacity-0 blur-[100px] transition-opacity duration-1000 group-hover:opacity-10" />

        <button
          onClick={onResetDataClick}
          className="group/item relative z-10 flex w-full items-center justify-between border-b border-red-500/10 px-8 py-6 transition-all hover:bg-red-500/[0.05]"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-red-500 transition-transform group-hover/item:scale-110">
              <Trash2 size={18} />
            </div>
            <div className="text-left">
              <span className="block text-sm font-light text-red-400">
                Reset All Local Data
              </span>
              <span className="mt-0.5 block text-[10px] font-medium tracking-widest text-red-400/50 uppercase">
                Clear device storage
              </span>
            </div>
          </div>
          <ChevronRight
            size={14}
            className="text-red-400/40 transition-transform group-hover/item:translate-x-1"
          />
        </button>

        {isAuthenticated && (
          <button
            onClick={onLogoutClick}
            className="group/item relative z-10 flex w-full items-center justify-between px-8 py-6 transition-all hover:bg-red-500/[0.05]"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-red-500 transition-transform group-hover/item:scale-110">
                <UserRound size={18} />
              </div>
              <div className="text-left">
                <span className="block text-sm font-light text-red-400">
                  Log Out
                </span>
                <span className="mt-0.5 block text-[10px] font-medium tracking-widest text-red-400/50 uppercase">
                  {user?.email}
                </span>
              </div>
            </div>
            <ChevronRight
              size={14}
              className="text-red-400/40 transition-transform group-hover/item:translate-x-1"
            />
          </button>
        )}
      </div>
    </div>
  );
}
