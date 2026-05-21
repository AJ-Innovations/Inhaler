import { create } from "zustand";
import { createJSONStorage, persist, StateStorage } from "zustand/middleware";
import { SecureStorage } from "@libs/secureStorage";

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string | null;
  isPremium?: boolean;
}

export type PremiumPlan = "free" | "pro" | "premium";

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  premiumPlan: PremiumPlan;
  login: (user: User) => void;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  setPremiumPlan: (plan: PremiumPlan) => void;
}

const encryptedStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return SecureStorage.getItem(name);
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await SecureStorage.setItem(name, value);
  },
  removeItem: (name: string): void => {
    SecureStorage.removeItem(name);
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      premiumPlan: "free",
      login: (user) => set({ isAuthenticated: true, user }),
      logout: () => {
        const keysToRemove = [
          "spirox_custom_exercises",
          "spirox_favorites",
          "spirox_sessions",
          "spirox_custom_goals",
          "spirox_user_name",
          "spirox_user_avatar",
          "spirox_user_country",
          "spirox_offline_token",
          "spirox_last_verified_time",
        ];
        keysToRemove.forEach((k) => SecureStorage.removeItem(k));
        set({ isAuthenticated: false, user: null, premiumPlan: "free" });
      },
      updateProfile: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        })),
      setPremiumPlan: (plan) => set({ premiumPlan: plan }),
    }),
    {
      name: "spirox-auth-storage",
      storage: createJSONStorage(() => encryptedStorage),
    },
  ),
);
