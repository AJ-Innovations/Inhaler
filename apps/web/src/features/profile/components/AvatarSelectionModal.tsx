import { AnimatePresence, motion } from "framer-motion";
import { Check, Image as ImageIcon, Upload, X } from "lucide-react";
import React, { RefObject } from "react";
import { SUGGESTED_AVATARS } from "../data/constants";

interface AvatarSelectionModalProps {
  isSelectingAvatar: boolean;
  setIsSelectingAvatar: (val: boolean) => void;
  userAvatar: string | null;
  onUpdateAvatar: (avatar: string | null) => void;
  fileInputRef: RefObject<HTMLInputElement | null>;
}

export function AvatarSelectionModal({
  isSelectingAvatar,
  setIsSelectingAvatar,
  userAvatar,
  onUpdateAvatar,
  fileInputRef,
}: AvatarSelectionModalProps) {
  if (!isSelectingAvatar) return null;

  return (
    <AnimatePresence>
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
            {SUGGESTED_AVATARS.map((avatar) => (
              <div key={avatar.id} className="flex flex-col items-center gap-3">
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
                      <Check size={10} className="text-black" strokeWidth={4} />
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
    </AnimatePresence>
  );
}
