import { ChevronLeft } from "lucide-react";
import React from "react";

interface SubscriptionHeaderProps {
  onBack: () => void;
}

export function SubscriptionHeader({ onBack }: SubscriptionHeaderProps) {
  return (
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
  );
}
