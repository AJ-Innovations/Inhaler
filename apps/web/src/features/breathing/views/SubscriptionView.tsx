'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Crown, Star, ChevronLeft, Lock } from 'lucide-react';

interface SubscriptionViewProps {
  onBack: () => void;
  isOnboarding?: boolean;
  onPlanSelected?: (planId: string) => void;
}

export function SubscriptionView({ onBack, isOnboarding, onPlanSelected }: SubscriptionViewProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [activeIndex, setActiveIndex] = useState(1); // Default to the Pro plan (index 1)
  const touchStart = useRef<number | null>(null);

  // Colour tokens keyed directly off activeIndex — re-derived on every render
  const toggleOnClass = [
    'bg-blue-600/80 shadow-[0_0_15px_rgba(37,99,235,0.35)]',   // Free  (index 0)
    'bg-emerald-500/80 shadow-[0_0_15px_rgba(16,185,129,0.3)]', // Pro   (index 1)
    'bg-amber-400/80 shadow-[0_0_15px_rgba(245,158,11,0.35)]',  // Premium (index 2)
  ][activeIndex] ?? 'bg-emerald-500/80 shadow-[0_0_15px_rgba(16,185,129,0.3)]';

  const badgeColorClass = [
    'bg-blue-600/10 border-blue-600/20 text-blue-400',           // Free
    'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',  // Pro
    'bg-amber-400/10 border-amber-400/20 text-amber-400',        // Premium
  ][activeIndex] ?? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current === null) return;
    const diff = touchStart.current - e.changedTouches[0].clientX;
    const threshold = 50; // swipe threshold in px

    if (diff > threshold) {
      // Swipe left -> Next card
      setActiveIndex(prev => Math.min(prev + 1, plans.length - 1));
    } else if (diff < -threshold) {
      // Swipe right -> Previous card
      setActiveIndex(prev => Math.max(prev - 1, 0));
    }

    touchStart.current = null;
  };

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      description: 'Ideal for individual users.',
      features: [
        'Access to basic breathing routines',
        'Daily streak tracking',
        'Standard visual themes',
        'Community support'
      ],
      lockedFeatures: [
        'Advanced custom breath builder v2',
        'Premium voice assistant models',
        'Push notifications & routines',
        '10GB cloud progress backup'
      ],
      icon: Star,
      highlight: false,
      color: 'blue'
    },
    {
      id: 'pro',
      name: 'Pro',
      price: billingCycle === 'monthly' ? 1 : 10 / 12,
      displayPrice: billingCycle === 'monthly' ? '1' : '10',
      strikethrough: billingCycle === 'yearly' ? '12' : null,
      period: billingCycle === 'monthly' ? '/ month' : '/ year',
      description: 'Ideal for daily users building a consistent breathing habit.',
      features: [
        'All Free features included',
        'Advanced custom breath builder v2',
        'Premium voice assistant models',
        'Push notifications & routines',
        'Priority chat support'
      ],
      lockedFeatures: [
        'Dedicated 1-on-1 AI coach',
        '10GB cloud progress backup',
        'Multi-device account sync'
      ],
      icon: Zap,
      highlight: true,
      popular: true,
      color: 'emerald'
    },
    {
      id: 'premium',
      name: 'Premium',
      price: billingCycle === 'monthly' ? 5 : 50 / 12,
      displayPrice: billingCycle === 'monthly' ? '5' : '50',
      strikethrough: billingCycle === 'yearly' ? '60' : null,
      period: billingCycle === 'monthly' ? '/ month' : '/ year',
      description: 'Designed for serious users seeking total mental and physical mastery.',
      features: [
        'All Pro features included',
        'Dedicated 1-on-1 AI coach',
        '10GB cloud progress backup',
        'Multi-device account sync',
        '24/7 priority developer hotline'
      ],
      lockedFeatures: [],
      icon: Crown,
      highlight: false,
      color: 'gold'
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return {
          border: 'border-blue-500/20',
          glow: 'bg-blue-500/20',
          button: 'bg-blue-600 text-white hover:bg-blue-500',
          badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
          icon: 'text-blue-400 bg-blue-500/10',
          highlight: 'bg-blue-500/5',
          priceColor: 'text-blue-400'
        };
      case 'gold':
        return {
          border: 'border-amber-500/30',
          glow: 'bg-amber-500/20',
          button: 'bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-black hover:opacity-90',
          badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
          icon: 'text-amber-400 bg-amber-500/10',
          highlight: 'bg-gradient-to-br from-amber-500/5 to-yellow-500/5',
          priceColor: 'text-amber-400'
        };
      default:
        return {
          border: 'border-emerald-500/30',
          glow: 'bg-emerald-500/20',
          button: 'bg-[#10B981] text-black hover:bg-[#34D399]',
          badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
          icon: 'text-emerald-400 bg-emerald-500/10',
          highlight: 'bg-emerald-500/5',
          priceColor: 'text-emerald-400'
        };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="h-[100dvh] w-full bg-black overflow-hidden flex flex-col"
    >
      <div className="max-w-[480px] mx-auto w-full flex flex-col h-full overflow-hidden">
        {/* Sticky Top Header Bar with Centered Title, Back button & Gorgeous Subtitle */}
        <div className="sticky top-0 z-50 bg-transparent backdrop-blur-md px-6 py-4 flex flex-col items-center border-b border-white/[0.04] shrink-0 w-full gap-1">
          <div className="flex items-center justify-between w-full">
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors shrink-0"
            >
              <ChevronLeft size={20} />
            </button>
            <h1 className="text-2xl font-medium tracking-tight text-white flex-1 text-center pr-10">Choose your Plan</h1>
          </div>
          <p className="text-white/40 text-[11px] tracking-wide font-light">Unlock absolute breathing mastery & cloud sync.</p>
        </div>

        {/* Plan Selector Pill Tabs */}
        <div className="flex items-center justify-center px-6 pt-4 pb-2 shrink-0">
          <div className="flex w-full bg-white/[0.04] border border-white/[0.06] rounded-full p-1 gap-1">
            {plans.map((plan, index) => {
              const isSelected = index === activeIndex;
              const PlanIcon = plan.icon;

              // Pre-defined safe className strings per colour
              const selectedClass =
                plan.color === 'blue'
                  ? 'bg-blue-600 text-white shadow-[0_0_16px_rgba(37,99,235,0.35)]'
                  : plan.color === 'gold'
                    ? 'bg-amber-400 text-black shadow-[0_0_16px_rgba(245,158,11,0.40)]'
                    : 'bg-emerald-500 text-black shadow-[0_0_16px_rgba(16,185,129,0.35)]';

              return (
                <button
                  key={plan.id}
                  onClick={() => setActiveIndex(index)}
                  className={`flex-1 flex items-center justify-center gap-1.5 h-9 rounded-full text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-300 ${isSelected
                    ? selectedClass
                    : 'text-gray-500 hover:text-gray-300 hover:bg-white/[0.04]'
                    }`}
                >
                  <PlanIcon size={11} />
                  {plan.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Centered Single-Card Viewer */}
        <div
          className="flex-1 w-full relative min-h-0 flex items-center justify-center px-5"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Track — slides via translateX */}
          <div
            className="flex flex-row gap-4 h-[520px] items-stretch transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] w-full"
            style={{ transform: `translateX(calc(-${activeIndex} * (100% + 16px)))` }}
          >
            {plans.map((plan, index) => {
              const colors = getColorClasses(plan.color || 'emerald');
              const isActive = index === activeIndex;
              return (
                <div
                  key={plan.id}
                  onClick={() => setActiveIndex(index)}
                  className={`relative w-full min-w-full h-full rounded-[36px] border p-6 flex flex-col justify-between transition-all duration-500 cursor-pointer ${isActive
                    ? `${colors.highlight} ${colors.border} shadow-[0_0_50px_rgba(0,0,0,0.4)] scale-100 opacity-100`
                    : `bg-white/[0.02] ${colors.border} scale-95 opacity-40`
                    }`}
                >
                  <div className="space-y-4 shrink-0">
                    {plan.popular && (
                      <div className={`absolute top-6 right-6 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${colors.badge}`}>
                        MOST POPULAR
                      </div>
                    )}

                    {/* Gradient Glow */}
                    {(plan.highlight || plan.id === 'premium' || plan.id === 'free') && (
                      <div className={`absolute -top-20 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full blur-[60px] pointer-events-none ${colors.glow}`} />
                    )}

                    <div className="space-y-4">
                      <div className="space-y-1">
                        <h3 className="text-xl font-light text-white">{plan.name}</h3>
                        <p className="text-gray-500 text-[9px] uppercase tracking-widest font-bold">Billed {billingCycle}</p>
                      </div>

                      <div className="flex flex-col gap-2">
                        <div className="flex items-baseline gap-4">
                          {plan.strikethrough && (
                            <span className={`text-2xl text-gray-400 font-light line-through decoration-2 tracking-tighter self-center mb-1 ${colors.badge.replace('bg-', 'decoration-').replace('/10', '/50')}`}>
                              ${plan.strikethrough}
                            </span>
                          )}
                          <span className={`text-4xl font-light tracking-tighter transition-colors duration-500 ${billingCycle === 'yearly' ? colors.priceColor : 'text-white'
                            }`}>
                            ${plan.displayPrice || plan.price}
                          </span>
                          <span className="text-xs text-gray-500 font-medium">{plan.period || '/ month'}</span>
                        </div>

                        {billingCycle === 'yearly' && plan.id !== 'free' && (
                          <div className={`inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full border text-[9px] font-extrabold uppercase tracking-wider w-fit animate-pulse ${colors.badge}`}>
                            <Zap size={10} fill="currentColor" className="shrink-0" />
                            20% Discount Applied
                          </div>
                        )}
                      </div>

                      <p className="text-gray-400 text-xs font-light leading-relaxed min-h-[36px]">{plan.description}</p>
                    </div>
                  </div>

                  {/* Button ABOVE features list with gloss animation */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onPlanSelected) {
                        onPlanSelected(plan.id);
                      }
                    }}
                    className={`w-full py-4 my-4 rounded-full text-[14px] font-black uppercase tracking-[0.15em] transition-all duration-500 shadow-2xl active:scale-95 shrink-0 relative overflow-hidden ${colors.button}`}
                  >
                    <span className="relative z-10">
                      {plan.id === 'free' ? 'Choose Free' : 'Subscribe Now'}
                    </span>
                    <motion.div
                      initial={{ x: '-100%' }}
                      animate={{ x: '100%' }}
                      transition={{
                        repeat: Infinity,
                        repeatType: 'loop',
                        duration: 2.5,
                        ease: 'linear',
                      }}
                      className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
                    />
                  </button>

                  <div className="flex-1 overflow-y-auto pr-1 space-y-3 border-t border-white/5 pt-4 scrollbar-hide min-h-0">
                    {/* Specialized Cloud storage for the third card */}
                    {plan.id === 'premium' && (
                      <div className="flex items-center gap-4 group shrink-0">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 bg-gradient-to-br from-amber-500 to-yellow-400 text-black shadow-[0_0_12px_rgba(245,158,11,0.25)]">
                          <Star size={10} fill="black" />
                        </div>
                        <span className="text-xs text-white font-black tracking-tight group-hover:text-amber-400 transition-colors">CLOUD PROGRESS SYNC</span>
                      </div>
                    )}

                    {/* Included Features */}
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-4 group shrink-0">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all ${colors.icon}`}>
                          <Check size={10} strokeWidth={3} />
                        </div>
                        <span className="text-xs text-gray-300 font-light group-hover:text-white transition-colors">{feature}</span>
                      </div>
                    ))}

                    {/* Excluded / Locked Features */}
                    {plan.lockedFeatures && plan.lockedFeatures.map((feature, i) => (
                      <div key={`locked-${i}`} className="flex items-center gap-4 group shrink-0 opacity-40">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 border border-white/10 bg-white/5 text-gray-500">
                          <Lock size={9} />
                        </div>
                        <span className="text-xs text-gray-500 font-light line-through decoration-white/20">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Billing Toggle Footer — colours derived from activeIndex at component level */}
        <div className="flex items-center justify-center gap-4 py-6 shrink-0 border-t border-white/[0.04] bg-black">
          <span className={`text-[10px] uppercase tracking-widest font-bold transition-colors duration-300 ${
            billingCycle === 'monthly' ? 'text-white' : 'text-gray-500'
          }`}>
            Monthly
          </span>

          <button
            onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'yearly' : 'monthly')}
            className={`w-12 h-6 rounded-full border border-white/10 relative p-1 transition-all duration-500 shrink-0 ${
              billingCycle === 'yearly' ? toggleOnClass : 'bg-white/10'
            }`}
          >
            <motion.div
              animate={{ x: billingCycle === 'monthly' ? 0 : 24 }}
              className="w-4 h-4 rounded-full bg-white shadow-lg"
            />
          </button>

          <div className="flex items-center gap-2">
            <span className={`text-[10px] uppercase tracking-widest font-bold transition-colors duration-300 ${
              billingCycle === 'yearly' ? 'text-white' : 'text-gray-500'
            }`}>
              Yearly
            </span>
            <span className={`px-2 py-0.5 rounded-full border text-[8px] font-black uppercase tracking-tighter transition-all duration-300 ${badgeColorClass}`}>
              Save 20%
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
