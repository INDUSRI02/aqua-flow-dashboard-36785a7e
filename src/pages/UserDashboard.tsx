import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Edit2, Save, X, Droplets, FileText, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import PageTransition from "@/components/PageTransition";
import AnimatedCard from "@/components/AnimatedCard";
import AnimatedCounter from "@/components/AnimatedCounter";

const UserDashboard = () => {
  const { user, profile, signOut } = useAuth();
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState(profile?.display_name || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [saving, setSaving] = useState(false);

  // Stats
  const [waterTotal, setWaterTotal] = useState(0);
  const [reportCount, setReportCount] = useState(0);
  const [quizBest, setQuizBest] = useState<{ score: number; total: number } | null>(null);

  useEffect(() => {
    if (!user) return;
    // Fetch summary stats
    const fetchStats = async () => {
      const [{ data: water }, { data: reps }, { data: quiz }] = await Promise.all([
        supabase.from("water_usage").select("liters").eq("user_id", user.id),
        supabase.from("leakage_reports").select("id").eq("user_id", user.id),
        supabase.from("quiz_results").select("score, total").eq("user_id", user.id).order("score", { ascending: false }).limit(1),
      ]);
      if (water) setWaterTotal(water.reduce((s, w) => s + Number(w.liters), 0));
      if (reps) setReportCount(reps.length);
      if (quiz && quiz.length > 0) setQuizBest(quiz[0]);
    };
    fetchStats();
  }, [user]);

  useEffect(() => {
    setDisplayName(profile?.display_name || "");
    setBio(profile?.bio || "");
  }, [profile]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ display_name: displayName, bio })
      .eq("user_id", user.id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Profile updated!" });
      setEditing(false);
    }
    setSaving(false);
  };

  return (
    <PageTransition>
      <div className="space-y-6 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="gradient-hero rounded-2xl p-8 text-primary-foreground"
        >
          <h1 className="text-3xl font-bold">Welcome, {profile?.display_name || "User"}! 👋</h1>
          <p className="mt-2 opacity-80">Here's your personal dashboard</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Water Logged", value: Math.round(waterTotal), suffix: "L", icon: Droplets, color: "text-primary" },
            { label: "Reports Filed", value: reportCount, suffix: "", icon: FileText, color: "text-secondary" },
            { label: "Best Quiz", value: quizBest ? quizBest.score : 0, suffix: quizBest ? `/${quizBest.total}` : "", icon: Trophy, color: "text-accent" },
          ].map((s, i) => (
            <AnimatedCard key={s.label} delay={i * 0.1}>
              <div className="flex items-center gap-2">
                <s.icon className={`h-5 w-5 ${s.color}`} />
                <div>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="font-bold text-foreground"><AnimatedCounter target={s.value} suffix={s.suffix} /></p>
                </div>
              </div>
            </AnimatedCard>
          ))}
        </div>

        {/* Profile */}
        <AnimatedCard delay={0.2}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" /> Profile Details
              </CardTitle>
              {!editing ? (
                <Button size="sm" variant="outline" onClick={() => setEditing(true)}>
                  <Edit2 className="h-4 w-4 mr-1" /> Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSave} disabled={saving} className="gradient-primary">
                    <Save className="h-4 w-4 mr-1" /> Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setEditing(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={user?.email || ""} disabled className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label>Display Name</Label>
                <Input
                  value={editing ? displayName : (profile?.display_name || "")}
                  onChange={e => setDisplayName(e.target.value)}
                  disabled={!editing}
                  className={!editing ? "bg-muted" : ""}
                />
              </div>
              <div className="space-y-2">
                <Label>Bio</Label>
                <Textarea
                  value={editing ? bio : (profile?.bio || "")}
                  onChange={e => setBio(e.target.value)}
                  disabled={!editing}
                  className={!editing ? "bg-muted" : ""}
                  placeholder="Tell us about yourself..."
                />
              </div>
            </CardContent>
          </Card>
        </AnimatedCard>
      </div>
    </PageTransition>
  );
};

export default UserDashboard;
