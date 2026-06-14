import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export function ParallaxSection({ children, offset = 50 }) {
  const ref = useRef(null);
  const [yOffset, setYOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        if (rect.top < windowHeight && rect.bottom > 0) {
          const scrollAmount = (windowHeight - rect.top) / windowHeight;
          setYOffset(scrollAmount * offset);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [offset]);

  return (
    <motion.div
      ref={ref}
      animate={{ y: yOffset }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      {children}
    </motion.div>
  );
}
