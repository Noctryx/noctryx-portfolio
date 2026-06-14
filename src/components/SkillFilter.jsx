import { useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { SKILL_DETAILS } from "../utils/rpgData";

const PROFICIENCY_COLORS = {
  Expert: { bar: "#22c55e", glow: "rgba(34,197,94,0.4)" },
  Advanced: { bar: "#3b82f6", glow: "rgba(59,130,246,0.4)" },
  Strong: { bar: "#eab308", glow: "rgba(234,179,8,0.4)" },
};

function getProficiencyColor(proficiency) {
  return (
    PROFICIENCY_COLORS[proficiency] ?? {
      bar: "#6b7280",
      glow: "rgba(107,114,128,0.3)",
    }
  );
}

function SkillBar({
  skill,
  detail,
  isActive,
  isHovered,
  onClick,
  onMouseEnter,
  onMouseLeave,
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const { bar, glow } = getProficiencyColor(detail.proficiency);
  const level = detail.level ?? 0;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={`w-full rounded-2xl border px-3 pt-2 pb-3 text-left transition ${
          isActive
            ? "border-green-400 bg-green-400/10 text-green-300"
            : "border-transparent bg-white/5 hover:border-green-400/40 hover:bg-green-400/5"
        }`}
        style={{
          boxShadow: isHovered ? `0 0 12px ${glow}` : "none",
          transition: "box-shadow 0.2s ease, border-color 0.2s ease",
        }}
      >
        {/* Top row: name + proficiency */}
        <div className="flex items-center justify-between gap-3 mb-2">
          <span className="font-medium text-sm">{skill}</span>
          <span
            className="text-[9px] uppercase tracking-widest font-bold px-1.5 py-0.5 rounded"
            style={{
              color: bar,
              background: `${bar}18`,
              border: `1px solid ${bar}30`,
            }}
          >
            {detail.proficiency}
          </span>
        </div>

        {/* XP bar */}
        <div className="relative h-[3px] rounded-full overflow-hidden bg-white/8">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: inView ? `${level}%` : 0 }}
            transition={{
              duration: 1.1,
              ease: [0.34, 1.56, 0.64, 1],
              delay: 0.1,
            }}
            className="absolute inset-y-0 left-0 rounded-full"
            style={{ background: bar }}
          />
          {/* Shimmer on fill */}
          {inView && (
            <motion.div
              initial={{ x: "-100%", opacity: 0.6 }}
              animate={{ x: `${level * 1.4}%`, opacity: 0 }}
              transition={{ duration: 0.9, delay: 0.15, ease: "easeOut" }}
              className="absolute inset-y-0 w-8 rounded-full"
              style={{
                background: `linear-gradient(90deg, transparent, ${bar}90, transparent)`,
              }}
            />
          )}
        </div>

        {/* Level % — only visible on hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.15 }}
              className="text-[9px] uppercase tracking-widest mt-1 overflow-hidden"
              style={{ color: bar }}
            >
              Level {level}%
            </motion.p>
          )}
        </AnimatePresence>
      </button>

      {/* Hover tooltip */}
      <AnimatePresence>
        {isHovered && detail.usedIn && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            className="pointer-events-none absolute left-0 top-full z-20 mt-2 w-64 rounded-2xl border border-green-400/30 bg-zinc-950/95 p-4 text-xs shadow-2xl backdrop-blur-xl"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold" style={{ color: bar }}>
                {skill}
              </p>
              <span
                className="text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded font-bold"
                style={{ color: bar, background: `${bar}18` }}
              >
                {level}%
              </span>
            </div>
            <p className="text-zinc-300 mb-2 leading-relaxed">
              {detail.usedIn}
            </p>
            {/* Mini bar in tooltip */}
            <div className="h-[2px] rounded-full bg-zinc-800 overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ width: `${level}%`, background: bar }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function SkillFilter({
  skills,
  selectedSkill,
  onSelectSkill,
  selectedClass,
}) {
  const [hoveredSkill, setHoveredSkill] = useState(null);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-4 mb-5">
        <div>
          <p className="text-xs uppercase tracking-widest text-green-400 mb-1">
            Skill Inventory
          </p>
          <p className="text-sm text-[var(--app-text-muted)]">
            Hover for usage notes · click to filter the quest log
          </p>
          {selectedClass?.name && (
            <p className="text-xs uppercase tracking-widest text-zinc-500 mt-2">
              Tuned for {selectedClass.name}
            </p>
          )}
        </div>

        {selectedSkill && (
          <button
            type="button"
            onClick={() => onSelectSkill(null)}
            className="text-xs uppercase tracking-widest text-[var(--app-text-muted)] hover:text-green-400 transition"
          >
            Clear
          </button>
        )}
      </div>

      {/* Selected skill callout */}
      {selectedSkill && SKILL_DETAILS[selectedSkill] && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 rounded-2xl border border-green-400/30 bg-green-400/10 p-4"
        >
          <div className="flex items-center justify-between mb-1">
            <p className="text-green-400 font-semibold">{selectedSkill}</p>
            <span className="text-xs text-green-400/70 font-mono uppercase tracking-widest">
              {SKILL_DETAILS[selectedSkill].level}%
            </span>
          </div>
          <p className="text-sm text-[var(--app-text)] mb-2">
            {SKILL_DETAILS[selectedSkill].usedIn}
          </p>
          <div className="h-[2px] rounded-full bg-white/10 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${SKILL_DETAILS[selectedSkill].level}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full rounded-full bg-green-400"
            />
          </div>
          <p className="text-xs uppercase tracking-widest text-zinc-400 mt-2">
            Proficiency: {SKILL_DETAILS[selectedSkill].proficiency}
          </p>
        </motion.div>
      )}

      {/* Skill group cards */}
      <div className="grid md:grid-cols-4 gap-6">
        {skills.map((group, groupIdx) => (
          <motion.div
            key={group.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: groupIdx * 0.08 }}
            whileHover={{ y: -8 }}
            className="bg-[var(--app-surface)] dark:bg-zinc-800/70 rounded-3xl p-6 border border-[var(--app-border)] dark:border-zinc-700 shadow-xl hover:shadow-[0_0_20px_rgba(34,197,94,0.1)] transition"
          >
            <h3 className="text-green-400 font-semibold mb-4 flex items-center gap-2">
              <span>{group.icon}</span>
              <span>{group.label}</span>
            </h3>

            <div className="space-y-3">
              {group.skills.map((skill) => {
                const detail = SKILL_DETAILS[skill] ?? {};
                return (
                  <SkillBar
                    key={skill}
                    skill={skill}
                    detail={detail}
                    isActive={selectedSkill === skill}
                    isHovered={hoveredSkill === skill}
                    onClick={() =>
                      onSelectSkill(selectedSkill === skill ? null : skill)
                    }
                    onMouseEnter={() => setHoveredSkill(skill)}
                    onMouseLeave={() => setHoveredSkill(null)}
                  />
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
