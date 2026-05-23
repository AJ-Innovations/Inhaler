export interface ProfileViewProps {
  stats: {
    totalMinutes: number;
    sessionCount: number;
    streak: number;
  };
  userName: string;
  userAvatar: string | null;
  onUpdateName: (name: string) => void;
  onUpdateAvatar: (avatar: string | null) => void;
  onResetData: () => void;
  onUpgrade: () => void;
  onLogin: () => void;
  isInstallable?: boolean;
  isIOS?: boolean;
  onInstallPWA?: () => void;
  dailyReminderEnabled?: boolean;
  dailyReminderTime?: string;
  onToggleReminder?: (enabled: boolean) => void;
  onUpdateTime?: (time: string) => void;
}
