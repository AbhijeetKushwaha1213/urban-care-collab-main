import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/SupabaseAuthContext";
import Landing from "./pages/Landing";
import Index from "./pages/Index";
import UserHomepage from "./pages/UserHomepage";
import Issues from "./pages/Issues";
import IssueDetail from "./pages/IssueDetail";
import Profile from "./pages/Profile";
import Events from "./pages/Events";
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
  
  // If not a new user, redirect to dashboard
  if (!isNewUser) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

// HomeRoute component to handle /home route
const HomeRoute = () => {
  const { currentUser, isNewUser, loading } = useAuth();
  
  // Show loading while auth state is being determined
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }
  
  // If logged in and not a new user, redirect to dashboard
  if (currentUser && !isNewUser) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // If logged in but new user, redirect to onboarding
  if (currentUser && isNewUser) {
    return <Navigate to="/onboarding" replace />;
  }
  
  // If not logged in, show the public Index page
  return <Index />;
};

// AppRoutes component to handle routing after auth context is loaded
const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<HomeRoute />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <UserHomepage />
          </ProtectedRoute>
        } />
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
        <Route path="/authority-dashboard" element={<AuthorityDashboard />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
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