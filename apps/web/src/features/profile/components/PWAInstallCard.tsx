import { motion } from "framer-motion";
import { ChevronRight, Smartphone } from "lucide-react";
import React from "react";

interface PWAInstallCardProps {
  isInstallable: boolean;
  onInstallClick: () => void;
}

export function PWAInstallCard({
  isInstallable,
  onInstallClick,
}: PWAInstallCardProps) {
  if (!isInstallable) return null;

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onInstallClick}
      className="group relative w-full overflow-hidden rounded-[36px] border border-white/[0.06] bg-white/[0.02] p-6 text-left backdrop-blur-md"
    >
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
  );
}
