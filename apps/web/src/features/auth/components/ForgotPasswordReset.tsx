import { motion } from "framer-motion";
import { ArrowRight, Eye, EyeOff, Lock } from "lucide-react";
import React, { useState } from "react";
import { useAuthFlow } from "../hooks/useAuthFlow";
import { passwordSchema } from "../utils/validation";

interface ForgotPasswordResetProps {
  flow: ReturnType<typeof useAuthFlow>;
}

export function ForgotPasswordReset({ flow }: ForgotPasswordResetProps) {
  const {
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    formErrors,
    setFormErrors,
    setAuthFlow,
  } = flow;

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const clearError = (field: string) => {
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-3 text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-[24px] border border-white/10 bg-transparent"
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
          <div className="space-y-1">
            <div className="group relative">
              <div className="absolute top-1/2 left-6 -translate-y-1/2 text-gray-500 transition-colors group-focus-within:text-blue-500">
                <Lock size={16} />
              </div>
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  clearError("newPassword");
                }}
                className={`h-14 w-full rounded-full border bg-white/[0.03] pr-12 pl-16 text-sm font-light text-white transition-all placeholder:text-gray-600 focus:bg-white/[0.05] focus:outline-none ${
                  formErrors.newPassword
                    ? "border-red-500/50 focus:border-red-500/80"
                    : "border-white/10 focus:border-blue-500/50"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-500 transition-colors hover:text-white"
              >
                {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {formErrors.newPassword && (
              <p className="pl-6 text-[10px] text-red-400">
                {formErrors.newPassword}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <div className="group relative">
              <div className="absolute top-1/2 left-6 -translate-y-1/2 text-gray-500 transition-colors group-focus-within:text-blue-500">
                <Lock size={16} />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  clearError("confirmPassword");
                }}
                className={`h-14 w-full rounded-full border bg-white/[0.03] pr-12 pl-16 text-sm font-light text-white transition-all placeholder:text-gray-600 focus:bg-white/[0.05] focus:outline-none ${
                  formErrors.confirmPassword
                    ? "border-red-500/50 focus:border-red-500/80"
                    : "border-white/10 focus:border-blue-500/50"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-500 transition-colors hover:text-white"
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {formErrors.confirmPassword && (
              <p className="pl-6 text-[10px] text-red-400">
                {formErrors.confirmPassword}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={() => {
            setFormErrors({});
            const result = passwordSchema.safeParse(newPassword);
            if (!result.success) {
              setFormErrors({ newPassword: result.error.issues[0].message });
              return;
            }
            if (newPassword !== confirmPassword) {
              setFormErrors({ confirmPassword: "Passwords do not match." });
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
