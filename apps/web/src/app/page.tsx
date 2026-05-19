import { BreathingExercise } from "@/features/breathing";

export default function Home() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <BreathingExercise />
    </div>
  );
}
