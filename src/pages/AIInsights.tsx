import PageTransition from "@/components/PageTransition";
import AnimatedCard from "@/components/AnimatedCard";
import { motion } from "framer-motion";
import { Brain, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

const predictionData = [
  { month: "Jan", actual: 3200, predicted: 3100 },
  { month: "Feb", actual: 2800, predicted: 2900 },
  { month: "Mar", actual: 3500, predicted: 3300 },
  { month: "Apr", actual: null, predicted: 2700 },
  { month: "May", actual: null, predicted: 2400 },
  { month: "Jun", actual: null, predicted: 2100 },
];

const risks = [
  { label: "Kitchen Pipe", level: "low", color: "bg-secondary" },
  { label: "Bathroom Faucet", level: "medium", color: "bg-yellow-500" },
  { label: "Garden Hose", level: "high", color: "bg-destructive" },
  { label: "Main Line", level: "low", color: "bg-secondary" },
];

const suggestions = [
  { icon: CheckCircle, title: "Install Smart Meter", desc: "Reduce wastage by 25% with real-time monitoring." },
  { icon: TrendingUp, title: "Optimize Irrigation", desc: "Switch to drip irrigation for 40% water savings." },
  { icon: AlertCircle, title: "Fix Bathroom Leak", desc: "Potential saving of 15L/day by fixing the faucet." },
];

const AIInsights = () => (
  <PageTransition>
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">🧠 AI Insights</h1>
        <p className="text-muted-foreground">AI-powered predictions and recommendations.</p>
      </div>

      {/* Prediction Chart */}
      <AnimatedCard>
        <h3 className="font-semibold mb-4 text-foreground">Usage Prediction (Liters)</h3>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={predictionData}>
            <defs>
              <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="predictGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))" }} />
            <Area type="monotone" dataKey="actual" stroke="hsl(199, 89%, 48%)" fill="url(#actualGrad)" strokeWidth={2} />
            <Area type="monotone" dataKey="predicted" stroke="hsl(142, 71%, 45%)" fill="url(#predictGrad)" strokeWidth={2} strokeDasharray="5 5" />
          </AreaChart>
        </ResponsiveContainer>
      </AnimatedCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Risk Indicators */}
        <AnimatedCard delay={0.1}>
          <h3 className="font-semibold mb-4 text-foreground flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-accent" /> Risk Assessment
          </h3>
          <div className="space-y-3">
            {risks.map((risk, i) => (
              <motion.div
                key={risk.label}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 * i }}
                className="flex items-center justify-between rounded-lg border border-border p-3"
              >
                <span className="text-foreground">{risk.label}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium text-primary-foreground ${risk.color}`}>
                  {risk.level}
                </span>
              </motion.div>
            ))}
          </div>
        </AnimatedCard>

        {/* Suggestions */}
        <AnimatedCard delay={0.2}>
          <h3 className="font-semibold mb-4 text-foreground flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" /> AI Recommendations
          </h3>
          <div className="space-y-3">
            {suggestions.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 * i }}
                whileHover={{ scale: 1.02, boxShadow: "var(--shadow-glow)" }}
                className="rounded-lg border border-border p-3 flex items-start gap-3 cursor-pointer transition-colors"
              >
                <s.icon className="h-5 w-5 text-secondary mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-foreground">{s.title}</p>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatedCard>
      </div>
    </div>
  </PageTransition>
);

export default AIInsights;
