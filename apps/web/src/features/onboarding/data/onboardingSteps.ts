/**
 * Static data for onboarding question steps.
 * Extracted from OnboardingView.tsx for modularity.
 */

import { Brain, Moon, Wind, Zap } from "lucide-react";

export const goals = [
  {
    id: "sleep",
    title: "Sleep & Recovery",
    desc: "Fall asleep faster and maximize rest.",
    icon: Moon,
    color: "text-white",
  },
  {
    id: "stress",
    title: "Stress & Anxiety",
    desc: "Calm your nervous system in minutes.",
    icon: Zap,
    color: "text-white",
  },
  {
    id: "focus",
    title: "Focus & Clarity",
    desc: "Sharpen attention and lock in focus.",
    icon: Brain,
    color: "text-white",
  },
  {
    id: "power",
    title: "Energy & Breath",
    desc: "Expand endurance and lung capacity.",
    icon: Wind,
    color: "text-white",
  },
];

export const stressLevels = [
  {
    id: "daily",
    title: "High Stress (Daily)",
    desc: "Always on-edge under pressure.",
  },
  {
    id: "weekly",
    title: "Moderate Stress",
    desc: "Struggling during key peak days.",
  },
  {
    id: "rarely",
    title: "Low Stress",
    desc: "Seeking proactive preventative calm.",
  },
];

export const experienceLevels = [
  {
    id: "beginner",
    title: "Beginner",
    desc: "New to breathing exercises.",
  },
  {
    id: "intermediate",
    title: "Intermediate",
    desc: "Familiar with box-breathing & holds.",
  },
  {
    id: "advanced",
    title: "Advanced",
    desc: "Regular breathwork practitioner.",
  },
];

/** Fallback country list when the API is unreachable. */
export const FALLBACK_COUNTRIES = [
  {
    code: "US",
    name: "United States",
    flag: "https://flagcdn.com/w40/us.png",
  },
  {
    code: "IN",
    name: "India",
    flag: "https://flagcdn.com/w40/in.png",
  },
  {
    code: "GB",
    name: "United Kingdom",
    flag: "https://flagcdn.com/w40/gb.png",
  },
  {
    code: "CA",
    name: "Canada",
    flag: "https://flagcdn.com/w40/ca.png",
  },
  {
    code: "AU",
    name: "Australia",
    flag: "https://flagcdn.com/w40/au.png",
  },
  {
    code: "DE",
    name: "Germany",
    flag: "https://flagcdn.com/w40/de.png",
  },
  {
    code: "FR",
    name: "France",
    flag: "https://flagcdn.com/w40/fr.png",
  },
  {
    code: "JP",
    name: "Japan",
    flag: "https://flagcdn.com/w40/jp.png",
  },
];
