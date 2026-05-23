import { useState, useRef, useEffect } from "react";
import { useAuthStore } from "../../auth/store/useAuthStore";
import { SettingsType } from "../components/ProfileSettingsContent";

export function useProfileState(
  userName: string,
  onUpdateName: (name: string) => void,
  onUpdateAvatar: (avatar: string | null) => void,
) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [isSelectingAvatar, setIsSelectingAvatar] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [activeSettings, setActiveSettings] = useState<SettingsType>("none");
  const [dailyGoal, setDailyGoal] = useState(15);
  const [showIOSPrompt, setShowIOSPrompt] = useState(false);
  const [showDesktopInstallPrompt, setShowDesktopInstallPrompt] =
    useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { isAuthenticated, user, logout } = useAuthStore();

  const currentDisplayName = isAuthenticated
    ? user?.name || user?.email || "Active Account"
    : userName;

  const [tempName, setTempName] = useState(currentDisplayName);

  useEffect(() => {
    if (!isEditingName) {
      setTempName(currentDisplayName);
    }
  }, [currentDisplayName, isEditingName]);

  const handleSaveName = () => {
    if (tempName.trim()) {
      onUpdateName(tempName);
      setIsEditingName(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("Image is too large. Please select an image under 1MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const size = Math.min(img.width, img.height, 800);
        canvas.width = size;
        canvas.height = size;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const sourceSize = Math.min(img.width, img.height);
        const sourceX = (img.width - sourceSize) / 2;
        const sourceY = (img.height - sourceSize) / 2;

        ctx.drawImage(
          img,
          sourceX,
          sourceY,
          sourceSize,
          sourceSize,
          0,
          0,
          size,
          size,
        );

        let quality = 0.85;
        let base64 = canvas.toDataURL("image/jpeg", quality);

        while (base64.length * 0.75 > 500000 && quality > 0.1) {
          quality -= 0.1;
          base64 = canvas.toDataURL("image/jpeg", quality);
        }

        onUpdateAvatar(base64);
        setIsSelectingAvatar(false);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleInstallClick = (isIOS: boolean) => {
    if (isIOS) {
      setShowIOSPrompt(true);
    } else {
      setShowDesktopInstallPrompt(true);
    }
  };

  return {
    isEditingName,
    setIsEditingName,
    isSelectingAvatar,
    setIsSelectingAvatar,
    showResetConfirm,
    setShowResetConfirm,
    activeSettings,
    setActiveSettings,
    dailyGoal,
    setDailyGoal,
    showIOSPrompt,
    setShowIOSPrompt,
    showDesktopInstallPrompt,
    setShowDesktopInstallPrompt,
    fileInputRef,
    isAuthenticated,
    user,
    logout,
    tempName,
    setTempName,
    handleSaveName,
    handleFileUpload,
    handleInstallClick,
  };
}
