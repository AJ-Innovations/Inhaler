import { motion } from "framer-motion";
import {
  ArrowRight,
  ChevronLeft,
  CreditCard,
  Crown,
  ShieldCheck,
  Star,
} from "lucide-react";
import React from "react";

export function PaymentStep({
  chosenPlan,
  cardNumber,
  cardName,
  cardExpiry,
  cardCvv,
  setCardName,
  setCardCvv,
  handleCardNumberChange,
  handleExpiryChange,
  handlePaymentSubmit,
  isPaying,
  onBack,
}: {
  chosenPlan: string;
  cardNumber: string;
  cardName: string;
  cardExpiry: string;
  cardCvv: string;
  setCardName: (v: string) => void;
  setCardCvv: (v: string) => void;
  handleCardNumberChange: (v: string) => void;
  handleExpiryChange: (v: string) => void;
  handlePaymentSubmit: (e: React.FormEvent) => void;
  isPaying: boolean;
  onBack: () => void;
}) {
  return (
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
            <Crown className="text-amber-400" size={24} fill="currentColor" />
          ) : (
            <Star className="text-indigo-400" size={24} fill="currentColor" />
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
          className={`pointer-events-none absolute -right-20 -bottom-20 h-40 w-40 rounded-full opacity-40 blur-[60px] ${
            chosenPlan === "premium" ? "bg-amber-500" : "bg-indigo-500"
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
                  setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 3))
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
            <ArrowRight size={16} strokeWidth={3} className="relative z-10" />
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
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs text-gray-600 transition-colors hover:text-white"
      >
        <ChevronLeft size={16} /> Back
      </button>
    </motion.div>
  );
}
