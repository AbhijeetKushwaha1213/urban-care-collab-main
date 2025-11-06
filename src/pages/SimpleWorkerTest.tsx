import React from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const SimpleWorkerTest: React.FC = () => {
  const { currentUser, userProfile } = useAuth();

  return (
    <div className="min-h-screen bg-blue-600 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">🔧 Worker Dashboard Test</h1>
        
        <div className="bg-white/10 p-6 rounded-lg mb-6">
          <h2 className="text-2xl font-semibold mb-4">Authentication Status</h2>
          <p><strong>User Logged In:</strong> {currentUser ? '✅ Yes' : '❌ No'}</p>
          <p><strong>User Email:</strong> {currentUser?.email || 'Not available'}</p>
          <p><strong>User ID:</strong> {currentUser?.id || 'Not available'}</p>
        </div>

        <div className="bg-white/10 p-6 rounded-lg mb-6">
          <h2 className="text-2xl font-semibold mb-4">Profile Information</h2>
          <p><strong>Profile Loaded:</strong> {userProfile ? '✅ Yes' : '❌ No'}</p>
          <p><strong>Full Name:</strong> {userProfile?.full_name || 'Not available'}</p>
          <p><strong>User Type:</strong> {userProfile?.user_type || 'Not available'}</p>
          <p><strong>Department:</strong> {userProfile?.department || 'Not available'}</p>
          <p><strong>Onboarding Complete:</strong> {userProfile?.is_onboarding_complete ? '✅ Yes' : '❌ No'}</p>
        </div>

        <div className="bg-green-600 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">🎉 Success!</h2>
          <p>If you can see this page, the worker routing is working!</p>
          <p className="mt-4">This is a temporary test page to verify the worker login flow.</p>
        </div>

        <div className="mt-8">
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100"
          >
            ← Back to Landing Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimpleWorkerTest;