import PageTransition from "@/components/PageTransition";
import AnimatedCard from "@/components/AnimatedCard";
import { motion } from "framer-motion";
import { Moon, Sun, Bell, Shield, Globe } from "lucide-react";
import { useState } from "react";

const ToggleSwitch = ({ label, icon: Icon, defaultOn = false }: { label: string; icon: any; defaultOn?: boolean }) => {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5 text-muted-foreground" />
        <span className="text-foreground">{label}</span>
      </div>
      <motion.button
        onClick={() => setOn(!on)}
        className={`relative h-7 w-12 rounded-full transition-colors ${on ? "gradient-primary" : "bg-muted"}`}
      >
        <motion.div
          animate={{ x: on ? 22 : 2 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="absolute top-1 h-5 w-5 rounded-full bg-card shadow"
        />
      </motion.button>
    </div>
  );
};

const SettingsPage = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDark = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">⚙️ Settings</h1>
          <p className="text-muted-foreground">Manage your preferences.</p>
        </div>

        <div className="max-w-xl space-y-4">
          <AnimatedCard>
            <h3 className="font-semibold mb-4 text-foreground">Appearance</h3>
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                {darkMode ? <Moon className="h-5 w-5 text-muted-foreground" /> : <Sun className="h-5 w-5 text-muted-foreground" />}
                <span className="text-foreground">Dark Mode</span>
              </div>
              <motion.button
                onClick={toggleDark}
                className={`relative h-7 w-12 rounded-full transition-colors ${darkMode ? "gradient-primary" : "bg-muted"}`}
              >
                <motion.div
                  animate={{ x: darkMode ? 22 : 2 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="absolute top-1 h-5 w-5 rounded-full bg-card shadow"
                />
              </motion.button>
            </div>
          </AnimatedCard>

          <AnimatedCard delay={0.1}>
            <h3 className="font-semibold mb-2 text-foreground">Notifications</h3>
            <ToggleSwitch label="Leak Alerts" icon={Bell} defaultOn />
            <ToggleSwitch label="Daily Tips" icon={Bell} defaultOn />
            <ToggleSwitch label="Weekly Report" icon={Bell} />
          </AnimatedCard>

          <AnimatedCard delay={0.2}>
            <h3 className="font-semibold mb-2 text-foreground">Privacy & Data</h3>
            <ToggleSwitch label="Share Anonymous Data" icon={Shield} />
            <ToggleSwitch label="Location Services" icon={Globe} />
          </AnimatedCard>
        </div>
      </div>
    </PageTransition>
  );
};

export default SettingsPage;
