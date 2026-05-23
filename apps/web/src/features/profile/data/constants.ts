import { Bell, ExternalLink, Info, Shield, Target } from "lucide-react";
import { SettingsType } from "../components/ProfileSettingsContent";

export const SUGGESTED_AVATARS = [
  { id: "zen_stones", path: "/avatars/zen_stones.png", label: "Zen" },
  { id: "lotus", path: "/avatars/lotus.png", label: "Lotus" },
  { id: "aurora", path: "/avatars/aurora.png", label: "Aurora" },
  { id: "meditator", path: "/avatars/meditator.png", label: "Peace" },
  { id: "paper_crane", path: "/avatars/paper_crane.png", label: "Hope" },
];

export const getMenuGroups = (
  dailyReminderEnabled: boolean,
  dailyReminderTime: string,
  dailyGoal: number,
) => [
  {
    title: "Preferences",
    items: [
      {
        id: "notifications" as SettingsType,
        icon: Bell,
        label: "Notifications",
        value: dailyReminderEnabled ? dailyReminderTime : "Off",
      },
      {
        id: "privacy" as SettingsType,
        icon: Shield,
        label: "Privacy & Health",
        value: "Connected",
      },
      {
        id: "goal" as SettingsType,
        icon: Target,
        label: "Daily Goal",
        value: `${dailyGoal} Minutes`,
      },
    ],
  },
  {
    title: "Support",
    items: [
      {
        id: "about" as SettingsType,
        icon: Info,
        label: "About Spirox",
        value: "v1.4.2",
      },
      {
        id: "none" as SettingsType,
        icon: ExternalLink,
        label: "Resource Center",
        isExternal: true,
      },
    ],
  },
];
