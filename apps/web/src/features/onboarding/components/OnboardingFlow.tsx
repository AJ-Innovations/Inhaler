"use client";

import { SubscriptionView } from "@features/subscription/components/SubscriptionView";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { useOnboardingFlow } from "../hooks/useOnboardingFlow";
import { CalibrationStep } from "./CalibrationStep";
import { CountryStep } from "./CountryStep";
import { ExperienceStep } from "./ExperienceStep";
import { GoalStep } from "./GoalStep";
import { PaymentStep } from "./PaymentStep";
import { StressStep } from "./StressStep";
import { SuccessStep } from "./SuccessStep";

interface OnboardingFlowProps {
  onComplete: (planId: string, userName?: string) => void;
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const {
    step,
    setStep,
    selectedGoal,
    setSelectedGoal,
    selectedStress,
    setSelectedStress,
    selectedExperience,
    setSelectedExperience,
    chosenPlan,
    setChosenPlan,
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
    calibrationProgress,
    calibrationText,
    handleFinalRedirect,
  } = useOnboardingFlow(onComplete);

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
            {step === "q_goal" && (
              <GoalStep
                selectedGoal={selectedGoal}
                setSelectedGoal={setSelectedGoal}
                onNext={() => setStep("q_stress")}
              />
            )}

            {step === "q_stress" && (
              <StressStep
                selectedStress={selectedStress}
                setSelectedStress={setSelectedStress}
                onNext={() => setStep("q_experience")}
                onBack={() => setStep("q_goal")}
              />
            )}

            {step === "q_experience" && (
              <ExperienceStep
                selectedExperience={selectedExperience}
                setSelectedExperience={setSelectedExperience}
                onNext={() => setStep("q_country")}
                onBack={() => setStep("q_stress")}
              />
            )}

            {step === "q_country" && (
              <CountryStep
                detectedCountryName={detectedCountryName}
                selectedCountry={selectedCountry}
                setSelectedCountry={setSelectedCountry}
                countries={countries}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                isDropdownOpen={isDropdownOpen}
                setIsDropdownOpen={setIsDropdownOpen}
                isLoadingCountries={isLoadingCountries}
                selectedCountryData={selectedCountryData}
                onNext={() => setStep("calibrating")}
                onBack={() => setStep("q_experience")}
              />
            )}

            {step === "calibrating" && (
              <CalibrationStep
                calibrationProgress={calibrationProgress}
                calibrationText={calibrationText}
              />
            )}

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
                    if (planId === "free") {
                      setStep("success");
                    } else {
                      setStep("payment");
                    }
                  }}
                  isOnboarding
                />
              </motion.div>
            )}

            {step === "payment" && (
              <PaymentStep
                chosenPlan={chosenPlan}
                cardNumber={cardNumber}
                cardName={cardName}
                cardExpiry={cardExpiry}
                cardCvv={cardCvv}
                setCardName={setCardName}
                setCardCvv={setCardCvv}
                handleCardNumberChange={handleCardNumberChange}
                handleExpiryChange={handleExpiryChange}
                handlePaymentSubmit={handlePaymentSubmit}
                isPaying={isPaying}
                onBack={() => setStep("paywall")}
              />
            )}

            {step === "success" && (
              <SuccessStep
                chosenPlan={chosenPlan}
                handleFinalRedirect={handleFinalRedirect}
              />
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
