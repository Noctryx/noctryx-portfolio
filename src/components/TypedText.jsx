import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function TypedText({ text, className, delay = 0 }) {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (delay > 0) {
      const delayTimer = setTimeout(() => {
        let currentIndex = 0;
        const interval = setInterval(() => {
          if (currentIndex <= text.length) {
            setDisplayedText(text.substring(0, currentIndex));
            currentIndex++;
          } else {
            clearInterval(interval);
            setIsComplete(true);
          }
        }, 50);
        return () => clearInterval(interval);
      }, delay);
      return () => clearTimeout(delayTimer);
    } else {
      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex <= text.length) {
          setDisplayedText(text.substring(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(interval);
          setIsComplete(true);
        }
      }, 50);
      return () => clearInterval(interval);
    }
  }, [text, delay]);

  return (
    <span className={className}>
      {displayedText}
      {!isComplete && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="inline-block"
        >
          |
        </motion.span>
      )}
    </span>
  );
}
