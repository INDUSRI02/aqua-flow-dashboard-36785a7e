import PageTransition from "@/components/PageTransition";
import AnimatedCard from "@/components/AnimatedCard";
import ProgressBar from "@/components/ProgressBar";
import { motion } from "framer-motion";
import { Droplets, Target, TrendingUp } from "lucide-react";
import { useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

const initialData = [
  { time: "6AM", liters: 5 },
  { time: "9AM", liters: 25 },
  { time: "12PM", liters: 40 },
  { time: "3PM", liters: 55 },
  { time: "6PM", liters: 70 },
  { time: "9PM", liters: 82 },
];

const WaterTracker = () => {
  const [usage, setUsage] = useState("");
  const [activity, setActivity] = useState("");
  const [data, setData] = useState(initialData);
  const [showSuggestion, setShowSuggestion] = useState(false);

  const handleLog = () => {
    if (!usage) return;
    const newPoint = { time: "Now", liters: Number(usage) + (data[data.length - 1]?.liters || 0) };
    setData([...data, newPoint]);
    setShowSuggestion(true);
    setUsage("");
    setActivity("");
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">💧 Water Tracker</h1>
          <p className="text-muted-foreground">Log and monitor your daily water consumption.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Input Form */}
          <AnimatedCard>
            <h3 className="font-semibold mb-4 text-foreground">Log Usage</h3>
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="number"
                  value={usage}
                  onChange={(e) => setUsage(e.target.value)}
                  placeholder=" "
                  className="peer w-full rounded-lg border border-input bg-background px-4 pt-5 pb-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
                <label className="absolute left-4 top-2 text-xs text-muted-foreground peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm transition-all pointer-events-none">
                  Liters Used
                </label>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={activity}
                  onChange={(e) => setActivity(e.target.value)}
                  placeholder=" "
                  className="peer w-full rounded-lg border border-input bg-background px-4 pt-5 pb-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
                <label className="absolute left-4 top-2 text-xs text-muted-foreground peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm transition-all pointer-events-none">
                  Activity (e.g., Shower)
                </label>
              </div>
              <motion.button
                onClick={handleLog}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full rounded-lg gradient-primary px-4 py-2.5 font-medium text-primary-foreground shadow-glow transition-shadow"
              >
                <Droplets className="inline h-4 w-4 mr-1" /> Log Water
              </motion.button>
            </div>
          </AnimatedCard>

          {/* Chart */}
          <AnimatedCard className="lg:col-span-2" delay={0.1}>
            <h3 className="font-semibold mb-4 text-foreground">Today's Consumption</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="waterGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))" }} />
                <Area type="monotone" dataKey="liters" stroke="hsl(199, 89%, 48%)" fill="url(#waterGradient)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </AnimatedCard>
        </div>

        {/* Goals & Suggestions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <AnimatedCard delay={0.2}>
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-5 w-5 text-secondary" />
              <h3 className="font-semibold text-foreground">Daily Goals</h3>
            </div>
            <div className="space-y-3">
              <ProgressBar value={68} label="Shower (target: 40L)" />
              <ProgressBar value={45} label="Kitchen (target: 30L)" />
              <ProgressBar value={82} label="Drinking (target: 3L)" />
              <ProgressBar value={30} label="Garden (target: 20L)" />
            </div>
          </AnimatedCard>

          {showSuggestion && (
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
            >
              <AnimatedCard delay={0.3}>
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="h-5 w-5 text-accent" />
                  <h3 className="font-semibold text-foreground">Smart Suggestions</h3>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Your shower usage is 20% above target — try a low-flow showerhead.</li>
                  <li>• Kitchen usage is on track — great job!</li>
                  <li>• Consider watering your garden in the early morning to reduce evaporation.</li>
                </ul>
              </AnimatedCard>
            </motion.div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default WaterTracker;
