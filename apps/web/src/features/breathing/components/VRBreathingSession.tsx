"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  Fullscreen,
  Maximize2,
  Pause,
  Play,
  RotateCcw,
  Smartphone,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";

import { Exercise } from "../data";
import { VRBreathingCanvas } from "./VRBreathingCanvas";

interface VRBreathingSessionProps {
  exercise: Exercise;
  phase: string;
  timer: number;
  duration: number;
  isActive: boolean;
  cycles: number;
  totalTime: number;
  onTogglePlay: () => void;
  onReset: () => void;
  onClose: () => void;
  activeSoundscape: string;
}

export function VRBreathingSession({
  exercise,
  phase,
  timer,
  duration,
  isActive,
  cycles,
  totalTime,
  onTogglePlay,
  onReset,
  onClose,
  activeSoundscape,
}: VRBreathingSessionProps) {
  const [isStereoscopic, setIsStereoscopic] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);
  const [gyroGranted, setGyroGranted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Auto-enter fullscreen and attempt landscape lock when entering VR
  const initiateLandscapeVR = async (enableStereo: boolean) => {
    setIsStereoscopic(enableStereo);
    setShowPrompt(false);

    try {
      const docEl = document.documentElement;
      // 1. Enter Fullscreen
      if (docEl.requestFullscreen) {
        await docEl.requestFullscreen();
      } else if ((docEl as any).webkitRequestFullscreen) {
        await (docEl as any).webkitRequestFullscreen();
      }
      setIsFullscreen(true);

      // 2. Lock Orientation to Landscape (on supporting browsers like Chrome Android)
      if (screen.orientation && (screen.orientation as any).lock) {
        await (screen.orientation as any)
          .lock("landscape")
          .catch((err: any) => {
            console.warn(
              "Screen orientation locking is restricted on this browser:",
              err,
            );
          });
      }
    } catch (e) {
      console.warn("Fullscreen toggle failed:", e);
    }

    // 3. iOS / Mobile Gyro Permission handling
    if (enableStereo) {
      const granted = await requestGyroPermission();
      setGyroGranted(granted);
    }
  };

  const requestGyroPermission = async (): Promise<boolean> => {
    if (
      typeof window !== "undefined" &&
      typeof (DeviceOrientationEvent as any) !== "undefined" &&
      typeof (DeviceOrientationEvent as any).requestPermission === "function"
    ) {
      try {
        const permissionState = await (
          DeviceOrientationEvent as any
        ).requestPermission();
        return permissionState === "granted";
      } catch (error) {
        console.error("Error requesting gyroscope access:", error);
        return false;
      }
    }
    return true; // Default granted for Android / Desktop
  };

  // Listen for fullscreen change events to sync internal states
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isCurrentlyFullscreen);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange,
      );
    };
  }, []);

  const handleExitVR = async () => {
    try {
      if (document.fullscreenElement) {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        }
      }
      if (screen.orientation && (screen.orientation as any).unlock) {
        screen.orientation.unlock();
      }
    } catch (e) {
      console.warn("Error exiting fullscreen:", e);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex h-[100dvh] w-screen flex-col overflow-hidden bg-black text-white select-none">
      {/* 3D WebGL WebVR Renderer Canvas */}
      <div className="absolute inset-0 z-0 h-full w-full">
        <VRBreathingCanvas
          phase={phase}
          timer={timer}
          duration={duration}
          isActive={isActive}
          activeSoundscape={activeSoundscape}
          isStereoscopic={isStereoscopic}
        />
      </div>

      {/* VR Selector & Permission Start Modal */}
      <AnimatePresence>
        {showPrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[250] flex items-center justify-center bg-black/85 px-4 backdrop-blur-lg"
          >
            <motion.div
              initial={{ scale: 0.9, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 15 }}
              className="w-full max-w-[500px] rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center shadow-2xl backdrop-blur-xl"
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-white shadow-inner">
                <Smartphone className="h-7 w-7 animate-pulse" />
              </div>
              <h3 className="text-2xl font-light tracking-wide">
                Enter VR Universe
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/60">
                Immerse yourself completely in a tranquil visual universe. To
                start, select your display mode. Landscape orientation is highly
                recommended.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => initiateLandscapeVR(false)}
                  className="flex-1 rounded-2xl border border-white/10 bg-white/[0.06] py-4 text-sm font-semibold tracking-wider text-white shadow-lg backdrop-blur-md transition-all hover:bg-white/[0.12] active:scale-95"
                >
                  <Eye className="mx-auto mb-1.5 h-5 w-5 text-cyan-300" />
                  360° Desktop View
                </button>
                <button
                  onClick={() => initiateLandscapeVR(true)}
                  className="flex-1 rounded-2xl border border-white/20 bg-white/[0.14] py-4 text-sm font-semibold tracking-wider text-white shadow-lg backdrop-blur-md transition-all hover:border-white/40 hover:bg-white/[0.22] active:scale-95"
                >
                  <Smartphone className="mx-auto mb-1.5 h-5 w-5 text-indigo-400" />
                  Cardboard VR (Split)
                </button>
              </div>

              <button
                onClick={onClose}
                className="mt-6 text-xs tracking-widest text-white/40 uppercase hover:text-white"
              >
                Back to Session
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Desktop-Style HUD - Fully Floating Glassmorphic Panels */}
      {!showPrompt && (
        <div className="pointer-events-none absolute inset-0 z-10 flex h-full w-full flex-col justify-between p-6 sm:p-10">
          {/* Top Info Bar */}
          <div className="flex w-full items-start justify-between">
            {/* Left Box: Exercise metadata */}
            <div className="pointer-events-auto rounded-2xl border border-white/10 bg-black/30 px-5 py-3.5 backdrop-blur-md">
              <h2 className="text-base font-light tracking-wide text-white/95">
                {exercise.name}
              </h2>
              <div className="mt-1 flex items-center gap-4 text-[10px] font-bold tracking-widest text-cyan-400 uppercase">
                <span>Phase: {phase}</span>
                <span className="text-white/30">•</span>
                <span>Cycles: {cycles}</span>
              </div>
            </div>

            {/* Right Box: Exit Button */}
            <button
              onClick={handleExitVR}
              className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/30 text-white/80 shadow-lg backdrop-blur-md transition-all hover:bg-white/[0.08] hover:text-white active:scale-95"
            >
              <X size={18} />
            </button>
          </div>

          {/* Center Space: Stereoscopic helper lines (renders only when Cardboard mode is active to help align viewer) */}
          {isStereoscopic && (
            <div className="pointer-events-none absolute inset-y-0 left-1/2 w-[1px] bg-white/5" />
          )}

          {/* Bottom HUD - Floating Desktop UI Console */}
          <div className="flex w-full flex-col items-center gap-6 md:flex-row md:items-end md:justify-between">
            {/* Left HUD Panel: Large Glowing Breathing Guide */}
            <div className="pointer-events-auto flex min-w-[180px] flex-col items-center rounded-2xl border border-white/10 bg-black/30 p-5 text-center backdrop-blur-md select-none md:items-start md:text-left">
              <span className="text-[9px] font-extrabold tracking-widest text-white/40 uppercase">
                Interactive Rhythm
              </span>
              <AnimatePresence mode="wait">
                <motion.h1
                  key={phase}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="mt-1.5 text-3xl font-extralight tracking-wide text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.35)]"
                >
                  {phase}
                </motion.h1>
              </AnimatePresence>

              <div className="mt-3 flex items-baseline gap-1 text-white/90">
                <span className="text-4xl font-extralight">{timer}</span>
                <span className="text-xs text-white/40">/ {duration}s</span>
              </div>
            </div>

            {/* Right HUD Panel: Compact Session Statistics */}
            <div className="pointer-events-auto flex items-center gap-3.5 rounded-2xl border border-white/10 bg-black/30 p-3 backdrop-blur-md">
              {/* Reset Button */}
              <button
                onClick={onReset}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/5 bg-white/[0.03] text-white/70 transition-all hover:bg-white/[0.08] hover:text-white active:scale-95"
                title="Reset Session"
              >
                <RotateCcw size={16} />
              </button>

              {/* Play / Pause */}
              <button
                onClick={onTogglePlay}
                className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/[0.08] text-white transition-all hover:scale-105 hover:bg-white/[0.14] active:scale-95"
              >
                {isActive ? (
                  <Pause size={20} fill="white" />
                ) : (
                  <Play size={20} className="ml-0.5" fill="white" />
                )}
              </button>

              {/* Toggle Split-Screen VR mode */}
              <button
                onClick={() => setIsStereoscopic(!isStereoscopic)}
                className={`flex h-11 w-11 items-center justify-center rounded-full border transition-all active:scale-95 ${
                  isStereoscopic
                    ? "border-cyan-500/50 bg-cyan-950/20 text-cyan-400"
                    : "border-white/5 bg-white/[0.03] text-white/70 hover:bg-white/[0.08] hover:text-white"
                }`}
                title={
                  isStereoscopic ? "Exit Cardboard VR" : "Enter Cardboard VR"
                }
              >
                {isStereoscopic ? (
                  <EyeOff size={16} />
                ) : (
                  <Maximize2 size={16} />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
