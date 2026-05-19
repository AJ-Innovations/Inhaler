import { Pause, Play, RotateCcw } from "lucide-react";
import React from "react";

interface BreathingControlsProps {
  isActive: boolean;
  toggle: () => void;
  reset: () => void;
}

export function BreathingControls({
  isActive,
  toggle,
  reset,
}: BreathingControlsProps) {
  return (
    <div className="mt-12 flex justify-center gap-4">
      <button
        onClick={toggle}
        className={`flex items-center gap-2 rounded-full px-6 py-3 font-semibold transition-all duration-300 ${
          !isActive
            ? "bg-white text-black hover:bg-gray-200"
            : "border border-white/10 bg-white/5 text-white hover:bg-white/10"
        }`}
      >
        {isActive ? <Pause size={20} /> : <Play size={20} />}
        {isActive ? "Pause" : "Start"}
      </button>
      <button
        onClick={reset}
        className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 font-semibold text-white transition-all duration-300 hover:bg-white/10"
      >
        <RotateCcw size={20} />
        Reset
      </button>
    </div>
  );
}
