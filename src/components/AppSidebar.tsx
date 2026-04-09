import { useState } from "react";
import {
  LayoutDashboard, Droplets, AlertTriangle, Brain, BookOpen,
  HelpCircle, Users, Settings, Waves, User, Shield, LogOut, Loader2
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const userItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "My Profile", url: "/profile", icon: User },
  { title: "Water Tracker", url: "/tracker", icon: Droplets },
  { title: "Leakage Reports", url: "/leakage", icon: AlertTriangle },
  { title: "AI Insights", url: "/insights", icon: Brain },
  { title: "Awareness", url: "/awareness", icon: BookOpen },
  { title: "Quiz & Challenges", url: "/quiz", icon: HelpCircle },
  { title: "Community", url: "/community", icon: Users },
  { title: "Settings", url: "/settings", icon: Settings },
];

const adminItems = [
  { title: "Admin Dashboard", url: "/", icon: Shield },
  { title: "User Management", url: "/admin", icon: Users },
  { title: "Water Tracker", url: "/tracker", icon: Droplets },
  { title: "AI Insights", url: "/insights", icon: Brain },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const navigate = useNavigate();
  const { role, profile, signOut } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  const items = role === "admin" ? adminItems : userItems;

  const handleSignOut = async () => {
    setLoggingOut(true);
    await signOut();
    toast({ title: "Signed out", description: "You have been logged out safely." });
    navigate("/login", { replace: true });
    setLoggingOut(false);
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className="flex items-center gap-2 px-4 py-5">
          <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}>
            <Waves className="h-7 w-7 text-primary" />
          </motion.div>
          {!collapsed && (
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-lg font-bold gradient-text">
              AquaSave
            </motion.span>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end={item.url === "/"}
                        className={`relative transition-all duration-200 ${isActive ? "gradient-primary text-primary-foreground" : "hover:bg-muted"}`}
                        activeClassName="gradient-primary text-primary-foreground"
                      >
                        <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.95 }} className="mr-2">
                          <item.icon className="h-4 w-4" />
                        </motion.div>
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto p-4">
          {!collapsed && profile?.display_name && (
            <p className="mb-2 truncate text-xs text-muted-foreground">{profile.display_name}</p>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            disabled={loggingOut}
            className="w-full justify-start text-muted-foreground hover:text-destructive"
          >
            {loggingOut ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogOut className="mr-2 h-4 w-4" />}
            {!collapsed && (loggingOut ? "Signing out..." : "Logout")}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
