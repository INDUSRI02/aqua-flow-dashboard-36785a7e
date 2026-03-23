import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

const AnimatedCard = ({ children, className = "", delay = 0 }: AnimatedCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ scale: 1.03, boxShadow: "var(--shadow-glow)" }}
    className={`rounded-lg border border-border bg-card p-6 transition-colors ${className}`}
  >
    {children}
  </motion.div>
);

export default AnimatedCard;
