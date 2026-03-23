import PageTransition from "@/components/PageTransition";
import AnimatedCard from "@/components/AnimatedCard";
import ProgressBar from "@/components/ProgressBar";
import { motion } from "framer-motion";
import { Droplets, Target, TrendingUp, Trash2, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

interface WaterEntry {
  id: string;
  liters: number;
  activity: string | null;
  logged_at: string;
}

const WaterTracker = () => {
  const { user } = useAuth();
  const [usage, setUsage] = useState("");
  const [activity, setActivity] = useState("");
  const [entries, setEntries] = useState<WaterEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchEntries = async () => {
    if (!user) return;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const { data, error } = await supabase
      .from("water_usage")
      .select("id, liters, activity, logged_at")
      .eq("user_id", user.id)
      .gte("logged_at", today.toISOString())
      .order("logged_at", { ascending: true });

    if (!error && data) setEntries(data);
    setLoading(false);
  };

  useEffect(() => { fetchEntries(); }, [user]);

  const handleLog = async () => {
    if (!usage || !user) return;
    setSubmitting(true);
    const { error } = await supabase.from("water_usage").insert({
      user_id: user.id,
      liters: Number(usage),
      activity: activity || null,
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Logged!", description: `${usage}L for ${activity || "general use"} recorded.` });
      setUsage("");
      setActivity("");
      fetchEntries();
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    await supabase.from("water_usage").delete().eq("id", id);
    fetchEntries();
  };

  // Build chart data from entries
  const totalToday = entries.reduce((sum, e) => sum + Number(e.liters), 0);
  const chartData = entries.map((e) => ({
    time: new Date(e.logged_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    liters: Number(e.liters),
  }));

  // Running cumulative for chart
  let cumulative = 0;
  const cumulativeData = chartData.map((d) => {
    cumulative += d.liters;
    return { ...d, cumulative };
  });

  // Category totals for goals
  const categoryTotals: Record<string, number> = {};
  entries.forEach((e) => {
    const cat = (e.activity || "Other").toLowerCase();
    categoryTotals[cat] = (categoryTotals[cat] || 0) + Number(e.liters);
  });

  const goals: Record<string, number> = { shower: 40, kitchen: 30, drinking: 3, garden: 20 };

  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">💧 Water Tracker</h1>
          <p className="text-muted-foreground">Log and monitor your daily water consumption.</p>
        </div>

        {/* Summary strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Today's Total", value: `${totalToday.toFixed(1)}L`, icon: Droplets },
            { label: "Entries Today", value: entries.length.toString(), icon: Calendar },
            { label: "Top Activity", value: Object.keys(categoryTotals).sort((a, b) => categoryTotals[b] - categoryTotals[a])[0] || "—", icon: TrendingUp },
            { label: "Daily Goal", value: `${Math.min(100, Math.round((totalToday / 150) * 100))}%`, icon: Target },
          ].map((s, i) => (
            <AnimatedCard key={s.label} delay={i * 0.05}>
              <div className="flex items-center gap-2">
                <s.icon className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="font-semibold text-foreground capitalize">{s.value}</p>
                </div>
              </div>
            </AnimatedCard>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Input Form */}
          <AnimatedCard>
            <h3 className="font-semibold mb-4 text-foreground">Log Usage</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Liters Used</label>
                <input
                  type="number"
                  value={usage}
                  onChange={(e) => setUsage(e.target.value)}
                  placeholder="e.g. 15"
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Activity</label>
                <select
                  value={activity}
                  onChange={(e) => setActivity(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                >
                  <option value="">Select activity</option>
                  <option value="Shower">Shower</option>
                  <option value="Kitchen">Kitchen</option>
                  <option value="Drinking">Drinking</option>
                  <option value="Garden">Garden</option>
                  <option value="Laundry">Laundry</option>
                  <option value="Cleaning">Cleaning</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <motion.button
                onClick={handleLog}
                disabled={submitting || !usage}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full rounded-lg gradient-primary px-4 py-2.5 font-medium text-primary-foreground shadow-glow transition-shadow disabled:opacity-50"
              >
                <Droplets className="inline h-4 w-4 mr-1" /> {submitting ? "Logging..." : "Log Water"}
              </motion.button>
            </div>
          </AnimatedCard>

          {/* Chart */}
          <AnimatedCard className="lg:col-span-2" delay={0.1}>
            <h3 className="font-semibold mb-4 text-foreground">Today's Consumption</h3>
            {cumulativeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={cumulativeData}>
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
                  <Area type="monotone" dataKey="cumulative" stroke="hsl(199, 89%, 48%)" fill="url(#waterGradient)" strokeWidth={2} name="Total (L)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                No entries yet today. Start logging!
              </div>
            )}
          </AnimatedCard>
        </div>

        {/* Goals & Recent Entries */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <AnimatedCard delay={0.2}>
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-5 w-5 text-secondary" />
              <h3 className="font-semibold text-foreground">Category Goals</h3>
            </div>
            <div className="space-y-3">
              {Object.entries(goals).map(([cat, target]) => {
                const used = categoryTotals[cat] || 0;
                const pct = Math.min(100, Math.round((used / target) * 100));
                return (
                  <ProgressBar key={cat} value={pct} label={`${cat.charAt(0).toUpperCase() + cat.slice(1)} — ${used.toFixed(1)}L / ${target}L`} />
                );
              })}
            </div>
          </AnimatedCard>

          <AnimatedCard delay={0.3}>
            <h3 className="font-semibold mb-3 text-foreground">Today's Log</h3>
            {loading ? (
              <p className="text-muted-foreground text-sm">Loading...</p>
            ) : entries.length === 0 ? (
              <p className="text-muted-foreground text-sm">No entries yet.</p>
            ) : (
              <div className="space-y-2 max-h-[280px] overflow-y-auto">
                {entries.map((e) => (
                  <motion.div
                    key={e.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-4 py-2"
                  >
                    <div>
                      <p className="font-medium text-foreground text-sm">{e.activity || "General"} — {Number(e.liters)}L</p>
                      <p className="text-xs text-muted-foreground">{new Date(e.logged_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                    </div>
                    <button onClick={() => handleDelete(e.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatedCard>
        </div>
      </div>
    </PageTransition>
  );
};

export default WaterTracker;
