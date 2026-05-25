"use client";

import { motion } from "framer-motion";
import React from "react";

import { useGeoDetection } from "../data/useGeoDetection";
import { useSubscriptionPlans } from "../hooks/useSubscriptionPlans";
import { useSubscriptionState } from "../hooks/useSubscriptionState";
import { SubscriptionViewProps } from "../types";
import { BillingToggle } from "./BillingToggle";
import { CountryPreviewSelector } from "./CountryPreviewSelector";
import { PlanCard } from "./PlanCard";
import { PlanPillTabs } from "./PlanPillTabs";
import { SubscriptionHeader } from "./SubscriptionHeader";

export function SubscriptionView({
  onBack,
  onPlanSelected,
}: SubscriptionViewProps) {
  const { activeTier, detectedCountry, applyCountry } = useGeoDetection();
  const {
    billingCycle,
    setBillingCycle,
    activeIndex,
    setActiveIndex,
    isDesktop,
    handleTouchStart,
    handleTouchEnd,
  } = useSubscriptionState(3); // 3 plans

  const plans = useSubscriptionPlans(activeTier, billingCycle);

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

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={`flex h-[100dvh] w-full flex-col overflow-hidden`}
    >
      <div className="mx-auto flex h-full w-full max-w-[480px] flex-col overflow-hidden transition-all duration-500 md:max-w-5xl">
        <SubscriptionHeader onBack={onBack} />

        <PlanPillTabs
          plans={plans}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
        />

        <div
          className="relative flex min-h-0 w-full flex-1 items-center justify-center px-5 lg:px-0"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="flex h-[380px] w-full flex-row items-stretch gap-4 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:grid md:h-[380px] md:grid-cols-3 md:gap-6"
            style={{
              transform: isDesktop
                ? "none"
                : `translateX(calc(-${activeIndex} * (100% + 16px)))`,
            }}
          >
            {plans.map((plan, index) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                isActive={index === activeIndex}
                isDesktop={isDesktop}
                billingCycle={billingCycle}
                activeTierSymbol={activeTier.symbol}
                onSelectPlan={() => setActiveIndex(index)}
                onSubscribe={() => {
                  if (onPlanSelected) {
                    onPlanSelected(plan.id);
                  }
                }}
              />
            ))}
          </div>
        </div>

        <BillingToggle
          billingCycle={billingCycle}
          setBillingCycle={setBillingCycle}
          toggleOnClass={toggleOnClass}
          badgeColorClass={badgeColorClass}
        />

        <CountryPreviewSelector
          detectedCountry={detectedCountry}
          applyCountry={applyCountry}
        />
      </div>
    </motion.div>
  );
}
