import { Exercise } from "@features/breathing/data";
import {
  Badge,
  CustomGoal,
} from "@features/breathing/hooks/useCustomExercises";

export interface DashboardGoalPayload {
  id: string;
  name: string;
  targetMinutes: number;
  exerciseId: string;
  frequency: "once" | "daily";
  iconId?: string;
}

export interface AchievementsViewProps {
  stats: {
    totalMinutes: number;
    sessionCount: number;
    streak: number;
    badges: Badge[];
    todayMinutes: number;
    weekMinutes: number;
  };
  customGoals: CustomGoal[];
  customExercises: Exercise[];
  onAddGoal: (goal: DashboardGoalPayload) => void;
  onDeleteGoal: (id: string) => void;
  onStart: (ex: Exercise) => void;
}
