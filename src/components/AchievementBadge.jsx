import { motion } from "framer-motion";
import { ACHIEVEMENTS } from "../utils/rpgData";

export const AchievementBadge = ({ isDark }) => {
  const earnedAchievements = ACHIEVEMENTS.filter((a) => a.earned);
  const unlockedCount = earnedAchievements.length;
  const totalCount = ACHIEVEMENTS.length;

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
      <div className="mb-8">
        <p className="text-green-400 tracking-[0.3em] mb-3 text-xs uppercase">
          🏆 Achievements Unlocked
        </p>
        <div className="flex justify-between items-start">
          <h3 className="text-3xl font-bold text-[var(--app-text)]">
            Quest Achievements
          </h3>
          <div className="text-right">
            <div className="text-3xl font-bold text-green-400">
              {unlockedCount}
            </div>
            <p
              className={`text-sm ${isDark ? "text-zinc-500" : "text-gray-500"}`}
            >
              of {totalCount} Unlocked
            </p>
          </div>
        </div>
      </div>

      {/* Unlocked Achievements */}
      <div>
        <p
          className={`text-xs uppercase tracking-widest mb-4 ${isDark ? "text-zinc-500" : "text-gray-500"}`}
        >
          ✓ Your Conquests
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {earnedAchievements.map((achievement, idx) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              whileHover={{ scale: 1.05, y: -4 }}
              className={`p-4 rounded-2xl border text-center transition ${
                isDark
                  ? "bg-gradient-to-br from-zinc-800/50 to-zinc-800/30 border-green-500/40 hover:border-green-400 hover:shadow-[0_0_15px_rgba(34,197,94,0.3)]"
                  : "bg-gradient-to-br from-green-50/50 to-green-50/30 border-green-300/40 hover:border-green-400 hover:shadow-[0_0_15px_rgba(34,197,94,0.2)]"
              }`}
            >
              <div className="text-3xl mb-2">{achievement.icon}</div>
              <h4 className="text-sm font-bold text-green-400 mb-1">
                {achievement.title}
              </h4>
              <p
                className={`text-xs ${
                  isDark ? "text-zinc-400" : "text-gray-600"
                } leading-tight`}
              >
                {achievement.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Achievement Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className={`p-6 rounded-2xl border ${
          isDark
            ? "bg-gradient-to-r from-zinc-800/50 to-zinc-800/30 border-green-500/30"
            : "bg-gradient-to-r from-green-50/50 to-green-50/30 border-green-300/30"
        }`}
      >
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p
              className={`text-xs uppercase tracking-widest ${isDark ? "text-zinc-500" : "text-gray-500"} mb-2`}
            >
              Completion Rate
            </p>
            <p className="text-2xl font-bold text-green-400">
              {Math.round((unlockedCount / totalCount) * 100)}%
            </p>
          </div>
          <div>
            <p
              className={`text-xs uppercase tracking-widest ${isDark ? "text-zinc-500" : "text-gray-500"} mb-2`}
            >
              Total Earned
            </p>
            <p className="text-2xl font-bold text-green-400">{unlockedCount}</p>
          </div>
          <div>
            <p
              className={`text-xs uppercase tracking-widest ${isDark ? "text-zinc-500" : "text-gray-500"} mb-2`}
            >
              Remaining
            </p>
            <p className="text-2xl font-bold text-amber-400">
              {totalCount - unlockedCount}
            </p>
          </div>
        </div>

        {/* Completion Bar */}
        <motion.div className="mt-6">
          <p
            className={`text-xs uppercase tracking-widest ${isDark ? "text-zinc-500" : "text-gray-500"} mb-2`}
          >
            Achievement Progress
          </p>
          <div
            className={`w-full h-3 rounded-full border ${
              isDark
                ? "bg-zinc-700 border-zinc-600"
                : "bg-gray-200 border-gray-300"
            } overflow-hidden`}
          >
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${(unlockedCount / totalCount) * 100}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-green-400 to-emerald-400 shadow-[0_0_8px_rgba(34,197,94,0.6)]"
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Footer Message */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className={`text-center mt-6 text-sm italic ${isDark ? "text-zinc-400" : "text-gray-600"}`}
      >
        🎯 "The journey of a thousand lines of code begins with a single
        commit."
      </motion.p>
    </motion.div>
  );
};
