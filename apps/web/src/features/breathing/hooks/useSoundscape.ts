'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export type SoundscapeType = 'none' | 'zen-river' | 'zen-fountain' | 'winter-rain' | 'light-rain' | 'nature-birds' | 'hz-transformation' | 'white-noise' | 'pink-noise' | 'brown-noise' | 'beach' | 'lake' | 'marine' | 'desert' | 'ethereal' | 'forest';

interface Soundscape {
  id: SoundscapeType;
  name: string;
  url?: string;
}

export const soundscapes: Soundscape[] = [
  { id: 'zen-river', name: 'Zen River', url: '/music/alex_jauk-calm-zen-river-flowing-228223.mp3' },
  { id: 'zen-fountain', name: 'Zen Fountain', url: '/music/alex_jauk-zen-fountain-ambience-210613.mp3' },
  { id: 'winter-rain', name: 'Winter Rain', url: '/music/fxprosound-winter-rain-in-oak-forest-loop-185672.mp3' },
  { id: 'light-rain', name: 'Light Rain', url: '/music/liecio-light-rain-109591.mp3' },
  { id: 'nature-birds', name: 'Nature Birds', url: '/music/mdjahidhossain-birds-nature-relax-sounds-110839.mp3' },
  { id: 'hz-transformation', name: '528Hz Transform', url: '/music/soul_frequencies-528-hz-transformation-music-500282.mp3' },
  { id: 'white-noise', name: 'White Noise' },
  { id: 'pink-noise', name: 'Pink Noise' },
  { id: 'brown-noise', name: 'Deep Brownian' },
  { id: 'beach', name: 'Sunset Beach', url: '/music/alex_jauk-calm-zen-river-flowing-228223.mp3' },
  { id: 'lake', name: 'Calm Lake', url: '/music/alex_jauk-calm-zen-river-flowing-228223.mp3' },
  { id: 'marine', name: 'Marine Depths', url: '/music/alex_jauk-zen-fountain-ambience-210613.mp3' },
  { id: 'desert', name: 'Desert Breeze', url: '/music/soul_frequencies-528-hz-transformation-music-500282.mp3' },
  { id: 'ethereal', name: 'Ethereal Loop', url: '/music/soul_frequencies-528-hz-transformation-music-500282.mp3' },
  { id: 'forest', name: 'Oak Forest', url: '/music/fxprosound-winter-rain-in-oak-forest-loop-185672.mp3' },
];

export function useSoundscape(isPlaying: boolean = false) {
  const [activeSoundscape, setActiveSoundscape] = useState<SoundscapeType>('none');
  const [volume, setVolume] = useState(0.5);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const stopNoise = useCallback(() => {
    if (noiseNodeRef.current) {
      try { noiseNodeRef.current.stop(); } catch (e) {}
      noiseNodeRef.current.disconnect();
      noiseNodeRef.current = null;
    }
  }, []);

  const startNoise = useCallback((type: 'white' | 'pink' | 'brown') => {
    if (typeof window === 'undefined') return;
    stopNoise();

    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    const ctx = audioCtxRef.current;
    const bufferSize = 2 * ctx.sampleRate;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);

    if (type === 'white') {
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
    } else if (type === 'pink') {
      let b0, b1, b2, b3, b4, b5, b6;
      b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        output[i] *= 0.11; // (approximate)
        b6 = white * 0.115926;
      }
    } else { // brown
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + (0.02 * white)) / 1.02;
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
  }, [volume, stopNoise]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.loop = true;
    }

    const audio = audioRef.current;
    const isNoise = activeSoundscape.includes('noise');

    if (!isPlaying || activeSoundscape === 'none') {
      audio.pause();
      stopNoise();
      return;
    }

    if (isNoise) {
      audio.pause();
      const type = activeSoundscape.split('-')[0] as 'white' | 'pink' | 'brown';
      startNoise(type);
    } else {
      stopNoise();
      const sound = soundscapes.find(s => s.id === activeSoundscape);
      if (sound && sound.url) {
        if (audio.src !== window.location.origin + sound.url) {
          audio.src = sound.url;
        }
        audio.volume = volume;
        audio.play().catch(err => console.error("Audio play failed:", err));
      }
    }

    return () => {
      audio.pause();
      stopNoise();
    };
  }, [activeSoundscape, isPlaying, startNoise, stopNoise]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
    if (gainNodeRef.current) gainNodeRef.current.gain.setTargetAtTime(volume, audioCtxRef.current?.currentTime || 0, 0.1);
  }, [volume]);

  const toggleSoundscape = (id: SoundscapeType) => {
    setActiveSoundscape(prev => prev === id ? 'none' : id);
  };

  return {
    activeSoundscape,
    setActiveSoundscape,
    toggleSoundscape,
    volume,
    setVolume,
    soundscapes
  };
}
