import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, PlusCircle, TrendingUp, MessageSquare, Users, ArrowRight, Search } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import FeaturedIssue from '@/components/FeaturedIssue';
import IssueCard from '@/components/IssueCard';
import AuthModal from '@/components/AuthModal';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

const featuredIssue = {
  id: "1",
  title: "Broken Park Benches in Willowbrook Park",
  description: "Several park benches in Willowbrook Park have been damaged and need repair. This has been an ongoing issue for several months, making it difficult for elderly visitors to enjoy the park.",
  location: "Willowbrook Park, Main Avenue",
  category: "Infrastructure",
  image: "https://images.unsplash.com/photo-1604357209793-fca5dca89f97?q=80&w=1200&auto=format&fit=crop",
  date: "2 days ago",
  volunteerCount: 12
};

const issuesData = [
  {
    id: "2",
    title: "Overflowing Trash Bins on Cedar Street",
    description: "The trash bins on Cedar Street have been overflowing for weeks now, causing litter to spread across the neighborhood.",
    location: "Cedar Street, Downtown",
    category: "Trash",
    image: "https://images.unsplash.com/photo-1605600659873-d808a13e4e4e?q=80&w=600&auto=format&fit=crop",
    date: "1 day ago",
    commentsCount: 8,
    volunteersCount: 5
  },
  {
    id: "3",
    title: "Water Shortage in Maple Garden Community",
    description: "Our community garden has been suffering from water shortage for the past week, endangering all the plants we've grown.",
    location: "Maple Garden, East Side",
    category: "Water",
    image: "https://images.unsplash.com/photo-1543674892-7d64d45facad?q=80&w=600&auto=format&fit=crop",
    date: "3 days ago",
    commentsCount: 12,
    volunteersCount: 7
  },
  {
    id: "4",
    title: "Drainage Blockage After Recent Rainfall",
    description: "The recent heavy rainfall has caused severe drainage blockage on Pine Road, creating large puddles and making it difficult to walk.",
    location: "Pine Road, North District",
    category: "Drainage",
    image: "https://images.unsplash.com/photo-1597435877854-a461fb2dd9f2?q=80&w=600&auto=format&fit=crop",
    date: "4 days ago",
    commentsCount: 5,
    volunteersCount: 3
  }
];

const categories = ["All", "Trash", "Water", "Infrastructure", "Drainage", "Other"];

const Index = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const navigate = useNavigate();
  const { currentUser, isNewUser } = useAuth();
  
  const handleReportIssue = () => {
    if (!currentUser) {
      setAuthModalOpen(true);
      toast({
        title: "Authentication required",
        description: "Please sign in to report an issue",
      });
    } else {
      navigate('/issues/report');
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 md:px-6 container mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center px-3 py-1.5 bg-secondary rounded-full text-sm mb-6 animate-slide-down">
            <TrendingUp className="h-4 w-4 mr-2 text-primary" />
            <span>Join 5,000+ residents improving their communities</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-6 text-balance animate-slide-down" style={{ animationDelay: '0.1s' }}>
            Collaborate to solve <span className="text-primary">local issues</span> in your neighborhood
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-balance animate-slide-down" style={{ animationDelay: '0.2s' }}>
            UrbanCare connects neighbors, communities, and local authorities to identify, discuss, and solve urban problems together.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-down" style={{ animationDelay: '0.3s' }}>
            <Button size="lg" className="group" onClick={() => setAuthModalOpen(true)}>
              <span>Get Started</span>
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/issues')}>
              <Search className="mr-2 h-4 w-4" />
              <span>Explore Issues</span>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Featured Issue */}
      <section className="py-16 px-4 md:px-6 container mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-semibold mb-2">Featured Issue</h2>
            <p className="text-muted-foreground">A highlighted problem that needs community attention</p>
          </div>
          <Link to="/issues" className="text-primary flex items-center hover:underline font-medium">
            <span>View all issues</span>
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        <FeaturedIssue {...featuredIssue} />
      </section>
      
      {/* Recent Issues */}
      <section className="py-16 px-4 md:px-6 container mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-semibold mb-2">Recent Issues</h2>
            <p className="text-muted-foreground">Latest problems reported in your community</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {issuesData.map(issue => (
            <IssueCard key={issue.id} {...issue} />
          ))}
          
          <div 
            onClick={handleReportIssue}
            className="flex flex-col items-center justify-center p-8 rounded-xl border border-dashed border-border bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer"
          >
            <PlusCircle className="h-10 w-10 text-primary mb-4" />
            <h3 className="text-lg font-medium mb-1">Report an Issue</h3>
            <p className="text-muted-foreground text-sm text-center">
              Notice a problem in your neighborhood? Report it here.
            </p>
          </div>
        </div>
      </section>
      
      {/* How it Works */}
      <section className="py-16 px-4 md:px-6 bg-secondary/50">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-semibold mb-4">How UrbanCare Works</h2>
            <p className="text-lg text-muted-foreground">
              Our platform enables communities to collaboratively address local urban challenges
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-background p-8 rounded-xl shadow-subtle animate-scale-in" style={{ animationDelay: '0.1s' }}>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Identify Issues</h3>
              <p className="text-muted-foreground">
                Report problems in your neighborhood with photos and location details for everyone to see.
              </p>
            </div>
            
            <div className="bg-background p-8 rounded-xl shadow-subtle animate-scale-in" style={{ animationDelay: '0.2s' }}>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Discuss Solutions</h3>
              <p className="text-muted-foreground">
                Engage in conversations with neighbors and local authorities to find the best approach.
              </p>
            </div>
            
            <div className="bg-background p-8 rounded-xl shadow-subtle animate-scale-in" style={{ animationDelay: '0.3s' }}>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Take Action</h3>
              <p className="text-muted-foreground">
                Coordinate with others, schedule events, and collaborate to solve problems together.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-4 md:px-6 container mx-auto">
        <div className="glass p-8 md:p-12 rounded-2xl">
          <div className="max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">Ready to improve your neighborhood?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join UrbanCare today and be part of the solution. Together, we can make our communities better places to live.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" onClick={() => setAuthModalOpen(true)}>Create an Account</Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/about')}>Learn More</Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-secondary/80 py-12 px-4 md:px-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center mr-2">
                  <MapPin className="h-4 w-4 text-white" />
                </div>
                <span className="text-xl font-semibold">UrbanCare</span>
              </div>
              <p className="text-muted-foreground mt-4 max-w-md">
                A platform for communities to collaboratively solve urban challenges and improve neighborhood living.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
              <div>
                <h3 className="font-medium mb-4">Platform</h3>
                <ul className="space-y-3">
                  <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Home</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Issues</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Events</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">About</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-4">Resources</h3>
                <ul className="space-y-3">
                  <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Help Center</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Community Guidelines</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-4">Contact</h3>
                <ul className="space-y-3">
                  <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Contact Us</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Feedback</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Report a Bug</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t border-border/50 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} UrbanCare. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Twitter
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Facebook
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Instagram
              </a>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Auth Modal */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  );
};

export default Index;
