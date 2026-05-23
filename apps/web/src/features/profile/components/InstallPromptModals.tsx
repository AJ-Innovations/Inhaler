import { AnimatePresence, motion } from "framer-motion";
import { Shield, X, Zap as ZapIcon } from "lucide-react";
import React from "react";

interface IOSInstallPromptModalProps {
  showIOSPrompt: boolean;
  setShowIOSPrompt: (val: boolean) => void;
}

export function IOSInstallPromptModal({
  showIOSPrompt,
  setShowIOSPrompt,
}: IOSInstallPromptModalProps) {
  if (!showIOSPrompt) return null;

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
                Add to Home Screen
              </h3>
              <p className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase">
                iOS Safari Setup
              </p>
            </div>
            <button
              onClick={() => setShowIOSPrompt(false)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white/40 transition-colors hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-6">
            <p className="text-sm leading-relaxed font-light text-white/50">
              Safari doesn't support automatic 1-click installations, but you
              can add Spirox to your home screen in 3 quick steps:
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs font-bold text-white">
                  1
                </div>
                <p className="pt-0.5 text-sm font-light text-white/70">
                  Tap the <span className="font-medium text-white">Share</span>{" "}
                  button (looks like a square with an upward arrow) in Safari.
                </p>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs font-bold text-white">
                  2
                </div>
                <p className="pt-0.5 text-sm font-light text-white/70">
                  Scroll down the list of options and select{" "}
                  <span className="font-medium text-white">
                    "Add to Home Screen"
                  </span>
                  .
                </p>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs font-bold text-white">
                  3
                </div>
                <p className="pt-0.5 text-sm font-light text-white/70">
                  Confirm by tapping{" "}
                  <span className="font-medium text-white">"Add"</span> in the
                  top right corner!
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t border-white/5 pt-4">
            <button
              onClick={() => setShowIOSPrompt(false)}
              className="h-14 w-full rounded-2xl bg-white text-sm font-bold tracking-widest text-black uppercase transition-all active:scale-95"
            >
              Got It
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

interface DesktopInstallPromptModalProps {
  showDesktopInstallPrompt: boolean;
  setShowDesktopInstallPrompt: (val: boolean) => void;
  onInstallPWA?: () => void;
}

export function DesktopInstallPromptModal({
  showDesktopInstallPrompt,
  setShowDesktopInstallPrompt,
  onInstallPWA,
}: DesktopInstallPromptModalProps) {
  if (!showDesktopInstallPrompt) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/20 px-8 backdrop-blur-2xl"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="relative w-full max-w-md space-y-8 rounded-[48px] border border-white/10 bg-white/5 p-10 shadow-[0_0_40px_rgba(255,255,255,0.05)] backdrop-blur-3xl"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-2xl font-light tracking-tight text-white">
                Install Spirox
              </h3>
              <p className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase">
                Native App Experience
              </p>
            </div>
            <button
              onClick={() => setShowDesktopInstallPrompt(false)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white/40 transition-colors hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4 rounded-[28px] border border-white/10 bg-white/5 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-[20px] bg-white text-black shadow-lg">
                <ZapIcon size={24} />
              </div>
              <div>
                <h4 className="text-sm font-medium text-white">
                  Lightning Fast
                </h4>
                <p className="text-xs text-white/50">
                  Starts instantly, no loading screens
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-[28px] border border-white/10 bg-white/5 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-[20px] bg-white text-black shadow-lg">
                <Shield size={24} />
              </div>
              <div>
                <h4 className="text-sm font-medium text-white">
                  Works Offline
                </h4>
                <p className="text-xs text-white/50">
                  Breathe anywhere without internet
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t border-white/5 pt-6">
            <button
              onClick={() => {
                setShowDesktopInstallPrompt(false);
                onInstallPWA?.();
              }}
              className="h-14 w-full rounded-[28px] bg-white text-sm font-bold tracking-widest text-black uppercase shadow-xl transition-all hover:scale-105 active:scale-95"
            >
              Install App
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
