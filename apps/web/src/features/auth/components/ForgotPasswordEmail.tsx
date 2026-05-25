import { motion } from "framer-motion";
import { ArrowRight, Key, Mail } from "lucide-react";
import React from "react";

import { useAuthFlow } from "../hooks/useAuthFlow";
import { emailSchema } from "../utils/validation";

interface ForgotPasswordEmailProps {
  flow: ReturnType<typeof useAuthFlow>;
}

export function ForgotPasswordEmail({ flow }: ForgotPasswordEmailProps) {
  const { email, setEmail, formErrors, setFormErrors, setAuthFlow } = flow;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-3 text-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-light tracking-tight text-white">
            Forgot Password
          </h1>
          <p className="mx-auto max-w-[280px] text-xs leading-relaxed font-light text-gray-500">
            Enter your registered email address below, and we'll send you a
            4-digit code to verify your identity.
          </p>
        </div>
      </div>

      {/* Email Form */}
      <div className="space-y-4">
        <div className="space-y-1">
          <div className="group relative">
            <div className="absolute top-1/2 left-6 -translate-y-1/2 text-gray-500 transition-colors group-focus-within:text-indigo-500">
              <Mail size={16} />
            </div>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (formErrors.email) {
                  const newErrors = { ...formErrors };
                  delete newErrors.email;
                  setFormErrors(newErrors);
                }
              }}
              className={`h-14 w-full rounded-full border bg-white/[0.03] pr-6 pl-16 text-sm font-light text-white transition-all placeholder:text-gray-600 focus:bg-white/[0.05] focus:outline-none ${
                formErrors.email
                  ? "border-red-500/50 focus:border-red-500/80"
                  : "border-white/10 focus:border-indigo-500/50"
              }`}
            />
          </div>
          {formErrors.email && (
            <p className="pl-6 text-[10px] text-red-400">{formErrors.email}</p>
          )}
        </div>

        <button
          onClick={() => {
            const result = emailSchema.safeParse(email);
            if (result.success) {
              setFormErrors({});
              setAuthFlow("forgot_otp");
            } else {
              setFormErrors({ email: result.error.issues[0].message });
            }
          }}
          className="flex h-14 w-full items-center justify-center gap-3 rounded-full bg-white text-[10px] font-black tracking-[0.2em] text-black uppercase shadow-2xl transition-all hover:bg-indigo-400 active:scale-95"
        >
          Send Verification Code
          <ArrowRight size={16} strokeWidth={3} />
        </button>
      </div>

      {/* Back to Login */}
      <div className="text-center">
        <button
          onClick={() => setAuthFlow("form")}
          className="text-xs font-light text-gray-600 transition-colors hover:text-indigo-400"
        >
          Back to Sign In
        </button>
      </div>
    </div>
  );
}
