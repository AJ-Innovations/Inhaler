import { Moon, Zap, Activity, ShieldAlert, Wind, Heart, Flame, Compass, Sun, Cloud, Infinity, Timer, Dna, Leaf, Sparkle, Brain } from 'lucide-react';
import { Exercise } from '../types';

export const IconMap = {
  Moon,
  Zap,
  Activity,
  ShieldAlert,
  Wind,
  Flame,
  Compass,
  Heart,
  Sun,
  Cloud,
  Infinity,
  Timer,
  Dna,
  Leaf,
  Sparkle,
  Brain,
};

export const exercises: Exercise[] = [
  {
    id: 'box',
    name: 'Box Breathing',
    subtitle: 'Focus & Stress Relief',
    description: 'A powerful technique used by Navy SEALs to stay calm and focused under pressure.',
    howTo: 'Inhale for 4s, hold for 4s, exhale for 4s, and hold for 4s. Repeat the cycle.',
    why: 'It regulates the autonomic nervous system by balancing the sympathetic and parasympathetic branches.',
    benefits: ['Lowers cortisol', 'Improves concentration', 'Instant calm'],
    icon: 'Zap',
    gradient: {
      start: '#0082ff',
      end: '#00ffd5'
    },
    pattern: { inhale: 4, hold1: 4, exhale: 4, hold2: 4 }
  },
  {
    id: '478',
    name: '4-7-8 Sleep',
    subtitle: 'Anxiety & Better Sleep',
    description: 'A natural tranquilizer for the nervous system that helps you fall asleep faster.',
    howTo: 'Inhale through nose for 4s, hold breath for 7s, exhale forcefully through mouth for 8s.',
    why: 'The long exhale triggers the vagus nerve, signaling the body to switch into rest mode.',
    benefits: ['Reduces anxiety', 'Cures insomnia', 'Deep relaxation'],
    icon: 'Moon',
    gradient: {
      start: '#a855f7',
      end: '#6366f1'
    },
    pattern: { inhale: 4, hold1: 7, exhale: 8, hold2: 0 }
  },
  {
    id: 'nadi',
    name: 'Nadi Shodhana',
    subtitle: 'Balance & Channel Clearing',
    description: 'A fundamental Yogic Pranayama that balances the left and right hemispheres of the brain.',
    howTo: 'Close your right nostril, inhale through the left. Close the left, exhale through the right. Inhale right, exhale left. Keep a 1:1 ratio.',
    why: 'Clears the "Nadis" (energy channels) and balances the "Ida" (lunar) and "Pingala" (solar) energies.',
    benefits: ['Hemispheric balance', 'Lowers heart rate', 'Reduces stress'],
    icon: 'Compass',
    gradient: {
      start: '#ec4899',
      end: '#8b5cf6'
    },
    pattern: { inhale: 4, hold1: 4, exhale: 4, hold2: 4 }
  },
  {
    id: 'kapalbhati',
    name: 'Kapalbhati',
    subtitle: 'Detox & Vitality',
    description: 'The "Skull Shining" breath is a powerful purification technique to energize the system.',
    howTo: 'Focus on short, forceful exhales by snapping the belly in. The inhale is passive and automatic. 1 second per cycle.',
    why: 'Massages internal organs, oxygenates the blood, and helps clear the mind (hence "shining skull").',
    warning: 'Avoid if you have high blood pressure, heart conditions, or are pregnant.',
    benefits: ['Metabolic boost', 'Clarifies mind', 'Respiratory strength'],
    icon: 'Flame',
    isAdvanced: true,
    gradient: {
      start: '#f43f5e',
      end: '#fb923c'
    },
    pattern: { inhale: 1, hold1: 0, exhale: 1, hold2: 0 }
  },
  {
    id: 'ibuki',
    name: 'Ibuki Breathing',
    subtitle: 'Martial Power & Stability',
    description: 'A traditional Karate breathing method used to strengthen the core and settle the mind after combat.',
    howTo: 'Inhale deeply. Exhale with maximum tension in the core, making a distinct, sharp sound through the back of the throat.',
    why: 'Forces the diaphragm to contract fully, building immense internal pressure and "Grit".',
    warning: 'Perform with caution; the extreme internal pressure can cause dizziness in beginners.',
    benefits: ['Core stability', 'Internal power', 'Focus under fire'],
    icon: 'ShieldAlert',
    isAdvanced: true,
    gradient: {
      start: '#4b5563',
      end: '#1f2937'
    },
    pattern: { inhale: 3, hold1: 1, exhale: 8, hold2: 1 }
  },
  {
    id: 'deep-hold',
    name: 'Deep Breath Hold',
    subtitle: 'Endurance & Vitality',
    description: 'An advanced technique to increase CO2 tolerance and boost cellular oxygenation.',
    howTo: 'Take 30 deep breaths, then on the last one, exhale halfway and hold for as long as possible. Reach milestones of 60s, 90s, and 120s.',
    why: 'Intermittent hypoxia triggers a survival response that strengthens the immune system and increases red blood cell count.',
    warning: 'NEVER perform this in water, while driving, or standing up. You may experience lightheadedness or temporary fainting.',
    benefits: ['Immune boost', 'Increased energy', 'pH balancing'],
    icon: 'ShieldAlert',
    isAdvanced: true,
    gradient: {
      start: '#ef4444',
      end: '#f59e0b'
    },
    pattern: { inhale: 2, hold1: 60, exhale: 5, hold2: 0 }
  },
  {
    id: 'calm',
    name: 'Deep Calm',
    subtitle: 'Quick Reset',
    description: 'A simple rhythmic breathing pattern for general mindfulness and heart rate reduction.',
    howTo: 'Slow inhale for 5s, brief pause, then a very slow exhale for 5s.',
    why: 'Rhythmic breathing synchronizes heart rate and brain waves for a state of "coherence".',
    benefits: ['Blood pressure', 'Mindfulness', 'Emotional balance'],
    icon: 'Activity',
    gradient: {
      start: '#14b8a6',
      end: '#10b981'
    },
    pattern: { inhale: 5, hold1: 2, exhale: 5, hold2: 2 }
  }
];
