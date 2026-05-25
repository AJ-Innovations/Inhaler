"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  downloadAndCacheMedia,
  getDecryptedBlobUrl,
} from "@libs/secureMediaCache";

export type SoundscapeType =
  | "leaf"
  | "zen-river"
  | "zen-fountain"
  | "winter-rain"
  | "light-rain"
  | "nature-birds"
  | "hz-transformation"
  | "white-noise"
  | "pink-noise"
  | "brown-noise"
  | "beach"
  | "lake"
  | "marine"
  | "desert"
  | "ethereal"
  | "forest";

interface Soundscape {
  id: SoundscapeType;
  name: string;
  url?: string;
}

export const soundscapes: Soundscape[] = [
  {
    id: "leaf",
    name: "Leaf",
    url: "/music/mdjahidhossain-birds-nature-relax-sounds-110839.mp3",
  },
  {
    id: "zen-river",
    name: "Zen River",
    url: "/music/alex_jauk-calm-zen-river-flowing-228223.mp3",
  },
  {
    id: "zen-fountain",
    name: "Zen Fountain",
    url: "/music/alex_jauk-zen-fountain-ambience-210613.mp3",
  },
  {
    id: "winter-rain",
    name: "Winter Rain",
    url: "/music/fxprosound-winter-rain-in-oak-forest-loop-185672.mp3",
  },
  {
    id: "light-rain",
    name: "Light Rain",
    url: "/music/liecio-light-rain-109591.mp3",
  },
  {
    id: "nature-birds",
    name: "Nature Birds",
    url: "/music/mdjahidhossain-birds-nature-relax-sounds-110839.mp3",
  },
  {
    id: "hz-transformation",
    name: "528Hz Transform",
    url: "/music/soul_frequencies-528-hz-transformation-music-500282.mp3",
  },
  { id: "white-noise", name: "White Noise" },
  { id: "pink-noise", name: "Pink Noise" },
  { id: "brown-noise", name: "Deep Brownian" },
  {
    id: "beach",
    name: "Sunset Beach",
    url: "/music/alex_jauk-calm-zen-river-flowing-228223.mp3",
  },
  {
    id: "lake",
    name: "Calm Lake",
    url: "/music/alex_jauk-calm-zen-river-flowing-228223.mp3",
  },
  {
    id: "marine",
    name: "Marine Depths",
    url: "/music/alex_jauk-zen-fountain-ambience-210613.mp3",
  },
  {
    id: "desert",
    name: "Desert Breeze",
    url: "/music/soul_frequencies-528-hz-transformation-music-500282.mp3",
  },
  {
    id: "ethereal",
    name: "Ethereal Loop",
    url: "/music/soul_frequencies-528-hz-transformation-music-500282.mp3",
  },
  {
    id: "forest",
    name: "Oak Forest",
    url: "/music/fxprosound-winter-rain-in-oak-forest-loop-185672.mp3",
  },
];

export function useSoundscape(isPlaying: boolean = false) {
  const [activeSoundscape, setActiveSoundscape] =
    useState<SoundscapeType>("leaf");
  const [volume, setVolume] = useState(0.5);
  const [isActuallyPlaying, setIsActuallyPlaying] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const stopNoise = useCallback(() => {
    if (noiseNodeRef.current) {
      try {
        noiseNodeRef.current.stop();
      } catch (e) { }
      noiseNodeRef.current.disconnect();
      noiseNodeRef.current = null;
    }
    setIsActuallyPlaying(false);
  }, []);

  const startNoise = useCallback(
    (type: "white" | "pink" | "brown") => {
      if (typeof window === "undefined") return;
      stopNoise();

      if (!audioCtxRef.current) {
        audioCtxRef.current = new (
          window.AudioContext || (window as any).webkitAudioContext
        )();
      }

      const ctx = audioCtxRef.current;
      const bufferSize = 2 * ctx.sampleRate;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);

      if (type === "white") {
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }
      } else if (type === "pink") {
        let b0, b1, b2, b3, b4, b5, b6;
        b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.969 * b2 + white * 0.153852;
          b3 = 0.8665 * b3 + white * 0.3104856;
          b4 = 0.55 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.016898;
          output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
          output[i] *= 0.11; // (approximate)
          b6 = white * 0.115926;
        }
      } else {
        // brown
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          output[i] = (lastOut + 0.02 * white) / 1.02;
          lastOut = output[i];
          output[i] *= 3.5; // (approximate)
        }
      }

      noiseNodeRef.current = ctx.createBufferSource();
      noiseNodeRef.current.buffer = buffer;
      noiseNodeRef.current.loop = true;

      gainNodeRef.current = ctx.createGain();
      gainNodeRef.current.gain.value = volume;

      noiseNodeRef.current.connect(gainNodeRef.current);
      gainNodeRef.current.connect(ctx.destination);
      noiseNodeRef.current.start();
      setIsActuallyPlaying(true);
    },
    [volume, stopNoise],
  );

  const playPromiseRef = useRef<Promise<void> | null>(null);

  const safePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !audio.src || audio.src === window.location.href) return;

    const promise = audio.play();
    playPromiseRef.current = promise;
    promise.catch((err) => {
      if (err.name !== "AbortError" && err.name !== "NotSupportedError") {
        console.warn("Audio play failed:", err);
        if (err.name === "NotAllowedError") {
          const resumeAudio = () => {
            audio.play().catch((e) => console.warn(e));
            document.removeEventListener("click", resumeAudio);
            document.removeEventListener("touchstart", resumeAudio);
          };
          document.addEventListener("click", resumeAudio);
          document.addEventListener("touchstart", resumeAudio);
        }
      }
    });
  }, []);

  const safePause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      audio.pause();
    } catch (e) { }
    playPromiseRef.current = null;
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.loop = true;
      audioRef.current.addEventListener("play", () => setIsActuallyPlaying(true));
      audioRef.current.addEventListener("playing", () => setIsActuallyPlaying(true));
      audioRef.current.addEventListener("pause", () => setIsActuallyPlaying(false));
      audioRef.current.addEventListener("ended", () => setIsActuallyPlaying(false));
    }

    const audio = audioRef.current;
    const isNoise = activeSoundscape.includes("noise");

    if (!isPlaying) {
      safePause();
      stopNoise();
      return;
    }

    if (isNoise) {
      safePause();
      const type = activeSoundscape.split("-")[0] as "white" | "pink" | "brown";
      startNoise(type);
    } else {
      stopNoise();
      const sound = soundscapes.find((s) => s.id === activeSoundscape);
      if (sound && sound.url) {
        const absoluteUrl = new URL(sound.url, window.location.href).href;

        (async () => {
          try {
            let blobUrl = await getDecryptedBlobUrl(absoluteUrl, "audio");
            if (!blobUrl) {
              await downloadAndCacheMedia(absoluteUrl, "audio");
              blobUrl = await getDecryptedBlobUrl(absoluteUrl, "audio");
            }
            if (blobUrl) {
              // Only update source if it's different to prevent stuttering
              if (audio.src !== blobUrl) {
                safePause();
                audio.src = blobUrl;
              }
              audio.volume = volume;
              if (audio.paused) {
                safePlay();
              }
            }
          } catch (err) {
            console.error("Failed to load encrypted soundscape:", err);
            // Graceful fallback to streaming if cache fails
            if (audio.src !== absoluteUrl) {
              safePause();
              audio.src = absoluteUrl;
              audio.volume = volume;
              safePlay();
            }
          }
        })();
      }
    }

    return () => {
      safePause();
      stopNoise();
    };
  }, [
    activeSoundscape,
    isPlaying,
    startNoise,
    stopNoise,
    safePlay,
    safePause,
    volume,
  ]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
    if (gainNodeRef.current)
      gainNodeRef.current.gain.setTargetAtTime(
        volume,
        audioCtxRef.current?.currentTime || 0,
        0.1,
      );
  }, [volume]);

  const selectSoundscape = useCallback((id: SoundscapeType) => {
    setActiveSoundscape(id);
  }, []);

  const pauseSoundscape = useCallback(() => {
    safePause();
    stopNoise();
  }, [safePause, stopNoise]);

  const toggleSoundscape = (id: SoundscapeType) => {
    selectSoundscape(activeSoundscape === id ? "leaf" : id);
  };

  return {
    activeSoundscape,
    setActiveSoundscape: selectSoundscape,
    pauseSoundscape,
    toggleSoundscape,
    play: safePlay,
    volume,
    setVolume,
    soundscapes,
    isActuallyPlaying,
  };
}
