import { motion } from "framer-motion";
import { ArrowRight, Lock } from "lucide-react";
import React from "react";
import { useAuthFlow } from "../hooks/useAuthFlow";

interface ForgotPasswordOtpProps {
  flow: ReturnType<typeof useAuthFlow>;
}

export function ForgotPasswordOtp({ flow }: ForgotPasswordOtpProps) {
  const {
    email,
    otp,
    setOtp,
    setAuthFlow,
    handleOtpChange,
    handleOtpKeyDown,
    handleOtpPaste,
  } = flow;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-3 text-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-light tracking-tight text-white">
            Enter Code
          </h1>
          <p className="mx-auto max-w-[280px] text-xs leading-relaxed font-light text-gray-500">
            We've sent a 4-digit verification code to{" "}
            <span className="font-medium text-emerald-400">{email}</span>.
          </p>
        </div>
      </div>

      {/* 4-Digit OTP Boxes */}
      <div className="space-y-6">
        <div className="flex justify-center gap-4">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              id={`otp-${idx}`}
              type="text"
              inputMode="numeric"
              pattern="\d*"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(idx, e.target.value)}
              onKeyDown={(e) => handleOtpKeyDown(idx, e)}
              onPaste={idx === 0 ? handleOtpPaste : undefined}
              className="h-16 w-14 rounded-full border border-white/10 bg-white/[0.03] text-center text-2xl font-light text-white transition-all focus:border-emerald-500/50 focus:bg-white/[0.05] focus:outline-none"
            />
          ))}
        </div>

        <button
          onClick={() => {
            const enteredCode = otp.join("");
            if (enteredCode.length === 4) {
              setAuthFlow("forgot_reset");
            } else {
              alert("Please enter the complete 4-digit code.");
            }
          }}
          className="flex h-14 w-full items-center justify-center gap-3 rounded-full bg-white text-[10px] font-black tracking-[0.2em] text-black uppercase shadow-2xl transition-all hover:bg-emerald-400 active:scale-95"
        >
          Verify Code
          <ArrowRight size={16} strokeWidth={3} />
        </button>
      </div>

      {/* Resend and Back Option */}
      <div className="flex flex-col items-center gap-3">
        <button
          onClick={() => {
            setOtp(["", "", "", ""]);
            alert(`A new 4-digit verification code has been sent to ${email}`);
          }}
          className="text-[10px] font-black tracking-widest text-gray-500 uppercase transition-colors hover:text-emerald-400"
        >
          Resend Code
        </button>
        <button
          onClick={() => setAuthFlow("forgot_email")}
          className="text-xs font-light text-gray-600 transition-colors hover:text-emerald-400"
        >
          Back to Email Input
        </button>
      </div>
    </div>
  );
}
