import { RadarChart } from "./RadarChart";
import { motion } from "framer-motion";
import { CLASSES } from "../data/classes";
import { STAT_DESCRIPTIONS } from "../utils/rpgData";
import { getBaseStats, calculateDerivedStats } from "../utils/levelingSystem";
import {
  calculateLevelFromXP,
  calculateTotalXP,
  getProgressToNextLevel,
} from "../utils/levelingSystem";

export const StatsCard = ({
  isDark,
  selectedClass = "GENERALIST",
  totalXP,
}) => {
  const resolvedXP = totalXP ?? calculateTotalXP();
  const levelData = calculateLevelFromXP(resolvedXP);
  const baseStats = getBaseStats(selectedClass);
  const derivedStats = calculateDerivedStats(baseStats, levelData.level);
  const progress = getProgressToNextLevel(resolvedXP);
  const classInfo = CLASSES[selectedClass] ?? CLASSES.GENERALIST;

  const stats = [
    { key: "strength", value: derivedStats.strength },
    { key: "intelligence", value: derivedStats.intelligence },
    { key: "dexterity", value: derivedStats.dexterity },
    { key: "constitution", value: derivedStats.constitution },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6 }}
      className={`rounded-3xl p-8 border backdrop-blur-xl ${
        isDark
          ? "bg-zinc-900/70 border-zinc-800/50"
          : "bg-white/80 border-green-200/30"
      }`}
    >
      <p className="text-green-400 tracking-[0.3em] mb-6 text-xs uppercase">
        ⚡ Battle Stats
      </p>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h3 className="text-3xl font-bold text-[var(--app-text)]">
            Character Attributes
          </h3>
          <p
            className={`mt-2 text-sm ${isDark ? "text-zinc-500" : "text-gray-500"}`}
          >
            Active class:{" "}
            <span className="text-green-400 font-semibold">
              {classInfo.icon} {classInfo.name}
            </span>{" "}
            • Change class in Character Sheet
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-widest text-green-400 mb-1">
            Current Level
          </p>
          <p className="text-3xl font-bold text-green-400">
            Lv. {levelData.level}
          </p>
          <p
            className={`text-xs ${isDark ? "text-zinc-500" : "text-gray-500"}`}
          >
            {resolvedXP} XP total • {levelData.tier}
          </p>
        </div>
      </div>

      <div
        className={`mb-8 h-3 rounded-full border ${
          isDark ? "bg-zinc-700 border-zinc-600" : "bg-gray-200 border-gray-300"
        } overflow-hidden`}
      >
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${progress}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-green-400 to-emerald-400 shadow-[0_0_8px_rgba(34,197,94,0.6)]"
        />
      </div>

      <div className="flex justify-center py-4">
        <RadarChart stats={derivedStats} level={levelData.level} />
      </div>
      {/* Overall Power Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className={`mt-8 p-6 rounded-2xl border ${
          isDark
            ? "bg-gradient-to-r from-zinc-800/50 to-zinc-800/30 border-green-500/30"
            : "bg-gradient-to-r from-green-50/50 to-green-50/30 border-green-300/30"
        }`}
      >
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm uppercase tracking-widest text-green-400 mb-2">
              ⚔️ Overall Power Level
            </p>
            <p className={isDark ? "text-zinc-300" : "text-gray-700"}>
              Average:{" "}
              {(
                Object.values(derivedStats).reduce((a, b) => a + b) / 4
              ).toFixed(1)}{" "}
              / 10
            </p>
          </div>
          <div className="text-4xl font-bold text-green-400">
            {Math.round(
              (Object.values(derivedStats).reduce((a, b) => a + b) / 4) * 10,
            )}
            %
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
