import PageTransition from "@/components/PageTransition";
import WaveBackground from "@/components/WaveBackground";
import AnimatedCard from "@/components/AnimatedCard";
import AnimatedCounter from "@/components/AnimatedCounter";
import CircularProgress from "@/components/CircularProgress";
import ProgressBar from "@/components/ProgressBar";
import { motion } from "framer-motion";
import { Droplets, TrendingDown, AlertTriangle, Lightbulb } from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts";

const usageData = [
  { day: "Mon", usage: 120, saved: 30 },
  { day: "Tue", usage: 110, saved: 40 },
  { day: "Wed", usage: 95, saved: 55 },
  { day: "Thu", usage: 130, saved: 20 },
  { day: "Fri", usage: 85, saved: 65 },
  { day: "Sat", usage: 100, saved: 50 },
  { day: "Sun", usage: 75, saved: 75 },
];

const tips = [
  "Fix leaky faucets—one drip per second wastes 3,000 gallons/year.",
  "Take 5-minute showers to save up to 25 gallons per shower.",
  "Use a rain barrel to collect water for your garden.",
  "Run dishwashers only when full to save up to 1,000 gallons/month.",
];

const Dashboard = () => {
  const randomTip = tips[Math.floor(Math.random() * tips.length)];

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Hero Banner */}
        <motion.div
          className="relative overflow-hidden rounded-xl gradient-hero p-8 text-primary-foreground"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <WaveBackground />
          <div className="relative z-10">
            <motion.h1
              className="text-3xl font-bold mb-2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Welcome Back! 🌊
            </motion.h1>
            <motion.p
              className="text-primary-foreground/80 max-w-lg"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              You've saved <strong>245 liters</strong> of water this week. Keep up the great work protecting our planet!
            </motion.p>
          </div>
        </motion.div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Droplets, label: "Water Saved", value: 1250, suffix: "L", color: "text-primary" },
            { icon: TrendingDown, label: "Usage Reduced", value: 32, suffix: "%", color: "text-secondary" },
            { icon: AlertTriangle, label: "Leaks Detected", value: 3, suffix: "", color: "text-destructive" },
            { icon: Lightbulb, label: "Tips Applied", value: 18, suffix: "", color: "text-accent" },
          ].map((stat, i) => (
            <AnimatedCard key={stat.label} delay={i * 0.1}>
              <div className="flex items-center gap-3">
                <div className={`rounded-lg p-2.5 bg-muted ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} className="text-2xl" />
                </div>
              </div>
            </AnimatedCard>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <AnimatedCard className="lg:col-span-2" delay={0.2}>
            <h3 className="text-lg font-semibold mb-4 text-foreground">Weekly Water Usage</h3>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={usageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    color: "hsl(var(--foreground))",
                  }}
                />
                <Line type="monotone" dataKey="usage" stroke="hsl(199, 89%, 48%)" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="saved" stroke="hsl(142, 71%, 45%)" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </AnimatedCard>

          <AnimatedCard delay={0.3}>
            <h3 className="text-lg font-semibold mb-4 text-foreground">Water Score</h3>
            <div className="flex flex-col items-center gap-4">
              <CircularProgress value={72} label="Saved" />
              <ProgressBar value={72} label="Monthly Goal" className="w-full" />
              <ProgressBar value={45} label="Community Rank" className="w-full" />
            </div>
          </AnimatedCard>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <AnimatedCard delay={0.4}>
            <h3 className="text-lg font-semibold mb-4 text-foreground">Daily Water Distribution</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={usageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    color: "hsl(var(--foreground))",
                  }}
                />
                <Bar dataKey="usage" fill="hsl(199, 89%, 48%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="saved" fill="hsl(142, 71%, 45%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </AnimatedCard>

          <AnimatedCard delay={0.5}>
            <div className="flex items-start gap-3">
              <motion.div
                className="rounded-lg p-2.5 gradient-primary text-primary-foreground"
                animate={{ rotateY: [0, 180, 360] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 5 }}
              >
                <Lightbulb className="h-5 w-5" />
              </motion.div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Daily Eco Tip 💡</h3>
                <p className="text-muted-foreground mt-2 leading-relaxed">{randomTip}</p>
              </div>
            </div>
            <motion.div
              className="mt-4 rounded-lg bg-destructive/10 border border-destructive/20 p-3 flex items-center gap-2"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <span className="text-sm text-destructive">Unusual usage spike detected in bathroom!</span>
            </motion.div>
          </AnimatedCard>
        </div>
      </div>
    </PageTransition>
  );
};

export default Dashboard;
