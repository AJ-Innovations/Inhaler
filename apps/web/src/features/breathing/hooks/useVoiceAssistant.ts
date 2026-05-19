"use client";

import { useCallback, useEffect, useRef } from "react";

export interface VoiceProfile {
  id: string;
  name: string;
  gender: "female" | "male";
  description: string;
}

export const voiceProfiles: VoiceProfile[] = [
  {
    id: "lauren",
    name: "Lauren",
    gender: "female",
    description: "A smooth, peaceful English voice.",
  },
  {
    id: "victoria",
    name: "Victoria",
    gender: "female",
    description: "A soft, calming English voice.",
  },
  {
    id: "edward",
    name: "Edward",
    gender: "male",
    description: "A warm, deep English voice.",
  },
  {
    id: "viraj",
    name: "Viraj",
    gender: "male",
    description: "A soothing, grounded English voice.",
  },
];

export function useVoiceAssistant(
  phase?: string,
  isActive?: boolean,
  config: {
    profileId: string;
    isEnabled: boolean;
    volume: number;
  } = { profileId: "lauren", isEnabled: true, volume: 1.0 },
) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio element
    if (typeof window !== "undefined" && !audioRef.current) {
      audioRef.current = new Audio();
    }
  }, []);

  const playAudioFile = useCallback(
    (fileName: string, forceProfileId?: string) => {
      if (!config.isEnabled || !audioRef.current) return;

      const profileIdToUse = forceProfileId || config.profileId;

      try {
        // Construct the path to the static audio file in the public directory
        audioRef.current.src = `/voices/${profileIdToUse}/${fileName}.mp3`;
        audioRef.current.volume = config.volume;

        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            // Playback interrupted (e.g. rapid phase changes), ignore safely
            if (
              error.name !== "AbortError" &&
              error.name !== "NotSupportedError"
            ) {
              console.warn("Voice audio playback failed:", error);
            }
          });
        }
      } catch (err) {
        console.error("Failed to play voice audio", err);
      }
    },
    [config.isEnabled, config.profileId, config.volume],
  );

  // Maintain the `speak` function signature for backward compatibility
  const speak = useCallback(
    (text: string, forceProfile?: VoiceProfile) => {
      const textLower = text.toLowerCase();
      let fileName = "";

      if (textLower.includes("inhale")) fileName = "inhale";
      else if (textLower.includes("exhale")) fileName = "exhale";
      else if (textLower.includes("hold")) fileName = "hold";
      else if (textLower.includes("rest") || textLower.includes("recover"))
        fileName = "relax";
      else fileName = "intro";

      playAudioFile(fileName, forceProfile?.id);
    },
    [playAudioFile],
  );

  // Automatically trigger voice on phase changes
  useEffect(() => {
    if (isActive && config.isEnabled && phase) {
      speak(phase);
    }
  }, [phase, isActive, config.isEnabled, speak]);

  const testVoice = useCallback(
    (profileId: string) => {
      // Plays public/voices/{profileId}/intro.mp3
      playAudioFile("intro", profileId);
    },
    [playAudioFile],
  );

  return {
    speak,
    testVoice,
    voiceProfiles,
  };
}
