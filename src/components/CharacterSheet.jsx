import { motion } from "framer-motion";
import { CLASSES } from "../utils/rpgData";

export const CharacterSheet = ({ isDark, selectedClass }) => {
  const selectedBuild = CLASSES[selectedClass] ?? CLASSES.GENERALIST;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6 }}
      className={`rounded-3xl p-8 md:p-10 border backdrop-blur-xl ${
        isDark
          ? "bg-zinc-900/70 border-zinc-800/50"
          : "bg-white/80 border-green-200/30"
      }`}
    >
      {/* Character Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-green-400 tracking-[0.3em] mb-3 text-xs uppercase">
              📜 Character Sheet
            </p>
            <p
              className={`text-lg mt-2 ${isDark ? "text-zinc-400" : "text-gray-600"}`}
            >
              "Primary Generalist build with focused specialization paths."
            </p>
          </div>
        </div>

        <div className="mb-6 rounded-2xl border border-green-400/20 bg-green-400/10 p-4">
          <p className="text-sm uppercase tracking-widest text-green-400 mb-2">
            🎭 Active Build
          </p>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{selectedBuild.icon}</span>
            <div>
              <p className="text-base font-semibold text-[var(--app-text)]">
                {selectedBuild.name}
              </p>
              <p className="text-xs uppercase tracking-[0.3em] text-green-400/80">
                Selected in the hero
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Class Description */}
      <div
        className={`p-4 rounded-2xl border mb-8 ${
          isDark
            ? "bg-zinc-800/30 border-zinc-700/50"
            : "bg-green-50/30 border-green-200/30"
        }`}
      >
        <p className="text-sm">
          <span className="font-semibold text-green-400">
            {CLASSES[selectedClass].name}:
          </span>{" "}
          <span className={isDark ? "text-zinc-300" : "text-gray-700"}>
            {selectedClass === "GENERALIST"
              ? `${CLASSES[selectedClass].description} This is the core build; specializations can branch from here.`
              : `${CLASSES[selectedClass].description} This skill enhances the generalist's capabilities in specific areas, allowing for more focused development and project execution.`}
          </span>
        </p>
      </div>

      {/* Character Info Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className={`p-5 rounded-2xl border ${
            isDark
              ? "bg-zinc-800/30 border-zinc-700/50"
              : "bg-gray-50/50 border-gray-200/50"
          }`}
        >
          <p className="text-xs uppercase tracking-widest text-green-400 mb-3">
            📚 Core Stats
          </p>
          <div className="space-y-2 text-sm">
            <p>
              <span className="text-green-400">Education:</span> B.Tech CSE (AI)
              @ Pydah College
            </p>
            <p>
              <span className="text-green-400">Year:</span> 2nd Year (2024 -
              2028)
            </p>
            <p>
              <span className="text-green-400">CGPA:</span> 8.65 / 10
            </p>
            <p>
              <span className="text-green-400">Role:</span> Student Developer
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className={`p-5 rounded-2xl border ${
            isDark
              ? "bg-zinc-800/30 border-zinc-700/50"
              : "bg-gray-50/50 border-gray-200/50"
          }`}
        >
          <p className="text-xs uppercase tracking-widest text-green-400 mb-3">
            ⚔️ Combat Ready
          </p>
          <div className="space-y-2 text-sm">
            <p>
              <span className="text-green-400">Specialties:</span> Full Stack +
              AI/ML
            </p>
            <p>
              <span className="text-green-400">Shipping Status:</span> 3+
              Projects Deployed
            </p>
            <p>
              <span className="text-green-400">Experience:</span> 6 Months
              Internship
            </p>
            <p>
              <span className="text-green-400">Achievements:</span> 5 Major
              Unlocked
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
