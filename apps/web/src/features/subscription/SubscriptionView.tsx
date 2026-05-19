'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Crown, Star, ChevronLeft, Lock } from 'lucide-react';

interface SubscriptionViewProps {
  onBack: () => void;
  isOnboarding?: boolean;
  onPlanSelected?: (planId: string) => void;
}

interface PricingTier {
  symbol: string;
  proMonthly: string;
  proYearly: string;
  proStrikethrough: string | null;
  premiumMonthly: string;
  premiumYearly: string;
  premiumStrikethrough: string | null;
  periodMonthly: string;
  periodYearly: string;
}

const pricingTiers: Record<string, PricingTier> = {
  US: {
    symbol: '$',
    proMonthly: '0.99',
    proYearly: '9.99',
    proStrikethrough: '12',
    premiumMonthly: '4.99',
    premiumYearly: '49.99',
    premiumStrikethrough: '60',
    periodMonthly: '/ month',
    periodYearly: '/ year',
  },
  GB: {
    symbol: '£',
    proMonthly: '0.99',
    proYearly: '9.99',
    proStrikethrough: '12',
    premiumMonthly: '4.49',
    premiumYearly: '44.99',
    premiumStrikethrough: '54',
    periodMonthly: '/ month',
    periodYearly: '/ year',
  },
  EU: {
    symbol: '€',
    proMonthly: '0.99',
    proYearly: '9.99',
    proStrikethrough: '12',
    premiumMonthly: '4.99',
    premiumYearly: '49.99',
    premiumStrikethrough: '60',
    periodMonthly: '/ month',
    periodYearly: '/ year',
  },
  IN: {
    symbol: '₹',
    proMonthly: '29',
    proYearly: '249',
    proStrikethrough: '348',
    premiumMonthly: '99',
    premiumYearly: '899',
    premiumStrikethrough: '1188',
    periodMonthly: '/ month',
    periodYearly: '/ year',
  },
  CA: {
    symbol: 'C$',
    proMonthly: '1.49',
    proYearly: '14.99',
    proStrikethrough: '18',
    premiumMonthly: '6.99',
    premiumYearly: '69.99',
    premiumStrikethrough: '84',
    periodMonthly: '/ month',
    periodYearly: '/ year',
  },
  AU: {
    symbol: 'A$',
    proMonthly: '1.49',
    proYearly: '14.99',
    proStrikethrough: '18',
    premiumMonthly: '7.49',
    premiumYearly: '74.99',
    premiumStrikethrough: '90',
    periodMonthly: '/ month',
    periodYearly: '/ year',
  },
  JP: {
    symbol: '¥',
    proMonthly: '150',
    proYearly: '1,500',
    proStrikethrough: '1,800',
    premiumMonthly: '700',
    premiumYearly: '7,000',
    premiumStrikethrough: '8,400',
    periodMonthly: '/ 月',
    periodYearly: '/ 年',
  },
  KR: {
    symbol: '₩',
    proMonthly: '990',
    proYearly: '9,900',
    proStrikethrough: '11,880',
    premiumMonthly: '4,900',
    premiumYearly: '49,000',
    premiumStrikethrough: '58,800',
    periodMonthly: '/ 월',
    periodYearly: '/ 년',
  },
  AE: {
    symbol: 'AED ',
    proMonthly: '2.99',
    proYearly: '29.99',
    proStrikethrough: '36',
    premiumMonthly: '14.99',
    premiumYearly: '149.99',
    premiumStrikethrough: '180',
    periodMonthly: '/ month',
    periodYearly: '/ year',
  },
  SA: {
    symbol: 'SR ',
    proMonthly: '2.99',
    proYearly: '29.99',
    proStrikethrough: '36',
    premiumMonthly: '12.99',
    premiumYearly: '129.99',
    premiumStrikethrough: '156',
    periodMonthly: '/ month',
    periodYearly: '/ year',
  },
  BR: {
    symbol: 'R$ ',
    proMonthly: '2.99',
    proYearly: '29.99',
    proStrikethrough: '36',
    premiumMonthly: '14.99',
    premiumYearly: '149.99',
    premiumStrikethrough: '180',
    periodMonthly: '/ mês',
    periodYearly: '/ ano',
  },
  TR: {
    symbol: '₺',
    proMonthly: '9.99',
    proYearly: '99.99',
    proStrikethrough: '120',
    premiumMonthly: '49.99',
    premiumYearly: '499.99',
    premiumStrikethrough: '600',
    periodMonthly: '/ ay',
    periodYearly: '/ yıl',
  },
  ID: {
    symbol: 'Rp ',
    proMonthly: '5.000',
    proYearly: '49.000',
    proStrikethrough: '60.000',
    premiumMonthly: '24.000',
    premiumYearly: '240.000',
    premiumStrikethrough: '288.000',
    periodMonthly: '/ bulan',
    periodYearly: '/ tahun',
  },
  VN: {
    symbol: '₫',
    proMonthly: '9,000',
    proYearly: '90,000',
    proStrikethrough: '108,000',
    premiumMonthly: '49,000',
    premiumYearly: '490,000',
    premiumStrikethrough: '588,000',
    periodMonthly: '/ tháng',
    periodYearly: '/ năm',
  },
  DEFAULT: {
    symbol: '$',
    proMonthly: '0.99',
    proYearly: '9.99',
    proStrikethrough: '12',
    premiumMonthly: '4.99',
    premiumYearly: '49.99',
    premiumStrikethrough: '60',
    periodMonthly: '/ month',
    periodYearly: '/ year',
  }
};

export function SubscriptionView({ onBack, isOnboarding, onPlanSelected }: SubscriptionViewProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [activeIndex, setActiveIndex] = useState(1); // Default to the Pro plan (index 1)
  const touchStart = useRef<number | null>(null);

  const [activeTier, setActiveTier] = useState<PricingTier>(pricingTiers.DEFAULT);
  const [detectedCountry, setDetectedCountry] = useState<string>('US');

  const applyCountry = (country: string) => {
    const cc = country.toUpperCase();
    setDetectedCountry(cc);
    const euroZone = ['DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'IE', 'FI', 'PT', 'GR', 'EE', 'LV', 'LT', 'SK', 'SI', 'CY', 'MT', 'HR'];
    if (pricingTiers[cc]) {
      setActiveTier(pricingTiers[cc]);
    } else if (euroZone.includes(cc)) {
      setActiveTier(pricingTiers.EU);
    } else {
      setActiveTier(pricingTiers.DEFAULT);
    }
  };

  React.useEffect(() => {
    let active = true;
    async function fetchGeo() {
      // 0. Try localStorage first
      if (typeof window !== 'undefined') {
        const savedCountry = localStorage.getItem('spirox_user_country');
        if (savedCountry) {
          applyCountry(savedCountry);
          return;
        }
      }

      // 1. Try ipapi.co (Primary HTTPS)
      try {
        const res = await fetch('https://ipapi.co/json/');
        if (res.ok) {
          const data = await res.json();
          if (active && data.country_code) {
            applyCountry(data.country_code);
            return;
          }
        }
      } catch (e) {
        console.warn('Primary Geo-IP (ipapi.co) failed, trying backup...', e);
      }

      // 2. Try freeipapi.com (Highly reliable CORS-friendly Backup)
      try {
        const res = await fetch('https://freeipapi.com/api/json');
        if (res.ok) {
          const data = await res.json();
          if (active && data.countryCode) {
            applyCountry(data.countryCode);
            return;
          }
        }
      } catch (e) {
        console.warn('Backup Geo-IP (freeipapi.com) failed, using default US.');
      }
    }
    fetchGeo();
    return () => { active = false; };
  }, []);

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
      displayPrice: '0',
      strikethrough: null,
      period: billingCycle === 'monthly' ? activeTier.periodMonthly : activeTier.periodYearly,
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
      price: billingCycle === 'monthly' ? parseFloat(activeTier.proMonthly.replace(/,/g, '')) : parseFloat(activeTier.proYearly.replace(/,/g, '')) / 12,
      displayPrice: billingCycle === 'monthly' ? activeTier.proMonthly : activeTier.proYearly,
      strikethrough: billingCycle === 'yearly' ? activeTier.proStrikethrough : null,
      period: billingCycle === 'monthly' ? activeTier.periodMonthly : activeTier.periodYearly,
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
      price: billingCycle === 'monthly' ? parseFloat(activeTier.premiumMonthly.replace(/,/g, '')) : parseFloat(activeTier.premiumYearly.replace(/,/g, '')) / 12,
      displayPrice: billingCycle === 'monthly' ? activeTier.premiumMonthly : activeTier.premiumYearly,
      strikethrough: billingCycle === 'yearly' ? activeTier.premiumStrikethrough : null,
      period: billingCycle === 'monthly' ? activeTier.periodMonthly : activeTier.periodYearly,
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
          button: 'bg-gradient-to-r from-amber-500 to-yellow-400 text-white font-black hover:opacity-90',
          badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
          icon: 'text-amber-400 bg-amber-500/10',
          highlight: 'bg-gradient-to-br from-amber-500/5 to-yellow-500/5',
          priceColor: 'text-amber-400'
        };
      default:
        return {
          border: 'border-emerald-500/30',
          glow: 'bg-emerald-500/20',
          button: 'bg-[#10B981] text-white hover:bg-[#34D399]',
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
      className={`h-[100dvh] w-full overflow-hidden flex flex-col`}
    >
      <div className="max-w-[480px] mx-auto w-full flex flex-col h-full overflow-hidden">
        {/* Sticky Top Header Bar with Centered Title, Back button & Gorgeous Subtitle */}
        <div className="sticky top-0 z-50 bg-transparent px-6 py-4 flex flex-col items-center shrink-0 w-full gap-1">
          <div className="flex items-center justify-between w-full">
            <button
              onClick={onBack}
              className="text-gray-200 hover:text-white transition-colors shrink-0"
            >
              <ChevronLeft size={24} />
            </button>
            <h1 className="text-2xl font-medium tracking-tight text-white flex-1 text-center pr-10">Choose your Plan</h1>
          </div>
          <p className="text-white/50 text-[12px] tracking-wide font-light">Unlock absolute breathing mastery & cloud sync.</p>
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
                    : 'text-gray-300 hover:text-white hover:bg-white/[0.04]'
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
                  className={`relative w-full min-w-full h-full rounded-[36px] border p-6 flex flex-col justify-between transition-all duration-500 cursor-pointer backdrop-blur-3xl ${isActive
                    ? `${colors.highlight} ${colors.border} scale-100 opacity-100`
                    : `bg-white/[0.02] ${colors.border} scale-95 opacity-40 hover:opacity-70`
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
                        <p className="text-gray-300 text-[9px] uppercase tracking-widest font-bold">Billed {billingCycle}</p>
                      </div>

                      <div className="flex flex-col gap-2">
                        <div className="flex items-baseline gap-4">
                          {plan.strikethrough && (
                            <span className={`text-2xl text-gray-200 font-light line-through decoration-2 tracking-tighter self-center mb-1 ${colors.badge.replace('bg-', 'decoration-').replace('/10', '/50')}`}>
                              {activeTier.symbol}{plan.strikethrough}
                            </span>
                          )}
                          <span className={`text-4xl font-light tracking-tighter transition-colors duration-500 ${billingCycle === 'yearly' ? colors.priceColor : 'text-white'
                            }`}>
                            {plan.id === 'free' ? '' : activeTier.symbol}{plan.displayPrice || plan.price}
                          </span>
                          <span className="text-xs text-gray-300 font-medium">{plan.period}</span>
                        </div>

                        {billingCycle === 'yearly' && plan.id !== 'free' && (
                          <div className={`inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full border text-[9px] font-extrabold uppercase tracking-wider w-fit animate-pulse ${colors.badge}`}>
                            <Zap size={10} fill="currentColor" className="shrink-0" />
                            20% Discount Applied
                          </div>
                        )}
                      </div>

                      <p className="text-gray-200 text-xs font-light leading-relaxed min-h-[36px]">{plan.description}</p>
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
                        <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 border border-white/10 bg-white/5 text-gray-300">
                          <Lock size={9} />
                        </div>
                        <span className="text-xs text-gray-300 font-light line-through decoration-white/20">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Billing Toggle Footer */}
        <div className="flex items-center justify-center gap-4 py-6 shrink-0">
          <span className={`text-[10px] uppercase tracking-widest font-bold transition-colors duration-300 ${billingCycle === 'monthly' ? 'text-white' : 'text-gray-300'
            }`}>
            Monthly
          </span>

          <button
            onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'yearly' : 'monthly')}
            className={`w-12 h-6 rounded-full border border-white/10 relative p-1 transition-all duration-500 shrink-0 ${billingCycle === 'yearly' ? toggleOnClass : 'bg-white/10'
              }`}
          >
            <motion.div
              animate={{ x: billingCycle === 'monthly' ? 0 : 24 }}
              className="w-4 h-4 rounded-full bg-white shadow-lg"
            />
          </button>

          <div className="flex items-center gap-2">
            <span className={`text-[10px] uppercase tracking-widest font-bold transition-colors duration-300 ${billingCycle === 'yearly' ? 'text-white' : 'text-gray-300'
              }`}>
              Yearly
            </span>
            <span className={`px-2 py-0.5 rounded-full border text-[8px] font-black uppercase tracking-tighter transition-all duration-300 ${badgeColorClass}`}>
              Save 20%
            </span>
          </div>
        </div>

        {/* Country Preview / Selector (Dynamic PPP) */}
        <div className="flex flex-col items-center justify-center gap-1 pb-6 shrink-0 opacity-80 hover:opacity-100 transition-opacity relative z-[20]">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/5 bg-white/5 backdrop-blur-md">
            <span className="text-[9px] uppercase tracking-widest text-white/50 font-bold">Country Preview:</span>
            <select
              value={detectedCountry}
              onChange={(e) => {
                applyCountry(e.target.value);
              }}
              className="bg-transparent text-white text-[9px] font-black uppercase tracking-wider border-none outline-none cursor-pointer focus:ring-0"
              style={{ colorScheme: 'dark' }}
            >
              <option value="US" className="bg-neutral-900 text-white">United States ($)</option>
              <option value="IN" className="bg-neutral-900 text-white">India (₹)</option>
              <option value="GB" className="bg-neutral-900 text-white">United Kingdom (£)</option>
              <option value="EU" className="bg-neutral-900 text-white">Eurozone (€)</option>
              <option value="CA" className="bg-neutral-900 text-white">Canada (C$)</option>
              <option value="AU" className="bg-neutral-900 text-white">Australia (A$)</option>
              <option value="JP" className="bg-neutral-900 text-white">Japan (¥)</option>
              <option value="KR" className="bg-neutral-900 text-white">South Korea (₩)</option>
              <option value="AE" className="bg-neutral-900 text-white">UAE (AED)</option>
              <option value="SA" className="bg-neutral-900 text-white">Saudi Arabia (SR)</option>
              <option value="BR" className="bg-neutral-900 text-white">Brazil (R$)</option>
              <option value="TR" className="bg-neutral-900 text-white">Turkey (₺)</option>
              <option value="ID" className="bg-neutral-900 text-white">Indonesia (Rp)</option>
              <option value="VN" className="bg-neutral-900 text-white">Vietnam (₫)</option>
            </select>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
