import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/SupabaseAuthContext";
import Landing from "./pages/Landing";
import Index from "./pages/Index";
import Issues from "./pages/Issues";
import IssueDetail from "./pages/IssueDetail";
import Profile from "./pages/Profile";
import Events from "./pages/Events";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import ReportIssue from "./pages/ReportIssue";
import UserOnboarding from "./pages/UserOnboarding";
import EventDetail from "./pages/EventDetail";
import AuthorityDashboard from "./pages/AuthorityDashboard";
import AuthCallback from "./pages/AuthCallback";

const queryClient = new QueryClient();

// ProtectedRoute component to handle authentication
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, isNewUser } = useAuth();
  
  // If not logged in, redirect to landing page
  if (!currentUser) {
    return <Navigate to="/" replace />;
  }
  
  // If new user, redirect to onboarding
  if (isNewUser) {
    return <Navigate to="/onboarding" replace />;
  }
  
  return <>{children}</>;
};

// OnboardingRoute component to handle first-time users
const OnboardingRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, isNewUser } = useAuth();
  
  // If not logged in, redirect to landing page
  if (!currentUser) {
    return <Navigate to="/" replace />;
  }
  
  // If not a new user, redirect to profile
  if (!isNewUser) {
    return <Navigate to="/profile" replace />;
  }
  
  return <>{children}</>;
};

// AppRoutes component to handle routing after auth context is loaded
const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Index />} />
        <Route path="/issues" element={<Issues />} />
        <Route path="/issues/:id" element={<IssueDetail />} />
        <Route path="/issues/report" element={
          <ProtectedRoute>
            <ReportIssue />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/onboarding" element={
          <OnboardingRoute>
            <UserOnboarding />
          </OnboardingRoute>
        } />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/authority-dashboard" element={<AuthorityDashboard />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <AppRoutes />
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
