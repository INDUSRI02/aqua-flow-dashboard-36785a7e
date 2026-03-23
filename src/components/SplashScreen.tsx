import { motion, AnimatePresence } from "framer-motion";
import { Waves, Droplets } from "lucide-react";

interface SplashScreenProps {
  show: boolean;
}

const SplashScreen = ({ show }: SplashScreenProps) => (
  <AnimatePresence>
    {show && (
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center gradient-hero"
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-center gap-4"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Waves className="h-16 w-16 text-primary-foreground" />
          </motion.div>
          <h1 className="text-4xl font-bold text-primary-foreground">AquaSave</h1>
          <p className="text-primary-foreground/80 text-sm">Water Conservation Awareness System</p>
          <motion.div className="flex gap-2 mt-6">
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
              >
                <Droplets className="h-5 w-5 text-primary-foreground/70" />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default SplashScreen;
