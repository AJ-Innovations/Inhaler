"use client";

import { supabase } from "@libs/supabaseClient";
import React, { useState } from "react";

export type AuthFlowState =
  | "form"
  | "forgot_email"
  | "forgot_otp"
  | "forgot_reset"
  | "forgot_success";

/**
 * Manages all authentication state: login/signup, forgot password flow,
 * OTP input handling, and Supabase integration.
 * Extracted from AuthView.tsx for separation of concerns.
 */
export function useAuthFlow(onSuccess: () => void) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Forgot Password Flow States
  const [authFlow, setAuthFlow] = useState<AuthFlowState>("form");
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

  return {
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
    authFlow,
    setAuthFlow,
    otp,
    setOtp,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    handleOtpChange,
    handleOtpKeyDown,
    handleOtpPaste,
    handleAuth,
  };
}
