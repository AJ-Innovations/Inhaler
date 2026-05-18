'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloudRain, Trees, Sparkles, Waves, Volume2, X, Play, Check, Wind, Zap, Moon } from 'lucide-react';
import { SoundscapeType, soundscapes } from '../hooks/useSoundscape';
import { voiceProfiles } from '../hooks/useVoiceAssistant';
import { BinauralType, binauralConfigs } from '../hooks/useBinauralBeats';

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
  'zen-river': Waves,
  'zen-fountain': Wind,
  'winter-rain': CloudRain,
  'light-rain': CloudRain,
  'nature-birds': Trees,
  'hz-transformation': Sparkles,
  'white-noise': Volume2,
  'pink-noise': Sparkles,
  'brown-noise': Moon,
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
  onClose 
}: SessionSettingsProps) {
  const [activeTab, setActiveTab] = useState<'sound' | 'voice' | 'binaural'>('sound');

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
            className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-[70]"
          />

          {/* Panel */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-white/[0.05] backdrop-blur-[40px] border-t border-white/20 rounded-t-[40px] z-[80] p-6 pb-10 shadow-[0_-15px_50px_rgba(0,0,0,0.4)]"
          >
            {/* Visual Handle */}
            <div className="w-10 h-1 bg-white/30 rounded-full mx-auto mb-6" />

            <div className="max-w-md mx-auto">
              <div className="flex justify-between items-center mb-8">
                <div className="flex bg-white/10 p-1 rounded-full border border-white/10 shadow-inner overflow-x-auto scrollbar-hide">
                  <button 
                    onClick={() => setActiveTab('sound')}
                    className={`px-5 py-2 rounded-full text-[11px] font-medium transition-all duration-400 whitespace-nowrap ${activeTab === 'sound' ? 'bg-white text-black shadow-md' : 'text-gray-300'}`}
                  >
                    Ambients
                  </button>
                  <button 
                    onClick={() => setActiveTab('voice')}
                    className={`px-5 py-2 rounded-full text-[11px] font-medium transition-all duration-400 whitespace-nowrap ${activeTab === 'voice' ? 'bg-white text-black shadow-md' : 'text-gray-300'}`}
                  >
                    Guide
                  </button>
                  <button 
                    onClick={() => setActiveTab('binaural')}
                    className={`px-5 py-2 rounded-full text-[11px] font-medium transition-all duration-400 whitespace-nowrap ${activeTab === 'binaural' ? 'bg-white text-black shadow-md' : 'text-gray-300'}`}
                  >
                    Frequencies
                  </button>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2.5 rounded-full bg-white/10 border border-white/10 hover:bg-white/20 transition-all shrink-0 ml-2"
                >
                  <X size={20} strokeWidth={1.5} />
                </button>
              </div>

              <div className="max-h-[60vh] overflow-y-auto pr-1 scrollbar-hide">
                {activeTab === 'sound' && (
                  <div className="flex flex-col gap-8">
                    <div className="grid grid-cols-2 gap-4">
                      {soundscapes.map((s) => {
                        const Icon = IconMap[s.id as keyof typeof IconMap] || Volume2;
                        const isActive = activeSoundscape === s.id;

                        return (
                          <button
                            key={s.id}
                            onClick={() => onSelectSoundscape(s.id)}
                            className={`flex flex-col items-center justify-center p-6 rounded-[28px] border relative transition-all duration-400 ${
                              isActive
                                ? 'bg-white/15 border-white/40 text-white shadow-[0_0_20px_rgba(255,255,255,0.1)]'
                                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                            }`}
                          >
                            <Icon size={24} strokeWidth={1.5} className="mb-2" />
                            <span className="text-xs font-medium">{s.name}</span>
                            {isActive && (
                              <div className="absolute top-3 right-3 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-lg">
                                <Check size={12} className="text-black" strokeWidth={3} />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>


                  </div>
                )}

                {activeTab === 'voice' && (
                  <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between px-2 mb-2">
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-white">Voice Guidance</span>
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">Toggle Audio Cues</span>
                      </div>
                      <button 
                        onClick={() => onSetVoiceEnabled(!isVoiceEnabled)}
                        className={`w-12 h-6 rounded-full transition-all duration-500 p-1 flex items-center ${isVoiceEnabled ? 'bg-white' : 'bg-white/10 border border-white/10'}`}
                      >
                        <div className={`w-4 h-4 rounded-full transition-all duration-500 ${isVoiceEnabled ? 'bg-black translate-x-6' : 'bg-gray-500 translate-x-0'}`} />
                      </button>
                    </div>



                    <div className="flex flex-col gap-3">
                      {voiceProfiles.map((v) => {
                        const isActive = selectedVoiceId === v.id;
                        const isMale = v.id === 'atlas' || v.id === 'caspian';
                        return (
                          <div 
                            key={v.id}
                            className={`flex items-center gap-4 p-4 rounded-[28px] border relative transition-all duration-400 ${
                              isActive ? 'bg-white/15 border-white/40 shadow-xl' : 'bg-white/5 border-white/10'
                            } ${!isVoiceEnabled ? 'opacity-40 grayscale pointer-events-none' : ''}`}
                          >
                            <div 
                              onClick={() => onSelectVoice(v.id)}
                              className="flex-1 cursor-pointer"
                            >
                              <h4 className={`text-base font-normal ${isActive ? 'text-white' : 'text-gray-300'}`}>{v.name}</h4>
                              <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">
                                {isMale ? 'Deep Presence' : 'Ethereal Harmony'}
                              </p>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              <button 
                                onClick={() => onTestVoice(v.id)}
                                className="p-3 rounded-full bg-white/10 border border-white/10 hover:bg-white/20 text-white transition-all"
                              >
                                <Play size={14} fill="currentColor" />
                              </button>
                              
                              <div 
                                onClick={() => onSelectVoice(v.id)}
                                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all ${
                                  isActive ? 'border-white bg-white' : 'border-white/20'
                                }`}
                              >
                                {isActive && <Check size={14} className="text-black" strokeWidth={3} />}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {activeTab === 'binaural' && (
                  <div className="flex flex-col gap-8">
                    <div className="grid grid-cols-1 gap-3">
                      <button
                        onClick={() => onSelectBinaural('none')}
                        className={`flex items-center gap-4 p-5 rounded-[28px] border relative transition-all duration-400 ${
                          activeBinaural === 'none'
                            ? 'bg-white/15 border-white/40 shadow-xl'
                            : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activeBinaural === 'none' ? 'bg-white text-black' : 'bg-white/5 text-gray-500'}`}>
                          <X size={20} />
                        </div>
                        <div className="flex-1 text-left">
                          <h4 className={`text-sm font-medium ${activeBinaural === 'none' ? 'text-white' : 'text-gray-400'}`}>No Frequency</h4>
                          <p className="text-[10px] uppercase tracking-widest opacity-60">Silent Mind</p>
                        </div>
                        {activeBinaural === 'none' && <Check size={16} className="text-white" />}
                      </button>

                      {binauralConfigs.map((c) => {
                        const isActive = activeBinaural === c.id;
                        const Icon = IconMap[c.id as keyof typeof IconMap] || Sparkles;
                        return (
                          <button
                            key={c.id}
                            onClick={() => onSelectBinaural(c.id)}
                            className={`flex items-center gap-4 p-5 rounded-[28px] border relative transition-all duration-400 ${
                              isActive
                                ? 'bg-white/15 border-white/40 shadow-xl'
                                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                            }`}
                          >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isActive ? 'bg-white text-black' : 'bg-white/5 text-gray-500'}`}>
                              <Icon size={20} />
                            </div>
                            <div className="flex-1 text-left">
                              <h4 className={`text-sm font-medium ${isActive ? 'text-white' : 'text-gray-300'}`}>{c.name}</h4>
                              <p className="text-[10px] uppercase tracking-widest opacity-60 mt-0.5">{c.description}</p>
                            </div>
                            {isActive && <Check size={16} className="text-white" />}
                          </button>
                        );
                      })}
                    </div>

                    {activeBinaural !== 'none' && (
                      <p className="text-[9px] text-gray-500 mt-4 px-2 text-center leading-relaxed">
                        Best experienced with headphones. Binaural beats work by playing slightly different frequencies in each ear to stimulate specific brainwave states.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Fixed Bottom Volume Adjuster (Dynamic per Active Tab) */}
              <div className="mt-6 pt-5 border-t border-white/10 relative z-20">
                {activeTab === 'sound' && (
                  <div className="px-1">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold">Ambient Volume</span>
                      <span className="text-[10px] text-white font-medium">{Math.round(soundscapeVolume * 100)}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="1" 
                      step="0.01" 
                      value={soundscapeVolume} 
                      onChange={(e) => onSetSoundscapeVolume(parseFloat(e.target.value))}
                      className="w-full h-1 bg-white/15 rounded-lg appearance-none cursor-pointer accent-white"
                    />
                  </div>
                )}

                {activeTab === 'voice' && isVoiceEnabled && (
                  <div className="px-1">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold">Guide Volume</span>
                      <span className="text-[10px] text-white font-medium">{Math.round(voiceVolume * 100)}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="1" 
                      step="0.01" 
                      value={voiceVolume} 
                      onChange={(e) => onSetVoiceVolume(parseFloat(e.target.value))}
                      className="w-full h-1 bg-white/15 rounded-lg appearance-none cursor-pointer accent-white"
                    />
                  </div>
                )}

                {activeTab === 'binaural' && activeBinaural !== 'none' && (
                  <div className="px-1">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold">Frequency Volume</span>
                      <span className="text-[10px] text-white font-medium">{Math.round(binauralVolume * 100)}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="1" 
                      step="0.01" 
                      value={binauralVolume} 
                      onChange={(e) => onSetBinauralVolume(parseFloat(e.target.value))}
                      className="w-full h-1 bg-white/15 rounded-lg appearance-none cursor-pointer accent-white"
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
