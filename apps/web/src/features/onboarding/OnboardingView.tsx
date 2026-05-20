"use client";

import { AuthView } from "@features/auth/AuthView";
import { SubscriptionView } from "@features/subscription/SubscriptionView";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Brain,
  Check,
  CheckCircle2,
  ChevronLeft,
  CreditCard,
  Crown,
  Globe,
  Lock,
  Moon,
  ShieldCheck,
  Sparkles,
  Star,
  Wind,
  Zap,
} from "lucide-react";
import React, { useEffect, useState } from "react";

interface OnboardingViewProps {
  onComplete: (planId: string, userName?: string) => void;
}

type OnboardingStep =
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

export function OnboardingView({ onComplete }: OnboardingViewProps) {
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
  interface CountryData {
    code: string;
    name: string;
    flag: string;
  }
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
        // Fallback static list in case of network/API limits
        if (active) {
          setCountries([
            {
              code: "US",
              name: "United States",
              flag: "https://flagcdn.com/w40/us.png",
            },
            {
              code: "IN",
              name: "India",
              flag: "https://flagcdn.com/w40/in.png",
            },
            {
              code: "GB",
              name: "United Kingdom",
              flag: "https://flagcdn.com/w40/gb.png",
            },
            {
              code: "CA",
              name: "Canada",
              flag: "https://flagcdn.com/w40/ca.png",
            },
            {
              code: "AU",
              name: "Australia",
              flag: "https://flagcdn.com/w40/au.png",
            },
            {
              code: "DE",
              name: "Germany",
              flag: "https://flagcdn.com/w40/de.png",
            },
            {
              code: "FR",
              name: "France",
              flag: "https://flagcdn.com/w40/fr.png",
            },
            {
              code: "JP",
              name: "Japan",
              flag: "https://flagcdn.com/w40/jp.png",
            },
          ]);
        }
      } finally {
        if (active) {
          setIsLoadingCountries(false);
        }
      }
    }

    async function detectGeo() {
      // 1. Try ipinfo.io (gold standard daily IP geolocation database)
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

      // 2. Try ipwho.is (highly accurate free geo provider with SSL support)
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

  const goals = [
    {
      id: "sleep",
      title: "Sleep & Recovery",
      desc: "Fall asleep faster and maximize rest.",
      icon: Moon,
      color: "text-white",
    },
    {
      id: "stress",
      title: "Stress & Anxiety",
      desc: "Calm your nervous system in minutes.",
      icon: Zap,
      color: "text-white",
    },
    {
      id: "focus",
      title: "Focus & Clarity",
      desc: "Sharpen attention and lock in focus.",
      icon: Brain,
      color: "text-white",
    },
    {
      id: "power",
      title: "Energy & Breath",
      desc: "Expand endurance and lung capacity.",
      icon: Wind,
      color: "text-white",
    },
  ];

  const stressLevels = [
    {
      id: "daily",
      title: "High Stress (Daily)",
      desc: "Always on-edge under pressure.",
    },
    {
      id: "weekly",
      title: "Moderate Stress",
      desc: "Struggling during key peak days.",
    },
    {
      id: "rarely",
      title: "Low Stress",
      desc: "Seeking proactive preventative calm.",
    },
  ];

  const experienceLevels = [
    {
      id: "beginner",
      title: "Beginner",
      desc: "New to breathing exercises.",
    },
    {
      id: "intermediate",
      title: "Intermediate",
      desc: "Familiar with box-breathing & holds.",
    },
    {
      id: "advanced",
      title: "Advanced",
      desc: "Regular breathwork practitioner.",
    },
  ];

  return (
    <div className="fixed inset-0 z-[500] flex flex-col overflow-hidden bg-black font-sans text-white select-none">
      {/* Cinematic Natural Background */}
      <div
        className="pointer-events-none absolute inset-0 scale-110 bg-cover bg-center bg-no-repeat opacity-100 blur-[10px] transition-all duration-1000"
        style={{ backgroundImage: "url('/image/ambients/lake4.png')" }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/80" />

      <div className="relative mx-auto flex h-full w-full max-w-[480px] flex-1 flex-col transition-all duration-300 md:max-w-[760px] lg:max-w-6xl">
        <div className="scrollbar-hide relative z-10 flex h-full flex-1 flex-col justify-center overflow-y-auto px-6 py-10">
          <AnimatePresence mode="wait">
            {/* STEP: Intro Screen */}
            {step === "intro" && (
              <motion.div
                key="intro"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.5 }}
                className="flex h-full flex-col items-center justify-center space-y-12 text-center"
              >
                <div className="space-y-6">
                  <div className="flex justify-center overflow-hidden pb-2">
                    <motion.img
                      initial={{ y: "100%", opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{
                        delay: 0.2,
                        duration: 0.8,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      src="/image/logo/spirox-logo.webp"
                      alt="Spirox Logo"
                      className="h-50 w-auto object-contain"
                    />
                  </div>
                  <div className="overflow-hidden">
                    <motion.p
                      initial={{ y: "100%", opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{
                        delay: 0.3,
                        duration: 0.8,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="mx-auto max-w-[450px] text-sm leading-relaxed font-light text-gray-200 lg:text-lg"
                    >
                      Take a moment to align your body and mind. Let's calibrate
                      your customized, high-performance breathing journey.
                    </motion.p>
                  </div>
                </div>

                <button
                  onClick={() => setStep("q_goal")}
                  className="relative mx-auto mt-8 flex h-14 w-full max-w-[320px] items-center justify-center gap-3 overflow-hidden rounded-full bg-white text-[14px] font-black tracking-[0.2em] text-black uppercase shadow-[0_20px_40px_rgba(255,255,255,0.06)] transition-all hover:scale-105 active:scale-95"
                >
                  <span className="relative z-10">Start Your Journey</span>
                  <ArrowRight
                    size={16}
                    strokeWidth={3}
                    className="relative z-10"
                  />
                </button>
              </motion.div>
            )}

            {/* STEP: Question 1 (Goals) */}
            {step === "q_goal" && (
              <motion.div
                key="q_goal"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="mx-auto flex w-full max-w-[480px] flex-col justify-center space-y-8 text-center"
              >
                <div className="space-y-2">
                  <span className="text-[9px] font-black tracking-[0.3em] text-white/50 uppercase">
                    Step 1 of 4
                  </span>
                  <h2 className="text-3xl leading-tight font-light tracking-tight text-white">
                    What is your primary goal?
                  </h2>
                  <p className="text-sm font-light text-gray-400">
                    We will tailor your initial sessions based on this choice.
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  {goals.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => {
                        setSelectedGoal(g.id);
                        setTimeout(() => setStep("q_stress"), 300);
                      }}
                      className={`flex w-full items-center gap-4 rounded-full border p-5 text-left transition-all duration-300 ${selectedGoal === g.id
                        ? "scale-[1.02] border-emerald-500/50 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.06)]"
                        : "border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04]"
                        }`}
                    >
                      <div
                        className={`shrink-0 rounded-full bg-white/5 p-3 ${g.color}`}
                      >
                        <g.icon size={20} />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-md leading-none font-semibold text-white">
                          {g.title}
                        </h4>
                        <p className="mt-1 text-[12px] font-light text-gray-400">
                          {g.desc}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP: Question 2 (Stress level) */}
            {step === "q_stress" && (
              <motion.div
                key="q_stress"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="mx-auto flex w-full max-w-[480px] flex-col justify-center space-y-8 text-center"
              >
                <div className="space-y-2">
                  <span className="text-[9px] font-black tracking-[0.3em] text-white/50 uppercase">
                    Step 2 of 4
                  </span>
                  <h2 className="text-3xl leading-tight font-light tracking-tight text-white">
                    How often do you feel overwhelmed?
                  </h2>
                  <p className="text-sm font-light text-gray-400">
                    Helps customize routine reminders and heart-rate recovery
                    cycles.
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  {stressLevels.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        setSelectedStress(s.id);
                        setTimeout(() => setStep("q_experience"), 300);
                      }}
                      className={`flex w-full items-center gap-4 rounded-full border p-5 text-left transition-all duration-300 ${selectedStress === s.id
                        ? "scale-[1.02] border-emerald-500/50 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.06)]"
                        : "border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04]"
                        }`}
                    >
                      <div className="space-y-1">
                        <h4 className="text-md leading-none font-semibold text-white">
                          {s.title}
                        </h4>
                        <p className="mt-1 text-[12px] font-light text-gray-400">
                          {s.desc}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setStep("q_goal")}
                  className="mx-auto inline-flex items-center gap-2 text-xs text-gray-500 transition-colors hover:text-white"
                >
                  <ChevronLeft size={16} /> Back
                </button>
              </motion.div>
            )}

            {/* STEP: Question 3 (Experience Level) */}
            {step === "q_experience" && (
              <motion.div
                key="q_experience"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="mx-auto flex w-full max-w-[480px] flex-col justify-center space-y-8 text-center"
              >
                <div className="space-y-2">
                  <span className="text-[9px] font-black tracking-[0.3em] text-white/50 uppercase">
                    Step 3 of 4
                  </span>
                  <h2 className="text-3xl leading-tight font-light tracking-tight text-white">
                    What is your experience level?
                  </h2>
                  <p className="text-sm font-light text-gray-400">
                    Determines inhale/hold intervals and unlocking advanced
                    options.
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  {experienceLevels.map((e) => (
                    <button
                      key={e.id}
                      onClick={() => {
                        setSelectedExperience(e.id);
                        setTimeout(() => setStep("q_country"), 300);
                      }}
                      className={`flex w-full items-center gap-4 rounded-full border p-5 text-left transition-all duration-300 ${selectedExperience === e.id
                        ? "scale-[1.02] border-emerald-500/50 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.06)]"
                        : "border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04]"
                        }`}
                    >
                      <div className="space-y-1">
                        <h4 className="text-md leading-none font-semibold text-white">
                          {e.title}
                        </h4>
                        <p className="mt-1 text-[12px] font-light text-gray-400">
                          {e.desc}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setStep("q_stress")}
                  className="mx-auto inline-flex items-center gap-2 text-xs text-gray-500 transition-colors hover:text-white"
                >
                  <ChevronLeft size={16} /> Back
                </button>
              </motion.div>
            )}

            {/* STEP: Question 4 (Country Selection) */}
            {step === "q_country" && (
              <motion.div
                key="q_country"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="mx-auto flex w-full max-w-[480px] flex-col justify-center space-y-8 text-center"
              >
                <div className="space-y-2">
                  <span className="text-[9px] font-black tracking-[0.3em] text-white/50 uppercase">
                    Step 4 of 4
                  </span>
                  <h2 className="text-3xl leading-tight font-light tracking-tight text-white">
                    Where are you breathing from?
                  </h2>
                  <p className="px-4 text-sm font-light text-gray-300">
                    We've detected your country as{" "}
                    <span className="font-semibold text-emerald-400">
                      {detectedCountryName}
                    </span>
                    . Confirm or select your country below to personalize your
                    pricing and routines.
                  </p>
                </div>

                <div className="relative mx-auto w-full max-w-[320px] space-y-4">
                  {/* Custom Searchable Dropdown */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="text-md flex h-14 w-full cursor-pointer items-center justify-between rounded-full border border-white/10 bg-white/5 px-6 font-light text-white backdrop-blur-md transition-all hover:bg-white/10"
                    >
                      <div className="flex items-center truncate">
                        {selectedCountryData ? (
                          <span className="flex items-center gap-3 truncate">
                            <img
                              src={selectedCountryData.flag}
                              alt={selectedCountryData.name}
                              className="h-5 w-7 shrink-0 rounded-[2px] border border-white/10 object-cover shadow-sm"
                            />
                            <span className="truncate">
                              {selectedCountryData.name}
                            </span>
                          </span>
                        ) : (
                          <span className="text-white/40">Select Country</span>
                        )}
                      </div>
                      <ChevronLeft
                        size={16}
                        className={`text-white/60 transition-transform duration-300 ${isDropdownOpen ? "rotate-90" : "-rotate-90"
                          }`}
                      />
                    </button>

                    {isDropdownOpen && (
                      <div className="absolute top-[62px] right-0 left-0 z-50 overflow-hidden rounded-[24px] border border-white/5 bg-white/5 p-3 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl">
                        <div className="relative mb-2 flex items-center">
                          <input
                            type="text"
                            placeholder="Search country..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="text-md h-10 w-full rounded-full border border-white/10 bg-white/5 px-4 pr-10 font-light text-white placeholder:text-white/30 focus:border-white/20 focus:bg-white/10 focus:outline-none"
                          />
                          {searchQuery && (
                            <button
                              type="button"
                              onClick={() => setSearchQuery("")}
                              className="absolute right-3 text-[12px] tracking-wider text-white/40 uppercase hover:text-white"
                            >
                              clear
                            </button>
                          )}
                        </div>

                        <div className="scrollbar-hide max-h-48 space-y-1 overflow-y-auto pr-1">
                          {isLoadingCountries ? (
                            <div className="py-4 text-center text-xs text-white/40">
                              Loading countries...
                            </div>
                          ) : countries.filter((c) =>
                            c.name
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase()),
                          ).length === 0 ? (
                            <div className="py-4 text-center text-sm text-white/40">
                              No countries found
                            </div>
                          ) : (
                            countries
                              .filter((c) =>
                                c.name
                                  .toLowerCase()
                                  .includes(searchQuery.toLowerCase()),
                              )
                              .map((c) => (
                                <button
                                  key={c.code}
                                  type="button"
                                  onClick={() => {
                                    setSelectedCountry(c.code);
                                    setSearchQuery("");
                                    setIsDropdownOpen(false);
                                  }}
                                  className={`text-md flex w-full items-center gap-3 rounded-full px-4 py-2 text-left transition-all ${selectedCountry === c.code
                                    ? "bg-white/15 font-medium text-white"
                                    : "text-white/80 hover:bg-white/5 hover:text-white"
                                    }`}
                                >
                                  <img
                                    src={c.flag}
                                    alt={c.name}
                                    className="h-4 w-7 shrink-0 rounded-[2px] border border-white/10 object-cover shadow-sm"
                                  />
                                  <span className="truncate">{c.name}</span>
                                </button>
                              ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {!isDropdownOpen ? (
                    <button
                      onClick={() => {
                        localStorage.setItem(
                          "spirox_user_country",
                          selectedCountry,
                        );
                        setStep("calibrating");
                      }}
                      className="relative flex h-14 w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-white text-[10px] font-black tracking-[0.2em] text-black uppercase shadow-[0_20px_40px_rgba(255,255,255,0.06)] transition-all hover:scale-105 active:scale-95"
                    >
                      Confirm & Start Calibration
                      <ArrowRight size={16} strokeWidth={3} />
                    </button>
                  ) : (
                    <div className="h-14" />
                  )}
                </div>

                <button
                  onClick={() => setStep("q_experience")}
                  className="mx-auto inline-flex items-center gap-2 text-xs text-gray-500 transition-colors hover:text-white"
                >
                  <ChevronLeft size={16} /> Back
                </button>
              </motion.div>
            )}

            {/* STEP: Calibration Engine Loader */}
            {step === "calibrating" && (
              <motion.div
                key="calibrating"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                className="flex h-full flex-col items-center justify-center space-y-12 text-center"
              >
                {/* Pulsing Diaphragm Simulator */}
                <div className="relative flex h-44 w-44 items-center justify-center">
                  <motion.div
                    animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{
                      repeat: Infinity,
                      duration: 3.5,
                      ease: "easeInOut",
                    }}
                    className="absolute inset-0 rounded-full bg-emerald-500/10 blur-2xl"
                  />
                  <motion.div
                    animate={{ scale: [0.8, 1.15, 0.8] }}
                    transition={{
                      repeat: Infinity,
                      duration: 3.5,
                      ease: "easeInOut",
                    }}
                    className="relative flex h-32 w-32 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/5 shadow-[0_0_30px_rgba(16,185,129,0.06)]"
                  >
                    <span className="text-2xl font-light text-emerald-400">
                      {calibrationProgress}%
                    </span>
                  </motion.div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xl font-light tracking-tight text-white">
                    Generating Personalized Sanctuary
                  </h3>
                  <p className="text-md mx-auto h-10 max-w-[280px] leading-relaxed font-light text-gray-300 transition-all duration-300">
                    {calibrationText}
                  </p>
                </div>
              </motion.div>
            )}

            {/* STEP: Paywall Carousel Plan Selector */}
            {step === "paywall" && (
              <motion.div
                key="paywall"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                className="absolute inset-0 z-50 flex h-full flex-col overflow-hidden bg-transparent"
              >
                <SubscriptionView
                  onBack={() => setStep("q_experience")}
                  onPlanSelected={(planId) => {
                    setChosenPlan(planId as any);
                    setStep("auth");
                  }}
                  isOnboarding
                />
              </motion.div>
            )}

            {/* STEP: Account Registration (AuthView integration) */}
            {step === "auth" && (
              <motion.div
                key="auth"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="absolute inset-0 z-50 bg-transparent"
              >
                <AuthView
                  onBack={() => setStep("paywall")}
                  onSuccess={() => {
                    if (chosenPlan === "free") {
                      setStep("success");
                    } else {
                      setStep("payment");
                    }
                  }}
                />
              </motion.div>
            )}

            {/* STEP: Payment Gateway setup */}
            {step === "payment" && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                className="flex h-full flex-col justify-center space-y-8"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="text-emerald-400" size={16} />
                    <span className="text-[9px] font-black tracking-[0.3em] text-emerald-400 uppercase">
                      Secure Payment Checkout
                    </span>
                  </div>
                  <h2 className="text-3xl leading-tight font-light tracking-tight text-white">
                    Payment Setup
                  </h2>
                  <p className="text-md font-light text-gray-300">
                    Set up your billing details to activate your{" "}
                    <span className="font-semibold text-white uppercase">
                      {chosenPlan}
                    </span>{" "}
                    membership.
                  </p>
                </div>

                {/* Glassmorphic Credit Card Preview */}
                <div className="relative flex h-44 w-full shrink-0 flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.01] p-6 shadow-2xl backdrop-blur-xl">
                  <div className="flex items-start justify-between">
                    <div className="flex h-8 w-12 items-center justify-center rounded-md bg-white/10 text-xs font-bold tracking-wider text-white/50">
                      CHIP
                    </div>
                    {chosenPlan === "premium" ? (
                      <Crown
                        className="text-amber-400"
                        size={24}
                        fill="currentColor"
                      />
                    ) : (
                      <Star
                        className="text-indigo-400"
                        size={24}
                        fill="currentColor"
                      />
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="h-6 font-mono text-xl font-light tracking-[0.25em] text-white">
                      {cardNumber || "•••• •••• •••• ••••"}
                    </div>
                    <div className="flex items-end justify-between">
                      <div className="space-y-1">
                        <span className="block text-[7px] leading-none font-bold tracking-widest text-gray-500 uppercase">
                          Cardholder
                        </span>
                        <span className="block h-4 max-w-[200px] overflow-hidden font-mono text-xs font-medium whitespace-nowrap text-white/80 uppercase">
                          {cardName || "YOUR FULL NAME"}
                        </span>
                      </div>
                      <div className="space-y-1 text-right">
                        <span className="block text-[7px] leading-none font-bold tracking-widest text-gray-500 uppercase">
                          Expires
                        </span>
                        <span className="block h-4 font-mono text-xs font-medium text-white/80">
                          {cardExpiry || "MM/YY"}
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* Accent glow on card */}
                  <div
                    className={`pointer-events-none absolute -right-20 -bottom-20 h-40 w-40 rounded-full opacity-40 blur-[60px] ${chosenPlan === "premium"
                      ? "bg-amber-500"
                      : "bg-indigo-500"
                      }`}
                  />
                </div>

                {/* Card Inputs Form */}
                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                  <div className="space-y-3">
                    <div className="group relative">
                      <div className="absolute top-1/2 left-5 -translate-y-1/2 text-gray-500 transition-colors group-focus-within:text-emerald-400">
                        <CreditCard size={16} />
                      </div>
                      <input
                        type="text"
                        placeholder="Cardholder Name"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        className="h-12 w-full rounded-full border border-white/10 bg-white/[0.03] pr-4 pl-14 text-sm font-light text-white transition-all placeholder:text-gray-600 focus:border-emerald-500/50 focus:bg-white/[0.05] focus:outline-none"
                        required
                      />
                    </div>

                    <div className="group relative">
                      <div className="absolute top-1/2 left-5 -translate-y-1/2 text-gray-500 transition-colors group-focus-within:text-emerald-400">
                        <CreditCard size={16} />
                      </div>
                      <input
                        type="text"
                        placeholder="Card Number"
                        value={cardNumber}
                        onChange={(e) => handleCardNumberChange(e.target.value)}
                        className="h-12 w-full rounded-full border border-white/10 bg-white/[0.03] pr-4 pl-14 font-mono text-sm text-white transition-all placeholder:text-gray-600 focus:border-emerald-500/50 focus:bg-white/[0.05] focus:outline-none"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="group relative">
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={cardExpiry}
                          onChange={(e) => handleExpiryChange(e.target.value)}
                          className="h-12 w-full rounded-full border border-white/10 bg-white/[0.03] px-5 text-center font-mono text-sm text-white transition-all placeholder:text-gray-600 focus:border-emerald-500/50 focus:bg-white/[0.05] focus:outline-none"
                          maxLength={5}
                          required
                        />
                      </div>
                      <div className="group relative">
                        <input
                          type="password"
                          placeholder="CVV"
                          value={cardCvv}
                          onChange={(e) =>
                            setCardCvv(
                              e.target.value.replace(/\D/g, "").slice(0, 3),
                            )
                          }
                          className="h-12 w-full rounded-full border border-white/10 bg-white/[0.03] px-5 text-center font-mono text-sm text-white transition-all placeholder:text-gray-600 focus:border-emerald-500/50 focus:bg-white/[0.05] focus:outline-none"
                          maxLength={3}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isPaying}
                    className="relative flex h-14 w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-white text-[10px] font-black tracking-[0.2em] text-black uppercase shadow-2xl transition-all hover:bg-emerald-400 active:scale-95"
                  >
                    <span className="relative z-10">
                      {isPaying
                        ? "Authorizing Transaction..."
                        : `Complete Checkout & Join`}
                    </span>
                    {!isPaying && (
                      <ArrowRight
                        size={16}
                        strokeWidth={3}
                        className="relative z-10"
                      />
                    )}

                    {/* Sweep shimmer effect */}
                    <motion.div
                      initial={{ x: "-100%" }}
                      animate={{ x: "100%" }}
                      transition={{
                        repeat: Infinity,
                        repeatType: "loop",
                        duration: 2.5,
                        ease: "linear",
                      }}
                      className="pointer-events-none absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-black/10 to-transparent"
                    />
                  </button>
                </form>

                <button
                  onClick={() => setStep("auth")}
                  className="inline-flex items-center gap-2 text-xs text-gray-600 transition-colors hover:text-white"
                >
                  <ChevronLeft size={16} /> Back
                </button>
              </motion.div>
            )}

            {/* STEP: Onboarding Success & Welcome */}
            {step === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex h-full flex-col items-center justify-center space-y-12 text-center"
              >
                <div className="space-y-4">
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", damping: 15 }}
                    className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-[32px] bg-gradient-to-br from-emerald-400 to-green-600 shadow-[0_0_50px_rgba(16,185,129,0.3)]"
                  >
                    <CheckCircle2 size={40} className="text-white" />
                  </motion.div>
                </div>

                <div className="space-y-3">
                  <h2 className="text-3xl font-light tracking-tight text-white">
                    Sanctuary Unlocked
                  </h2>
                  <p className="mx-auto max-w-[280px] text-xs leading-relaxed font-light text-gray-400">
                    {chosenPlan === "free"
                      ? "Welcome to Spirox! Your account is created and free breathing cycles are ready."
                      : `Welcome to Spirox Pro! Your premium billing is authorized and all masteries are unlocked.`}
                  </p>
                </div>

                <button
                  onClick={handleFinalRedirect}
                  className="mt-8 flex h-14 w-full items-center justify-center gap-3 rounded-full bg-white text-[10px] font-black tracking-[0.2em] text-black uppercase shadow-2xl transition-all hover:scale-105 active:scale-95"
                >
                  Enter Your Sanctuary
                  <ArrowRight size={16} strokeWidth={3} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -top-40 -left-40 z-0 h-96 w-96 rounded-full bg-emerald-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 -bottom-40 z-0 h-96 w-96 rounded-full bg-indigo-500/10 blur-[120px]" />
    </div>
  );
}
