import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

export function Counter({ value, label }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const numValue = parseFloat(value);
    const duration = 1.5;
    const steps = 60;
    const increment = numValue / steps;
    let current = 0;
    let step = 0;

    const interval = setInterval(
      () => {
        step++;
        current = Math.min(increment * step, numValue);
        setDisplayValue(current.toFixed(2).replace(/\.?0+$/, ""));

        if (step >= steps) {
          clearInterval(interval);
          setDisplayValue(value);
        }
      },
      (duration * 1000) / steps,
    );

    return () => clearInterval(interval);
  }, [isInView, value]);

  return (
    <motion.div
      ref={ref}
      whileHover={{ y: -6 }}
      className="bg-zinc-900/70 dark:bg-zinc-800/70 backdrop-blur-xl border border-zinc-800 dark:border-zinc-700 rounded-3xl p-6 text-center shadow-xl hover:shadow-[0_0_20px_rgba(34,197,94,0.1)] transition"
    >
      <h3 className="text-4xl font-bold text-green-400">{displayValue}</h3>
      <p className="text-zinc-400 mt-2">{label}</p>
    </motion.div>
  );
}
