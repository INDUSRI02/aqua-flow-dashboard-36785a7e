import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import DashboardLayout from "@/components/DashboardLayout";
import Dashboard from "@/pages/Dashboard";
import WaterTracker from "@/pages/WaterTracker";
import LeakageReport from "@/pages/LeakageReport";
import AIInsights from "@/pages/AIInsights";
import Awareness from "@/pages/Awareness";
import Quiz from "@/pages/Quiz";
import Community from "@/pages/Community";
import SettingsPage from "@/pages/SettingsPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route
            path="/*"
            element={
              <DashboardLayout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/tracker" element={<WaterTracker />} />
                  <Route path="/leakage" element={<LeakageReport />} />
                  <Route path="/insights" element={<AIInsights />} />
                  <Route path="/awareness" element={<Awareness />} />
                  <Route path="/quiz" element={<Quiz />} />
                  <Route path="/community" element={<Community />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </DashboardLayout>
            }
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
