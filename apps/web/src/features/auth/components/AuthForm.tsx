import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Lock, Mail, User } from "lucide-react";
import React from "react";
import { SocialAuth } from "./SocialAuth";
import { useAuthFlow } from "../hooks/useAuthFlow";

interface AuthFormProps {
  flow: ReturnType<typeof useAuthFlow>;
}

export function AuthForm({ flow }: AuthFormProps) {
  const {
    mode,
    setMode,
    email,
    setEmail,
    password,
    setPassword,
    name,
    setName,
    loading,
    errorMessage,
    formErrors,
    setFormErrors,
    setAuthFlow,
    handleAuth,
  } = flow;

  // Helper to clear specific field error on change
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
                <div className="space-y-1">
                  <div className="group relative">
                    <div className="absolute top-1/2 left-6 -translate-y-1/2 text-gray-500 transition-colors group-focus-within:text-emerald-500">
                      <User size={16} />
                    </div>
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        clearError("name");
                      }}
                      className={`h-14 w-full rounded-full border bg-white/[0.03] pr-6 pl-16 text-sm font-light text-white transition-all placeholder:text-gray-600 focus:bg-white/[0.05] focus:outline-none ${
                        formErrors.name
                          ? "border-red-500/50 focus:border-red-500/80"
                          : "border-white/10 focus:border-emerald-500/50"
                      }`}
                    />
                  </div>
                  {formErrors.name && (
                    <p className="pl-6 text-[10px] text-red-400">
                      {formErrors.name}
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-1">
            <div className="group relative">
              <div className="absolute top-1/2 left-6 -translate-y-1/2 text-gray-500 transition-colors group-focus-within:text-emerald-500">
                <Mail size={16} />
              </div>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  clearError("email");
                }}
                className={`h-14 w-full rounded-full border bg-white/[0.03] pr-6 pl-16 text-sm font-light text-white transition-all placeholder:text-gray-600 focus:bg-white/[0.05] focus:outline-none ${
                  formErrors.email
                    ? "border-red-500/50 focus:border-red-500/80"
                    : "border-white/10 focus:border-emerald-500/50"
                }`}
              />
            </div>
            {formErrors.email && (
              <p className="pl-6 text-[10px] text-red-400">
                {formErrors.email}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <div className="group relative">
              <div className="absolute top-1/2 left-6 -translate-y-1/2 text-gray-500 transition-colors group-focus-within:text-emerald-500">
                <Lock size={16} />
              </div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  clearError("password");
                }}
                className={`h-14 w-full rounded-full border bg-white/[0.03] pr-6 pl-16 text-sm font-light text-white transition-all placeholder:text-gray-600 focus:bg-white/[0.05] focus:outline-none ${
                  formErrors.password
                    ? "border-red-500/50 focus:border-red-500/80"
                    : "border-white/10 focus:border-emerald-500/50"
                }`}
              />
            </div>
            {formErrors.password && (
              <p className="pl-6 text-[10px] text-red-400">
                {formErrors.password}
              </p>
            )}
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
      <SocialAuth />

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
