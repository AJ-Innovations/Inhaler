import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import React from "react";
import { useAuthFlow } from "../hooks/useAuthFlow";

interface ForgotPasswordSuccessProps {
  flow: ReturnType<typeof useAuthFlow>;
}

export function ForgotPasswordSuccess({ flow }: ForgotPasswordSuccessProps) {
  const { setNewPassword, setConfirmPassword, setEmail, setOtp, setAuthFlow } =
    flow;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-[32px] border border-white/10 bg-transparent"
        >
          <CheckCircle size={36} className="text-white" />
        </motion.div>
        <div className="space-y-1">
          <h1 className="text-3xl font-light tracking-tight text-white">
            Password Reset
          </h1>
          <p className="mx-auto max-w-[280px] text-xs leading-relaxed font-light text-gray-500">
            Your password has been successfully updated. You can now sign in
            with your new credentials.
          </p>
        </div>
      </div>

      <button
        onClick={() => {
          setNewPassword("");
          setConfirmPassword("");
          setEmail("");
          setOtp(["", "", "", ""]);
          setAuthFlow("form");
        }}
        className="h-14 w-full rounded-full bg-white text-[10px] font-black tracking-[0.2em] text-black uppercase shadow-2xl transition-all hover:bg-emerald-400 active:scale-95"
      >
        Sign In Now
      </button>
    </div>
  );
}
