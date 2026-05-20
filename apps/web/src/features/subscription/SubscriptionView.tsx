"use client";

import { motion } from "framer-motion";
import { Check, ChevronLeft, Crown, Lock, Star, Zap } from "lucide-react";
import React, { useRef, useState } from "react";

interface SubscriptionViewProps {
  onBack: () => void;
  isOnboarding?: boolean;
  onPlanSelected?: (planId: string) => void;
}

interface PricingTier {
  symbol: string;
  proMonthly: string;
  proYearly: string;
  proStrikethrough: string | null;
  premiumMonthly: string;
  premiumYearly: string;
  premiumStrikethrough: string | null;
  periodMonthly: string;
  periodYearly: string;
}

const pricingTiers: Record<string, PricingTier> = {
  US: {
    symbol: "$",
    proMonthly: "0.99",
    proYearly: "9.99",
    proStrikethrough: "12",
    premiumMonthly: "4.99",
    premiumYearly: "49.99",
    premiumStrikethrough: "60",
    periodMonthly: "/ month",
    periodYearly: "/ year",
  },
  GB: {
    symbol: "£",
    proMonthly: "0.99",
    proYearly: "9.99",
    proStrikethrough: "12",
    premiumMonthly: "4.49",
    premiumYearly: "44.99",
    premiumStrikethrough: "54",
    periodMonthly: "/ month",
    periodYearly: "/ year",
  },
  EU: {
    symbol: "€",
    proMonthly: "0.99",
    proYearly: "9.99",
    proStrikethrough: "12",
    premiumMonthly: "4.99",
    premiumYearly: "49.99",
    premiumStrikethrough: "60",
    periodMonthly: "/ month",
    periodYearly: "/ year",
  },
  IN: {
    symbol: "₹",
    proMonthly: "29",
    proYearly: "249",
    proStrikethrough: "348",
    premiumMonthly: "99",
    premiumYearly: "899",
    premiumStrikethrough: "1188",
    periodMonthly: "/ month",
    periodYearly: "/ year",
  },
  CA: {
    symbol: "C$",
    proMonthly: "1.49",
    proYearly: "14.99",
    proStrikethrough: "18",
    premiumMonthly: "6.99",
    premiumYearly: "69.99",
    premiumStrikethrough: "84",
    periodMonthly: "/ month",
    periodYearly: "/ year",
  },
  AU: {
    symbol: "A$",
    proMonthly: "1.49",
    proYearly: "14.99",
    proStrikethrough: "18",
    premiumMonthly: "7.49",
    premiumYearly: "74.99",
    premiumStrikethrough: "90",
    periodMonthly: "/ month",
    periodYearly: "/ year",
  },
  JP: {
    symbol: "¥",
    proMonthly: "150",
    proYearly: "1,500",
    proStrikethrough: "1,800",
    premiumMonthly: "700",
    premiumYearly: "7,000",
    premiumStrikethrough: "8,400",
    periodMonthly: "/ 月",
    periodYearly: "/ 年",
  },
  KR: {
    symbol: "₩",
    proMonthly: "990",
    proYearly: "9,900",
    proStrikethrough: "11,880",
    premiumMonthly: "4,900",
    premiumYearly: "49,000",
    premiumStrikethrough: "58,800",
    periodMonthly: "/ 월",
    periodYearly: "/ 년",
  },
  AE: {
    symbol: "AED ",
    proMonthly: "2.99",
    proYearly: "29.99",
    proStrikethrough: "36",
    premiumMonthly: "14.99",
    premiumYearly: "149.99",
    premiumStrikethrough: "180",
    periodMonthly: "/ month",
    periodYearly: "/ year",
  },
  SA: {
    symbol: "SR ",
    proMonthly: "2.99",
    proYearly: "29.99",
    proStrikethrough: "36",
    premiumMonthly: "12.99",
    premiumYearly: "129.99",
    premiumStrikethrough: "156",
    periodMonthly: "/ month",
    periodYearly: "/ year",
  },
  BR: {
    symbol: "R$ ",
    proMonthly: "2.99",
    proYearly: "29.99",
    proStrikethrough: "36",
    premiumMonthly: "14.99",
    premiumYearly: "149.99",
    premiumStrikethrough: "180",
    periodMonthly: "/ mês",
    periodYearly: "/ ano",
  },
  TR: {
    symbol: "₺",
    proMonthly: "9.99",
    proYearly: "99.99",
    proStrikethrough: "120",
    premiumMonthly: "49.99",
    premiumYearly: "499.99",
    premiumStrikethrough: "600",
    periodMonthly: "/ ay",
    periodYearly: "/ yıl",
  },
  ID: {
    symbol: "Rp ",
    proMonthly: "5.000",
    proYearly: "49.000",
    proStrikethrough: "60.000",
    premiumMonthly: "24.000",
    premiumYearly: "240.000",
    premiumStrikethrough: "288.000",
    periodMonthly: "/ bulan",
    periodYearly: "/ tahun",
  },
  VN: {
    symbol: "₫",
    proMonthly: "9,000",
    proYearly: "90,000",
    proStrikethrough: "108,000",
    premiumMonthly: "49,000",
    premiumYearly: "490,000",
    premiumStrikethrough: "588,000",
    periodMonthly: "/ tháng",
    periodYearly: "/ năm",
  },
  DEFAULT: {
    symbol: "$",
    proMonthly: "0.99",
    proYearly: "9.99",
    proStrikethrough: "12",
    premiumMonthly: "4.99",
    premiumYearly: "49.99",
    premiumStrikethrough: "60",
    periodMonthly: "/ month",
    periodYearly: "/ year",
  },
};

export function SubscriptionView({
  onBack,
  isOnboarding,
  onPlanSelected,
}: SubscriptionViewProps) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly",
  );
  const [activeIndex, setActiveIndex] = useState(1); // Default to the Pro plan (index 1)
  const touchStart = useRef<number | null>(null);

  const [activeTier, setActiveTier] = useState<PricingTier>(
    pricingTiers.DEFAULT,
  );
  const [detectedCountry, setDetectedCountry] = useState<string>("US");
  const [isDesktop, setIsDesktop] = useState(false);

  React.useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const applyCountry = (country: string) => {
    const cc = country.toUpperCase();
    setDetectedCountry(cc);
    const euroZone = [
      "DE",
      "FR",
      "IT",
      "ES",
      "NL",
      "BE",
      "AT",
      "IE",
      "FI",
      "PT",
      "GR",
      "EE",
      "LV",
      "LT",
      "SK",
      "SI",
      "CY",
      "MT",
      "HR",
    ];
    if (pricingTiers[cc]) {
      setActiveTier(pricingTiers[cc]);
    } else if (euroZone.includes(cc)) {
      setActiveTier(pricingTiers.EU);
    } else {
      setActiveTier(pricingTiers.DEFAULT);
    }
  };

  React.useEffect(() => {
    let active = true;
    async function fetchGeo() {
      // 0. Try localStorage first
      if (typeof window !== "undefined") {
        const savedCountry = localStorage.getItem("spirox_user_country");
        if (savedCountry) {
          applyCountry(savedCountry);
          return;
        }
      }

      // 1. Try ipapi.co (Primary HTTPS)
      try {
        const res = await fetch("https://ipapi.co/json/");
        if (res.ok) {
          const data = await res.json();
          if (active && data.country_code) {
            applyCountry(data.country_code);
            return;
          }
        }
      } catch (e) {
        console.warn("Primary Geo-IP (ipapi.co) failed, trying backup...", e);
      }

      // 2. Try freeipapi.com (Highly reliable CORS-friendly Backup)
      try {
        const res = await fetch("https://freeipapi.com/api/json");
        if (res.ok) {
          const data = await res.json();
          if (active && data.countryCode) {
            applyCountry(data.countryCode);
            return;
          }
        }
      } catch (e) {
        console.warn("Backup Geo-IP (freeipapi.com) failed, using default US.");
      }
    }
    fetchGeo();
    return () => {
      active = false;
    };
  }, []);

  // Colour tokens keyed directly off activeIndex — re-derived on every render
  const toggleOnClass =
    [
      "bg-blue-600/80 shadow-[0_0_15px_rgba(37,99,235,0.35)]", // Free  (index 0)
      "bg-emerald-500/80 shadow-[0_0_15px_rgba(16,185,129,0.3)]", // Pro   (index 1)
      "bg-amber-400/80 shadow-[0_0_15px_rgba(245,158,11,0.35)]", // Premium (index 2)
    ][activeIndex] ??
    "bg-emerald-500/80 shadow-[0_0_15px_rgba(16,185,129,0.3)]";

  const badgeColorClass =
    [
      "bg-blue-600/10 border-blue-600/20 text-blue-400", // Free
      "bg-emerald-500/10 border-emerald-500/20 text-emerald-400", // Pro
      "bg-amber-400/10 border-amber-400/20 text-amber-400", // Premium
    ][activeIndex] ??
    "bg-emerald-500/10 border-emerald-500/20 text-emerald-400";

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current === null) return;
    const diff = touchStart.current - e.changedTouches[0].clientX;
    const threshold = 50; // swipe threshold in px

    if (diff > threshold) {
      // Swipe left -> Next card
      setActiveIndex((prev) => Math.min(prev + 1, plans.length - 1));
    } else if (diff < -threshold) {
      // Swipe right -> Previous card
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    }

    touchStart.current = null;
  };

  const plans = [
    {
      id: "free",
      name: "Free",
      price: 0,
      displayPrice: "0",
      strikethrough: null,
      period:
        billingCycle === "monthly"
          ? activeTier.periodMonthly
          : activeTier.periodYearly,
      description: "Ideal for individual users.",
      features: [
        "Access to basic breathing routines",
        "Daily streak tracking",
        "Standard visual themes",
        "Community support",
      ],
      lockedFeatures: [
        "Advanced custom breath builder v2",
        "Premium voice assistant models",
        "Push notifications & routines",
        "10GB cloud progress backup",
      ],
      icon: Star,
      highlight: false,
      color: "blue",
    },
    {
      id: "pro",
      name: "Pro",
      price:
        billingCycle === "monthly"
          ? parseFloat(activeTier.proMonthly.replace(/,/g, ""))
          : parseFloat(activeTier.proYearly.replace(/,/g, "")) / 12,
      displayPrice:
        billingCycle === "monthly"
          ? activeTier.proMonthly
          : activeTier.proYearly,
      strikethrough:
        billingCycle === "yearly" ? activeTier.proStrikethrough : null,
      period:
        billingCycle === "monthly"
          ? activeTier.periodMonthly
          : activeTier.periodYearly,
      description:
        "Ideal for daily users building a consistent breathing habit.",
      features: [
        "All Free features included",
        "Advanced custom breath builder v2",
        "Premium voice assistant models",
        "Push notifications & routines",
        "Priority chat support",
      ],
      lockedFeatures: [
        "Dedicated 1-on-1 AI coach",
        "10GB cloud progress backup",
        "Multi-device account sync",
      ],
      icon: Zap,
      highlight: true,
      popular: true,
      color: "emerald",
    },
    {
      id: "premium",
      name: "Premium",
      price:
        billingCycle === "monthly"
          ? parseFloat(activeTier.premiumMonthly.replace(/,/g, ""))
          : parseFloat(activeTier.premiumYearly.replace(/,/g, "")) / 12,
      displayPrice:
        billingCycle === "monthly"
          ? activeTier.premiumMonthly
          : activeTier.premiumYearly,
      strikethrough:
        billingCycle === "yearly" ? activeTier.premiumStrikethrough : null,
      period:
        billingCycle === "monthly"
          ? activeTier.periodMonthly
          : activeTier.periodYearly,
      description:
        "Designed for serious users seeking total mental and physical mastery.",
      features: [
        "All Pro features included",
        "Dedicated 1-on-1 AI coach",
        "10GB cloud progress backup",
        "Multi-device account sync",
        "24/7 priority developer hotline",
      ],
      lockedFeatures: [],
      icon: Crown,
      highlight: false,
      color: "gold",
    },
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case "blue":
        return {
          border: "border-blue-500/20",
          glow: "bg-blue-500/20",
          button: "bg-blue-600 text-white hover:bg-blue-500",
          badge: "bg-blue-500/10 text-blue-400 border-blue-500/20",
          icon: "text-blue-400 bg-blue-500/10",
          highlight: "bg-blue-500/5",
          priceColor: "text-blue-400",
        };
      case "gold":
        return {
          border: "border-amber-500/30",
          glow: "bg-amber-500/20",
          button:
            "bg-gradient-to-r from-amber-500 to-yellow-400 text-white font-black hover:opacity-90",
          badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
          icon: "text-amber-400 bg-amber-500/10",
          highlight: "bg-gradient-to-br from-amber-500/5 to-yellow-500/5",
          priceColor: "text-amber-400",
        };
      default:
        return {
          border: "border-emerald-500/30",
          glow: "bg-emerald-500/20",
          button: "bg-[#10B981] text-white hover:bg-[#34D399]",
          badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
          icon: "text-emerald-400 bg-emerald-500/10",
          highlight: "bg-emerald-500/5",
          priceColor: "text-emerald-400",
        };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={`flex h-[100dvh] w-full flex-col overflow-hidden`}
    >
      <div className="mx-auto flex h-full w-full max-w-[480px] flex-col overflow-hidden transition-all duration-500 lg:max-w-7xl">
        {/* Sticky Top Header Bar with Centered Title, Back button & Gorgeous Subtitle */}
        <div className="sticky top-0 z-50 flex w-full shrink-0 flex-col items-center gap-1 bg-transparent px-6 py-4">
          <div className="flex w-full items-center justify-between">
            <button
              onClick={onBack}
              className="shrink-0 text-gray-200 transition-colors hover:text-white"
            >
              <ChevronLeft size={24} />
            </button>
            <h1 className="flex-1 pr-10 text-center text-2xl font-medium tracking-tight text-white">
              Choose your Plan
            </h1>
          </div>
          <p className="text-[12px] font-light tracking-wide text-white/50">
            Unlock absolute breathing mastery & cloud sync.
          </p>
        </div>

        {/* Plan Selector Pill Tabs */}
        <div className="flex shrink-0 items-center justify-center px-6 pt-4 pb-2 lg:hidden">
          <div className="flex w-full gap-1 rounded-full border border-white/[0.06] bg-white/[0.04] p-1">
            {plans.map((plan, index) => {
              const isSelected = index === activeIndex;
              const PlanIcon = plan.icon;

              // Pre-defined safe className strings per colour
              const selectedClass =
                plan.color === "blue"
                  ? "bg-blue-600 text-white shadow-[0_0_16px_rgba(37,99,235,0.35)]"
                  : plan.color === "gold"
                    ? "bg-amber-400 text-black shadow-[0_0_16px_rgba(245,158,11,0.40)]"
                    : "bg-emerald-500 text-black shadow-[0_0_16px_rgba(16,185,129,0.35)]";

              return (
                <button
                  key={plan.id}
                  onClick={() => setActiveIndex(index)}
                  className={`flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full text-[10px] font-black tracking-[0.15em] uppercase transition-all duration-300 ${isSelected
                    ? selectedClass
                    : "text-gray-300 hover:bg-white/[0.04] hover:text-white"
                    }`}
                >
                  <PlanIcon size={11} />
                  {plan.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Centered Single-Card Viewer */}
        <div
          className="relative flex min-h-0 w-full flex-1 items-center justify-center px-5 lg:px-0"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Track — slides via translateX */}
          <div
            className="flex h-[520px] w-full flex-row items-stretch gap-4 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:grid lg:h-auto lg:grid-cols-3 lg:gap-8"
            style={{
              transform: isDesktop
                ? "none"
                : `translateX(calc(-${activeIndex} * (100% + 16px)))`,
            }}
          >
            {plans.map((plan, index) => {
              const colors = getColorClasses(plan.color || "emerald");
              const isActive = index === activeIndex;
              return (
                <div
                  key={plan.id}
                  onClick={() => setActiveIndex(index)}
                  className={`relative flex h-full w-full min-w-full cursor-pointer flex-col justify-between rounded-[36px] p-6 lg:p-8 backdrop-blur-3xl transition-all duration-500 lg:min-w-0 ${isActive || isDesktop
                    ? "bg-white/[0.06] border border-white/20 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] scale-100 opacity-100"
                    : "bg-white/[0.02] border border-white/5 scale-95 opacity-40 hover:opacity-70"
                    }`}
                >
                  <div className="shrink-0 space-y-4">
                    {plan.popular && (
                      <div
                        className={`absolute top-6 right-6 rounded-full border px-3 py-1 text-[8px] font-black tracking-widest uppercase ${colors.badge}`}
                      >
                        MOST POPULAR
                      </div>
                    )}

                    {/* Gradient Glow */}
                    {(plan.highlight ||
                      plan.id === "premium" ||
                      plan.id === "free") && (
                        <div
                          className={`pointer-events-none absolute -top-20 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full blur-[60px] ${colors.glow}`}
                        />
                      )}

                    <div className="space-y-4">
                      <div className="space-y-1">
                        <h3 className="text-xl font-light text-white">
                          {plan.name}
                        </h3>
                        <p className="text-[9px] font-bold tracking-widest text-gray-300 uppercase">
                          Billed {billingCycle}
                        </p>
                      </div>

                      <div className="flex flex-col gap-2">
                        <div className="flex items-baseline gap-4">
                          {plan.strikethrough && (
                            <span
                              className={`mb-1 self-center text-2xl font-light tracking-tighter text-gray-200 line-through decoration-2 ${colors.badge.replace("bg-", "decoration-").replace("/10", "/50")}`}
                            >
                              {activeTier.symbol}
                              {plan.strikethrough}
                            </span>
                          )}
                          <span
                            className={`text-4xl font-light tracking-tighter transition-colors duration-500 ${billingCycle === "yearly"
                              ? colors.priceColor
                              : "text-white"
                              }`}
                          >
                            {plan.id === "free" ? "" : activeTier.symbol}
                            {plan.displayPrice || plan.price}
                          </span>
                          <span className="text-xs font-medium text-gray-300">
                            {plan.period}
                          </span>
                        </div>

                        {billingCycle === "yearly" && plan.id !== "free" && (
                          <div
                            className={`inline-flex w-fit animate-pulse items-center justify-center gap-1.5 rounded-full border px-3 py-1 text-[9px] font-extrabold tracking-wider uppercase ${colors.badge}`}
                          >
                            <Zap
                              size={10}
                              fill="currentColor"
                              className="shrink-0"
                            />
                            20% Discount Applied
                          </div>
                        )}
                      </div>

                      <p className="min-h-[36px] text-xs leading-relaxed font-light text-gray-200">
                        {plan.description}
                      </p>
                    </div>
                  </div>

                  {/* Button ABOVE features list with gloss animation */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onPlanSelected) {
                        onPlanSelected(plan.id);
                      }
                    }}
                    className={`relative my-4 w-full shrink-0 overflow-hidden rounded-full py-4 text-[14px] font-black tracking-[0.15em] uppercase shadow-2xl transition-all duration-500 active:scale-95 ${colors.button}`}
                  >
                    <span className="relative z-10">
                      {plan.id === "free" ? "Choose Free" : "Subscribe Now"}
                    </span>
                    <motion.div
                      initial={{ x: "-100%" }}
                      animate={{ x: "100%" }}
                      transition={{
                        repeat: Infinity,
                        repeatType: "loop",
                        duration: 2.5,
                        ease: "linear",
                      }}
                      className="pointer-events-none absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    />
                  </button>

                  <div className="scrollbar-hide min-h-0 flex-1 space-y-3 overflow-y-auto border-t border-white/5 pt-4 pr-1">
                    {/* Specialized Cloud storage for the third card */}
                    {plan.id === "premium" && (
                      <div className="group flex shrink-0 items-center gap-4">
                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-yellow-400 text-black shadow-[0_0_12px_rgba(245,158,11,0.25)]">
                          <Star size={10} fill="black" />
                        </div>
                        <span className="text-xs font-black tracking-tight text-white transition-colors group-hover:text-amber-400">
                          CLOUD PROGRESS SYNC
                        </span>
                      </div>
                    )}

                    {/* Included Features */}
                    {plan.features.map((feature, i) => (
                      <div
                        key={i}
                        className="group flex shrink-0 items-center gap-4"
                      >
                        <div
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-all ${colors.icon}`}
                        >
                          <Check size={10} strokeWidth={3} />
                        </div>
                        <span className="text-xs font-light text-gray-300 transition-colors group-hover:text-white">
                          {feature}
                        </span>
                      </div>
                    ))}

                    {/* Excluded / Locked Features */}
                    {plan.lockedFeatures &&
                      plan.lockedFeatures.map((feature, i) => (
                        <div
                          key={`locked-${i}`}
                          className="group flex shrink-0 items-center gap-4 opacity-40"
                        >
                          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-300">
                            <Lock size={9} />
                          </div>
                          <span className="text-xs font-light text-gray-300 line-through decoration-white/20">
                            {feature}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Billing Toggle Footer */}
        <div className="flex shrink-0 items-center justify-center gap-4 py-6">
          <span
            className={`text-[10px] font-bold tracking-widest uppercase transition-colors duration-300 ${billingCycle === "monthly" ? "text-white" : "text-gray-300"
              }`}
          >
            Monthly
          </span>

          <button
            onClick={() =>
              setBillingCycle((prev) =>
                prev === "monthly" ? "yearly" : "monthly",
              )
            }
            className={`relative h-6 w-12 shrink-0 rounded-full border border-white/10 p-1 transition-all duration-500 ${billingCycle === "yearly" ? toggleOnClass : "bg-white/10"
              }`}
          >
            <motion.div
              animate={{ x: billingCycle === "monthly" ? 0 : 24 }}
              className="h-4 w-4 rounded-full bg-white shadow-lg"
            />
          </button>

          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-bold tracking-widest uppercase transition-colors duration-300 ${billingCycle === "yearly" ? "text-white" : "text-gray-300"
                }`}
            >
              Yearly
            </span>
            <span
              className={`rounded-full border px-2 py-0.5 text-[8px] font-black tracking-tighter uppercase transition-all duration-300 ${badgeColorClass}`}
            >
              Save 20%
            </span>
          </div>
        </div>

        {/* Country Preview / Selector (Dynamic PPP) */}
        <div className="relative z-[20] flex shrink-0 flex-col items-center justify-center gap-1 pb-6 opacity-80 transition-opacity hover:opacity-100">
          <div className="flex items-center gap-2 rounded-full border border-white/5 bg-white/5 px-3 py-1.5 backdrop-blur-md">
            <span className="text-[9px] font-bold tracking-widest text-white/50 uppercase">
              Country Preview:
            </span>
            <select
              value={detectedCountry}
              onChange={(e) => {
                applyCountry(e.target.value);
              }}
              className="cursor-pointer border-none bg-transparent text-[9px] font-black tracking-wider text-white uppercase outline-none focus:ring-0"
              style={{ colorScheme: "dark" }}
            >
              <option value="US" className="bg-neutral-900 text-white">
                United States ($)
              </option>
              <option value="IN" className="bg-neutral-900 text-white">
                India (₹)
              </option>
              <option value="GB" className="bg-neutral-900 text-white">
                United Kingdom (£)
              </option>
              <option value="EU" className="bg-neutral-900 text-white">
                Eurozone (€)
              </option>
              <option value="CA" className="bg-neutral-900 text-white">
                Canada (C$)
              </option>
              <option value="AU" className="bg-neutral-900 text-white">
                Australia (A$)
              </option>
              <option value="JP" className="bg-neutral-900 text-white">
                Japan (¥)
              </option>
              <option value="KR" className="bg-neutral-900 text-white">
                South Korea (₩)
              </option>
              <option value="AE" className="bg-neutral-900 text-white">
                UAE (AED)
              </option>
              <option value="SA" className="bg-neutral-900 text-white">
                Saudi Arabia (SR)
              </option>
              <option value="BR" className="bg-neutral-900 text-white">
                Brazil (R$)
              </option>
              <option value="TR" className="bg-neutral-900 text-white">
                Turkey (₺)
              </option>
              <option value="ID" className="bg-neutral-900 text-white">
                Indonesia (Rp)
              </option>
              <option value="VN" className="bg-neutral-900 text-white">
                Vietnam (₫)
              </option>
            </select>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
