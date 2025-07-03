
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/pages/ProtectedRoute";
import Login from "@/pages/Login";
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import MainDashboard from "@/pages/MainDashboard";
import LpoCreate from "@/pages/LpoCreate";
import EmailReport from "@/pages/EmailReport";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/main-dashboard" element={
              <ProtectedRoute>
                <MainDashboard />
              </ProtectedRoute>
            } />
            <Route path="/lpo-create" element={
              <ProtectedRoute>
                <LpoCreate />
              </ProtectedRoute>
            } />
            <Route path="/email-report" element={
              <ProtectedRoute>
                <EmailReport />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
