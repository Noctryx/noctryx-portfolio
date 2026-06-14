import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BOOT_LINES = [
  {
    text: "> INITIALIZING NOCTRYX SYSTEM...",
    delay: 0,
    color: "text-zinc-500",
  },
  { text: "> LOADING ADVENTURER DATA...", delay: 600, color: "text-zinc-500" },
  {
    text: "> CLASS: GENERALIST DETECTED",
    delay: 1300,
    color: "text-green-400",
  },
  { text: "> SKILLS: 16 UNLOCKED", delay: 1900, color: "text-green-400" },
  {
    text: "> ACHIEVEMENTS: 8 / 8 EARNED",
    delay: 2500,
    color: "text-green-400",
  },
  {
    text: "> XP THRESHOLD: ████████████ EXCEEDED",
    delay: 3100,
    color: "text-amber-400",
  },
  {
    text: "> WARNING: HIGH-LEVEL ADVENTURER DETECTED",
    delay: 3900,
    color: "text-red-400",
  },
  { text: "> LOADING PORTFOLIO...", delay: 4700, color: "text-zinc-400" },
];

const HERO_APPEAR_DELAY = 5400;
const SKIP_ENABLE_DELAY = 800;

export function BossIntro({ onComplete }) {
  const [visibleLines, setVisibleLines] = useState([]);
  const [showHero, setShowHero] = useState(false);
  const [skippable, setSkippable] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [scanline, setScanline] = useState(0);

  const finish = useCallback(() => {
    if (exiting) return;
    setExiting(true);
    setTimeout(() => onComplete(), 700);
  }, [exiting, onComplete]);

  useEffect(() => {
    const skipTimer = setTimeout(() => setSkippable(true), SKIP_ENABLE_DELAY);
    return () => clearTimeout(skipTimer);
  }, []);

  useEffect(() => {
    const timers = BOOT_LINES.map((line, idx) =>
      setTimeout(() => {
        setVisibleLines((prev) => [...prev, idx]);
      }, line.delay),
    );

    const heroTimer = setTimeout(() => setShowHero(true), HERO_APPEAR_DELAY);
    const autoFinish = setTimeout(() => finish(), HERO_APPEAR_DELAY + 2200);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(heroTimer);
      clearTimeout(autoFinish);
    };
  }, [finish]);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanline((prev) => (prev + 1) % 100);
    }, 16);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleKey = (e) => {
      if (skippable) finish();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [skippable, finish]);

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          key="boss-intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.6, ease: "easeIn" }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: "#000000" }}
          onClick={() => skippable && finish()}
        >
          {/* Scanline overlay */}
          <div
            className="pointer-events-none absolute inset-0 z-10"
            style={{
              background: `linear-gradient(transparent ${scanline}%, rgba(34,197,94,0.015) ${scanline}%, rgba(34,197,94,0.015) ${scanline + 2}%, transparent ${scanline + 2}%)`,
            }}
          />

          {/* Vignette */}
          <div
            className="pointer-events-none absolute inset-0 z-10"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.85) 100%)",
            }}
          />

          {/* Grid lines */}
          <div
            className="pointer-events-none absolute inset-0 z-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(34,197,94,1) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,1) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />

          <div className="relative z-20 w-full max-w-2xl px-8">
            {/* Top bar */}
            <div className="mb-8 flex items-center gap-3 border-b border-green-400/20 pb-4">
              <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[10px] uppercase tracking-[0.4em] text-green-400/60 font-mono">
                NOCTRYX OS v2.0 — SYSTEM BOOT
              </span>
              <div className="ml-auto text-[10px] text-zinc-600 font-mono">
                {new Date().toLocaleDateString("en-GB")}
              </div>
            </div>

            {/* Terminal lines */}
            <div className="space-y-2 font-mono text-sm min-h-[200px]">
              {BOOT_LINES.map((line, idx) => (
                <AnimatePresence key={idx}>
                  {visibleLines.includes(idx) && (
                    <motion.div
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className={`leading-relaxed ${line.color}`}
                    >
                      <TypingLine text={line.text} />
                    </motion.div>
                  )}
                </AnimatePresence>
              ))}

              {/* Blinking cursor */}
              {visibleLines.length < BOOT_LINES.length && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="inline-block w-2 h-4 bg-green-400 align-middle"
                />
              )}
            </div>

            {/* Hero reveal */}
            <AnimatePresence>
              {showHero && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="mt-10 border-t border-green-400/20 pt-8"
                >
                  <p className="text-[10px] uppercase tracking-[0.5em] text-green-400/60 mb-3 font-mono">
                    ADVENTURER IDENTIFIED
                  </p>
                  <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-1">
                    P Venkata Srinivas
                  </h1>
                  <p className="text-green-400 text-sm tracking-[0.3em] uppercase font-mono">
                    ⚔ Generalist · Full Stack · AI Builder
                  </p>

                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                    className="mt-6 h-[2px] bg-gradient-to-r from-green-400 via-emerald-400 to-transparent origin-left"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Skip hint */}
            <AnimatePresence>
              {skippable && !showHero && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-8 text-[10px] uppercase tracking-[0.4em] text-zinc-600 font-mono text-center"
                >
                  Press any key or click to skip
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function TypingLine({ text }) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(interval);
    }, 18);
    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayed}</span>;
}
