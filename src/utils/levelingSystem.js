// Leveling System Utilities
import { EXPERIENCE_TIERS, CLASSES, ACHIEVEMENTS } from "./rpgData";

const XP_WEIGHTS = {
  complexity: 40,
  scope: 25,
  breadth: 20,
  impact: 35,
};

// Calculate level based on XP
export const calculateLevelFromXP = (totalXP) => {
  let currentLevel = 1;
  let currentTier = EXPERIENCE_TIERS[0];
  let currentIndex = 0;

  for (let i = EXPERIENCE_TIERS.length - 1; i >= 0; i--) {
    if (totalXP >= EXPERIENCE_TIERS[i].minXP) {
      currentLevel = EXPERIENCE_TIERS[i].level;
      currentTier = EXPERIENCE_TIERS[i];
      currentIndex = i;
      break;
    }
  }

  const nextIndex = currentIndex + 1;
  const nextTierXP =
    nextIndex < EXPERIENCE_TIERS.length
      ? EXPERIENCE_TIERS[nextIndex].minXP
      : EXPERIENCE_TIERS[EXPERIENCE_TIERS.length - 1].minXP;

  return {
    level: currentLevel,
    tier: currentTier.title,
    nextTierXP: nextTierXP,
    currentXP: totalXP,
  };
};

export const calculateProjectXP = (project) => {
  if (!project?.xpProfile) return 0;

  const {
    complexity = 0,
    scope = 0,
    breadth = 0,
    impact = 0,
  } = project.xpProfile;

  return Math.round(
    100 +
      complexity * XP_WEIGHTS.complexity +
      scope * XP_WEIGHTS.scope +
      breadth * XP_WEIGHTS.breadth +
      impact * XP_WEIGHTS.impact,
  );
};

export const calculateAchievementXP = (achievements = ACHIEVEMENTS) => {
  return achievements.reduce(
    (total, achievement) =>
      total + (achievement.earned ? (achievement.xp ?? 0) : 0),
    0,
  );
};

// Calculate total XP based on achievements and projects
export const calculateTotalXP = (
  projects = [],
  achievements = ACHIEVEMENTS,
) => {
  const startingXP = 100;
  const projectXP = projects.reduce(
    (total, project) => total + calculateProjectXP(project),
    0,
  );

  return startingXP + projectXP + calculateAchievementXP(achievements);
};

// Calculate base stats from character class
export const getBaseStats = (selectedClass) => {
  if (!selectedClass || !CLASSES[selectedClass]) {
    return CLASSES.GENERALIST.stats;
  }
  return CLASSES[selectedClass].stats;
};

// Calculate derived stats (considering level)
export const calculateDerivedStats = (baseStats, level) => {
  const levelMultiplier = 1 + (level - 1) * 0.1;
  return {
    strength: Math.min(10, baseStats.strength * levelMultiplier),
    intelligence: Math.min(10, baseStats.intelligence * levelMultiplier),
    dexterity: Math.min(10, baseStats.dexterity * levelMultiplier),
    constitution: Math.min(10, baseStats.constitution * levelMultiplier),
  };
};

// Get progress to next level
export const getProgressToNextLevel = (currentXP) => {
  const levelData = calculateLevelFromXP(currentXP);
  const currentTierIndex = EXPERIENCE_TIERS.findIndex(
    (t) => t.level === levelData.level,
  );
  const nextTierIndex = currentTierIndex + 1;

  if (nextTierIndex >= EXPERIENCE_TIERS.length) {
    return 100; // Max level
  }

  const currentTierXP = EXPERIENCE_TIERS[currentTierIndex].minXP;
  const nextTierXP = EXPERIENCE_TIERS[nextTierIndex].minXP;

  const progress =
    ((currentXP - currentTierXP) / (nextTierXP - currentTierXP)) * 100;
  return Math.min(100, Math.max(0, progress));
};

// Get XP breakdown
export const getXPBreakdown = (projects = [], achievements = ACHIEVEMENTS) => {
  return {
    startingXP: 100,
    projectXP: projects.map((project) => ({
      title: project.title,
      xp: calculateProjectXP(project),
    })),
    achievementXP: calculateAchievementXP(achievements),
    totalXP: calculateTotalXP(projects, achievements),
  };
};
