import { useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, animate } from 'framer-motion';
import { BreathingPhase } from '../hooks/useBreathingTimer';

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
  activeSoundscape 
}: BreathingCircleProps) {
  // Motion values to animate continuously and support absolute pause/resume controls
  const scale = useMotionValue(0.85);
  const opacity = useMotionValue(0.60);

  // Keep a ref of the remaining timer seconds to avoid re-triggering the continuous animation on every clock tick
  const timerRef = useRef(timer);
  useEffect(() => {
    timerRef.current = timer;
  }, [timer]);

  useEffect(() => {
    // Determine the final targets for this phase
    // Max scale increased to 1.45, min scale to 0.80 for more dramatic breathing range
    const targetScale = (phase === 'Inhale' || phase === 'Hold') ? 1.45 : 0.80;
    const targetOpacity = (phase === 'Inhale' || phase === 'Hold') ? 0.85 : 0.60;

    if (isActive) {
      // Add a slight padding (+0.3s) to the duration. This ensures that the GPU-accelerated
      // animation is still in motion when the naturally slower JS setInterval ticks,
      // completely eliminating the split-second pause at the end of a phase.
      const remainingDuration = timerRef.current > 0 ? timerRef.current + 0.3 : 4.3;

      const animScale = animate(scale, targetScale, {
        duration: remainingDuration,
        ease: phase === 'Hold' || phase === 'Rest' ? 'linear' : 'easeInOut',
      });

      const animOpacity = animate(opacity, targetOpacity, {
        duration: remainingDuration,
        ease: phase === 'Hold' || phase === 'Rest' ? 'linear' : 'easeInOut',
      });

      return () => {
        animScale.stop();
        animOpacity.stop();
      };
    } else {
      scale.stop();
      opacity.stop();

      // If the session is reset or not active at Rest, ensure it is at resting bounds
      if (phase === 'Rest') {
        scale.set(0.80);
        opacity.set(0.60);
      }
    }
  }, [phase, isActive, scale, opacity]);

  return (
    <div className="relative my-6 flex items-center justify-center w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] pointer-events-none select-none">
      
      {/* SINGLE LAYER CORE BREATHING CIRCLE: Frosted glassmorphism, no borders, animated continuously */}
      <motion.div
        className="w-[170px] h-[170px] sm:w-[205px] sm:h-[205px] rounded-full flex items-center justify-center relative pointer-events-none"
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3), inset 0 0 25px rgba(255, 255, 255, 0.05)',
          scale,
          opacity,
        }}
      />
      
      {/* Floating Timer Countdown (Super-centered) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl sm:text-7xl font-extralight text-white drop-shadow-2xl font-sans pointer-events-none flex items-center justify-center w-full h-full">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={timer}
            initial={{ opacity: 0, scale: 0.85, filter: 'blur(4px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.15, filter: 'blur(4px)' }}
            transition={{ 
              duration: 0.35,
              ease: "easeInOut"
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
