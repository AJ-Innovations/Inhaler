'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Zap, Moon, Brain, Wind, Check, Lock, ShieldCheck,
  CreditCard, ArrowRight, ChevronLeft, Star, Crown, CheckCircle2
} from 'lucide-react';
import { AuthView } from './AuthView';
import { SubscriptionView } from './SubscriptionView';

interface OnboardingViewProps {
  onComplete: (planId: string, userName?: string) => void;
}

type OnboardingStep =
  | 'intro'
  | 'q_goal'
  | 'q_stress'
  | 'q_experience'
  | 'calibrating'
  | 'paywall'
  | 'auth'
  | 'payment'
  | 'success';

export function OnboardingView({ onComplete }: OnboardingViewProps) {
  const [step, setStep] = useState<OnboardingStep>('intro');
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [selectedStress, setSelectedStress] = useState<string | null>(null);
  const [selectedExperience, setSelectedExperience] = useState<string | null>(null);
  const [chosenPlan, setChosenPlan] = useState<'free' | 'pro' | 'premium'>('pro');

  // Custom Payment Inputs
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [isPaying, setIsPaying] = useState(false);

  // Calibration Loader Progress
  const [calibrationProgress, setCalibrationProgress] = useState(0);
  const [calibrationText, setCalibrationText] = useState('Initializing Diaphragm Analysis...');

  useEffect(() => {
    if (step !== 'calibrating') return;

    let progressInterval: NodeJS.Timeout;
    const startTime = Date.now();

    progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const computed = Math.min((elapsed / 3500) * 100, 100);

      setCalibrationProgress(Math.floor(computed));

      if (computed < 25) {
        setCalibrationText('Analyzing custom goals & lung capacity...');
      } else if (computed < 55) {
        setCalibrationText('Calibrating box-breathing ratios...');
      } else if (computed < 85) {
        setCalibrationText('Syncing ambient soundscapes & binaural beat frequencies...');
      } else {
        setCalibrationText('Finalizing personalized breathing sanctuary...');
      }

      if (computed >= 100) {
        clearInterval(progressInterval);
        setTimeout(() => {
          setStep('paywall');
        }, 600);
      }
    }, 50);

    return () => clearInterval(progressInterval);
  }, [step]);

  // Format Card Number
  const handleCardNumberChange = (value: string) => {
    const numbersOnly = value.replace(/\D/g, '').slice(0, 16);
    const matches = numbersOnly.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      setCardNumber(parts.join(' '));
    } else {
      setCardNumber(numbersOnly);
    }
  };

  // Format Expiry Date
  const handleExpiryChange = (value: string) => {
    const clean = value.replace(/\D/g, '').slice(0, 4);
    if (clean.length >= 2) {
      setCardExpiry(`${clean.slice(0, 2)}/${clean.slice(2)}`);
    } else {
      setCardExpiry(clean);
    }
  };

  // Complete Payment Action
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber || !cardExpiry || !cardCvv || !cardName) {
      alert('Please fill in all credit card credentials.');
      return;
    }
    setIsPaying(true);

    // Simulate payment transaction
    setTimeout(() => {
      setIsPaying(false);
      setStep('success');
    }, 2500);
  };

  // Success flow redirect
  const handleFinalRedirect = () => {
    onComplete(chosenPlan, cardName || 'Mindful Breather');
  };

  const goals = [
    { id: 'sleep', title: 'Deep Sleep & Insomnia Cure', desc: 'Fall asleep faster and maximize recovery.', icon: Moon, color: 'text-white' },
    { id: 'stress', title: 'Anxiety & Quick Stress Relief', desc: 'Settle your nervous system in 2 minutes.', icon: Zap, color: 'text-white' },
    { id: 'focus', title: 'Extreme Focus & Brain Clarity', desc: 'Navy SEAL method to lock in attention.', icon: Brain, color: 'text-white' },
    { id: 'power', title: 'Athletic Grit & Endurance', desc: 'Expand CO2 tolerance and lung volume.', icon: Wind, color: 'text-white' }
  ];

  const stressLevels = [
    { id: 'daily', title: 'Almost Constantly (Daily)', desc: 'Always on-edge, multi-tasking under pressure.' },
    { id: 'weekly', title: 'Frequently (A few times a week)', desc: 'Struggling during peak deadlines and stress spikes.' },
    { id: 'rarely', title: 'Occasionally or Rarely', desc: 'Just seeking general focus and preventative calm.' }
  ];

  const experienceLevels = [
    { id: 'beginner', title: 'Beginner / First Steps', desc: 'I want simple patterns and audio guidance.' },
    { id: 'intermediate', title: 'Intermediate / Occasional', desc: 'I understand box-breathing and breath holds.' },
    { id: 'advanced', title: 'Advanced / Daily Meditator', desc: 'I want extreme challenges and advanced detox.' }
  ];

  return (
    <div className="fixed inset-0 z-[500] text-white flex flex-col font-sans select-none overflow-hidden bg-black">
      {/* Cinematic Natural Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-[10px] opacity-100 scale-110 pointer-events-none transition-all duration-1000"
        style={{ backgroundImage: "url('/image/ambients/lake4.png')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/80 pointer-events-none" />

      <div className="relative flex-1 flex flex-col max-w-[480px] mx-auto w-full h-full">
        <div className="flex-1 flex flex-col justify-center px-6 relative z-10 py-10 h-full overflow-y-auto scrollbar-hide">
          <AnimatePresence mode="wait">

            {/* STEP: Intro Screen */}
            {step === 'intro' && (
              <motion.div
                key="intro"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.5 }}
                className="space-y-12 text-center flex flex-col items-center justify-center h-full"
              >
                <div className="space-y-4">
                  <motion.div
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                    className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500/20 via-blue-500/20 to-indigo-500/20 border border-white/10 flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.15)] relative"
                  >
                    <Sparkles size={40} className="text-white animate-pulse" />
                    <div className="absolute inset-0 rounded-full bg-emerald-500/5 blur-xl" />
                  </motion.div>
                </div>

                <div className="space-y-4">
                  <div className="overflow-hidden pb-2">
                    <motion.h1
                      initial={{ y: "100%", opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      className="text-6xl font-light tracking-tight text-white"
                    >
                      SPIROX
                    </motion.h1>
                  </div>
                  <div className="overflow-hidden">
                    <motion.p
                      initial={{ y: "100%", opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      className="text-white/70 text-sm font-light max-w-[280px] leading-relaxed mx-auto"
                    >
                      Take a moment to align your body and mind. Let's calibrate your customized, high-performance breathing journey.
                    </motion.p>
                  </div>
                </div>

                <button
                  onClick={() => setStep('q_goal')}
                  className="w-full h-14 bg-white text-black rounded-full font-black text-[10px] uppercase tracking-[0.2em] shadow-[0_20px_40px_rgba(255,255,255,0.06)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 mt-8 relative overflow-hidden"
                >
                  <span className="relative z-10">Start Diaphragm Calibration</span>
                  <ArrowRight size={16} strokeWidth={3} className="relative z-10" />
                </button>
              </motion.div>
            )}

            {/* STEP: Question 1 (Goals) */}
            {step === 'q_goal' && (
              <motion.div
                key="q_goal"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-8 flex flex-col justify-center h-full"
              >
                <div className="space-y-4">
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white">Step 1 of 3</span>
                  <h2 className="text-3xl font-light text-white tracking-tight leading-tight">What is your primary goal today?</h2>
                  <p className="text-gray-300 text-md font-light">We will tailor your initial sessions based on this choice.</p>
                </div>

                <div className="space-y-3">
                  {goals.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => {
                        setSelectedGoal(g.id);
                        setTimeout(() => setStep('q_stress'), 300);
                      }}
                      className={`w-full p-5 rounded-full border text-left flex items-center gap-4 transition-all duration-300 ${selectedGoal === g.id
                        ? 'border-emerald-500/50 bg-emerald-500/5 shadow-[0_0_20px_rgba(16,185,129,0.06)] scale-[1.02]'
                        : 'border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04]'
                        }`}
                    >
                      <div className={`p-3 rounded-full bg-white/5 shrink-0 ${g.color}`}>
                        <g.icon size={20} />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-md font-semibold text-white leading-none">{g.title}</h4>
                        <p className="text-[12px] text-gray-300 font-light">{g.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP: Question 2 (Stress level) */}
            {step === 'q_stress' && (
              <motion.div
                key="q_stress"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-8 flex flex-col justify-center h-full"
              >
                <div className="space-y-2">
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white">Step 2 of 3</span>
                  <h2 className="text-3xl font-light text-white tracking-tight leading-tight">How often do you feel overwhelmed?</h2>
                  <p className="text-gray-300 text-md font-light">Helps customize routine reminders and heart-rate recovery cycles.</p>
                </div>

                <div className="space-y-3">
                  {stressLevels.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        setSelectedStress(s.id);
                        setTimeout(() => setStep('q_experience'), 300);
                      }}
                      className={`w-full p-5 rounded-full border text-left transition-all duration-300 ${selectedStress === s.id
                        ? 'border-emerald-500/50 bg-emerald-500/5 shadow-[0_0_20px_rgba(16,185,129,0.06)] scale-[1.02]'
                        : 'border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04]'
                        }`}
                    >
                      <div className="space-y-1">
                        <h4 className="text-md font-semibold text-white leading-none">{s.title}</h4>
                        <p className="text-[12px] text-gray-300 font-light mt-1">{s.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setStep('q_goal')}
                  className="inline-flex items-center gap-2 text-xs text-gray-600 hover:text-white transition-colors mt-2"
                >
                  <ChevronLeft size={16} /> Back
                </button>
              </motion.div>
            )}

            {/* STEP: Question 3 (Experience Level) */}
            {step === 'q_experience' && (
              <motion.div
                key="q_experience"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-8 flex flex-col justify-center h-full"
              >
                <div className="space-y-2">
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white">Step 3 of 3</span>
                  <h2 className="text-3xl font-light text-white tracking-tight leading-tight">What is your experience level?</h2>
                  <p className="text-gray-300 text-md font-light">Determines inhale/hold intervals and unlocking advanced options.</p>
                </div>

                <div className="space-y-3">
                  {experienceLevels.map((e) => (
                    <button
                      key={e.id}
                      onClick={() => {
                        setSelectedExperience(e.id);
                        setTimeout(() => setStep('calibrating'), 300);
                      }}
                      className={`w-full p-5 rounded-full border text-left transition-all duration-300 ${selectedExperience === e.id
                        ? 'border-emerald-500/50 bg-emerald-500/5 shadow-[0_0_20px_rgba(16,185,129,0.06)] scale-[1.02]'
                        : 'border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04]'
                        }`}
                    >
                      <div className="space-y-1">
                        <h4 className="text-md font-semibold text-white leading-none">{e.title}</h4>
                        <p className="text-[12px] text-gray-300 font-light mt-1">{e.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setStep('q_stress')}
                  className="inline-flex items-center gap-2 text-xs text-gray-600 hover:text-white transition-colors mt-2"
                >
                  <ChevronLeft size={16} /> Back
                </button>
              </motion.div>
            )}

            {/* STEP: Calibration Engine Loader */}
            {step === 'calibrating' && (
              <motion.div
                key="calibrating"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                className="space-y-12 text-center flex flex-col items-center justify-center h-full"
              >
                {/* Pulsing Diaphragm Simulator */}
                <div className="relative w-44 h-44 flex items-center justify-center">
                  <motion.div
                    animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
                    className="absolute inset-0 bg-emerald-500/10 rounded-full blur-2xl"
                  />
                  <motion.div
                    animate={{ scale: [0.8, 1.15, 0.8] }}
                    transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
                    className="w-32 h-32 rounded-full border border-emerald-500/20 bg-emerald-500/5 flex items-center justify-center relative shadow-[0_0_30px_rgba(16,185,129,0.06)]"
                  >
                    <span className="text-2xl font-light text-emerald-400">{calibrationProgress}%</span>
                  </motion.div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xl font-light tracking-tight text-white">Generating Personalized Sanctuary</h3>
                  <p className="text-gray-300 text-md font-light max-w-[280px] mx-auto leading-relaxed h-10 transition-all duration-300">
                    {calibrationText}
                  </p>
                </div>
              </motion.div>
            )}

            {/* STEP: Paywall Carousel Plan Selector */}
            {step === 'paywall' && (
              <motion.div
                key="paywall"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                className="absolute inset-0 z-50 bg-transparent flex flex-col h-full overflow-hidden"
              >
                <SubscriptionView
                  onBack={() => setStep('q_experience')}
                  onPlanSelected={(planId) => {
                    setChosenPlan(planId as any);
                    setStep('auth');
                  }}
                  isOnboarding
                />
              </motion.div>
            )}

            {/* STEP: Account Registration (AuthView integration) */}
            {step === 'auth' && (
              <motion.div
                key="auth"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="absolute inset-0 z-50 bg-transparent"
              >
                <AuthView
                  onBack={() => setStep('paywall')}
                  onSuccess={() => {
                    if (chosenPlan === 'free') {
                      setStep('success');
                    } else {
                      setStep('payment');
                    }
                  }}
                />
              </motion.div>
            )}

            {/* STEP: Payment Gateway setup */}
            {step === 'payment' && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                className="space-y-8 flex flex-col justify-center h-full"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="text-emerald-400" size={16} />
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-400">Secure Payment Checkout</span>
                  </div>
                  <h2 className="text-3xl font-light text-white tracking-tight leading-tight">Payment Setup</h2>
                  <p className="text-gray-300 text-md font-light">
                    Set up your billing details to activate your <span className="text-white font-semibold uppercase">{chosenPlan}</span> membership.
                  </p>
                </div>

                {/* Glassmorphic Credit Card Preview */}
                <div className="relative w-full h-44 rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.01] p-6 flex flex-col justify-between overflow-hidden shadow-2xl backdrop-blur-xl shrink-0">
                  <div className="flex justify-between items-start">
                    <div className="w-12 h-8 rounded-md bg-white/10 flex items-center justify-center font-bold text-xs text-white/50 tracking-wider">
                      CHIP
                    </div>
                    {chosenPlan === 'premium' ? (
                      <Crown className="text-amber-400" size={24} fill="currentColor" />
                    ) : (
                      <Star className="text-indigo-400" size={24} fill="currentColor" />
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="text-xl tracking-[0.25em] font-light text-white font-mono h-6">
                      {cardNumber || '•••• •••• •••• ••••'}
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="space-y-1">
                        <span className="text-[7px] text-gray-500 font-bold uppercase tracking-widest leading-none block">Cardholder</span>
                        <span className="text-xs text-white/80 font-medium font-mono uppercase h-4 block overflow-hidden max-w-[200px] whitespace-nowrap">
                          {cardName || 'YOUR FULL NAME'}
                        </span>
                      </div>
                      <div className="space-y-1 text-right">
                        <span className="text-[7px] text-gray-500 font-bold uppercase tracking-widest leading-none block">Expires</span>
                        <span className="text-xs text-white/80 font-medium font-mono h-4 block">
                          {cardExpiry || 'MM/YY'}
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* Accent glow on card */}
                  <div className={`absolute -right-20 -bottom-20 w-40 h-40 rounded-full blur-[60px] pointer-events-none opacity-40 ${chosenPlan === 'premium' ? 'bg-amber-500' : 'bg-indigo-500'
                    }`} />
                </div>

                {/* Card Inputs Form */}
                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                  <div className="space-y-3">
                    <div className="relative group">
                      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-emerald-400 transition-colors">
                        <CreditCard size={16} />
                      </div>
                      <input
                        type="text"
                        placeholder="Cardholder Name"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        className="w-full h-12 bg-white/[0.03] border border-white/10 rounded-full pl-14 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.05] transition-all font-light text-sm"
                        required
                      />
                    </div>

                    <div className="relative group">
                      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-emerald-400 transition-colors">
                        <CreditCard size={16} />
                      </div>
                      <input
                        type="text"
                        placeholder="Card Number"
                        value={cardNumber}
                        onChange={(e) => handleCardNumberChange(e.target.value)}
                        className="w-full h-12 bg-white/[0.03] border border-white/10 rounded-full pl-14 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.05] transition-all font-mono text-sm"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative group">
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={cardExpiry}
                          onChange={(e) => handleExpiryChange(e.target.value)}
                          className="w-full h-12 bg-white/[0.03] border border-white/10 rounded-full px-5 text-white placeholder:text-gray-600 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.05] transition-all font-mono text-sm text-center"
                          maxLength={5}
                          required
                        />
                      </div>
                      <div className="relative group">
                        <input
                          type="password"
                          placeholder="CVV"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                          className="w-full h-12 bg-white/[0.03] border border-white/10 rounded-full px-5 text-white placeholder:text-gray-600 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.05] transition-all font-mono text-sm text-center"
                          maxLength={3}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isPaying}
                    className="w-full h-14 bg-white text-black rounded-full font-black text-[10px] uppercase tracking-[0.2em] hover:bg-emerald-400 transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-3 relative overflow-hidden"
                  >
                    <span className="relative z-10">{isPaying ? 'Authorizing Transaction...' : `Complete Checkout & Join`}</span>
                    {!isPaying && <ArrowRight size={16} strokeWidth={3} className="relative z-10" />}

                    {/* Sweep shimmer effect */}
                    <motion.div
                      initial={{ x: '-100%' }}
                      animate={{ x: '100%' }}
                      transition={{ repeat: Infinity, repeatType: 'loop', duration: 2.5, ease: 'linear' }}
                      className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-black/10 to-transparent pointer-events-none"
                    />
                  </button>
                </form>

                <button
                  onClick={() => setStep('auth')}
                  className="inline-flex items-center gap-2 text-xs text-gray-600 hover:text-white transition-colors"
                >
                  <ChevronLeft size={16} /> Back
                </button>
              </motion.div>
            )}

            {/* STEP: Onboarding Success & Welcome */}
            {step === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-12 text-center flex flex-col items-center justify-center h-full"
              >
                <div className="space-y-4">
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', damping: 15 }}
                    className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-green-600 rounded-[32px] mx-auto flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.3)] relative"
                  >
                    <CheckCircle2 size={40} className="text-white" />
                  </motion.div>
                </div>

                <div className="space-y-3">
                  <h2 className="text-3xl font-light tracking-tight text-white">Sanctuary Unlocked</h2>
                  <p className="text-gray-400 text-xs font-light max-w-[280px] leading-relaxed mx-auto">
                    {chosenPlan === 'free'
                      ? 'Welcome to Spirox! Your account is created and free breathing cycles are ready.'
                      : `Welcome to Spirox Pro! Your premium billing is authorized and all masteries are unlocked.`}
                  </p>
                </div>

                <button
                  onClick={handleFinalRedirect}
                  className="w-full h-14 bg-white text-black rounded-full font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 mt-8"
                >
                  Enter Your Sanctuary
                  <ArrowRight size={16} strokeWidth={3} />
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      {/* Ambient background glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none z-0" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none z-0" />
    </div>
  );
}
