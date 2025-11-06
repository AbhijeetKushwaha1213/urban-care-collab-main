import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, MapPin, Bell, BarChart3, Users, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import AuthModal from '@/components/AuthModal';
import { useAuth } from '@/contexts/SupabaseAuthContext';

export default function Landing() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState<'citizen' | 'authority' | null>(null);

  const handleGetStarted = () => {
    // Scroll to the user type selection section
    document.getElementById('user-selection')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCitizenAccess = () => {
    if (currentUser) {
      // User is already logged in, redirect directly
      navigate('/issues');
    } else {
      // User not logged in, show auth modal
      setSelectedUserType('citizen');
      setAuthModalOpen(true);
    }
  };

  const handleAuthorityAccess = () => {
    if (currentUser) {
      // User is already logged in, redirect directly
      navigate('/authority-dashboard');
    } else {
      // User not logged in, show auth modal
      setSelectedUserType('authority');
      setAuthModalOpen(true);
    }
  };

  const handleAuthSuccess = () => {
    // After successful authentication, redirect based on selected user type
    setAuthModalOpen(false);
    if (selectedUserType === 'citizen') {
      navigate('/issues');
    } else if (selectedUserType === 'authority') {
      navigate('/authority-dashboard');
    }
    setSelectedUserType(null);
  };

  const handleAuthClose = () => {
    setAuthModalOpen(false);
    setSelectedUserType(null);
  };

  return (
    <div 
      className="min-h-screen text-white font-sans relative"
      style={{
        backgroundImage: 'url(/cityscape-bg.jpeg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/30"></div>
      
      {/* Content wrapper */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="text-center py-24 px-6">
          <motion.h1 
            initial={{ opacity: 0, y: -30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 1 }} 
            className="text-5xl font-bold mb-4 text-white drop-shadow-lg"
          >
            Nagar Setu: Smarter Cities, Empowered Citizens
          </motion.h1>
          <p className="text-lg text-white/90 max-w-3xl mx-auto mb-8 drop-shadow-md">
            A next-gen civic engagement platform where citizens report issues instantly, and governments respond smarter with AI-driven prioritization and resolve them.
          </p>
          <Button 
            onClick={handleGetStarted}
            className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 text-lg rounded-full shadow-lg"
          >
            Get Started
          </Button>
        </section>

        {/* Features Section */}
        <section className="py-16 px-6 bg-white/10 backdrop-blur-md rounded-t-3xl -mt-12 border-t border-white/20">
        <h2 className="text-center text-3xl font-bold mb-12 text-white drop-shadow-lg">Discover Powerful Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="shadow-xl border-none bg-white/20 backdrop-blur-md border border-white/20">
            <CardContent className="flex flex-col items-center p-6">
              <Brain className="w-10 h-10 text-indigo-300 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-white">AI-Powered Routing</h3>
              <p className="text-white/90 text-center">
                Automatically categorizes and assigns reports to relevant departments for faster action.
              </p>
            </CardContent>
          </Card>
          
          <Card className="shadow-xl border-none bg-white/20 backdrop-blur-md border border-white/20">
            <CardContent className="flex flex-col items-center p-6">
              <MapPin className="w-10 h-10 text-pink-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-white">Smart Geo-Tagging</h3>
              <p className="text-white/90 text-center">
                Reports automatically capture exact location data for accurate issue mapping.
              </p>
            </CardContent>
          </Card>
          
          <Card className="shadow-xl border-none bg-white/20 backdrop-blur-md border border-white/20">
            <CardContent className="flex flex-col items-center p-6">
              <Bell className="w-10 h-10 text-green-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-white">Live Notifications</h3>
              <p className="text-white/90 text-center">
                Stay updated as your report moves from submission to resolution in real-time.
              </p>
            </CardContent>
          </Card>
          </div>
        </section>

        {/* User Selection Section */}
        <section id="user-selection" className="py-20 px-6 bg-black/30 backdrop-blur-sm">
          <h2 className="text-3xl font-bold text-center mb-12 text-white drop-shadow-lg">Choose Your Access Type</h2>
          <div className="flex flex-col md:flex-row justify-center gap-8 max-w-4xl mx-auto">
          
            {/* Citizen Access */}
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              className="bg-white/20 p-8 rounded-2xl text-center shadow-xl w-full md:w-1/2 backdrop-blur-md border border-white/20"
            >
              <Users className="w-16 h-16 text-pink-400 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-4 text-pink-400">Citizen Access</h3>
              <p className="text-white/90 text-sm mb-6">
                Report civic issues, track progress, and help build a better community. Join thousands of citizens making a difference.
              </p>
              <Button 
                onClick={handleCitizenAccess}
                className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-full w-full"
              >
                Access as Citizen
              </Button>
            </motion.div>

            {/* Authority Access */}
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              className="bg-white/20 p-8 rounded-2xl text-center shadow-xl w-full md:w-1/2 backdrop-blur-md border border-white/20"
            >
              <Shield className="w-16 h-16 text-blue-400 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-4 text-blue-400">Authority Access</h3>
              <p className="text-white/90 text-sm mb-6">
                Manage reported issues, coordinate responses, and track resolution progress with advanced analytics and AI insights.
              </p>
              <Button 
                onClick={handleAuthorityAccess}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full w-full"
              >
                Access as Authority
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Community / Testimonials */}
        <section className="py-20 px-6 bg-black/20 backdrop-blur-sm">
        <h2 className="text-3xl font-bold text-center mb-12 text-white drop-shadow-lg">Hear From Our Community</h2>
        <div className="flex flex-col md:flex-row justify-center gap-8 max-w-5xl mx-auto">
          {["Empowered Citizens", "Responsive Officials", "Smarter Cities"].map((title, i) => (
            <motion.div 
              key={i} 
              whileHover={{ scale: 1.05 }} 
              className="bg-white/15 p-6 rounded-2xl text-center shadow-md w-full md:w-1/3 backdrop-blur-md border border-white/20"
            >
              <h3 className="text-xl font-semibold mb-2 text-pink-400">{title}</h3>
              <p className="text-white/90 text-sm">
                Nagar Setu bridges people and governance through technology, transparency, and trust.
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-20 bg-white/15 backdrop-blur-md border-t border-white/20">
        <h2 className="text-4xl font-bold mb-6 text-white drop-shadow-lg">Join the Future of Smart Governance</h2>
        <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto drop-shadow-md">
          Be part of the change. Report civic issues, monitor progress, and help build cleaner, more connected cities.
        </p>
        <Button 
          onClick={handleGetStarted}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 text-lg rounded-full shadow-xl"
        >
          Get Started Now
        </Button>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-400 bg-gray-950 border-t border-gray-800">
        <div className="mb-4">
          <Button
            onClick={() => navigate('/worker/login')}
            variant="outline"
            className="text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-white mr-4"
          >
            Worker Login
          </Button>
          <span className="text-gray-500 text-sm">Field Worker Portal</span>
        </div>
        <p>© 2025 Nagar Setu | Empowering Citizens for Smarter Cities</p>
      </footer>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={handleAuthClose}
        redirectTo={selectedUserType === 'citizen' ? '/issues' : '/authority-dashboard'}
        userType={selectedUserType || 'citizen'}
      />
      </div>
    </div>
  );
}