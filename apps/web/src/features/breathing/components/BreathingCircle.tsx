import { motion, AnimatePresence } from 'framer-motion';
import { BreathingPhase } from '../hooks/useBreathingTimer';

interface BreathingCircleProps {
  phase: BreathingPhase;
  timer: number;
  gradient?: {
    start: string;
    end: string;
  };
  activeSoundscape?: string;
}

// Organic delay animations for a luxurious liquid lag effect!
const layer3Variants = {
  Inhale: { scale: 1.45, opacity: 0.18, transition: { duration: 4.2, ease: "easeInOut" } },
  Hold: { scale: 1.45, opacity: 0.12, transition: { duration: 4, ease: "linear" } },
  Exhale: { scale: 1, opacity: 0.06, transition: { duration: 3.8, ease: "easeInOut" } },
  Rest: { scale: 1, opacity: 0.02, transition: { duration: 4, ease: "linear" } },
} as const;

const layer2Variants = {
  Inhale: { scale: 1.25, opacity: 0.45, transition: { duration: 4.1, ease: "easeInOut" } },
  Hold: { scale: 1.25, opacity: 0.35, transition: { duration: 4, ease: "linear" } },
  Exhale: { scale: 1, opacity: 0.22, transition: { duration: 3.9, ease: "easeInOut" } },
  Rest: { scale: 1, opacity: 0.1, transition: { duration: 4, ease: "linear" } },
} as const;

const circleVariants = {
  Inhale: { scale: 1.15, opacity: 1, transition: { duration: 4, ease: "easeInOut" } },
  Hold: { scale: 1.15, opacity: 0.85, transition: { duration: 4, ease: "linear" } },
  Exhale: { scale: 0.9, opacity: 0.7, transition: { duration: 4, ease: "easeInOut" } },
  Rest: { scale: 0.9, opacity: 0.5, transition: { duration: 4, ease: "linear" } },
} as const;

// Convert selected Ambients to stunning corresponding gradient colors!
const getAmbientCircleGradient = (activeSoundscape?: string) => {
  switch (activeSoundscape) {
    case 'zen-river':
      return { start: '#0ea5e9', end: '#10b981' }; // Beautiful teal to emerald green
    case 'zen-fountain':
      return { start: '#3b82f6', end: '#06b6d4' }; // Calm blue to sparkling cyan
    case 'winter-rain':
      return { start: '#64748b', end: '#cbd5e1' }; // Slate storm to misty grey
    case 'light-rain':
      return { start: '#6366f1', end: '#a855f7' }; // Indigo to violet purple
    case 'nature-birds':
      return { start: '#10b981', end: '#84cc16' }; // Forest emerald to lime green
    case 'hz-transformation':
      return { start: '#8b5cf6', end: '#ec4899' }; // Spiritual purple to cosmic pink
    case 'white-noise':
      return { start: '#e2e8f0', end: '#94a3b8' }; // Soft glowing cloud white to slate
    case 'pink-noise':
      return { start: '#f43f5e', end: '#be123c' }; // Heart-healing rose pink to dark ruby
    case 'brown-noise':
      return { start: '#f59e0b', end: '#78350f' }; // Grounding warm amber to earth brown
    case 'none':
    default:
      return null;
  }
};

export function BreathingCircle({ phase, timer, gradient, activeSoundscape }: BreathingCircleProps) {
  // Determine gradient color mapping based on Ambient
  const ambientGrad = getAmbientCircleGradient(activeSoundscape);
  const activeStart = ambientGrad ? ambientGrad.start : (gradient ? gradient.start : '#0082ff');
  const activeEnd = ambientGrad ? ambientGrad.end : (gradient ? gradient.end : '#00ffd5');

  const bgGradient = `linear-gradient(135deg, ${activeStart} 0%, ${activeEnd} 100%)`;
  const shadowColor = activeStart;

  return (
    <div className="relative my-6 flex items-center justify-center w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] pointer-events-none select-none">
      
      {/* LAYER 3: Outer Soft Glowing Aura Ripple */}
      <motion.div
        className="absolute w-[210px] h-[210px] sm:w-[250px] sm:h-[250px] rounded-full blur-xl pointer-events-none"
        style={{
          background: bgGradient,
        }}
        animate={phase}
        variants={layer3Variants}
      />

      {/* LAYER 2: Middle Delicate Inner-Shadow Border Ring */}
      <motion.div
        className="absolute w-[230px] h-[230px] sm:w-[275px] sm:h-[275px] rounded-full border border-white/10 pointer-events-none"
        style={{
          boxShadow: `0 0 35px ${shadowColor}22, inset 0 0 20px ${shadowColor}11`,
        }}
        animate={phase}
        variants={layer2Variants}
      />

      {/* LAYER 1: Core Gradient Breathing Circle (Houses the countdown) */}
      <motion.div
        className="w-[170px] h-[170px] sm:w-[205px] sm:h-[205px] rounded-full flex items-center justify-center relative shadow-2xl transition-all duration-700"
        style={{
          background: bgGradient,
          boxShadow: `0 0 80px ${shadowColor}33, inset 0 0 30px rgba(255, 255, 255, 0.2)`
        }}
        animate={phase}
        variants={circleVariants}
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
