import {
  LayoutDashboard, Droplets, AlertTriangle, Brain, BookOpen,
  HelpCircle, Users, Settings, Waves, User, Shield, LogOut
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

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
  const { role, profile, signOut } = useAuth();

  const items = role === "admin" ? adminItems : userItems;

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
            <p className="text-xs text-muted-foreground mb-2 truncate">{profile.display_name}</p>
          )}
          <Button variant="ghost" size="sm" onClick={signOut} className="w-full justify-start text-muted-foreground hover:text-destructive">
            <LogOut className="h-4 w-4 mr-2" />
            {!collapsed && "Logout"}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
