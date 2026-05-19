import {
  animate,
  AnimatePresence,
  motion,
  useMotionValue,
} from "framer-motion";
import { useEffect, useRef } from "react";

import { BreathingPhase } from "../hooks/useBreathingTimer";

interface BreathingCircleProps {
  phase: BreathingPhase;
  timer: number; // this is timeLeft
  duration: number; // total duration of current phase
  isActive: boolean;
  gradient?: {
    start: string;
    end: string;
  };
  activeSoundscape?: string;
}

export function BreathingCircle({
  phase,
  timer,
  duration,
  isActive,
  gradient,
  activeSoundscape,
}: BreathingCircleProps) {
  // Motion values to animate continuously and support absolute pause/resume controls
  const scale = useMotionValue(0.85);
  const opacity = useMotionValue(0.6);

  // Keep a ref of the remaining timer seconds to avoid re-triggering the continuous animation on every clock tick
  const timerRef = useRef(timer);
  useEffect(() => {
    timerRef.current = timer;
  }, [timer]);

  useEffect(() => {
    // Determine the final targets for this phase
    // Max scale increased to 1.45, min scale to 0.80 for more dramatic breathing range
    const targetScale = phase === "Inhale" || phase === "Hold" ? 1.45 : 0.8;
    const targetOpacity = phase === "Inhale" || phase === "Hold" ? 0.85 : 0.6;

    if (isActive) {
      // Add a slight padding (+0.3s) to the duration. This ensures that the GPU-accelerated
      // animation is still in motion when the naturally slower JS setInterval ticks,
      // completely eliminating the split-second pause at the end of a phase.
      const remainingDuration =
        timerRef.current > 0 ? timerRef.current + 0.3 : 4.3;

      const animScale = animate(scale, targetScale, {
        duration: remainingDuration,
        ease: phase === "Hold" || phase === "Rest" ? "linear" : "easeInOut",
      });

      const animOpacity = animate(opacity, targetOpacity, {
        duration: remainingDuration,
        ease: phase === "Hold" || phase === "Rest" ? "linear" : "easeInOut",
      });

      return () => {
        animScale.stop();
        animOpacity.stop();
      };
    } else {
      scale.stop();
      opacity.stop();

      // If the session is reset or not active at Rest, ensure it is at resting bounds
      if (phase === "Rest") {
        scale.set(0.8);
        opacity.set(0.6);
      }
    }
  }, [phase, isActive, scale, opacity]);

  return (
    <div className="pointer-events-none relative my-6 flex h-[280px] w-[280px] items-center justify-center select-none sm:h-[340px] sm:w-[340px]">
      {/* SINGLE LAYER CORE BREATHING CIRCLE: Frosted glassmorphism, no borders, animated continuously */}
      <motion.div
        className="pointer-events-none relative flex h-[170px] w-[170px] items-center justify-center rounded-full sm:h-[205px] sm:w-[205px]"
        style={{
          background: "rgba(255, 255, 255, 0.03)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          boxShadow:
            "0 8px 32px 0 rgba(0, 0, 0, 0.3), inset 0 0 25px rgba(255, 255, 255, 0.05)",
          scale,
          opacity,
        }}
      />

      {/* Floating Timer Countdown (Super-centered) */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 flex h-full w-full -translate-x-1/2 -translate-y-1/2 items-center justify-center font-sans text-6xl font-extralight text-white drop-shadow-2xl sm:text-7xl">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={timer}
            initial={{ opacity: 0, scale: 0.85, filter: "blur(4px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.15, filter: "blur(4px)" }}
            transition={{
              duration: 0.35,
              ease: "easeInOut",
            }}
            className="absolute"
          >
            {timer}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}
