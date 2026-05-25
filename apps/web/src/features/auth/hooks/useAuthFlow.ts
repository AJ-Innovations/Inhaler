"use client";

import React, { useState } from "react";
import { z } from "zod";

import { signInWithEmail, signUpWithEmail } from "../api/auth";
import { useAuthStore } from "../store/useAuthStore";
import { AuthFlowState, AuthMode, FormErrors } from "../types";
import { formatZodError, loginSchema, signupSchema } from "../utils/validation";

/**
 * Manages all authentication state: login/signup, forgot password flow,
 * OTP input handling, and Supabase integration.
 * Extracted from AuthView.tsx for separation of concerns.
 */
export function useAuthFlow(onSuccess: () => void) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

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
    setFormErrors({});
    setErrorMessage(null);

    // 1. Validate Inputs with Zod
    try {
      if (mode === "signup") {
        signupSchema.parse({ email, password, name });
      } else {
        loginSchema.parse({ email, password });
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        setFormErrors(formatZodError(err));
      }
      return;
    }

    // 2. Execute API Calls
    setLoading(true);

    try {
      if (mode === "signup") {
        await signUpWithEmail(email.trim(), password.trim(), name.trim());
        alert(
          "Verification email sent! Please check your inbox (or spam folder) to verify your account, then log in.",
        );
        setMode("login");
      } else {
        const result = await signInWithEmail(email.trim(), password.trim());
        if (result.user) {
          useAuthStore.getState().login({
            id: result.user.id,
            email: result.user.email || "",
            name: result.user.user_metadata?.full_name || "User",
            avatar: result.user.user_metadata?.avatar_url || null,
          });
        }
        // Successfully logged in!
        onSuccess();
      }
    } catch (err: any) {
      let errorMsg = err.message || "An error occurred during authentication.";

      // Supabase uses generic messages for security; translate to a more standard/user-friendly message
      if (
        mode === "login" &&
        errorMsg.toLowerCase().includes("invalid login credentials")
      ) {
        errorMsg =
          "User not found or incorrect password. Please check your details.";
      }

      setErrorMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === "login" ? "signup" : "login");
    setErrorMessage(null);
    setFormErrors({});
  };

  return {
    mode,
    switchMode,
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
