import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STATS = [
  {
    key: "strength",
    label: "STR",
    fullLabel: "Strength",
    description: "Problem-solving & DSA",
    color: "#ef4444",
  },
  {
    key: "intelligence",
    label: "INT",
    fullLabel: "Intelligence",
    description: "AI/ML & system design",
    color: "#3b82f6",
  },
  {
    key: "dexterity",
    label: "DEX",
    fullLabel: "Dexterity",
    description: "Frontend & UI craft",
    color: "#eab308",
  },
  {
    key: "constitution",
    label: "CON",
    fullLabel: "Constitution",
    description: "Reliability & delivery",
    color: "#22c55e",
  },
];

const SIZE = 220;
const CENTER = SIZE / 2;
const MAX_RADIUS = 80;
const LEVELS = 4;

function polarToXY(angle, radius) {
  const rad = (angle - 90) * (Math.PI / 180);
  return {
    x: CENTER + radius * Math.cos(rad),
    y: CENTER + radius * Math.sin(rad),
  };
}

function buildPolygonPath(values, maxVal = 10) {
  const points = values.map((val, i) => {
    const angle = (360 / values.length) * i;
    const r = (val / maxVal) * MAX_RADIUS;
    return polarToXY(angle, r);
  });
  return (
    points
      .map(
        (p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`,
      )
      .join(" ") + " Z"
  );
}

function useAnimatedPath(targetValues, maxVal = 10) {
  const [currentValues, setCurrentValues] = useState(targetValues);
  const prevRef = useRef(targetValues);
  const frameRef = useRef(null);
  const startRef = useRef(null);
  const DURATION = 600;

  useEffect(() => {
    const from = prevRef.current;
    const to = targetValues;
    if (from.every((v, i) => v === to[i])) return;

    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    startRef.current = null;

    const animate = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const progress = Math.min((ts - startRef.current) / DURATION, 1);
      const eased =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      setCurrentValues(from.map((f, i) => f + (to[i] - f) * eased));

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        prevRef.current = to;
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [targetValues]);

  return currentValues;
}

export function RadarChart({ stats, level }) {
  const statValues = STATS.map((s) => Math.min(10, stats[s.key] ?? 0));
  const animatedValues = useAnimatedPath(statValues);
  const [hovered, setHovered] = useState(null);

  const dataPath = buildPolygonPath(animatedValues);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        <svg
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="overflow-visible"
        >
          {/* Web rings */}
          {Array.from({ length: LEVELS }).map((_, lvl) => {
            const r = ((lvl + 1) / LEVELS) * MAX_RADIUS;
            const points = STATS.map((_, i) => {
              const angle = (360 / STATS.length) * i;
              const p = polarToXY(angle, r);
              return `${p.x},${p.y}`;
            }).join(" ");
            return (
              <polygon
                key={lvl}
                points={points}
                fill="none"
                stroke="rgba(34,197,94,0.12)"
                strokeWidth="1"
              />
            );
          })}

          {/* Axis spokes */}
          {STATS.map((_, i) => {
            const angle = (360 / STATS.length) * i;
            const end = polarToXY(angle, MAX_RADIUS);
            return (
              <line
                key={i}
                x1={CENTER}
                y1={CENTER}
                x2={end.x}
                y2={end.y}
                stroke="rgba(34,197,94,0.15)"
                strokeWidth="1"
              />
            );
          })}

          {/* Filled data polygon */}
          <path
            d={dataPath}
            fill="rgba(34,197,94,0.12)"
            stroke="rgba(34,197,94,0.6)"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />

          {/* Vertex dots */}
          {animatedValues.map((val, i) => {
            const angle = (360 / STATS.length) * i;
            const r = (val / 10) * MAX_RADIUS;
            const p = polarToXY(angle, r);
            const stat = STATS[i];
            const isHovered = hovered === i;

            return (
              <g key={i}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isHovered ? 7 : 4}
                  fill={stat.color}
                  stroke="rgba(0,0,0,0.6)"
                  strokeWidth="1.5"
                  style={{ transition: "r 0.2s ease" }}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  className="cursor-pointer"
                />
                {isHovered && (
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={12}
                    fill={stat.color}
                    fillOpacity={0.15}
                  />
                )}
              </g>
            );
          })}

          {/* Axis labels */}
          {STATS.map((stat, i) => {
            const angle = (360 / STATS.length) * i;
            const labelR = MAX_RADIUS + 22;
            const p = polarToXY(angle, labelR);

            return (
              <text
                key={i}
                x={p.x}
                y={p.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="11"
                fontWeight="700"
                fontFamily="monospace"
                fill={hovered === i ? stat.color : "rgba(255,255,255,0.7)"}
                style={{ transition: "fill 0.2s ease" }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                className="cursor-pointer select-none"
              >
                {stat.label}
              </text>
            );
          })}

          {/* Center level display */}
          <text
            x={CENTER}
            y={CENTER - 8}
            textAnchor="middle"
            fontSize="18"
            fontWeight="700"
            fontFamily="monospace"
            fill="#22c55e"
          >
            {level}
          </text>
          <text
            x={CENTER}
            y={CENTER + 10}
            textAnchor="middle"
            fontSize="9"
            fontFamily="monospace"
            fill="rgba(34,197,94,0.5)"
            letterSpacing="2"
          >
            LEVEL
          </text>
        </svg>
      </div>

      {/* Stat legend */}
      <div className="grid grid-cols-2 gap-3 w-full">
        {STATS.map((stat, i) => {
          const val = animatedValues[i];
          const isHovered = hovered === i;

          return (
            <motion.div
              key={stat.key}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              animate={{ scale: isHovered ? 1.02 : 1 }}
              transition={{ duration: 0.15 }}
              className="rounded-xl border px-3 py-2 cursor-pointer transition"
              style={{
                borderColor: isHovered
                  ? `${stat.color}60`
                  : "rgba(39,39,42,0.8)",
                background: isHovered
                  ? `${stat.color}10`
                  : "rgba(24,24,27,0.6)",
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className="text-[10px] font-bold uppercase tracking-widest font-mono"
                  style={{ color: stat.color }}
                >
                  {stat.label}
                </span>
                <span
                  className="text-xs font-bold font-mono"
                  style={{ color: stat.color }}
                >
                  {val.toFixed(1)}
                </span>
              </div>
              <p className="text-[10px] text-zinc-500 leading-tight">
                {stat.description}
              </p>
              {/* Mini bar */}
              <div className="mt-2 h-[2px] rounded-full bg-zinc-800 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${(val / 10) * 100}%`,
                    background: stat.color,
                  }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {hovered !== null && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="text-center"
          >
            <p
              className="text-sm font-semibold"
              style={{ color: STATS[hovered].color }}
            >
              {STATS[hovered].fullLabel}
            </p>
            <p className="text-xs text-zinc-500">
              {STATS[hovered].description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
