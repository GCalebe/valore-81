
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Auth from "@/pages/Auth";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Schedule from "./pages/Schedule";
import ClientsDashboard from "./pages/ClientsDashboard";
import ChatsDashboard from "./pages/ChatsDashboard";
import MetricsDashboard from "./pages/MetricsDashboard";
import KnowledgeManager from "./pages/KnowledgeManager";
import Evolution from "./pages/Evolution";
import AgentConfig from "./pages/AgentConfig";
import ThemeSettings from "./pages/ThemeSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/schedule"
                element={
                  <ProtectedRoute>
                    <Schedule />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/clients"
                element={
                  <ProtectedRoute>
                    <ClientsDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/chats"
                element={
                  <ProtectedRoute>
                    <ChatsDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/metrics"
                element={
                  <ProtectedRoute>
                    <MetricsDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/knowledge"
                element={
                  <ProtectedRoute>
                    <KnowledgeManager />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/evolution"
                element={
                  <ProtectedRoute>
                    <Evolution />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/agent-config"
                element={
                  <ProtectedRoute>
                    <AgentConfig />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/theme-settings"
                element={
                  <ProtectedRoute>
                    <ThemeSettings />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
