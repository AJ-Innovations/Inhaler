"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  CloudRain,
  Moon,
  Play,
  Sparkles,
  Trees,
  Volume2,
  Waves,
  Wind,
  X,
  Zap,
} from "lucide-react";
import React, { useState } from "react";

import { binauralConfigs, BinauralType } from "../hooks/useBinauralBeats";
import { soundscapes, SoundscapeType } from "../hooks/useSoundscape";
import { voiceProfiles } from "../hooks/useVoiceAssistant";

interface SessionSettingsProps {
  activeSoundscape: SoundscapeType;
  onSelectSoundscape: (id: SoundscapeType) => void;
  soundscapeVolume: number;
  onSetSoundscapeVolume: (v: number) => void;
  selectedVoiceId: string;
  onSelectVoice: (id: string) => void;
  voiceVolume: number;
  onSetVoiceVolume: (v: number) => void;
  isVoiceEnabled: boolean;
  onSetVoiceEnabled: (enabled: boolean) => void;
  onTestVoice: (id: string) => void;
  activeBinaural: BinauralType;
  onSelectBinaural: (id: BinauralType) => void;
  binauralVolume: number;
  onSetBinauralVolume: (v: number) => void;
  isOpen: boolean;
  onClose: () => void;
}

const IconMap = {
  "zen-river": Waves,
  "zen-fountain": Wind,
  "winter-rain": CloudRain,
  "light-rain": CloudRain,
  "nature-birds": Trees,
  "hz-transformation": Sparkles,
  "white-noise": Volume2,
  "pink-noise": Sparkles,
  "brown-noise": Moon,
  none: X,
  alpha: Zap,
  theta: Waves,
  delta: Moon,
  beach: Waves,
  lake: Waves,
  marine: Waves,
  desert: Wind,
  ethereal: Sparkles,
  forest: Trees,
};

export function SessionSettings({
  activeSoundscape,
  onSelectSoundscape,
  soundscapeVolume,
  onSetSoundscapeVolume,
  selectedVoiceId,
  onSelectVoice,
  voiceVolume,
  onSetVoiceVolume,
  isVoiceEnabled,
  onSetVoiceEnabled,
  onTestVoice,
  activeBinaural,
  onSelectBinaural,
  binauralVolume,
  onSetBinauralVolume,
  isOpen,
  onClose,
}: SessionSettingsProps) {
  const [activeTab, setActiveTab] = useState<"sound" | "voice" | "binaural">(
    "sound",
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[70] bg-black/30 backdrop-blur-[2px]"
          />

          {/* Panel */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 bottom-0 left-0 z-[80] rounded-t-[40px] border-t border-white/20 bg-white/[0.05] p-6 pb-10 shadow-[0_-15px_50px_rgba(0,0,0,0.4)] backdrop-blur-[40px]"
          >
            {/* Visual Handle */}
            <div className="mx-auto mb-6 h-1 w-10 rounded-full bg-white/30" />

            <div className="mx-auto max-w-md">
              <div className="mb-8 flex items-center justify-between">
                <div className="scrollbar-hide flex overflow-x-auto rounded-full border border-white/10 bg-white/10 p-1 shadow-inner">
                  <button
                    onClick={() => setActiveTab("sound")}
                    className={`rounded-full px-5 py-2 text-[11px] font-medium whitespace-nowrap transition-all duration-400 ${activeTab === "sound" ? "bg-white text-black shadow-md" : "text-gray-300"}`}
                  >
                    Ambients
                  </button>
                  <button
                    onClick={() => setActiveTab("voice")}
                    className={`rounded-full px-5 py-2 text-[11px] font-medium whitespace-nowrap transition-all duration-400 ${activeTab === "voice" ? "bg-white text-black shadow-md" : "text-gray-300"}`}
                  >
                    Guide
                  </button>
                  <button
                    onClick={() => setActiveTab("binaural")}
                    className={`rounded-full px-5 py-2 text-[11px] font-medium whitespace-nowrap transition-all duration-400 ${activeTab === "binaural" ? "bg-white text-black shadow-md" : "text-gray-300"}`}
                  >
                    Frequencies
                  </button>
                </div>
                <button
                  onClick={onClose}
                  className="ml-2 shrink-0 rounded-full border border-white/10 bg-white/10 p-2.5 transition-all hover:bg-white/20"
                >
                  <X size={20} strokeWidth={1.5} />
                </button>
              </div>

              <div className="scrollbar-hide max-h-[60vh] overflow-y-auto pr-1">
                {activeTab === "sound" && (
                  <div className="flex flex-col gap-8">
                    <div className="grid grid-cols-2 gap-4">
                      {soundscapes.map((s) => {
                        const Icon =
                          IconMap[s.id as keyof typeof IconMap] || Volume2;
                        const isActive = activeSoundscape === s.id;

                        return (
                          <button
                            key={s.id}
                            onClick={() => onSelectSoundscape(s.id)}
                            className={`relative flex flex-col items-center justify-center rounded-[28px] border p-6 transition-all duration-400 ${
                              isActive
                                ? "border-white/40 bg-white/15 text-white shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                                : "border-white/10 bg-white/5 text-gray-400 hover:bg-white/10"
                            }`}
                          >
                            <Icon
                              size={24}
                              strokeWidth={1.5}
                              className="mb-2"
                            />
                            <span className="text-xs font-medium">
                              {s.name}
                            </span>
                            {isActive && (
                              <div className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-lg">
                                <Check
                                  size={12}
                                  className="text-black"
                                  strokeWidth={3}
                                />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {activeTab === "voice" && (
                  <div className="flex flex-col gap-6">
                    <div className="mb-2 flex items-center justify-between px-2">
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-white">
                          Voice Guidance
                        </span>
                        <span className="mt-0.5 text-[10px] tracking-widest text-gray-500 uppercase">
                          Toggle Audio Cues
                        </span>
                      </div>
                      <button
                        onClick={() => onSetVoiceEnabled(!isVoiceEnabled)}
                        className={`flex h-6 w-12 items-center rounded-full p-1 transition-all duration-500 ${isVoiceEnabled ? "bg-white" : "border border-white/10 bg-white/10"}`}
                      >
                        <div
                          className={`h-4 w-4 rounded-full transition-all duration-500 ${isVoiceEnabled ? "translate-x-6 bg-black" : "translate-x-0 bg-gray-500"}`}
                        />
                      </button>
                    </div>

                    <div className="flex flex-col gap-3">
                      {voiceProfiles.map((v) => {
                        const isActive = selectedVoiceId === v.id;
                        const isMale = v.id === "edward" || v.id === "viraj";
                        return (
                          <div
                            key={v.id}
                            className={`relative flex items-center gap-4 rounded-[28px] border p-4 transition-all duration-400 ${
                              isActive
                                ? "border-white/40 bg-white/15 shadow-xl"
                                : "border-white/10 bg-white/5"
                            } ${!isVoiceEnabled ? "pointer-events-none opacity-40 grayscale" : ""}`}
                          >
                            {/* Profile Avatar Icon */}
                            <div
                              onClick={() => onSelectVoice(v.id)}
                              className={`flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border transition-all select-none active:scale-95 ${
                                isActive
                                  ? "border-white/40 bg-white/10 shadow-lg"
                                  : "border-white/10 bg-white/5 opacity-80 hover:opacity-100"
                              }`}
                            >
                              <img
                                src={`/image/avatars/${v.id}.png`}
                                alt={v.name}
                                className="h-full w-full object-cover"
                              />
                            </div>

                            <div
                              onClick={() => onSelectVoice(v.id)}
                              className="flex-1 cursor-pointer"
                            >
                              <h4
                                className={`text-base font-normal ${isActive ? "text-white" : "text-gray-300"}`}
                              >
                                {v.name}
                              </h4>
                              <p className="mt-1 text-xs text-gray-400">
                                {v.description}
                              </p>
                            </div>

                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => onTestVoice(v.id)}
                                className="rounded-full border border-white/10 bg-white/10 p-3 text-white transition-all hover:bg-white/20"
                              >
                                <Play size={14} fill="currentColor" />
                              </button>

                              <div
                                onClick={() => onSelectVoice(v.id)}
                                className={`flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border-2 transition-all ${
                                  isActive
                                    ? "border-white bg-white"
                                    : "border-white/20"
                                }`}
                              >
                                {isActive && (
                                  <Check
                                    size={14}
                                    className="text-black"
                                    strokeWidth={3}
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {activeTab === "binaural" && (
                  <div className="flex flex-col gap-8">
                    <div className="grid grid-cols-1 gap-3">
                      <button
                        onClick={() => onSelectBinaural("none")}
                        className={`relative flex items-center gap-4 rounded-[28px] border p-5 transition-all duration-400 ${
                          activeBinaural === "none"
                            ? "border-white/40 bg-white/15 shadow-xl"
                            : "border-white/10 bg-white/5 text-gray-400 hover:bg-white/10"
                        }`}
                      >
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full ${activeBinaural === "none" ? "bg-white text-black" : "bg-white/5 text-gray-500"}`}
                        >
                          <X size={20} />
                        </div>
                        <div className="flex-1 text-left">
                          <h4
                            className={`text-sm font-medium ${activeBinaural === "none" ? "text-white" : "text-gray-400"}`}
                          >
                            No Frequency
                          </h4>
                          <p className="text-[10px] tracking-widest uppercase opacity-60">
                            Silent Mind
                          </p>
                        </div>
                        {activeBinaural === "none" && (
                          <Check size={16} className="text-white" />
                        )}
                      </button>

                      {binauralConfigs.map((c) => {
                        const isActive = activeBinaural === c.id;
                        const Icon =
                          IconMap[c.id as keyof typeof IconMap] || Sparkles;
                        return (
                          <button
                            key={c.id}
                            onClick={() => onSelectBinaural(c.id)}
                            className={`relative flex items-center gap-4 rounded-[28px] border p-5 transition-all duration-400 ${
                              isActive
                                ? "border-white/40 bg-white/15 shadow-xl"
                                : "border-white/10 bg-white/5 text-gray-400 hover:bg-white/10"
                            }`}
                          >
                            <div
                              className={`flex h-10 w-10 items-center justify-center rounded-full ${isActive ? "bg-white text-black" : "bg-white/5 text-gray-500"}`}
                            >
                              <Icon size={20} />
                            </div>
                            <div className="flex-1 text-left">
                              <h4
                                className={`text-sm font-medium ${isActive ? "text-white" : "text-gray-300"}`}
                              >
                                {c.name}
                              </h4>
                              <p className="mt-0.5 text-[10px] tracking-widest uppercase opacity-60">
                                {c.description}
                              </p>
                            </div>
                            {isActive && (
                              <Check size={16} className="text-white" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {activeBinaural !== "none" && (
                      <p className="mt-4 px-2 text-center text-[9px] leading-relaxed text-gray-500">
                        Best experienced with headphones. Binaural beats work by
                        playing slightly different frequencies in each ear to
                        stimulate specific brainwave states.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Fixed Bottom Volume Adjuster (Dynamic per Active Tab) */}
              <div className="relative z-20 mt-6 border-t border-white/10 pt-5">
                {activeTab === "sound" && (
                  <div className="px-1">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">
                        Ambient Volume
                      </span>
                      <span className="text-[10px] font-medium text-white">
                        {Math.round(soundscapeVolume * 100)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={soundscapeVolume}
                      onChange={(e) =>
                        onSetSoundscapeVolume(parseFloat(e.target.value))
                      }
                      className="h-1 w-full cursor-pointer appearance-none rounded-lg bg-white/15 accent-white"
                    />
                  </div>
                )}

                {activeTab === "voice" && isVoiceEnabled && (
                  <div className="px-1">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">
                        Guide Volume
                      </span>
                      <span className="text-[10px] font-medium text-white">
                        {Math.round(voiceVolume * 100)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={voiceVolume}
                      onChange={(e) =>
                        onSetVoiceVolume(parseFloat(e.target.value))
                      }
                      className="h-1 w-full cursor-pointer appearance-none rounded-lg bg-white/15 accent-white"
                    />
                  </div>
                )}

                {activeTab === "binaural" && activeBinaural !== "none" && (
                  <div className="px-1">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">
                        Frequency Volume
                      </span>
                      <span className="text-[10px] font-medium text-white">
                        {Math.round(binauralVolume * 100)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={binauralVolume}
                      onChange={(e) =>
                        onSetBinauralVolume(parseFloat(e.target.value))
                      }
                      className="h-1 w-full cursor-pointer appearance-none rounded-lg bg-white/15 accent-white"
                    />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
