import { motion } from "framer-motion";
import { Check, Lock, Star, Zap } from "lucide-react";
import React from "react";
import { BillingCycle, PlanType } from "../types";

interface PlanCardProps {
  plan: PlanType;
  isActive: boolean;
  isDesktop: boolean;
  billingCycle: BillingCycle;
  activeTierSymbol: string;
  onSelectPlan: () => void;
  onSubscribe: () => void;
}

export function PlanCard({
  plan,
  isActive,
  isDesktop,
  billingCycle,
  activeTierSymbol,
  onSelectPlan,
  onSubscribe,
}: PlanCardProps) {
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

  const colors = getColorClasses(plan.color || "emerald");

  return (
    <div
      onClick={onSelectPlan}
      className={`relative flex h-full w-full min-w-full cursor-pointer flex-col justify-between rounded-[36px] p-5 backdrop-blur-3xl transition-all duration-500 lg:min-w-0 lg:p-6 ${
        isActive || isDesktop
          ? "scale-100 border border-white/20 bg-white/[0.06] opacity-100 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]"
          : "scale-95 border border-white/5 bg-white/[0.02] opacity-40 hover:opacity-70"
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
        {(plan.highlight || plan.id === "premium" || plan.id === "free") && (
          <div
            className={`pointer-events-none absolute -top-20 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full blur-[60px] ${colors.glow}`}
          />
        )}

        <div className="space-y-4">
          <div className="space-y-1">
            <h3 className="text-xl font-light text-white">{plan.name}</h3>
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
                  {activeTierSymbol}
                  {plan.strikethrough}
                </span>
              )}
              <span
                className={`text-4xl font-light tracking-tighter transition-colors duration-500 ${
                  billingCycle === "yearly" ? colors.priceColor : "text-white"
                }`}
              >
                {plan.id === "free" ? "" : activeTierSymbol}
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
                <Zap size={10} fill="currentColor" className="shrink-0" />
                20% Discount Applied
              </div>
            )}
          </div>

          <p className="min-h-[36px] text-xs leading-relaxed font-light text-gray-200">
            {plan.description}
          </p>
        </div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onSubscribe();
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
          <div key={i} className="group flex shrink-0 items-center gap-4">
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
}
