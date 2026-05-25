/**
 * Shared ambient image and soundscape data.
 * Previously duplicated in breathing/index.tsx and SessionSettings.tsx.
 */

export interface AmbientItem {
  id: string;
  name: string;
  image: string;
}

/** Map a soundscape ID to its background image path. */
export const getAmbientImage = (activeSoundscape: string): string => {
  switch (activeSoundscape) {
    case "zen-river":
      return "/image/ambients/river.png";
    case "zen-fountain":
      return "/image/ambients/lake.png";
    case "winter-rain":
      return "/image/ambients/rain.png";
    case "light-rain":
      return "/image/ambients/rain2.png";
    case "nature-birds":
      return "/image/ambients/nature2.png";
    case "hz-transformation":
      return "/image/ambients/galaxy.png";
    case "white-noise":
      return "/image/ambients/galaxy2.png";
    case "pink-noise":
      return "/image/ambients/galaxy3.png";
    case "brown-noise":
      return "/image/ambients/nature.png";
    case "beach":
      return "/image/ambients/beach.png";
    case "lake":
      return "/image/ambients/lake4.png";
    case "marine":
      return "/image/ambients/marain.png";
    case "desert":
      return "/image/ambients/desert3.png";
    case "ethereal":
      return "/image/ambients/loop.png";
    case "forest":
      return "/image/ambients/tree.png";
    case "silent-focus":
      return "/image/ambients/leaf2.png";
    case "desert-night":
      return "/image/ambients/desert2.png";
    case "sunset-beach":
      return "/image/ambients/beach2.png";
    case "deep-nature":
      return "/image/ambients/nature3.png";
    default:
      return "/image/ambients/nature2.png"; // Default to nature-birds image
  }
};

/** Full list of available ambients with display metadata. */
export const ambientList: AmbientItem[] = [
  {
    id: "nature-birds",
    name: "Nature Birds",
    image: "/image/ambients/nature2.png",
  },
  { id: "zen-river", name: "Zen River", image: "/image/ambients/river.png" },
  {
    id: "zen-fountain",
    name: "Zen Fountain",
    image: "/image/ambients/lake.png",
  },
  { id: "winter-rain", name: "Winter Rain", image: "/image/ambients/rain.png" },
  { id: "light-rain", name: "Light Rain", image: "/image/ambients/rain2.png" },
  {
    id: "hz-transformation",
    name: "528Hz Transform",
    image: "/image/ambients/galaxy.png",
  },
  {
    id: "white-noise",
    name: "White Noise",
    image: "/image/ambients/galaxy2.png",
  },
  {
    id: "pink-noise",
    name: "Pink Noise",
    image: "/image/ambients/galaxy3.png",
  },
  {
    id: "brown-noise",
    name: "Deep Brownian",
    image: "/image/ambients/nature.png",
  },
  { id: "beach", name: "Sunset Beach", image: "/image/ambients/beach.png" },
  { id: "lake", name: "Calm Lake", image: "/image/ambients/lake4.png" },
  { id: "marine", name: "Marine Depths", image: "/image/ambients/marain.png" },
  { id: "desert", name: "Desert Breeze", image: "/image/ambients/desert3.png" },
  { id: "ethereal", name: "Ethereal Loop", image: "/image/ambients/loop.png" },
  { id: "forest", name: "Oak Forest", image: "/image/ambients/tree.png" },
  {
    id: "silent-focus",
    name: "Silent Focus",
    image: "/image/ambients/leaf2.png",
  },
  {
    id: "desert-night",
    name: "Desert Night",
    image: "/image/ambients/desert2.png",
  },
  {
    id: "sunset-beach",
    name: "Golden Horizon",
    image: "/image/ambients/beach2.png",
  },
  {
    id: "deep-nature",
    name: "Deep Nature",
    image: "/image/ambients/nature3.png",
  },
];
