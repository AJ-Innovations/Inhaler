"use client";

import { motion } from "framer-motion";
import { Library, Plus } from "lucide-react";
import React from "react";

import { ExerciseCard } from "../components/ExerciseCard";
import { Exercise, exercises } from "../data";

interface LibraryViewProps {
  onStart: (ex: Exercise) => void;
  onDetails: (ex: Exercise) => void;
  customExercises: Exercise[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onDeleteCustom: (id: string) => void;
  onCreate: () => void;
}

export function LibraryView({
  onStart,
  onDetails,
  customExercises,
  favorites,
  onToggleFavorite,
  onDeleteCustom,
  onCreate,
}: LibraryViewProps) {
  const favoriteExercises = exercises.filter((ex: Exercise) =>
    favorites.includes(ex.id),
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="w-full"
    >
      <div className="mb-10 flex items-center justify-between">
        <h1 className="text-3xl font-light tracking-tight text-white">
          My Library
        </h1>
        <button
          onClick={onCreate}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-black shadow-lg transition-all hover:scale-105 active:scale-95"
        >
          <Plus size={24} />
        </button>
      </div>

      {customExercises.length === 0 && favoriteExercises.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center opacity-50">
          <Library size={48} strokeWidth={1} className="mb-4 text-gray-500" />
          <p className="text-sm font-light text-gray-400">
            Your library is empty.
            <br />
            Create a journey or bookmark a practice.
          </p>
        </div>
      )}

      {customExercises.length > 0 && (
        <>
          <div className="mb-6">
            <span className="px-1 text-[10px] font-medium tracking-[0.3em] text-gray-600 uppercase">
              Created Collections
            </span>
          </div>
          <div className="mb-10 flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-3">
            {customExercises.map((ex: Exercise) => (
              <ExerciseCard
                key={ex.id}
                exercise={ex}
                onStart={() => onStart(ex)}
                onDetails={() => onDetails(ex)}
                onDelete={() => onDeleteCustom(ex.id)}
                isCustom
              />
            ))}
          </div>
        </>
      )}

      {favoriteExercises.length > 0 && (
        <>
          <div className="mb-6">
            <span className="px-1 text-[10px] font-medium tracking-[0.3em] text-gray-300 uppercase">
              Saved Practices
            </span>
          </div>
          <div className="flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-3">
            {favoriteExercises.map((ex: Exercise) => (
              <ExerciseCard
                key={ex.id}
                exercise={ex}
                onStart={() => onStart(ex)}
                onDetails={() => onDetails(ex)}
                isFavorite
                onToggleFavorite={() => onToggleFavorite(ex.id)}
              />
            ))}
          </div>
        </>
      )}
    </motion.div>
  );
}
