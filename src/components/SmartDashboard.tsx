import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import LoadingSpinner from '@/components/LoadingSpinner';
import UserHomepage from '@/pages/UserHomepage';

const SmartDashboard: React.FC = () => {
  const { userProfile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && userProfile) {
      // Route users to their appropriate dashboard based on user type
      switch (userProfile.user_type) {
        case 'worker':
          navigate('/worker/dashboard', { replace: true });
          break;
        case 'authority':
          navigate('/authority-dashboard', { replace: true });
          break;
        case 'citizen':
        default:
          // Citizens stay on this dashboard
          break;
      }
    }
  }, [userProfile, loading, navigate]);

  // Show loading while determining user type
  if (loading) {
    return <LoadingSpinner fullScreen message="Loading your dashboard..." />;
  }

  // If user is a citizen or fallback, show the UserHomepage
  if (userProfile?.user_type === 'citizen' || !userProfile?.user_type) {
    return <UserHomepage />;
  }

  // For workers and authorities, this will be replaced by navigation
  // but show loading in case navigation is delayed
  return <LoadingSpinner fullScreen message="Redirecting to your dashboard..." />;
};

export default SmartDashboard;