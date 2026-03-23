import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface AnimatedCounterProps {
  target: number;
  suffix?: string;
  duration?: number;
  className?: string;
}

const AnimatedCounter = ({ target, suffix = "", duration = 2, className = "" }: AnimatedCounterProps) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = target / (duration * 60);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [target, duration]);

  return (
    <motion.span
      className={`font-bold tabular-nums ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {count.toLocaleString()}{suffix}
    </motion.span>
  );
};

export default AnimatedCounter;
