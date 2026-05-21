import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string | null;
  isPremium?: boolean;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
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
        ];
        keysToRemove.forEach((k) => localStorage.removeItem(k));
        set({ isAuthenticated: false, user: null });
      },
      updateProfile: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        })),
    }),
    {
      name: "spirox-auth-storage",
    },
  ),
);
