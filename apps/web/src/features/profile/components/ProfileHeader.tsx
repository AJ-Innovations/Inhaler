import { AnimatePresence, motion } from "framer-motion";
import { Camera, Check, Edit2, Sparkles, UserRound, X } from "lucide-react";
import Image from "next/image";
import React from "react";

interface ProfileHeaderProps {
  userName: string;
  userAvatar: string | null;
  tempName: string;
  isEditingName: boolean;
  setTempName: (name: string) => void;
  setIsEditingName: (editing: boolean) => void;
  handleSaveName: () => void;
  setIsSelectingAvatar: (selecting: boolean) => void;
  isAuthenticated?: boolean;
  authUserName?: string;
  isPremium?: boolean;
}

export function ProfileHeader({
  userName,
  userAvatar,
  tempName,
  isEditingName,
  setTempName,
  setIsEditingName,
  handleSaveName,
  setIsSelectingAvatar,
  isAuthenticated,
  authUserName,
  isPremium,
}: ProfileHeaderProps) {
  const displayTitle = isAuthenticated
    ? authUserName || "Active Account"
    : userName;
  const displaySubtitle = isAuthenticated
    ? isPremium
      ? "Premium Plan • Spirox User"
      : "Free Plan • Spirox User"
    : "Spirox User • Offline Mode";

  return (
    <div className="flex flex-col items-center pt-4">
      <div className="group relative">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="relative mb-6 h-40 w-40 cursor-pointer overflow-hidden rounded-full bg-white/[0.04] p-1 shadow-2xl"
          onClick={() => setIsSelectingAvatar(true)}
        >
          <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full border border-white/10 bg-transparent">
            {userAvatar ? (
              <Image
                src={userAvatar}
                alt="Avatar"
                fill
                className="object-cover"
              />
            ) : (
              <UserRound size={80} strokeWidth={1} className="text-white/20" />
            )}

            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
              <Camera size={32} className="mb-1 text-white" />
              <span className="text-[10px] font-black tracking-widest text-white uppercase">
                Update Image
              </span>
            </div>
          </div>
          <div className="pointer-events-none absolute inset-0 rounded-full bg-white/5 opacity-50 blur-3xl" />
        </motion.div>

        <button
          className="absolute right-1 bottom-8 z-20 flex h-10 w-10 items-center justify-center rounded-full border-4 border-black bg-white text-black shadow-lg transition-all hover:scale-110 active:scale-95"
          onClick={() => setIsEditingName(true)}
        >
          <Edit2 size={16} />
        </button>
      </div>

      <AnimatePresence mode="wait">
        {isEditingName ? (
          <motion.div
            key="edit"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mt-2 flex items-center gap-2"
          >
            <input
              autoFocus
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
              className="w-56 rounded-2xl border border-white/20 bg-white/5 px-4 py-2 text-center text-2xl font-light text-white focus:border-white/40 focus:outline-none"
            />
            <button
              onClick={handleSaveName}
              className="rounded-2xl bg-white p-3 text-black"
            >
              <Check size={20} />
            </button>
            <button
              onClick={() => {
                setIsEditingName(false);
                setTempName(userName);
              }}
              className="rounded-2xl bg-white/5 p-3 text-white/40"
            >
              <X size={20} />
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="display"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center"
          >
            <h2 className="text-3xl font-light tracking-tight text-white capitalize">
              {displayTitle}
            </h2>
            <div className="mt-2 flex items-center justify-center gap-2">
              <Sparkles size={12} className="text-white/60" />
              <p className="text-[10px] font-bold tracking-[0.3em] text-white/40 uppercase">
                {displaySubtitle}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
