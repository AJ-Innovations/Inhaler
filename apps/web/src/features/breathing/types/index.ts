export interface Exercise {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  howTo: string;
  why: string;
  warning?: string;
  benefits: string[];
  icon: string;
  isAdvanced?: boolean;
  gradient: {
    start: string;
    end: string;
  };
  pattern: {
    inhale: number;
    hold1: number;
    exhale: number;
    hold2: number;
  };
}
