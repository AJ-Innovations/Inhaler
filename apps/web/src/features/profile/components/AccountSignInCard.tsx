import { ChevronRight, Mail } from "lucide-react";
import React from "react";

interface AccountSignInCardProps {
  isAuthenticated: boolean;
  onLogin: () => void;
}

export function AccountSignInCard({
  isAuthenticated,
  onLogin,
}: AccountSignInCardProps) {
  if (isAuthenticated) return null;

  return (
    <div className="space-y-4">
      <h3 className="px-1 text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase">
        Account
      </h3>
      <div className="group relative overflow-hidden rounded-[42px] border border-white/[0.06] bg-white/[0.02] shadow-2xl backdrop-blur-md">
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
  );
}
