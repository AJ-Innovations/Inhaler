import { Crown, Star, Zap } from "lucide-react";

import { BillingCycle, PlanType } from "../types";

export function useSubscriptionPlans(
  activeTier: any,
  billingCycle: BillingCycle,
): PlanType[] {
  return [
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
}
