import { useState } from "react";

import { DashboardGoalPayload } from "../types";

interface UseAddGoalProps {
  onAddGoal: (goal: DashboardGoalPayload) => void;
}

export function useAddGoal({ onAddGoal }: UseAddGoalProps) {
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [newGoalName, setNewGoalName] = useState("");
  const [newGoalTarget, setNewGoalTarget] = useState("2");
  const [selectedExerciseId, setSelectedExerciseId] = useState("box");
  const [frequency, setFrequency] = useState<"once" | "daily">("daily");
  const [selectedIconId, setSelectedIconId] = useState("wind");

  const handleAddGoal = () => {
    if (!newGoalName) return;
    onAddGoal({
      id: Math.random().toString(36).substring(2, 11),
      name: newGoalName,
      targetMinutes: parseInt(newGoalTarget) || 2,
      exerciseId: selectedExerciseId,
      frequency,
      iconId: selectedIconId,
    });
    setNewGoalName("");
    setIsAddingGoal(false);
  };

  const openModal = () => setIsAddingGoal(true);
  const closeModal = () => setIsAddingGoal(false);

  return {
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
  };
}
