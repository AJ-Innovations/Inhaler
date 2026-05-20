"use client";

import React, { useEffect, useState } from "react";

import { FALLBACK_COUNTRIES } from "../data/onboardingSteps";

export type OnboardingStep =
  | "intro"
  | "q_goal"
  | "q_stress"
  | "q_experience"
  | "q_country"
  | "calibrating"
  | "paywall"
  | "auth"
  | "payment"
  | "success";

export interface CountryData {
  code: string;
  name: string;
  flag: string;
}

/**
 * Manages all onboarding state: step navigation, user selections,
 * country detection/search, calibration animation, and payment form.
 * Extracted from OnboardingView.tsx for separation of concerns.
 */
export function useOnboardingFlow(
  onComplete: (planId: string, userName?: string) => void,
) {
  const [step, setStep] = useState<OnboardingStep>("intro");
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [selectedStress, setSelectedStress] = useState<string | null>(null);
  const [selectedExperience, setSelectedExperience] = useState<string | null>(
    null,
  );
  const [chosenPlan, setChosenPlan] = useState<"free" | "pro" | "premium">(
    "pro",
  );
  const [detectedCountry, setDetectedCountry] = useState("US");
  const [selectedCountry, setSelectedCountry] = useState("US");

  // Dynamic Country Fetching States
  const [countries, setCountries] = useState<CountryData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoadingCountries, setIsLoadingCountries] = useState(false);

  const selectedCountryData = countries.find(
    (c) => c.code === selectedCountry,
  ) || {
    code: selectedCountry,
    name: selectedCountry === "US" ? "United States" : selectedCountry,
    flag: `https://flagcdn.com/w40/${selectedCountry.toLowerCase()}.png`,
  };
  const detectedCountryName =
    countries.find((c) => c.code === detectedCountry)?.name || "United States";

  useEffect(() => {
    let active = true;
    async function fetchCountries() {
      setIsLoadingCountries(true);
      try {
        const res = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,cca2,flags",
        );
        if (res.ok) {
          const data = await res.json();
          const list = data
            .map((c: any) => ({
              code: c.cca2.toUpperCase(),
              name: c.name.common,
              flag:
                c.flags?.png ||
                c.flags?.svg ||
                `https://flagcdn.com/w40/${c.cca2.toLowerCase()}.png`,
            }))
            .sort((a: any, b: any) => a.name.localeCompare(b.name));
          if (active) {
            setCountries(list);
          }
        }
      } catch (e) {
        console.error("Failed to fetch country list:", e);
        if (active) {
          setCountries(FALLBACK_COUNTRIES);
        }
      } finally {
        if (active) {
          setIsLoadingCountries(false);
        }
      }
    }

    async function detectGeo() {
      // 1. Try ipinfo.io
      try {
        const res = await fetch("https://ipinfo.io/json");
        if (res.ok) {
          const data = await res.json();
          if (active && data.country) {
            const cc = data.country.toUpperCase();
            setDetectedCountry(cc);
            setSelectedCountry(cc);
            return;
          }
        }
      } catch (e) {
        console.warn("Onboarding ipinfo lookup failed, trying next...");
      }

      // 2. Try ipwho.is
      try {
        const res = await fetch("https://ipwho.is/");
        if (res.ok) {
          const data = await res.json();
          if (active && data.success && data.country_code) {
            const cc = data.country_code.toUpperCase();
            setDetectedCountry(cc);
            setSelectedCountry(cc);
            return;
          }
        }
      } catch (e) {
        console.warn("Onboarding ipwho lookup failed, trying next...");
      }

      // 3. Try ipapi.co
      try {
        const res = await fetch("https://ipapi.co/json/");
        if (res.ok) {
          const data = await res.json();
          if (active && data.country_code) {
            const cc = data.country_code.toUpperCase();
            setDetectedCountry(cc);
            setSelectedCountry(cc);
            return;
          }
        }
      } catch (e) {
        console.warn(
          "Onboarding primary geo lookup failed, trying backup...",
          e,
        );
      }

      // 4. Try freeipapi.com
      try {
        const res = await fetch("https://freeipapi.com/api/json");
        if (res.ok) {
          const data = await res.json();
          if (active && data.countryCode) {
            const cc = data.countryCode.toUpperCase();
            setDetectedCountry(cc);
            setSelectedCountry(cc);
            return;
          }
        }
      } catch (e) {
        console.warn("Onboarding geo backup failed.");
      }
    }

    fetchCountries();
    detectGeo();
    return () => {
      active = false;
    };
  }, []);

  // Custom Payment Inputs
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [isPaying, setIsPaying] = useState(false);

  // Calibration Loader Progress
  const [calibrationProgress, setCalibrationProgress] = useState(0);
  const [calibrationText, setCalibrationText] = useState(
    "Initializing Diaphragm Analysis...",
  );

  useEffect(() => {
    if (step !== "calibrating") return;

    let progressInterval: NodeJS.Timeout;
    const startTime = Date.now();

    progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const computed = Math.min((elapsed / 3500) * 100, 100);

      setCalibrationProgress(Math.floor(computed));

      if (computed < 25) {
        setCalibrationText("Analyzing custom goals & lung capacity...");
      } else if (computed < 55) {
        setCalibrationText("Calibrating box-breathing ratios...");
      } else if (computed < 85) {
        setCalibrationText(
          "Syncing ambient soundscapes & binaural beat frequencies...",
        );
      } else {
        setCalibrationText("Finalizing personalized breathing sanctuary...");
      }

      if (computed >= 100) {
        clearInterval(progressInterval);
        setTimeout(() => {
          setStep("paywall");
        }, 600);
      }
    }, 50);

    return () => clearInterval(progressInterval);
  }, [step]);

  // Format Card Number
  const handleCardNumberChange = (value: string) => {
    const numbersOnly = value.replace(/\D/g, "").slice(0, 16);
    const matches = numbersOnly.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      setCardNumber(parts.join(" "));
    } else {
      setCardNumber(numbersOnly);
    }
  };

  // Format Expiry Date
  const handleExpiryChange = (value: string) => {
    const clean = value.replace(/\D/g, "").slice(0, 4);
    if (clean.length >= 2) {
      setCardExpiry(`${clean.slice(0, 2)}/${clean.slice(2)}`);
    } else {
      setCardExpiry(clean);
    }
  };

  // Complete Payment Action
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber || !cardExpiry || !cardCvv || !cardName) {
      alert("Please fill in all credit card credentials.");
      return;
    }
    setIsPaying(true);

    // Simulate payment transaction
    setTimeout(() => {
      setIsPaying(false);
      setStep("success");
    }, 2500);
  };

  // Success flow redirect
  const handleFinalRedirect = () => {
    onComplete(chosenPlan, cardName || "Mindful Breather");
  };

  return {
    // Step navigation
    step,
    setStep,

    // Selections
    selectedGoal,
    setSelectedGoal,
    selectedStress,
    setSelectedStress,
    selectedExperience,
    setSelectedExperience,
    chosenPlan,
    setChosenPlan,

    // Country
    detectedCountry,
    selectedCountry,
    setSelectedCountry,
    countries,
    searchQuery,
    setSearchQuery,
    isDropdownOpen,
    setIsDropdownOpen,
    isLoadingCountries,
    selectedCountryData,
    detectedCountryName,

    // Payment
    cardNumber,
    cardExpiry,
    cardCvv,
    setCardCvv,
    cardName,
    setCardName,
    isPaying,
    handleCardNumberChange,
    handleExpiryChange,
    handlePaymentSubmit,

    // Calibration
    calibrationProgress,
    calibrationText,

    // Final
    handleFinalRedirect,
  };
}
