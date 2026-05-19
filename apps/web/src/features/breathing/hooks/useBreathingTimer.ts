import { useCallback, useEffect, useRef, useState } from "react";

export type BreathingPhase = "Inhale" | "Hold" | "Exhale" | "Rest";

interface Pattern {
  inhale: number;
  hold1: number;
  exhale: number;
  hold2: number;
}

export function useBreathingTimer(pattern: Pattern) {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<BreathingPhase>("Rest");
  const [timer, setTimer] = useState(pattern.inhale);
  const [cycleCount, setCycleCount] = useState(0);

  // Use refs to avoid effect re-runs on every tick/phase change
  const phaseRef = useRef<BreathingPhase>("Rest");
  const timerRef = useRef(pattern.inhale);

  const [totalTime, setTotalTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive) {
      interval = setInterval(() => {
        setTotalTime((t) => t + 1);
        timerRef.current -= 1;

        if (timerRef.current <= 0) {
          // Transition Logic
          let nextPhase: BreathingPhase = "Inhale";
          let nextTimer = pattern.inhale;

          if (phaseRef.current === "Inhale") {
            if (pattern.hold1 > 0) {
              nextPhase = "Hold";
              nextTimer = pattern.hold1;
            } else {
              nextPhase = "Exhale";
              nextTimer = pattern.exhale;
            }
          } else if (phaseRef.current === "Hold") {
            nextPhase = "Exhale";
            nextTimer = pattern.exhale;
          } else if (phaseRef.current === "Exhale") {
            if (pattern.hold2 > 0) {
              nextPhase = "Rest";
              nextTimer = pattern.hold2;
            } else {
              nextPhase = "Inhale";
              nextTimer = pattern.inhale;
              setCycleCount((c) => c + 1);
            }
          } else if (phaseRef.current === "Rest") {
            nextPhase = "Inhale";
            nextTimer = pattern.inhale;
            setCycleCount((c) => c + 1);
          }

          phaseRef.current = nextPhase;
          timerRef.current = nextTimer;
          setPhase(nextPhase);
          setTimer(nextTimer);
        } else {
          setTimer(timerRef.current);
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, pattern]); // Only depend on isActive and pattern

  const toggle = useCallback(() => {
    setIsActive((prev) => {
      const starting = !prev;
      if (starting) {
        if (phaseRef.current === "Rest") {
          phaseRef.current = "Inhale";
          timerRef.current = pattern.inhale;
          setPhase("Inhale");
          setTimer(pattern.inhale);
        }
      }
      return starting;
    });
  }, [pattern.inhale]);

  const reset = useCallback(() => {
    setIsActive(false);
    phaseRef.current = "Rest";
    timerRef.current = pattern.inhale;
    setPhase("Rest");
    setTimer(pattern.inhale);
    setCycleCount(0);
    setTotalTime(0);
  }, [pattern.inhale]);

  const duration =
    phase === "Inhale"
      ? pattern.inhale
      : phase === "Hold"
        ? pattern.hold1
        : phase === "Exhale"
          ? pattern.exhale
          : pattern.hold2;

  return {
    isActive,
    phase,
    timeLeft: timer,
    cycles: cycleCount,
    totalTime,
    duration,
    toggle,
    reset,
  };
}
