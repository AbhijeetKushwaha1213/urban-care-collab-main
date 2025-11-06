import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import LoadingSpinner from '@/components/LoadingSpinner';
import UserHomepage from '@/pages/UserHomepage';

const SmartDashboard: React.FC = () => {
  const { userProfile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('SmartDashboard: loading =', loading, 'userProfile =', userProfile);
    if (!loading && userProfile) {
      console.log('SmartDashboard: User type is', userProfile.user_type);
      // Route users to their appropriate dashboard based on user type
      switch (userProfile.user_type) {
        case 'worker':
          console.log('SmartDashboard: Redirecting worker to /worker/dashboard');
          navigate('/worker/dashboard', { replace: true });
          break;
        case 'authority':
          console.log('SmartDashboard: Redirecting authority to /authority-dashboard');
          navigate('/authority-dashboard', { replace: true });
          break;
        case 'citizen':
        default:
          console.log('SmartDashboard: Showing citizen dashboard');
          // Citizens stay on this dashboard
          break;
      }
    }
  }, [userProfile, loading, navigate]);

  // Show loading while determining user type
  if (loading) {
    return <LoadingSpinner fullScreen message="Loading your dashboard..." />;
  }

  // If no user profile yet, show loading (might still be loading)
  if (!userProfile) {
    console.log('SmartDashboard: No user profile yet, showing loading...');
    return <LoadingSpinner fullScreen message="Loading your profile..." />;
  }

  // If user is a citizen or fallback, show the UserHomepage
  if (userProfile.user_type === 'citizen' || !userProfile.user_type) {
    console.log('SmartDashboard: Showing UserHomepage for citizen or undefined user type');
    return <UserHomepage />;
  }

  // For workers and authorities, this will be replaced by navigation
  // but show loading in case navigation is delayed
  console.log('SmartDashboard: Showing loading while redirecting...');
  return <LoadingSpinner fullScreen message="Redirecting to your dashboard..." />;
};

export default SmartDashboard;