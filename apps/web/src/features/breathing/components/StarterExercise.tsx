"use client";

import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";

export function StarterExercise({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<"inhale" | "exhale" | "completed">(
    "inhale",
  );
  const [round, setRound] = useState(1);

  useEffect(() => {
    // soundscape is now managed by AppRouter globally
  }, []);

  const speak = (phaseText: string) => {
    if (typeof window !== "undefined") {
      let fileName = "";
      if (phaseText === "Inhale slowly") fileName = "inhale";
      else if (phaseText === "Hold") fileName = "hold";
      else if (phaseText === "Exhale completely") fileName = "exhale";

      if (fileName) {
        const audio = new Audio(`/voices/lauren/${fileName}.mp3`);
        audio.play().catch(() => {});
      }
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (phase === "inhale") {
      speak("Inhale slowly");
      timer = setTimeout(() => setPhase("exhale"), 4000); // 4 seconds inhale
    } else if (phase === "exhale") {
      speak("Exhale completely");
      timer = setTimeout(() => {
        if (round < 2) {
          setRound((r) => r + 1);
          setPhase("inhale");
        } else {
          setPhase("completed");
        }
      }, 6000); // 6 seconds exhale
    } else if (phase === "completed") {
      timer = setTimeout(() => onComplete(), 500);
    }

    return () => clearTimeout(timer);
  }, [phase, round, onComplete]);

  const getScale = () => {
    switch (phase) {
      case "inhale":
        return 2;
      case "exhale":
      case "completed":
        return 1;
      default:
        return 1;
    }
  };

  const getTransitionDuration = () => {
    switch (phase) {
      case "inhale":
        return 4; // 4s inhale
      case "exhale":
        return 6; // 6s exhale
      default:
        return 1;
    }
  };

  return (
    <div className="relative flex h-[100dvh] w-full flex-col items-center justify-center overflow-hidden text-white">
      <div className="absolute inset-0 bg-black/20" />

      <div className="z-10 flex flex-col items-center justify-center text-center">
        <div className="relative flex h-80 w-80 items-center justify-center">
          <motion.h2
            animate={{ opacity: phase === "completed" ? 0 : 1 }}
            className="absolute z-50 text-xl font-light tracking-widest text-white uppercase opacity-90 drop-shadow-md"
          >
            {phase}
          </motion.h2>

          {[1, 2, 3, 4, 5].map((ring) => {
            const baseScale = 0.3 + ring * 0.18;
            const opacity = 1.0 - ring * 0.18;

            return (
              <motion.div
                key={ring}
                animate={{
                  scale: baseScale * getScale(),
                }}
                transition={{
                  duration: getTransitionDuration(),
                  ease: "easeInOut",
                }}
                className="absolute rounded-full bg-white"
                style={{
                  width: "200px",
                  height: "200px",
                  opacity: opacity,
                  zIndex: 10 - ring,
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
