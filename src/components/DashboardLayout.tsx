import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Droplets } from "lucide-react";

const DashboardLayout = ({ children }: { children: ReactNode }) => (
  <SidebarProvider>
    <div className="min-h-screen flex w-full">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 flex items-center justify-between border-b border-border bg-card/80 backdrop-blur-sm px-4 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <Droplets className="h-5 w-5 text-primary animate-droplet" />
            <span className="text-sm font-medium text-muted-foreground hidden sm:inline">
              Water Conservation Awareness System
            </span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  </SidebarProvider>
);

export default DashboardLayout;
