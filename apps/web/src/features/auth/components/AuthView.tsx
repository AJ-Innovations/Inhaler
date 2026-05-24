"use client";

import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import React from "react";

import { useAuthFlow } from "../hooks/useAuthFlow";
import { AuthForm } from "./AuthForm";
import { ForgotPasswordEmail } from "./ForgotPasswordEmail";
import { ForgotPasswordOtp } from "./ForgotPasswordOtp";
import { ForgotPasswordReset } from "./ForgotPasswordReset";
import { ForgotPasswordSuccess } from "./ForgotPasswordSuccess";

interface AuthViewProps {
  onBack?: () => void;
  onSuccess: () => void;
}

export function AuthView({ onBack, onSuccess }: AuthViewProps) {
  const flow = useAuthFlow(onSuccess);

  const renderFlowContent = () => {
    switch (flow.authFlow) {
      case "forgot_email":
        return <ForgotPasswordEmail flow={flow} />;
      case "forgot_otp":
        return <ForgotPasswordOtp flow={flow} />;
      case "forgot_reset":
        return <ForgotPasswordReset flow={flow} />;
      case "forgot_success":
        return <ForgotPasswordSuccess flow={flow} />;
      default:
        return <AuthForm flow={flow} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] flex flex-col overflow-hidden bg-transparent backdrop-blur-2xl"
    >
      <div className="mx-auto flex h-full w-full max-w-[480px] flex-col px-8 py-6">
        {/* Back Button */}
        {onBack && (
          <button
            onClick={onBack}
            className="mb-6 flex h-10 w-10 items-center justify-center self-start rounded-xl bg-white/5 transition-colors hover:bg-white/10"
          >
            <ChevronLeft size={18} className="text-gray-400" />
          </button>
        )}

        <div className="flex flex-1 flex-col justify-center space-y-8">
          {renderFlowContent()}
        </div>

        {/* Footer */}
        <p className="mt-auto pt-8 text-center text-[10px] font-medium tracking-tighter text-gray-500">
          By continuing, you agree to our{" "}
          <span className="text-gray-400">Terms</span> and{" "}
          <span className="text-gray-400">Privacy</span>.
        </p>
      </div>

      {/* Decorative Blur Elements */}
      <div className="pointer-events-none fixed -top-20 -right-20 h-80 w-80 rounded-full bg-emerald-500/10 blur-[100px]" />
      <div className="pointer-events-none fixed -bottom-20 -left-20 h-80 w-80 rounded-full bg-blue-500/10 blur-[100px]" />
    </motion.div>
  );
}
