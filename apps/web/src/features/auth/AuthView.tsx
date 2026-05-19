"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle,
  ChevronLeft,
  Key,
  Lock,
  Mail,
  User,
} from "lucide-react";
import React, { useState } from "react";

import { supabase } from "@/lib/supabaseClient";

interface AuthViewProps {
  onBack: () => void;
  onSuccess: () => void;
}

export function AuthView({ onBack, onSuccess }: AuthViewProps) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Forgot Password Flow States
  const [authFlow, setAuthFlow] = useState<
    "form" | "forgot_email" | "forgot_otp" | "forgot_reset" | "forgot_success"
  >("form");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input field
    if (value && index < 3) {
      const nextInput = document.getElementById(
        `otp-${index + 1}`,
      ) as HTMLInputElement | null;
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(
        `otp-${index - 1}`,
      ) as HTMLInputElement | null;
      if (prevInput) {
        prevInput.focus();
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
      }
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (/^\d{4}$/.test(pastedData)) {
      const newOtp = pastedData.split("");
      setOtp(newOtp);

      // Auto-focus last box
      const lastInput = document.getElementById(
        "otp-3",
      ) as HTMLInputElement | null;
      if (lastInput) lastInput.focus();
    }
  };

  const handleAuth = async () => {
    if (!email.trim() || !password.trim()) {
      setErrorMessage("Please enter both email and password.");
      return;
    }
    if (mode === "signup" && !name.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password: password.trim(),
          options: {
            data: {
              full_name: name.trim(),
            },
          },
        });
        if (error) throw error;
        alert(
          "Verification email sent! Please check your inbox (or spam folder) to verify your account, then log in.",
        );
        setMode("login");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim(),
        });
        if (error) throw error;

        // Successfully logged in!
        onSuccess();
      }
    } catch (err: any) {
      setErrorMessage(
        err.message || "An error occurred during authentication.",
      );
    } finally {
      setLoading(false);
    }
  };

  const renderFlowContent = () => {
    switch (authFlow) {
      case "forgot_email":
        return (
          <div className="space-y-8">
            {/* Header */}
            <div className="space-y-3 text-center">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mx-auto flex h-16 w-16 items-center justify-center rounded-[24px] bg-gradient-to-br from-indigo-500 to-purple-500 shadow-2xl shadow-indigo-500/20"
              >
                <Key size={28} className="text-white" />
              </motion.div>
              <div className="space-y-1">
                <h1 className="text-3xl font-light tracking-tight text-white">
                  Forgot Password
                </h1>
                <p className="mx-auto max-w-[280px] text-xs leading-relaxed font-light text-gray-500">
                  Enter your registered email address below, and we'll send you
                  a 4-digit code to verify your identity.
                </p>
              </div>
            </div>

            {/* Email Form */}
            <div className="space-y-4">
              <div className="group relative">
                <div className="absolute top-1/2 left-6 -translate-y-1/2 text-gray-500 transition-colors group-focus-within:text-indigo-500">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-14 w-full rounded-full border border-white/10 bg-white/[0.03] pr-6 pl-16 text-sm font-light text-white transition-all placeholder:text-gray-600 focus:border-indigo-500/50 focus:bg-white/[0.05] focus:outline-none"
                />
              </div>

              <button
                onClick={() => {
                  if (email.trim()) {
                    setAuthFlow("forgot_otp");
                  } else {
                    alert("Please enter your email address first.");
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

      case "forgot_otp":
        return (
          <div className="space-y-8">
            {/* Header */}
            <div className="space-y-3 text-center">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mx-auto flex h-16 w-16 items-center justify-center rounded-[24px] bg-gradient-to-br from-emerald-500 to-teal-500 shadow-2xl shadow-emerald-500/20"
              >
                <Lock size={28} className="text-white" />
              </motion.div>
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
                  alert(
                    `A new 4-digit verification code has been sent to ${email}`,
                  );
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

      case "forgot_reset":
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

      case "forgot_success":
        return (
          <div className="space-y-8">
            {/* Header */}
            <div className="space-y-4 text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mx-auto flex h-20 w-20 items-center justify-center rounded-[32px] bg-gradient-to-br from-emerald-400 to-green-600 shadow-2xl shadow-emerald-500/30"
              >
                <CheckCircle size={36} className="text-white" />
              </motion.div>
              <div className="space-y-1">
                <h1 className="text-3xl font-light tracking-tight text-white">
                  Password Reset
                </h1>
                <p className="mx-auto max-w-[280px] text-xs leading-relaxed font-light text-gray-500">
                  Your password has been successfully updated. You can now sign
                  in with your new credentials.
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

      default:
        return (
          <div className="space-y-8">
            {/* Header */}
            <div className="space-y-3 text-center">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mx-auto flex h-16 w-16 items-center justify-center rounded-[24px] bg-gradient-to-br from-emerald-500 to-blue-500 shadow-2xl shadow-emerald-500/20"
              >
                <Lock size={28} className="text-white" />
              </motion.div>
              <div className="space-y-1">
                <h1 className="text-3xl font-light tracking-tight text-white">
                  {mode === "login" ? "Welcome Back" : "Join Spirox"}
                </h1>
                <p className="text-xs font-light text-gray-500">
                  {mode === "login"
                    ? "Sign in to continue your journey."
                    : "Start your journey to mindfulness today."}
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="space-y-4">
              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {mode === "signup" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="group relative"
                    >
                      <div className="absolute top-1/2 left-6 -translate-y-1/2 text-gray-500 transition-colors group-focus-within:text-emerald-500">
                        <User size={16} />
                      </div>
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="h-14 w-full rounded-full border border-white/10 bg-white/[0.03] pr-6 pl-16 text-sm font-light text-white transition-all placeholder:text-gray-600 focus:border-emerald-500/50 focus:bg-white/[0.05] focus:outline-none"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="group relative">
                  <div className="absolute top-1/2 left-6 -translate-y-1/2 text-gray-500 transition-colors group-focus-within:text-emerald-500">
                    <Mail size={16} />
                  </div>
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-14 w-full rounded-full border border-white/10 bg-white/[0.03] pr-6 pl-16 text-sm font-light text-white transition-all placeholder:text-gray-600 focus:border-emerald-500/50 focus:bg-white/[0.05] focus:outline-none"
                  />
                </div>

                <div className="group relative">
                  <div className="absolute top-1/2 left-6 -translate-y-1/2 text-gray-500 transition-colors group-focus-within:text-emerald-500">
                    <Lock size={16} />
                  </div>
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-14 w-full rounded-full border border-white/10 bg-white/[0.03] pr-6 pl-16 text-sm font-light text-white transition-all placeholder:text-gray-600 focus:border-emerald-500/50 focus:bg-white/[0.05] focus:outline-none"
                  />
                </div>

                {mode === "login" && (
                  <div className="flex justify-end px-2">
                    <button
                      onClick={() => setAuthFlow("forgot_email")}
                      className="text-[10px] font-black tracking-widest text-gray-600 uppercase transition-colors hover:text-emerald-400"
                    >
                      Forgot Password?
                    </button>
                  </div>
                )}
              </div>

              {errorMessage && (
                <div className="shrink-0 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-center text-xs font-light text-red-400">
                  {errorMessage}
                </div>
              )}

              <button
                onClick={handleAuth}
                disabled={loading}
                className="flex h-14 w-full items-center justify-center gap-3 rounded-full bg-white text-[10px] font-black tracking-[0.2em] text-black uppercase shadow-2xl transition-all hover:bg-emerald-400 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Processing..."
                  : mode === "login"
                    ? "Sign In"
                    : "Create Account"}
                {!loading && <ArrowRight size={16} strokeWidth={3} />}
              </button>
            </div>

            {/* Divider */}
            <div className="relative flex items-center gap-4">
              <div className="h-px flex-1 bg-white/5" />
              <span className="text-[9px] font-bold tracking-widest text-gray-700 uppercase">
                Or continue with
              </span>
              <div className="h-px flex-1 bg-white/5" />
            </div>

            {/* Social Auth */}
            <div className="grid grid-cols-2 gap-3">
              <button className="group flex h-14 items-center justify-center gap-3 rounded-full border border-white/10 bg-white/[0.03] text-gray-500 transition-all hover:bg-white/5 hover:text-white active:scale-95">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="text-white transition-transform group-hover:scale-110"
                >
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09zM12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23zM5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85zM12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span className="text-[9px] font-black tracking-widest text-gray-500 uppercase transition-colors group-hover:text-white">
                  Google
                </span>
              </button>
              <button className="group flex h-14 items-center justify-center gap-3 rounded-full border border-white/10 bg-white/[0.03] text-gray-500 transition-all hover:bg-white/5 hover:text-white active:scale-95">
                <svg
                  width="15"
                  height="18"
                  viewBox="0 0 256 315"
                  fill="currentColor"
                  className="text-white transition-transform group-hover:scale-110"
                >
                  <path d="M213.803 167.03c.442 47.58 41.74 63.413 42.147 63.615-.35 1.116-6.599 22.563-21.757 44.716-13.104 19.153-26.705 38.235-48.13 38.63-21.05.394-27.815-12.44-51.848-12.44-24.032 0-31.504 12.047-51.456 12.834-20.741.786-36.64-21.123-49.854-40.215-27.017-39.041-47.652-110.192-19.828-158.451 13.82-24.02 38.53-39.223 65.333-39.617 20.346-.393 39.512 13.71 52.032 13.71 12.522 0 35.844-16.913 60.604-14.44 10.387.43 39.589 4.184 58.293 31.593-1.496.932-34.881 20.32-34.453 60.038zM174.17 49.303c11.091-13.43 18.594-32.131 16.554-50.803-16.038.645-35.414 10.68-46.913 24.11-10.313 11.954-19.34 31.065-16.902 49.336 17.904 1.389 36.174-9.213 47.261-22.643z" />
                </svg>
                <span className="text-[9px] font-black tracking-widest text-gray-500 uppercase transition-colors group-hover:text-white">
                  Apple ID
                </span>
              </button>
            </div>

            {/* Toggle Mode */}
            <div className="pt-2 text-center">
              <button
                onClick={() => setMode(mode === "login" ? "signup" : "login")}
                className="text-xs font-light text-gray-600 transition-colors hover:text-emerald-400"
              >
                {mode === "login"
                  ? "Don't have an account? Sign up"
                  : "Already have an account? Sign in"}
              </button>
            </div>
          </div>
        );
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
        <button
          onClick={onBack}
          className="mb-6 flex h-10 w-10 items-center justify-center self-start rounded-xl bg-white/5 transition-colors hover:bg-white/10"
        >
          <ChevronLeft size={18} className="text-gray-400" />
        </button>

        <div className="flex flex-1 flex-col justify-center space-y-8">
          {renderFlowContent()}
        </div>

        {/* Footer */}
        <p className="mt-auto pt-8 text-center text-[9px] font-medium tracking-tighter text-gray-800">
          By continuing, you agree to our{" "}
          <span className="text-gray-700">Terms</span> and{" "}
          <span className="text-gray-700">Privacy</span>.
        </p>
      </div>

      {/* Decorative Blur Elements */}
      <div className="pointer-events-none fixed -top-20 -right-20 h-80 w-80 rounded-full bg-emerald-500/10 blur-[100px]" />
      <div className="pointer-events-none fixed -bottom-20 -left-20 h-80 w-80 rounded-full bg-blue-500/10 blur-[100px]" />
    </motion.div>
  );
}
