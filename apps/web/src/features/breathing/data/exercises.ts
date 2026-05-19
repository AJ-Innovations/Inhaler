import {
  Activity,
  Brain,
  Cloud,
  Compass,
  Dna,
  Flame,
  Heart,
  Infinity,
  Leaf,
  Moon,
  ShieldAlert,
  Sparkle,
  Sun,
  Timer,
  Wind,
  Zap,
} from "lucide-react";

import { Exercise } from "../types";

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
    id: "box",
    name: "Box Breathing",
    subtitle: "Focus & Stress Relief",
    description:
      "A powerful technique used by Navy SEALs to stay calm and focused under pressure.",
    howTo:
      "Inhale for 4s, hold for 4s, exhale for 4s, and hold for 4s. Repeat the cycle.",
    why: "It regulates the autonomic nervous system by balancing the sympathetic and parasympathetic branches.",
    benefits: ["Lowers cortisol", "Improves concentration", "Instant calm"],
    icon: "Zap",
    gradient: {
      start: "#0082ff",
      end: "#00ffd5",
    },
    pattern: { inhale: 4, hold1: 4, exhale: 4, hold2: 4 },
  },
  {
    id: "478",
    name: "4-7-8 Sleep",
    subtitle: "Anxiety & Better Sleep",
    description:
      "A natural tranquilizer for the nervous system that helps you fall asleep faster.",
    howTo:
      "Inhale through nose for 4s, hold breath for 7s, exhale forcefully through mouth for 8s.",
    why: "The long exhale triggers the vagus nerve, signaling the body to switch into rest mode.",
    benefits: ["Reduces anxiety", "Cures insomnia", "Deep relaxation"],
    icon: "Moon",
    gradient: {
      start: "#a855f7",
      end: "#6366f1",
    },
    pattern: { inhale: 4, hold1: 7, exhale: 8, hold2: 0 },
  },
  {
    id: "nadi",
    name: "Nadi Shodhana",
    subtitle: "Balance & Channel Clearing",
    description:
      "A fundamental Yogic Pranayama that balances the left and right hemispheres of the brain.",
    howTo:
      "Close your right nostril, inhale through the left. Close the left, exhale through the right. Inhale right, exhale left. Keep a 1:1 ratio.",
    why: 'Clears the "Nadis" (energy channels) and balances the "Ida" (lunar) and "Pingala" (solar) energies.',
    benefits: ["Hemispheric balance", "Lowers heart rate", "Reduces stress"],
    icon: "Compass",
    gradient: {
      start: "#ec4899",
      end: "#8b5cf6",
    },
    pattern: { inhale: 4, hold1: 4, exhale: 4, hold2: 4 },
  },
  {
    id: "kapalbhati",
    name: "Kapalbhati",
    subtitle: "Detox & Vitality",
    description:
      'The "Skull Shining" breath is a powerful purification technique to energize the system.',
    howTo:
      "Focus on short, forceful exhales by snapping the belly in. The inhale is passive and automatic. 1 second per cycle.",
    why: 'Massages internal organs, oxygenates the blood, and helps clear the mind (hence "shining skull").',
    warning:
      "Avoid if you have high blood pressure, heart conditions, or are pregnant.",
    benefits: ["Metabolic boost", "Clarifies mind", "Respiratory strength"],
    icon: "Flame",
    isAdvanced: true,
    gradient: {
      start: "#f43f5e",
      end: "#fb923c",
    },
    pattern: { inhale: 1, hold1: 0, exhale: 1, hold2: 0 },
  },
  {
    id: "ibuki",
    name: "Ibuki Breathing",
    subtitle: "Martial Power & Stability",
    description:
      "A traditional Karate breathing method used to strengthen the core and settle the mind after combat.",
    howTo:
      "Inhale deeply. Exhale with maximum tension in the core, making a distinct, sharp sound through the back of the throat.",
    why: 'Forces the diaphragm to contract fully, building immense internal pressure and "Grit".',
    warning:
      "Perform with caution; the extreme internal pressure can cause dizziness in beginners.",
    benefits: ["Core stability", "Internal power", "Focus under fire"],
    icon: "ShieldAlert",
    isAdvanced: true,
    gradient: {
      start: "#4b5563",
      end: "#1f2937",
    },
    pattern: { inhale: 3, hold1: 1, exhale: 8, hold2: 1 },
  },
  {
    id: "deep-hold",
    name: "Deep Breath Hold",
    subtitle: "Endurance & Vitality",
    description:
      "An advanced technique to increase CO2 tolerance and boost cellular oxygenation.",
    howTo:
      "Take 30 deep breaths, then on the last one, exhale halfway and hold for as long as possible. Reach milestones of 60s, 90s, and 120s.",
    why: "Intermittent hypoxia triggers a survival response that strengthens the immune system and increases red blood cell count.",
    warning:
      "NEVER perform this in water, while driving, or standing up. You may experience lightheadedness or temporary fainting.",
    benefits: ["Immune boost", "Increased energy", "pH balancing"],
    icon: "ShieldAlert",
    isAdvanced: true,
    gradient: {
      start: "#ef4444",
      end: "#f59e0b",
    },
    pattern: { inhale: 2, hold1: 60, exhale: 5, hold2: 0 },
  },
  {
    id: "calm",
    name: "Deep Calm",
    subtitle: "Quick Reset",
    description:
      "A simple rhythmic breathing pattern for general mindfulness and heart rate reduction.",
    howTo: "Slow inhale for 5s, brief pause, then a very slow exhale for 5s.",
    why: 'Rhythmic breathing synchronizes heart rate and brain waves for a state of "coherence".',
    benefits: ["Blood pressure", "Mindfulness", "Emotional balance"],
    icon: "Activity",
    gradient: {
      start: "#14b8a6",
      end: "#10b981",
    },
    pattern: { inhale: 5, hold1: 2, exhale: 5, hold2: 2 },
  },
  {
    id: "sudarshan",
    name: "Sudarshan Kriya",
    subtitle: "Joy & Energy Flow",
    description:
      "A powerful rhythmic breathing practice that harmonizes body, mind, and emotions.",
    howTo:
      "Alternate between slow, medium, and fast cycles of deep, rhythmic breathing.",
    why: "Synchronizes the biological rhythms of the body, releasing deep-seated stress and toxins.",
    benefits: ["Relieves depression", "Boosts immunity", "Enhances life force"],
    icon: "Sparkle",
    gradient: {
      start: "#f59e0b",
      end: "#ec4899",
    },
    pattern: { inhale: 3, hold1: 0, exhale: 3, hold2: 0 },
  },
  {
    id: "wim-hof",
    name: "Inner Fire (Tummo)",
    subtitle: "Resilience & Strength",
    description:
      "A method combining hyperventilation and breath retention to boost adrenaline and alkaline levels.",
    howTo:
      "Inhale deeply through the mouth, release passively. Repeat 30 times. Then exhale and hold, then inhale and hold.",
    why: "Temporarily shifts body pH to alkaline and stimulates the sympathetic nervous system to build stress resilience.",
    benefits: ["Alkalizes body", "Cold tolerance", "Immune surge"],
    icon: "Flame",
    isAdvanced: true,
    gradient: {
      start: "#fb7185",
      end: "#e11d48",
    },
    pattern: { inhale: 2, hold1: 45, exhale: 2, hold2: 15 },
  },
  {
    id: "anulom",
    name: "Anulom Vilom",
    subtitle: "Nervous System Purifier",
    description:
      "An alternate nostril breathing technique that purifies channels and calms the active mind.",
    howTo:
      "Inhale left nostril, exhale right. Inhale right, exhale left. Keep it slow, silent, and deep.",
    why: "Directly balances the parasympathetic and sympathetic nervous systems, cooling and heating energies.",
    benefits: ["Sinus clearing", "Balances blood pressure", "Mental clarity"],
    icon: "Brain",
    gradient: {
      start: "#3b82f6",
      end: "#2563eb",
    },
    pattern: { inhale: 4, hold1: 4, exhale: 4, hold2: 4 },
  },
  {
    id: "sitali",
    name: "Sitali Cooling",
    subtitle: "Cool & Calm System",
    description:
      "A cooling breathing technique that lowers body temperature and soothes anger/anxiety.",
    howTo:
      "Curl the sides of your tongue to form a tube. Inhale deeply through this tube. Close mouth, exhale through nose.",
    why: "Evaporates moisture on the tongue, cooling the blood flow to the brain and throat.",
    benefits: ["Reduces body heat", "Quenches thirst", "Soothes acidity"],
    icon: "Leaf",
    gradient: {
      start: "#06b6d4",
      end: "#0891b2",
    },
    pattern: { inhale: 4, hold1: 2, exhale: 6, hold2: 0 },
  },
  {
    id: "bhastrika",
    name: "Bhastrika Bellows",
    subtitle: "Energy & Lung Capacity",
    description:
      "Rapid, powerful inhalations and exhalations that act like bellows, generating intense heat and energy.",
    howTo:
      "Inhale and exhale forcefully through the nose with arm movements. Keep speed rhythmic and high-paced.",
    why: "Forces massive oxygen exchange, tones the diaphragm, and stimulates high metabolic activity.",
    benefits: ["Massive energy boost", "Clears congestion", "Oxygenates brain"],
    icon: "Zap",
    isAdvanced: true,
    gradient: {
      start: "#ea580c",
      end: "#d97706",
    },
    pattern: { inhale: 1, hold1: 0, exhale: 1, hold2: 0 },
  },
  {
    id: "bhramari",
    name: "Bhramari Bee",
    subtitle: "Vibrational Healing",
    description:
      "A soothing practice where you create a gentle humming sound during a prolonged exhale.",
    howTo:
      'Close your ears with thumbs, eyes with fingers. Inhale deep, then exhale slowly making a deep "Mmm" humming sound.',
    why: "The humming vibration increases nitric oxide production in sinuses by 15x and activates the vagus nerve instantly.",
    benefits: ["Instant calm", "Lowers blood pressure", "Sinus health"],
    icon: "Infinity",
    gradient: {
      start: "#c084fc",
      end: "#a855f7",
    },
    pattern: { inhale: 4, hold1: 0, exhale: 10, hold2: 0 },
  },
  {
    id: "buteyko",
    name: "Buteyko Method",
    subtitle: "Asthma & Breath Volume",
    description:
      "A therapeutic breathing technique focused on shallow nasal breathing to normalize breathing volume.",
    howTo:
      "Breathe shallowly through the nose. Hold breath gently after exhalation to accumulate CO2 (Control Pause).",
    why: "Normalizes respiration rate and increases CO2 levels to improve oxygen delivery via the Bohr effect.",
    benefits: [
      "Controls asthma",
      "Stops mouth-breathing",
      "Improves oxygenation",
    ],
    icon: "Activity",
    gradient: {
      start: "#10b981",
      end: "#047857",
    },
    pattern: { inhale: 2, hold1: 0, exhale: 3, hold2: 5 },
  },
];
