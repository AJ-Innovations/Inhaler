import { Calendar, Clock, Trophy } from "lucide-react";
import { TargetArrow } from "./goalIcons";

export const DASHBOARD_CATEGORIES = [
  { id: "daily", label: "Today's Focus", icon: Clock, color: "text-white" },
  { id: "weekly", label: "Consistency", icon: Calendar, color: "text-white" },
  {
    id: "milestone",
    label: "Lifetime Achievements",
    icon: Trophy,
    color: "text-white",
  },
  {
    id: "custom",
    label: "Personal Goals",
    icon: TargetArrow,
    color: "text-white",
  },
] as const;
