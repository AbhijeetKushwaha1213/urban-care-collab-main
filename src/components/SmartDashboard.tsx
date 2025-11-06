import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import LoadingSpinner from '@/components/LoadingSpinner';
import UserHomepage from '@/pages/UserHomepage';

const SmartDashboard: React.FC = () => {
  const { userProfile, loading, currentUser } = useAuth();
  const navigate = useNavigate();
  const [hasAttemptedRouting, setHasAttemptedRouting] = useState(false);

  // Timeout fallback in case profile loading gets stuck
  useEffect(() => {
    if (currentUser && !hasAttemptedRouting) {
      const timeout = setTimeout(() => {
        console.log('SmartDashboard: Timeout reached, forcing routing decision');
        if (!hasAttemptedRouting) {
          setHasAttemptedRouting(true);
          if (!userProfile) {
            console.log('SmartDashboard: No profile after timeout, treating as citizen');
          }
        }
      }, 5000); // 5 second timeout

      return () => clearTimeout(timeout);
    }
  }, [currentUser, hasAttemptedRouting, userProfile]);

  useEffect(() => {
    console.log('SmartDashboard: loading =', loading, 'userProfile =', userProfile, 'currentUser =', !!currentUser);
    
    // Only attempt routing once we have a user and profile is loaded (or failed to load)
    if (!loading && currentUser && !hasAttemptedRouting) {
      if (userProfile) {
        console.log('SmartDashboard: User type is', userProfile.user_type);
        setHasAttemptedRouting(true);
        
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
      } else {
        // Profile failed to load, but user exists - might be a new user
        console.log('SmartDashboard: No profile found for existing user, treating as citizen');
        setHasAttemptedRouting(true);
      }
    }
  }, [userProfile, loading, currentUser, navigate, hasAttemptedRouting]);

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