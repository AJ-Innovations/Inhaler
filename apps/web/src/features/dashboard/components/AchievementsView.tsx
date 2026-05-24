"use client";

import { exercises as defaultExercises } from "@features/breathing/data";
import { Badge } from "@features/breathing/hooks/useCustomExercises";
import { motion } from "framer-motion";
import React from "react";
import { AddGoalModal } from "./AddGoalModal";
import { CategorySection } from "./CategorySection";
import { DashboardHeader } from "./DashboardHeader";
import { DASHBOARD_CATEGORIES } from "../data/categories";
import { useAddGoal } from "../hooks/useAddGoal";
import { AchievementsViewProps } from "../types";

export function AchievementsView({
  stats,
  customExercises,
  onAddGoal,
  onDeleteGoal,
  onStart,
}: AchievementsViewProps) {
  const allExercises = [...defaultExercises, ...customExercises];

  const {
    isAddingGoal,
    newGoalName,
    setNewGoalName,
    newGoalTarget,
    setNewGoalTarget,
    selectedExerciseId,
    setSelectedExerciseId,
    frequency,
    setFrequency,
    selectedIconId,
    setSelectedIconId,
    handleAddGoal,
    openModal,
    closeModal,
  } = useAddGoal({ onAddGoal });

  const handleBadgeClick = (badge: Badge) => {
    const isCustomGoal =
      badge.category === "custom" ||
      badge.type === "manual" ||
      !!badge.frequency;
    if (!isCustomGoal) return;

    const exercise = allExercises.find((e) => e.id === badge.exerciseId);
    if (exercise) onStart(exercise);
    else {
      const boxEx = allExercises.find((e) => e.id === "box");
      if (boxEx) onStart(boxEx);
    }
  };

  return (
    <>
      {isAddingGoal && (
        <AddGoalModal
          onClose={closeModal}
          onAddGoal={handleAddGoal}
          newGoalName={newGoalName}
          setNewGoalName={setNewGoalName}
          newGoalTarget={newGoalTarget}
          setNewGoalTarget={setNewGoalTarget}
          selectedExerciseId={selectedExerciseId}
          setSelectedExerciseId={setSelectedExerciseId}
          frequency={frequency}
          setFrequency={setFrequency}
          selectedIconId={selectedIconId}
          setSelectedIconId={setSelectedIconId}
          allExercises={allExercises}
        />
      )}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="w-full space-y-12 pb-10"
      >
        <DashboardHeader />

        <div className="space-y-14">
          {DASHBOARD_CATEGORIES.map((cat) => {
            const catBadges = stats.badges.filter((b) => {
              if (cat.id === "daily") {
                return (
                  b.category === "daily" ||
                  (b.category === "custom" && b.frequency === "daily")
                );
              }
              if (cat.id === "custom") {
                return b.category === "custom";
              }
              return b.category === cat.id;
            });

            return (
              <CategorySection
                key={cat.id}
                id={cat.id}
                label={cat.label}
                icon={cat.icon}
                color={cat.color}
                badges={catBadges}
                onAddGoalClick={cat.id === "custom" ? openModal : undefined}
                onBadgeClick={handleBadgeClick}
                onDeleteGoal={onDeleteGoal}
              />
            );
          })}
        </div>
      </motion.div>
    </>
  );
}
