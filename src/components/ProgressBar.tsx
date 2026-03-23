import { motion } from "framer-motion";

interface ProgressBarProps {
  value: number;
  label?: string;
  className?: string;
}

const ProgressBar = ({ value, label, className = "" }: ProgressBarProps) => (
  <div className={className}>
    {label && (
      <div className="mb-1 flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium text-foreground">{value}%</span>
      </div>
    )}
    <div className="h-3 overflow-hidden rounded-full bg-muted">
      <motion.div
        className="h-full rounded-full gradient-primary"
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
    </div>
  </div>
);

export default ProgressBar;
