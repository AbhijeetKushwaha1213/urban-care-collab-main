
import React from 'react';
import { Button } from "@/components/ui/button";
import { MapPin, Heart, Users, PieChart, Lightbulb, Shield, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';

const About = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="pt-32 pb-20 px-4 md:px-6 container mx-auto">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-semibold mb-6">About UrbanCare</h1>
          <p className="text-xl text-muted-foreground mb-12">
            A platform that empowers communities to identify, discuss, and solve urban problems together.
          </p>
          
          {/* Mission Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-semibold mb-4">Our Mission</h2>
            <p className="text-lg text-muted-foreground mb-4">
              UrbanCare aims to bridge the gap between residents, communities, and local authorities to create more livable and sustainable neighborhoods. By providing a platform for civic engagement, we empower everyone to take an active role in improving their surroundings.
            </p>
            <p className="text-lg text-muted-foreground">
              We believe that the most effective solutions come from collaborative efforts and local knowledge. Our platform facilitates these connections, making it easier for communities to organize, address, and resolve urban challenges.
            </p>
          </section>
          
          {/* Key Features */}
          <section className="mb-16">
            <h2 className="text-3xl font-semibold mb-6">Key Features</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card border rounded-lg p-6">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Issue Reporting</h3>
                <p className="text-muted-foreground">
                  Easily report local issues with photos and location details, making them visible to the community and authorities.
                </p>
              </div>
              
              <div className="bg-card border rounded-lg p-6">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Community Organization</h3>
                <p className="text-muted-foreground">
                  Coordinate with neighbors to plan events, discussions, and activities aimed at solving local problems.
                </p>
              </div>
              
              <div className="bg-card border rounded-lg p-6">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <PieChart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Progress Tracking</h3>
                <p className="text-muted-foreground">
                  Monitor the status of reported issues and track community efforts toward resolving them over time.
                </p>
              </div>
              
              <div className="bg-card border rounded-lg p-6">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Lightbulb className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Solution Ideation</h3>
                <p className="text-muted-foreground">
                  Collaborate on developing ideas and approaches to tackle urban challenges effectively.
                </p>
              </div>
            </div>
          </section>
          
          {/* Our Values */}
          <section className="mb-16">
            <h2 className="text-3xl font-semibold mb-6">Our Values</h2>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center">
                  <Heart className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">Community First</h3>
                  <p className="text-muted-foreground">
                    We prioritize the needs, voices, and well-being of local communities in everything we do.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">Transparency</h3>
                  <p className="text-muted-foreground">
                    We believe in open communication about issues, processes, and decision-making.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">Inclusivity</h3>
                  <p className="text-muted-foreground">
                    We strive to create a platform that is accessible and welcoming to all members of the community.
                  </p>
                </div>
              </div>
            </div>
          </section>
          
          {/* Join Us Section */}
          <section className="bg-secondary/30 rounded-xl p-8 text-center">
            <h2 className="text-3xl font-semibold mb-4">Join Our Community</h2>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              Ready to make a difference in your neighborhood? Join UrbanCare today and be part of the movement to create better urban environments for everyone.
            </p>
            <Button size="lg" className="group">
              <span>Get Started</span>
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;
