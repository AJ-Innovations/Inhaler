'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Crown, Star, ChevronLeft } from 'lucide-react';

interface SubscriptionViewProps {
  onBack: () => void;
}

export function SubscriptionView({ onBack }: SubscriptionViewProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      description: 'Ideal for individual users.',
      features: [
        'Access to basic breathing routines',
        'Standard visual themes',
        'Daily streak tracking',
        'Community support'
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
      description: 'Ideal for small teams and power users.',
      features: [
        'Access to all premium features',
        'Custom breath builder v2',
        'AI coaching & guidance',
        'Priority support'
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
      description: 'Best choice for enterprises and studios.',
      features: [
        'Everything in Pro',
        'Up to 20 users',
        '10GB cloud storage',
        '24/7 dedicated support'
      ],
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
          highlight: 'bg-blue-500/5'
        };
      case 'gold':
        return {
          border: 'border-amber-500/30',
          glow: 'bg-amber-500/20',
          button: 'bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-black hover:opacity-90',
          badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
          icon: 'text-amber-400 bg-amber-500/10',
          highlight: 'bg-gradient-to-br from-amber-500/5 to-yellow-500/5'
        };
      default:
        return {
          border: 'border-emerald-500/30',
          glow: 'bg-emerald-500/20',
          button: 'bg-[#10B981] text-black hover:bg-[#34D399]',
          badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
          icon: 'text-emerald-400 bg-emerald-500/10',
          highlight: 'bg-emerald-500/5'
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
      <div className="max-w-[480px] mx-auto w-full py-6 flex flex-col h-full overflow-hidden">
        {/* Padded Header / Top Section */}
        <div className="px-6 flex flex-col shrink-0">
          {/* Back Button */}
          <button 
            onClick={onBack}
            className="mb-6 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors self-start shrink-0"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="text-center mb-8 space-y-2 shrink-0">
            <h1 className="text-3xl font-light tracking-tight text-white">Choose your Plan</h1>
            <p className="text-gray-500 text-xs font-light">Discover the perfect plan tailored just for you.</p>
            
            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 pt-2">
              <span className={`text-[10px] uppercase tracking-widest font-bold ${billingCycle === 'monthly' ? 'text-white' : 'text-gray-500'}`}>Monthly</span>
              <button 
                onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'yearly' : 'monthly')}
                className={`w-12 h-6 rounded-full border border-white/10 relative p-1 transition-all duration-500 shrink-0 ${
                  billingCycle === 'yearly' ? 'bg-emerald-500/80 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-white/10'
                }`}
              >
                <motion.div 
                  animate={{ x: billingCycle === 'monthly' ? 0 : 24 }}
                  className="w-4 h-4 rounded-full bg-white shadow-lg"
                />
              </button>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] uppercase tracking-widest font-bold ${billingCycle === 'yearly' ? 'text-white' : 'text-gray-500'}`}>Yearly</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[8px] font-black text-emerald-400 uppercase tracking-tighter">
                  Save 20%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Full Screen Scrollable Cards Slider */}
        <div className="flex-1 flex flex-row gap-4 pb-8 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-6 items-stretch min-h-0">
          {plans.map((plan) => {
            const colors = getColorClasses(plan.color || 'emerald');
            return (
              <div 
                key={plan.id}
                className={`relative w-[80%] min-w-[80%] snap-start rounded-[40px] border p-6 flex flex-col justify-between transition-all duration-700 ${
                  plan.highlight 
                    ? `${colors.highlight} ${colors.border} shadow-[0_0_40px_rgba(16,185,129,0.08)]` 
                    : `bg-white/[0.02] ${colors.border}`
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

                    <div className="flex items-baseline gap-2">
                      {plan.strikethrough && (
                        <span className={`text-lg text-gray-600 font-light line-through decoration-2 tracking-tighter self-center mb-1 ${colors.badge.replace('bg-', 'decoration-').replace('/10', '/50')}`}>
                          ${plan.strikethrough}
                        </span>
                      )}
                      <span className="text-4xl font-light text-white tracking-tighter">${plan.displayPrice || plan.price}</span>
                      <span className="text-xs text-gray-500 font-medium">{plan.period || '/ month'}</span>
                    </div>

                    <p className="text-gray-400 text-xs font-light leading-relaxed min-h-[36px]">{plan.description}</p>
                  </div>
                </div>

                {/* Button ABOVE features list */}
                <button className={`w-full py-4 my-4 rounded-full text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-500 shadow-2xl active:scale-95 shrink-0 ${colors.button}`}>
                  Get it now
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
                  
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-4 group shrink-0">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all ${colors.icon}`}>
                        <Check size={10} strokeWidth={3} />
                      </div>
                      <span className="text-xs text-gray-400 font-light group-hover:text-white transition-colors">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
