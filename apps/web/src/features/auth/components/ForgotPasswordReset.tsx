import { motion } from "framer-motion";
import { ArrowRight, Lock } from "lucide-react";
import React from "react";
import { useAuthFlow } from "../hooks/useAuthFlow";

interface ForgotPasswordResetProps {
  flow: ReturnType<typeof useAuthFlow>;
}

export function ForgotPasswordReset({ flow }: ForgotPasswordResetProps) {
  const {
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    setAuthFlow,
  } = flow;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-3 text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-[24px] bg-gradient-to-br from-blue-500 to-indigo-500 shadow-2xl shadow-blue-500/20"
        >
          <Lock size={28} className="text-white" />
        </motion.div>
        <div className="space-y-1">
          <h1 className="text-3xl font-light tracking-tight text-white">
            Reset Password
          </h1>
          <p className="mx-auto max-w-[280px] text-xs leading-relaxed font-light text-gray-500">
            Create a strong, secure new password for your Spirox account.
          </p>
        </div>
      </div>

      {/* Passwords Form */}
      <div className="space-y-4">
        <div className="space-y-3">
          <div className="group relative">
            <div className="absolute top-1/2 left-6 -translate-y-1/2 text-gray-500 transition-colors group-focus-within:text-blue-500">
              <Lock size={16} />
            </div>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="h-14 w-full rounded-full border border-white/10 bg-white/[0.03] pr-6 pl-16 text-sm font-light text-white transition-all placeholder:text-gray-600 focus:border-blue-500/50 focus:bg-white/[0.05] focus:outline-none"
            />
          </div>

          <div className="group relative">
            <div className="absolute top-1/2 left-6 -translate-y-1/2 text-gray-500 transition-colors group-focus-within:text-blue-500">
              <Lock size={16} />
            </div>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="h-14 w-full rounded-full border border-white/10 bg-white/[0.03] pr-6 pl-16 text-sm font-light text-white transition-all placeholder:text-gray-600 focus:border-blue-500/50 focus:bg-white/[0.05] focus:outline-none"
            />
          </div>
        </div>

        <button
          onClick={() => {
            if (!newPassword.trim() || !confirmPassword.trim()) {
              alert("Please fill out both password fields.");
              return;
            }
            if (newPassword !== confirmPassword) {
              alert("Passwords do not match. Please verify your typing.");
              return;
            }
            setAuthFlow("forgot_success");
          }}
          className="flex h-14 w-full items-center justify-center gap-3 rounded-full bg-white text-[10px] font-black tracking-[0.2em] text-black uppercase shadow-2xl transition-all hover:bg-blue-400 active:scale-95"
        >
          Save New Password
          <ArrowRight size={16} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}
