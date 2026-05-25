import { Exercise } from "@features/breathing/data";
import { Badge } from "@features/breathing/hooks/useCustomExercises";

export interface Session {
  exerciseId: string;
  date: string;
  duration: number;
  cycles?: number;
}

export interface JournalViewProps {
  sessions: Session[];
  stats: {
    totalMinutes: number;
    sessionCount: number;
    streak: number;
    badges: Badge[];
  };
}

export interface HeatmapDay {
  date: string;
  level: number;
  duration: number;
}

export interface BreakdownItem {
  exercise: Exercise;
  minutes: number;
  duration: number;
}
