import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Search, Trash2, Shield, BarChart3, UserCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
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

const AdminDashboard = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    const { data: profiles } = await supabase.from("profiles").select("user_id, display_name, created_at");
    const { data: roles } = await supabase.from("user_roles").select("user_id, role");

    if (profiles) {
      const mapped = profiles.map(p => ({
        ...p,
        roles: roles?.filter(r => r.user_id === p.user_id).map(r => r.role) || [],
      }));
      setUsers(mapped);
    }
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (userId: string) => {
    if (userId === user?.id) {
      toast({ title: "Error", description: "Cannot delete your own account", variant: "destructive" });
      return;
    }

    // Delete via edge function would be needed for full delete, but we can remove profile/roles
    const { error } = await supabase.from("profiles").delete().eq("user_id", userId);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "User removed", description: "User data has been deleted." });
    fetchUsers();
  };

  const filtered = users.filter(u =>
    u.display_name?.toLowerCase().includes(search.toLowerCase()) ||
    u.user_id.toLowerCase().includes(search.toLowerCase())
  );

  const totalUsers = users.length;
  const adminCount = users.filter(u => u.roles.includes("admin")).length;

  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage users and view analytics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <AnimatedCard delay={0}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold"><AnimatedCounter end={totalUsers} /></div>
              </CardContent>
            </Card>
          </AnimatedCard>

          <AnimatedCard index={1}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Regular Users</CardTitle>
                <UserCheck className="h-5 w-5 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold"><AnimatedCounter end={totalUsers - adminCount} /></div>
              </CardContent>
            </Card>
          </AnimatedCard>

          <AnimatedCard index={2}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Admins</CardTitle>
                <Shield className="h-5 w-5 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold"><AnimatedCounter end={adminCount} /></div>
              </CardContent>
            </Card>
          </AnimatedCard>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" /> User Management
              </CardTitle>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-9"
                />
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
                    <motion.tr
                      key={u.user_id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="border-b transition-colors hover:bg-muted/50"
                    >
                      <TableCell className="font-medium">{u.display_name || "Unnamed"}</TableCell>
                      <TableCell>
                        {u.roles.map(r => (
                          <Badge key={r} variant={r === "admin" ? "default" : "secondary"} className="mr-1">
                            {r}
                          </Badge>
                        ))}
                      </TableCell>
                      <TableCell>{new Date(u.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        {!u.roles.includes("admin") && (
                          <Button size="sm" variant="destructive" onClick={() => handleDelete(u.user_id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </TableCell>
                    </motion.tr>
                  ))}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                        No users found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
};

export default AdminDashboard;
