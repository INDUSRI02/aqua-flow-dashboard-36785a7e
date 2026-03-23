import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import SplashScreen from "@/components/SplashScreen";
import DashboardLayout from "@/components/DashboardLayout";
import Dashboard from "@/pages/Dashboard";
import WaterTracker from "@/pages/WaterTracker";
import LeakageReport from "@/pages/LeakageReport";
import AIInsights from "@/pages/AIInsights";
import Awareness from "@/pages/Awareness";
import Quiz from "@/pages/Quiz";
import Community from "@/pages/Community";
import SettingsPage from "@/pages/SettingsPage";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import AdminDashboard from "@/pages/AdminDashboard";
import UserDashboard from "@/pages/UserDashboard";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children, requiredRole }: { children: React.ReactNode; requiredRole?: "admin" | "user" }) {
  const { session, role, loading } = useAuth();
  
  if (loading) return null;
  if (!session) return <Navigate to="/login" replace />;
  if (requiredRole && role !== requiredRole) return <Navigate to="/" replace />;
  
  return <>{children}</>;
}

function AppRoutes() {
  const { session, role, loading } = useAuth();

  if (loading) return null;

  return (
    <Routes>
      <Route path="/login" element={session ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/register" element={session ? <Navigate to="/" replace /> : <Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      
      <Route path="/*" element={
        <ProtectedRoute>
          <DashboardLayout>
            <Routes>
              <Route path="/" element={role === "admin" ? <AdminDashboard /> : <Dashboard />} />
              <Route path="/profile" element={<UserDashboard />} />
              <Route path="/admin" element={
                <ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>
              } />
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
        </ProtectedRoute>
      } />
    </Routes>
  );
}

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <SplashScreen show={showSplash} />
            {!showSplash && <AppRoutes />}
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
