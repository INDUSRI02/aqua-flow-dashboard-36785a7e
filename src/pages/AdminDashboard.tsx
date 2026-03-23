import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Search, Trash2, Shield, BarChart3, UserCheck, FileText, HelpCircle, Plus, ChevronDown, CheckCircle2, Clock, XCircle, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import PageTransition from "@/components/PageTransition";
import AnimatedCard from "@/components/AnimatedCard";
import AnimatedCounter from "@/components/AnimatedCounter";

interface UserData {
  user_id: string;
  display_name: string | null;
  created_at: string;
  roles: string[];
}

interface ReportData {
  id: string;
  location: string;
  description: string;
  status: string;
  admin_notes: string | null;
  created_at: string;
  user_id: string;
  user_name?: string;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_index: number;
  category: string | null;
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [reports, setReports] = useState<ReportData[]>([]);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // New question form
  const [newQ, setNewQ] = useState("");
  const [newOpts, setNewOpts] = useState(["", "", "", ""]);
  const [newCorrect, setNewCorrect] = useState(0);
  const [newCategory, setNewCategory] = useState("general");

  const fetchAll = async () => {
    setLoading(true);
    const [{ data: profiles }, { data: roles }, { data: reps }, { data: qs }] = await Promise.all([
      supabase.from("profiles").select("user_id, display_name, created_at"),
      supabase.from("user_roles").select("user_id, role"),
      supabase.from("leakage_reports").select("*").order("created_at", { ascending: false }),
      supabase.from("quiz_questions").select("*").order("created_at", { ascending: false }),
    ]);

    if (profiles) {
      const mapped = profiles.map(p => ({
        ...p,
        roles: roles?.filter(r => r.user_id === p.user_id).map(r => r.role) || [],
      }));
      setUsers(mapped);

      // Attach user names to reports
      const nameMap: Record<string, string> = {};
      profiles.forEach(p => { nameMap[p.user_id] = p.display_name || "User"; });
      
      if (reps) {
        setReports(reps.map(r => ({ ...r, user_name: nameMap[r.user_id] || "Unknown" })));
      }
    }

    if (qs) {
      setQuestions(qs.map(q => ({
        ...q,
        options: Array.isArray(q.options) ? q.options as string[] : JSON.parse(q.options as any),
      })));
    }

    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const handleDeleteUser = async (userId: string) => {
    if (userId === user?.id) {
      toast({ title: "Error", description: "Cannot delete your own account", variant: "destructive" });
      return;
    }
    await supabase.from("profiles").delete().eq("user_id", userId);
    toast({ title: "User removed" });
    fetchAll();
  };

  const handleUpdateReportStatus = async (reportId: string, status: string, notes?: string) => {
    const update: any = { status };
    if (notes !== undefined) update.admin_notes = notes;
    await supabase.from("leakage_reports").update(update).eq("id", reportId);
    toast({ title: "Report updated" });
    fetchAll();
  };

  const handleDeleteReport = async (id: string) => {
    await supabase.from("leakage_reports").delete().eq("id", id);
    toast({ title: "Report deleted" });
    fetchAll();
  };

  const handleAddQuestion = async () => {
    if (!newQ.trim() || newOpts.some(o => !o.trim())) {
      toast({ title: "Please fill all fields", variant: "destructive" });
      return;
    }
    const { error } = await supabase.from("quiz_questions").insert({
      question: newQ.trim(),
      options: newOpts.map(o => o.trim()),
      correct_index: newCorrect,
      category: newCategory,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Question added!" });
      setNewQ("");
      setNewOpts(["", "", "", ""]);
      setNewCorrect(0);
      fetchAll();
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    await supabase.from("quiz_questions").delete().eq("id", id);
    toast({ title: "Question deleted" });
    fetchAll();
  };

  const filtered = users.filter(u =>
    u.display_name?.toLowerCase().includes(search.toLowerCase()) ||
    u.user_id.toLowerCase().includes(search.toLowerCase())
  );

  const totalUsers = users.length;
  const adminCount = users.filter(u => u.roles.includes("admin")).length;
  const pendingReports = reports.filter(r => r.status === "pending").length;

  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage users, reports, and quiz content</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Users", value: totalUsers, icon: Users, color: "text-primary" },
            { label: "Regular Users", value: totalUsers - adminCount, icon: UserCheck, color: "text-secondary" },
            { label: "Admins", value: adminCount, icon: Shield, color: "text-accent" },
            { label: "Pending Reports", value: pendingReports, icon: FileText, color: "text-destructive" },
          ].map((s, i) => (
            <AnimatedCard key={s.label} delay={i * 0.05}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">{s.label}</CardTitle>
                  <s.icon className={`h-5 w-5 ${s.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold"><AnimatedCounter target={s.value} /></div>
                </CardContent>
              </Card>
            </AnimatedCard>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="reports">Reports ({reports.length})</TabsTrigger>
            <TabsTrigger value="quiz">Quiz ({questions.length})</TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5" /> User Management</CardTitle>
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtered.map((u, i) => (
                        <motion.tr key={u.user_id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.03 }} className="border-b transition-colors hover:bg-muted/50">
                          <TableCell className="font-medium">{u.display_name || "Unnamed"}</TableCell>
                          <TableCell>
                            {u.roles.map(r => (
                              <Badge key={r} variant={r === "admin" ? "default" : "secondary"} className="mr-1">{r}</Badge>
                            ))}
                          </TableCell>
                          <TableCell>{new Date(u.created_at).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            {!u.roles.includes("admin") && (
                              <Button size="sm" variant="destructive" onClick={() => handleDeleteUser(u.user_id)}>
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            )}
                          </TableCell>
                        </motion.tr>
                      ))}
                      {filtered.length === 0 && (
                        <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">No users found</TableCell></TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" /> Leakage Reports</CardTitle>
              </CardHeader>
              <CardContent>
                {reports.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No reports submitted yet.</p>
                ) : (
                  <div className="space-y-4">
                    {reports.map((r, i) => (
                      <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="rounded-lg border border-border p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-foreground">{r.location}</p>
                            <p className="text-xs text-muted-foreground">By {r.user_name} • {new Date(r.created_at).toLocaleDateString()}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <select
                              value={r.status}
                              onChange={(e) => handleUpdateReportStatus(r.id, e.target.value)}
                              className="text-xs rounded border border-input bg-background px-2 py-1 text-foreground"
                            >
                              <option value="pending">Pending</option>
                              <option value="reviewing">Reviewing</option>
                              <option value="resolved">Resolved</option>
                              <option value="rejected">Rejected</option>
                            </select>
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteReport(r.id)}>
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{r.description}</p>
                        <div className="flex gap-2">
                          <input
                            placeholder="Add admin note..."
                            defaultValue={r.admin_notes || ""}
                            onBlur={(e) => {
                              if (e.target.value !== (r.admin_notes || "")) {
                                handleUpdateReportStatus(r.id, r.status, e.target.value);
                              }
                            }}
                            className="flex-1 text-sm rounded border border-input bg-background px-3 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quiz Tab */}
          <TabsContent value="quiz">
            <div className="space-y-4">
              {/* Add Question */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Plus className="h-5 w-5" /> Add Question</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Question</label>
                    <Input value={newQ} onChange={e => setNewQ(e.target.value)} placeholder="Enter question..." />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {newOpts.map((opt, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="correct"
                          checked={newCorrect === i}
                          onChange={() => setNewCorrect(i)}
                          className="accent-primary"
                        />
                        <Input
                          value={opt}
                          onChange={e => { const n = [...newOpts]; n[i] = e.target.value; setNewOpts(n); }}
                          placeholder={`Option ${i + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">Select the radio button next to the correct answer.</p>
                  <div className="flex gap-3">
                    <select value={newCategory} onChange={e => setNewCategory(e.target.value)}
                      className="rounded border border-input bg-background px-3 py-2 text-sm text-foreground">
                      <option value="general">General</option>
                      <option value="usage">Usage</option>
                      <option value="tips">Tips</option>
                      <option value="leakage">Leakage</option>
                    </select>
                    <Button onClick={handleAddQuestion} className="gradient-primary text-primary-foreground">
                      <Plus className="h-4 w-4 mr-1" /> Add Question
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Existing Questions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><HelpCircle className="h-5 w-5" /> Questions ({questions.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {questions.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No questions yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {questions.map((q, i) => (
                        <motion.div key={q.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                          className="rounded-lg border border-border p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-medium text-foreground text-sm">{q.question}</p>
                              <div className="mt-2 grid grid-cols-2 gap-1">
                                {q.options.map((opt, oi) => (
                                  <p key={oi} className={`text-xs px-2 py-1 rounded ${oi === q.correct_index ? "bg-secondary/20 text-secondary font-semibold" : "text-muted-foreground"}`}>
                                    {oi === q.correct_index ? "✓" : "○"} {opt}
                                  </p>
                                ))}
                              </div>
                              {q.category && <Badge variant="outline" className="mt-2 text-xs">{q.category}</Badge>}
                            </div>
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteQuestion(q.id)}>
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  );
};

export default AdminDashboard;
