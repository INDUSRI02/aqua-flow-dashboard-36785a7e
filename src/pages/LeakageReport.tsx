import PageTransition from "@/components/PageTransition";
import AnimatedCard from "@/components/AnimatedCard";
import { motion } from "framer-motion";
import { Upload, Send, MapPin, AlertTriangle, Clock, CheckCircle2, XCircle } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface Report {
  id: string;
  location: string;
  description: string;
  status: string;
  admin_notes: string | null;
  created_at: string;
}

const statusConfig: Record<string, { color: string; icon: any; label: string }> = {
  pending: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: Clock, label: "Pending" },
  reviewing: { color: "bg-blue-100 text-blue-800 border-blue-200", icon: AlertTriangle, label: "Reviewing" },
  resolved: { color: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle2, label: "Resolved" },
  rejected: { color: "bg-red-100 text-red-800 border-red-200", icon: XCircle, label: "Rejected" },
};

const LeakageReport = () => {
  const { user } = useAuth();
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [severity, setSeverity] = useState("medium");
  const [submitting, setSubmitting] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("leakage_reports")
      .select("id, location, description, status, admin_notes, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (data) setReports(data);
    setLoading(false);
  };

  useEffect(() => { fetchReports(); }, [user]);

  const handleSubmit = async () => {
    if (!location.trim() || !description.trim() || !user) {
      toast({ title: "Missing fields", description: "Please fill in location and description.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("leakage_reports").insert({
      user_id: user.id,
      location: location.trim(),
      description: `[${severity.toUpperCase()}] ${description.trim()}`,
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Report Submitted! 🎉", description: "Our team will review it shortly." });
      setDescription("");
      setLocation("");
      setSeverity("medium");
      fetchReports();
    }
    setSubmitting(false);
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">🚨 Leakage Report</h1>
          <p className="text-muted-foreground">Report water leaks in your area to help save water.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form */}
          <AnimatedCard>
            <h3 className="font-semibold mb-4 text-foreground">Submit a Report</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Building A, Ground Floor"
                    className="w-full rounded-lg border border-input bg-background pl-10 pr-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Severity</label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                >
                  <option value="low">Low — Minor drip</option>
                  <option value="medium">Medium — Steady leak</option>
                  <option value="high">High — Major leak / flooding</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the leak in detail..."
                  rows={4}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                />
              </div>
              <motion.button
                onClick={handleSubmit}
                disabled={submitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full rounded-lg gradient-primary px-4 py-2.5 font-medium text-primary-foreground shadow-glow disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="h-5 w-5 border-2 border-primary-foreground border-t-transparent rounded-full"
                  />
                ) : (
                  <><Send className="h-4 w-4" /> Submit Report</>
                )}
              </motion.button>
            </div>
          </AnimatedCard>

          {/* Previous Reports */}
          <AnimatedCard delay={0.1}>
            <h3 className="font-semibold mb-4 text-foreground">Your Reports</h3>
            {loading ? (
              <p className="text-muted-foreground text-sm">Loading...</p>
            ) : reports.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <AlertTriangle className="h-10 w-10 mb-2 opacity-40" />
                <p>No reports submitted yet.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {reports.map((r, i) => {
                  const sc = statusConfig[r.status] || statusConfig.pending;
                  const Icon = sc.icon;
                  return (
                    <motion.div
                      key={r.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="rounded-lg border border-border p-4 space-y-2"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-foreground text-sm flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {r.location}
                          </p>
                          <p className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</p>
                        </div>
                        <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full border ${sc.color}`}>
                          <Icon className="h-3 w-3" /> {sc.label}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{r.description}</p>
                      {r.admin_notes && (
                        <div className="rounded bg-muted/50 p-2 text-xs text-muted-foreground border-l-2 border-primary">
                          <strong>Admin:</strong> {r.admin_notes}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </AnimatedCard>
        </div>
      </div>
    </PageTransition>
  );
};

export default LeakageReport;
