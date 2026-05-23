import { AnimatePresence, motion } from "framer-motion";
import { Shield } from "lucide-react";
import React from "react";

interface ResetConfirmationModalProps {
  showResetConfirm: boolean;
  setShowResetConfirm: (val: boolean) => void;
  onResetData: () => void;
}

export function ResetConfirmationModal({
  showResetConfirm,
  setShowResetConfirm,
  onResetData,
}: ResetConfirmationModalProps) {
  if (!showResetConfirm) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 px-8 backdrop-blur-md"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="relative w-full max-w-sm space-y-6 rounded-[40px] border border-white/10 bg-black/60 p-8 text-center shadow-2xl backdrop-blur-2xl"
        >
          <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-3xl bg-red-500/20 text-red-500">
            <Shield size={32} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-light text-white">
              Reset Application?
            </h3>
            <p className="text-sm leading-relaxed font-light text-white/40">
              This will permanently delete all your custom exercises, favorites,
              and statistics. This cannot be undone.
            </p>
          </div>
          <div className="flex flex-col gap-3 pt-4">
            <button
              onClick={onResetData}
              className="h-14 w-full rounded-2xl bg-red-500 text-sm font-bold tracking-widest text-white uppercase shadow-lg shadow-red-500/20 transition-all active:scale-95"
            >
              Confirm Delete
            </button>
            <button
              onClick={() => setShowResetConfirm(false)}
              className="h-14 w-full rounded-2xl bg-white/5 text-sm font-bold tracking-widest text-white/40 uppercase transition-all active:scale-95"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
