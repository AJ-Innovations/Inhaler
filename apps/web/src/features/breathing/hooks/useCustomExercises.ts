"use client";

import { supabase } from "@libs/supabaseClient";
import { SecureStorage } from "@libs/secureStorage";
import { useEffect, useMemo, useState } from "react";

import { Exercise } from "../data";

const STORAGE_KEY = "spirox_custom_exercises";

export interface Badge {
  id: string;
  name: string;
  description: string;
  category: "daily" | "weekly" | "milestone" | "custom";
  type: "streak" | "duration" | "sessions" | "technique" | "time" | "manual";
  requirement: number;
  unlocked: boolean;
  progress?: number;
  frequency?: "once" | "daily"; // Added to track daily personal goals
  exerciseId?: string; // Added for navigation
  iconId?: string; // Added for custom goal icons
}

export interface CustomGoal {
  id: string;
  name: string;
  exerciseId: string;
  targetMinutes: number;
  currentMinutes: number;
  frequency: "once" | "daily";
  iconId?: string; // Support for custom icons
}

export function useLibrary() {
  const [customExercises, setCustomExercises] = useState<Exercise[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [sessions, setSessions] = useState<
    { exerciseId: string; date: string; duration: number }[]
  >([]);
  const [customGoals, setCustomGoals] = useState<CustomGoal[]>([]);
  const [userName, setUserName] = useState("Zen Practitioner");
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [userCountry, setUserCountry] = useState("US");
  const [user, setUser] = useState<any>(null);

  // Sync user profile from Supabase
  useEffect(() => {
    // 1. Fetch current active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
    });

    // 2. Listen to auth changes in real-time
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        // Fallback to encrypted local storage if logged out
        SecureStorage.getItem("spirox_user_name").then((savedName) => {
          setUserName(savedName || "Zen Practitioner");
        });
        SecureStorage.getItem("spirox_user_avatar").then((savedAvatar) => {
          setUserAvatar(savedAvatar);
        });
        SecureStorage.getItem("spirox_user_country").then((savedCountry) => {
          setUserCountry(savedCountry || "US");
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("username, avatar_url")
        .eq("id", userId)
        .single();

      if (error) {
        if (
          error.message?.includes("country_code") ||
          error.code === "PGRST204" ||
          error.code === "PGRST100"
        ) {
          const { data: fbData } = await supabase
            .from("profiles")
            .select("username, avatar_url")
            .eq("id", userId)
            .single();
          if (fbData) {
            if (fbData.username) setUserName(fbData.username);
            if (fbData.avatar_url) setUserAvatar(fbData.avatar_url);
          }
          return;
        }
        throw error;
      }
      if (data) {
        if (data.username) setUserName(data.username);
        if (data.avatar_url) setUserAvatar(data.avatar_url);
      }
    } catch (err) {
      console.error("Error fetching user profile from database:", err);
    }
  };

  // Load persisted data from encrypted storage
  useEffect(() => {
    const loadEncryptedData = async () => {
      const savedCustom = await SecureStorage.getItem(STORAGE_KEY);
      if (savedCustom) {
        try {
          setCustomExercises(JSON.parse(savedCustom));
        } catch {
          /* ignore */
        }
      }

      const savedFavs = await SecureStorage.getItem("spirox_favorites");
      if (savedFavs) {
        try {
          setFavorites(JSON.parse(savedFavs));
        } catch {
          /* ignore */
        }
      }

      const savedSessions = await SecureStorage.getItem("spirox_sessions");
      if (savedSessions) {
        try {
          setSessions(JSON.parse(savedSessions));
        } catch {
          /* ignore */
        }
      }

      const savedGoals = await SecureStorage.getItem("spirox_custom_goals");
      if (savedGoals) {
        try {
          setCustomGoals(JSON.parse(savedGoals));
        } catch {
          /* ignore */
        }
      }

      const savedName = await SecureStorage.getItem("spirox_user_name");
      if (savedName) {
        if (savedName === "Mindful Breather") {
          setUserName("Spirox User");
          SecureStorage.setItem("spirox_user_name", "Spirox User");
        } else {
          setUserName(savedName);
        }
      }

      const savedAvatar = await SecureStorage.getItem("spirox_user_avatar");
      if (savedAvatar) setUserAvatar(savedAvatar);

      const savedCountry =
        (await SecureStorage.getItem("spirox_user_country")) || "US";
      if (savedCountry) setUserCountry(savedCountry);
    };

    loadEncryptedData();
  }, []);

  const addExercise = (exercise: Exercise) => {
    const updated = [...customExercises, exercise];
    setCustomExercises(updated);
    SecureStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const deleteExercise = (id: string) => {
    const updated = customExercises.filter((ex) => ex.id !== id);
    setCustomExercises(updated);
    SecureStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const toggleFavorite = (id: string) => {
    const updated = favorites.includes(id)
      ? favorites.filter((favId) => favId !== id)
      : [...favorites, id];
    setFavorites(updated);
    SecureStorage.setItem("spirox_favorites", JSON.stringify(updated));
  };

  const recordSession = (exerciseId: string, duration: number) => {
    const newSession = { exerciseId, date: new Date().toISOString(), duration };
    const updated = [...sessions, newSession];
    setSessions(updated);
    SecureStorage.setItem("spirox_sessions", JSON.stringify(updated));
  };

  const addCustomGoal = (goal: Omit<CustomGoal, "currentMinutes">) => {
    const newGoal = { ...goal, currentMinutes: 0 };
    const updated = [...customGoals, newGoal];
    setCustomGoals(updated);
    SecureStorage.setItem("spirox_custom_goals", JSON.stringify(updated));
  };

  const deleteCustomGoal = (id: string) => {
    const updated = customGoals.filter((g) => g.id !== id);
    setCustomGoals(updated);
    SecureStorage.setItem("spirox_custom_goals", JSON.stringify(updated));
  };

  const updateUserName = async (name: string) => {
    setUserName(name);
    SecureStorage.setItem("spirox_user_name", name);

    if (user) {
      try {
        // 1. Update the public profiles table
        const { error: profileError } = await supabase
          .from("profiles")
          .update({ username: name })
          .eq("id", user.id);
        if (profileError) throw profileError;

        // 2. Update the Auth users metadata (full_name)
        const { error: authError } = await supabase.auth.updateUser({
          data: { full_name: name },
        });
        if (authError) throw authError;
      } catch (err) {
        console.error("Error updating username in database/auth:", err);
      }
    }
  };

  const updateAvatar = async (avatar: string | null) => {
    setUserAvatar(avatar);
    if (avatar) SecureStorage.setItem("spirox_user_avatar", avatar);
    else SecureStorage.removeItem("spirox_user_avatar");

    if (user) {
      try {
        const { error } = await supabase
          .from("profiles")
          .update({ avatar_url: avatar })
          .eq("id", user.id);
        if (error) throw error;
      } catch (err) {
        console.error("Error updating avatar in database:", err);
      }
    }
  };

  const updateUserCountry = async (code: string) => {
    const cc = code.toUpperCase();
    setUserCountry(cc);
    SecureStorage.setItem("spirox_user_country", cc);

    if (user) {
      try {
        const { error } = await supabase
          .from("profiles")
          .update({ country_code: cc })
          .eq("id", user.id);
        if (error) {
          console.warn(
            "Could not update country_code in profiles table (it may not exist). Error:",
            error.message,
          );
        }
      } catch (err) {
        console.error("Error updating country in database:", err);
      }
    }
  };

  const clearAllData = () => {
    localStorage.clear();
    window.location.reload();
  };

  const stats = useMemo(() => {
    const totalMinutes = sessions.reduce((acc, s) => acc + s.duration, 0) / 60;
    const sessionCount = sessions.length;

    // Dates & Streaks
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const dates = sessions.map((s) => s.date.split("T")[0]);
    const uniqueDates = Array.from(new Set(dates)).sort().reverse();

    let streak = 0;
    if (uniqueDates.length > 0) {
      const yesterdayDate = new Date(now.getTime() - 86400000);
      const yesterday = yesterdayDate.toISOString().split("T")[0];
      if (uniqueDates[0] === todayStr || uniqueDates[0] === yesterday) {
        streak = 1;
        for (let i = 0; i < uniqueDates.length - 1; i++) {
          const d1 = new Date(uniqueDates[i]);
          const d2 = new Date(uniqueDates[i + 1]);
          const diff = (d1.getTime() - d2.getTime()) / (1000 * 3600 * 24);
          if (diff === 1) streak++;
          else break;
        }
      }
    }

    // Daily Stats
    const todaySessions = sessions.filter((s) => s.date.startsWith(todayStr));
    const todayMinutes =
      todaySessions.reduce((acc, s) => acc + s.duration, 0) / 60;

    // Weekly Stats
    const weekSessions = sessions.filter((s) => new Date(s.date) >= weekAgo);
    const weekMinutes =
      weekSessions.reduce((acc, s) => acc + s.duration, 0) / 60;

    // Badge calculation
    const badges: Badge[] = [
      {
        id: "daily_first",
        name: "First Light",
        description: "Complete your first session today.",
        category: "daily",
        type: "sessions",
        requirement: 1,
        unlocked: todaySessions.length >= 1,
        progress: todaySessions.length >= 1 ? 100 : 0,
        iconId: "sun",
      },
      {
        id: "daily_deep",
        name: "Deep Diver",
        description: "Complete 20 minutes of practice today.",
        category: "daily",
        type: "duration",
        requirement: 20,
        unlocked: todayMinutes >= 20,
        progress: Math.min(100, (todayMinutes / 20) * 100),
        iconId: "activity",
      },
      {
        id: "weekly_consistent",
        name: "Weekly Warrior",
        description: "Practice for 3 days this week.",
        category: "weekly",
        type: "streak",
        requirement: 3,
        unlocked:
          new Set(weekSessions.map((s) => s.date.split("T")[0])).size >= 3,
        progress: Math.min(
          100,
          (new Set(weekSessions.map((s) => s.date.split("T")[0])).size / 3) *
            100,
        ),
        iconId: "calendar",
      },
      {
        id: "milestone_100",
        name: "Centurion",
        description: "Reach 100 total minutes of practice.",
        category: "milestone",
        type: "duration",
        requirement: 100,
        unlocked: totalMinutes >= 100,
        progress: Math.min(100, (totalMinutes / 100) * 100),
        iconId: "trophy",
      },
      {
        id: "milestone_1000",
        name: "Zen Master",
        description: "Reach 1000 total minutes of practice.",
        category: "milestone",
        type: "duration",
        requirement: 1000,
        unlocked: totalMinutes >= 1000,
        progress: Math.min(100, (totalMinutes / 1000) * 100),
        iconId: "shield",
      },
      {
        id: "milestone_explorer",
        name: "Explorer",
        description: "Try 3 different techniques.",
        category: "milestone",
        type: "technique",
        requirement: 3,
        unlocked: new Set(sessions.map((s) => s.exerciseId)).size >= 3,
      },
    ];

    // Map custom goals to badges with frequency-specific tracking
    const customGoalBadges: Badge[] = customGoals.map((goal) => {
      let exerciseMinutes = 0;

      if (goal.frequency === "daily") {
        // Track minutes for TODAY only
        exerciseMinutes =
          sessions
            .filter(
              (s) =>
                s.date.startsWith(todayStr) &&
                (s.exerciseId === goal.exerciseId || goal.exerciseId === "all"),
            )
            .reduce((acc, s) => acc + s.duration, 0) / 60;
      } else {
        // Track LIFETIME minutes
        exerciseMinutes =
          sessions
            .filter(
              (s) =>
                s.exerciseId === goal.exerciseId || goal.exerciseId === "all",
            )
            .reduce((acc, s) => acc + s.duration, 0) / 60;
      }

      return {
        id: goal.id,
        name: goal.name,
        description:
          goal.frequency === "daily"
            ? `Daily Target: ${goal.targetMinutes}m of ${goal.exerciseId === "all" ? "any practice" : goal.exerciseId}.`
            : `Milestone: Reach ${goal.targetMinutes}m total of ${goal.exerciseId === "all" ? "any practice" : goal.exerciseId}.`,
        category: "custom",
        type: "manual",
        frequency: goal.frequency, // Pass frequency to badge
        exerciseId: goal.exerciseId, // Ensure exerciseId is passed for navigation
        iconId: goal.iconId, // Pass custom icon ID to badge
        requirement: goal.targetMinutes,
        unlocked: exerciseMinutes >= goal.targetMinutes,
        progress: Math.min(100, (exerciseMinutes / goal.targetMinutes) * 100),
      };
    });

    return {
      totalMinutes,
      sessionCount,
      streak,
      badges: [...badges, ...customGoalBadges],
      todayMinutes,
      weekMinutes,
    };
  }, [sessions, customGoals]);

  return {
    customExercises,
    favorites,
    sessions,
    customGoals,
    stats,
    addExercise,
    deleteExercise,
    toggleFavorite,
    recordSession,
    addCustomGoal,
    deleteCustomGoal,
    userName,
    userAvatar,
    userCountry,
    updateUserName,
    updateAvatar,
    updateUserCountry,
    clearAllData,
  };
}
