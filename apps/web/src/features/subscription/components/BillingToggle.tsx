import { motion } from "framer-motion";
import React from "react";
import { BillingCycle } from "../types";

interface BillingToggleProps {
  billingCycle: BillingCycle;
  setBillingCycle: (
    val: BillingCycle | ((prev: BillingCycle) => BillingCycle),
  ) => void;
  toggleOnClass: string;
  badgeColorClass: string;
}

export function BillingToggle({
  billingCycle,
  setBillingCycle,
  toggleOnClass,
  badgeColorClass,
}: BillingToggleProps) {
  return (
    <div className="flex shrink-0 items-center justify-center gap-4 py-6">
      <span
        className={`text-[10px] font-bold tracking-widest uppercase transition-colors duration-300 ${
          billingCycle === "monthly" ? "text-white" : "text-gray-300"
        }`}
      >
        Monthly
      </span>

      <button
        onClick={() =>
          setBillingCycle((prev) => (prev === "monthly" ? "yearly" : "monthly"))
        }
        className={`relative h-6 w-12 shrink-0 rounded-full border border-white/10 p-1 transition-all duration-500 ${
          billingCycle === "yearly" ? toggleOnClass : "bg-white/10"
        }`}
      >
        <motion.div
          animate={{ x: billingCycle === "monthly" ? 0 : 24 }}
          className="h-4 w-4 rounded-full bg-white shadow-lg"
        />
      </button>

      <div className="flex items-center gap-2">
        <span
          className={`text-[10px] font-bold tracking-widest uppercase transition-colors duration-300 ${
            billingCycle === "yearly" ? "text-white" : "text-gray-300"
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
  );
}
