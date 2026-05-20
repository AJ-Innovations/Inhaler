/**
 * Icon mapping and category data for the Achievements/Goals feature.
 * Extracted from AchievementsView.tsx for modularity.
 */

import {
  Activity,
  Brain,
  Calendar,
  Cloud,
  Heart,
  LucideIcon,
  Moon,
  Shield,
  Sun,
  Target,
  Trophy,
  Wind,
  Zap,
} from "lucide-react";

/** Map of goal icon IDs to their Lucide icon components. */
export const GOAL_ICONS: Record<string, LucideIcon> = {
  wind: Wind,
  heart: Heart,
  zap: Zap,
  brain: Brain,
  activity: Activity,
  sun: Sun,
  moon: Moon,
  cloud: Cloud,
  shield: Shield,
  trophy: Trophy,
  target: Target,
  calendar: Calendar,
};

/** Custom SVG target-arrow icon component for goals. */
export const TargetArrow = ({
  size = 20,
  strokeWidth = 2,
  className = "",
}: {
  size?: number;
  strokeWidth?: number;
  className?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
    <path d="M12 12l7-7" />
    <path d="M19 8V5h-3" />
  </svg>
);
