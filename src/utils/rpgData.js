export { CLASSES } from "../data/classes";

// Experience Tiers
export const EXPERIENCE_TIERS = [
  { level: 1, minXP: 0, title: "Novice" },
  { level: 5, minXP: 250, title: "Apprentice" },
  { level: 10, minXP: 800, title: "Journeyman" },
  { level: 15, minXP: 1500, title: "Craftsman" },
  { level: 20, minXP: 2500, title: "Master" },
  { level: 25, minXP: 4000, title: "Legendary" },
];

// Quest Categories
export const QUEST_TYPES = {
  MAIN_QUEST: "main",
  SIDE_QUEST: "side",
  TREASURE_FOUND: "treasure",
};

export { ACHIEVEMENTS } from "../data/achievements";

export { SKILL_GROUPS, SKILL_DETAILS } from "../data/skills";

// Player Stats Descriptions
export const STAT_DESCRIPTIONS = {
  strength: {
    label: "Strength",
    description: "Problem-solving & DSA mastery",
    color: "from-red-500 to-orange-400",
  },
  intelligence: {
    label: "Intelligence",
    description: "AI/ML & system design knowledge",
    color: "from-blue-500 to-cyan-400",
  },
  dexterity: {
    label: "Dexterity",
    description: "Frontend & UI craftsmanship",
    color: "from-yellow-500 to-green-400",
  },
  constitution: {
    label: "Constitution",
    description: "Reliability & project delivery",
    color: "from-green-500 to-emerald-400",
  },
};
