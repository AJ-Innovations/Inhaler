export type BillingCycle = "monthly" | "yearly";

export interface SubscriptionViewProps {
  onBack: () => void;
  isOnboarding?: boolean;
  onPlanSelected?: (planId: string) => void;
}

export interface PlanType {
  id: string;
  name: string;
  price: number;
  displayPrice: string;
  strikethrough: string | null;
  period: string;
  description: string;
  features: string[];
  lockedFeatures: string[];
  icon: any;
  highlight: boolean;
  popular?: boolean;
  color: string;
}
