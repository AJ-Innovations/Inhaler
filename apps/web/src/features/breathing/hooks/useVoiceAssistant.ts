'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export interface VoiceProfile {
  id: string;
  name: string;
  pitch: number;
  rate: number;
  lang: string;
  voiceNameIncludes: string[];
}

export const voiceProfiles: VoiceProfile[] = [
  {
    id: 'luna',
    name: 'Luna (Zen)',
    pitch: 1.1,
    rate: 0.7,
    lang: 'en-US',
    voiceNameIncludes: ['Natural', 'Neural', 'Samantha', 'Google US English', 'Aria'],
  },
  {
    id: 'atlas',
    name: 'Atlas (Male)',
    pitch: 0.5, // Significantly lower pitch for male simulation
    rate: 0.8,
    lang: 'en-US',
    voiceNameIncludes: ['Natural', 'Neural', 'David', 'Microsoft David', 'Guy', 'Google US English Male', 'James'],
  },
  {
    id: 'aria',
    name: 'Aria (Soft)',
    pitch: 1.3, // Higher and lighter
    rate: 0.6,
    lang: 'en-US',
    voiceNameIncludes: ['Natural', 'Neural', 'Google UK English Female', 'Zira', 'Linda'],
  },
  {
    id: 'caspian',
    name: 'Caspian (Deep)',
    pitch: 0.4, // Extremely deep
    rate: 0.75,
    lang: 'en-US',
    voiceNameIncludes: ['Natural', 'Neural', 'James', 'Google UK English Male', 'Stefan', 'Mark'],
  }
];

export function useVoiceAssistant(
  phase?: string, 
  isActive?: boolean, 
  config: { 
    profileId: string; 
    isEnabled: boolean; 
    volume: number; 
  } = { profileId: 'luna', isEnabled: true, volume: 1.0 }
) {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  const updateVoices = useCallback(() => {
    if (typeof window !== 'undefined') {
      const synth = window.speechSynthesis;
      const allVoices = synth.getVoices();
      if (allVoices.length > 0) {
        // Prioritize high-quality voices
        const sortedVoices = [...allVoices].sort((a, b) => {
          const aIsNatural = a.name.includes('Natural') || a.name.includes('Neural') || a.name.includes('Premium');
          const bIsNatural = b.name.includes('Natural') || b.name.includes('Neural') || b.name.includes('Premium');
          if (aIsNatural && !bIsNatural) return -1;
          if (!aIsNatural && bIsNatural) return 1;
          return 0;
        });
        setVoices(sortedVoices);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;
      
      // Initial load
      updateVoices();

      // Setup event listener
      if (synthRef.current.onvoiceschanged !== undefined) {
        synthRef.current.onvoiceschanged = updateVoices;
      }

      // Polling as a fallback for browsers that don't fire onvoiceschanged reliably
      const pollInterval = setInterval(() => {
        if (voices.length === 0) {
          updateVoices();
        } else {
          clearInterval(pollInterval);
        }
      }, 1000);

      return () => clearInterval(pollInterval);
    }
  }, [updateVoices, voices.length]);

  const getVoice = useCallback((profile: VoiceProfile) => {
    if (voices.length === 0) return null;

    const isMaleProfile = profile.id === 'atlas' || profile.id === 'caspian';

    // 1. Try to find by specific priority names
    for (const name of profile.voiceNameIncludes) {
      const voice = voices.find(v => v.name.toLowerCase().includes(name.toLowerCase()));
      if (voice) return voice;
    }

    // 2. Fallback to gender detection
    if (isMaleProfile) {
      const maleVoice = voices.find(v => {
        const name = v.name.toLowerCase();
        return name.includes('male') || 
               name.includes('david') || 
               name.includes('guy') || 
               name.includes('james') || 
               name.includes('thomas') || 
               name.includes('stefan') ||
               name.includes('mark') ||
               name.includes('daniel');
      });
      if (maleVoice) return maleVoice;
    } else {
      const femaleVoice = voices.find(v => {
        const name = v.name.toLowerCase();
        return name.includes('female') || 
               name.includes('samantha') || 
               name.includes('aria') || 
               name.includes('linda') || 
               name.includes('zira') || 
               name.includes('catherine') ||
               name.includes('heera');
      });
      if (femaleVoice) return femaleVoice;
    }

    // 3. Fallback to English voices
    const enVoice = voices.find(v => v.lang.startsWith('en'));
    if (enVoice) return enVoice;

    return voices[0];
  }, [voices]);

  const speak = useCallback((text: string, forceProfile?: VoiceProfile) => {
    if (typeof window === 'undefined' || !window.speechSynthesis || !config.isEnabled) return;

    const synth = window.speechSynthesis;
    synth.cancel();

    const profile = forceProfile || voiceProfiles.find(p => p.id === config.profileId) || voiceProfiles[0];

    // Adding more pauses for natural flow
    const formattedText = text
      .replace('Inhale', 'Breathe in...')
      .replace('Exhale', 'Breathe out...')
      .replace('Hold', 'Hold your breath...')
      .replace('Rest', 'Relax...');

    const utterance = new SpeechSynthesisUtterance(formattedText);

    const voice = getVoice(profile);
    if (voice) {
      utterance.voice = voice;
    }

    // Force extreme differences if it's the same voice
    utterance.pitch = profile.pitch;
    utterance.rate = profile.rate;
    utterance.volume = config.volume;

    synth.speak(utterance);
  }, [config.profileId, config.isEnabled, config.volume, getVoice]);

  useEffect(() => {
    if (isActive && config.isEnabled && phase && phase !== 'Rest') {
      speak(phase);
    }
  }, [phase, isActive, config.isEnabled, speak]);

  const testVoice = useCallback((profileId: string) => {
    const profile = voiceProfiles.find(p => p.id === profileId);
    if (profile) {
      const text = profile.id === 'atlas' || profile.id === 'caspian' 
        ? `Hello, I am ${profile.name}. Focus on your breath. Inhale deeply, and exhale slowly.`
        : `Welcome to your practice. I am ${profile.name}. Let's find your inner calm together.`;
      speak(text, profile);
    }
  }, [speak]);

  return {
    speak,
    testVoice,
    voiceProfiles
  };
}
