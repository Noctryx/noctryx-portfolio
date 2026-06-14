import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QUEST_TYPES } from "../utils/rpgData";
import { calculateProjectXP } from "../utils/levelingSystem";

export const QuestLog = ({
  isDark,
  projects,
  selectedSkill,
  onClearFilter,
  onQuestOpen,
}) => {
  const [expandedQuest, setExpandedQuest] = useState(null);

  const questList = projects.map((project) => ({
    ...project,
    rewardXP: calculateProjectXP(project),
    type:
      project.tier === "main" ? QUEST_TYPES.MAIN_QUEST : QUEST_TYPES.SIDE_QUEST,
    difficulty: project.tier === "main" ? "LEGENDARY" : "EPIC",
  }));

  const mainQuests = questList.filter((quest) => quest.tier === "main");
  const sideQuests = questList.filter((quest) => quest.tier === "side");
  const totalXP = questList.reduce((total, quest) => total + quest.rewardXP, 0);

  const questTypeIcons = {
    [QUEST_TYPES.MAIN_QUEST]: "⚔️",
    [QUEST_TYPES.SIDE_QUEST]: "🗺️",
    [QUEST_TYPES.TREASURE_FOUND]: "💎",
  };

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
        📜 Quest Log
      </p>
      <h3 className="text-3xl font-bold mb-8 text-[var(--app-text)]">
        Legendary Encounters Conquered
      </h3>

      {selectedSkill && (
        <div className="mb-6 flex items-center justify-between gap-4 rounded-2xl border border-green-400/30 bg-green-400/10 px-4 py-3 text-sm">
          <p className="text-green-400">
            Filtering by skill:{" "}
            <span className="font-semibold">{selectedSkill}</span>
          </p>
          <button
            type="button"
            onClick={onClearFilter}
            className="text-xs uppercase tracking-widest text-[var(--app-text-muted)] hover:text-green-400 transition"
          >
            Clear Filter
          </button>
        </div>
      )}

      {questList.length === 0 ? (
        <div
          className={`rounded-2xl border p-6 ${
            isDark
              ? "border-zinc-700 bg-zinc-800/30"
              : "border-gray-200 bg-gray-50/50"
          }`}
        >
          <p className="text-[var(--app-text-muted)]">
            No quests match this skill filter yet.
          </p>
        </div>
      ) : null}

      {mainQuests.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-5">
            <span className="text-xl">⚔️</span>
            <h4 className="text-xl font-bold text-orange-400 uppercase tracking-wider">
              Main Quests
            </h4>
            <div
              className={`flex-1 h-px ${isDark ? "bg-zinc-700" : "bg-gray-300"}`}
            />
          </div>

          <div className="space-y-4">
            {mainQuests.map((quest, idx) => (
              <QuestCard
                key={quest.title}
                quest={quest}
                isDark={isDark}
                isExpanded={expandedQuest === quest.title}
                onToggle={() => {
                  if (expandedQuest !== quest.title) onQuestOpen?.();
                  setExpandedQuest(
                    expandedQuest === quest.title ? null : quest.title,
                  );
                }}
                delay={idx * 0.1}
                questTypeIcon={questTypeIcons[quest.type]}
              />
            ))}
          </div>
        </div>
      )}

      {sideQuests.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-5">
            <span className="text-xl">🗺️</span>
            <h4 className="text-xl font-bold text-cyan-400 uppercase tracking-wider">
              Side Quests
            </h4>
            <div
              className={`flex-1 h-px ${isDark ? "bg-zinc-700" : "bg-gray-300"}`}
            />
          </div>

          <div className="space-y-4">
            {sideQuests.map((quest, idx) => (
              <QuestCard
                key={quest.title}
                quest={quest}
                isDark={isDark}
                isExpanded={expandedQuest === quest.title}
                onToggle={() => {
                  if (expandedQuest !== quest.title) onQuestOpen?.();
                  setExpandedQuest(
                    expandedQuest === quest.title ? null : quest.title,
                  );
                }}
                delay={mainQuests.length * 0.1 + idx * 0.1}
                questTypeIcon={questTypeIcons[quest.type]}
              />
            ))}
          </div>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className={`mt-10 p-6 rounded-2xl border ${
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
              Total Quests
            </p>
            <p className="text-2xl font-bold text-green-400">
              {questList.length}
            </p>
          </div>
          <div>
            <p
              className={`text-xs uppercase tracking-widest ${isDark ? "text-zinc-500" : "text-gray-500"} mb-2`}
            >
              Main Quests
            </p>
            <p className="text-2xl font-bold text-orange-400">
              {mainQuests.length}
            </p>
          </div>
          <div>
            <p
              className={`text-xs uppercase tracking-widest ${isDark ? "text-zinc-500" : "text-gray-500"} mb-2`}
            >
              Total XP Earned
            </p>
            <p className="text-2xl font-bold text-green-400">{totalXP}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const QuestCard = ({
  quest,
  isDark,
  isExpanded,
  onToggle,
  delay,
  questTypeIcon,
}) => {
  const difficultyColors = {
    LEGENDARY: "from-orange-500 to-red-500",
    EPIC: "from-cyan-500 to-blue-500",
    RARE: "from-purple-500 to-blue-500",
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      onClick={onToggle}
      className={`rounded-2xl border overflow-hidden cursor-pointer transition ${
        isDark
          ? "bg-zinc-800/40 border-zinc-700/50 hover:border-green-400/50 hover:shadow-[0_0_15px_rgba(34,197,94,0.2)]"
          : "bg-gray-50/50 border-gray-200/50 hover:border-green-400/50 hover:shadow-[0_0_15px_rgba(34,197,94,0.15)]"
      }`}
    >
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className="text-3xl flex-shrink-0">{questTypeIcon}</div>

          <div className="flex-1">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <h5 className="text-lg font-bold text-[var(--app-text)]">
                  {quest.title}
                </h5>
                <p
                  className={`text-sm ${
                    isDark ? "text-zinc-400" : "text-gray-600"
                  }`}
                >
                  {quest.desc}
                </p>
              </div>

              <div className="flex-shrink-0 text-right">
                <motion.div
                  animate={{
                    boxShadow:
                      quest.difficulty === "LEGENDARY"
                        ? [
                            "0 0 0px rgba(249,115,22,0)",
                            "0 0 12px rgba(249,115,22,0.7)",
                            "0 0 0px rgba(249,115,22,0)",
                          ]
                        : [
                            "0 0 0px rgba(6,182,212,0)",
                            "0 0 12px rgba(6,182,212,0.7)",
                            "0 0 0px rgba(6,182,212,0)",
                          ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className={`inline-block px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide text-white bg-gradient-to-r ${
                    difficultyColors[quest.difficulty]
                  }`}
                >
                  {quest.difficulty}
                </motion.div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mt-3">
              <p
                className={`text-xs ${isDark ? "text-zinc-500" : "text-gray-600"}`}
              >
                <span className="text-green-400 font-semibold">Role:</span>{" "}
                {quest.role}
              </p>
              <p
                className={`text-xs ${isDark ? "text-zinc-500" : "text-gray-600"}`}
              >
                <span className="text-green-400 font-semibold">Impact:</span>{" "}
                {quest.impact}
              </p>
            </div>

            <div className="mt-3">
              <p className="text-xs font-semibold text-amber-400">
                ⭐ {quest.rewardXP} XP
              </p>
            </div>
          </div>

          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="flex-shrink-0 text-green-400"
          >
            ▼
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`border-t overflow-hidden ${
              isDark ? "border-zinc-700/50" : "border-gray-200/50"
            }`}
          >
            <div className="p-5 space-y-4">
              <p
                className={`text-sm ${isDark ? "text-zinc-300" : "text-gray-700"}`}
              >
                {quest.details?.purpose}
              </p>

              <div>
                <p className="text-xs uppercase tracking-widest text-green-400 mb-3">
                  Features Unlocked
                </p>
                <ul className="grid md:grid-cols-2 gap-2">
                  {quest.details?.features?.map((feature) => (
                    <li
                      key={feature}
                      className={`text-xs px-3 py-2 rounded-lg ${
                        isDark
                          ? "bg-zinc-800/50 text-zinc-300"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      • {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-3">
                <a
                  href={quest.details?.github}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs px-4 py-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition"
                >
                  View Code
                </a>
                <a
                  href={quest.details?.live}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs px-4 py-2 rounded-lg bg-zinc-700/40 text-[var(--app-text)] hover:bg-zinc-700/60 transition"
                >
                  Live Demo
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
