import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Award, ArrowRight, Calendar, MapPin, User } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface SuccessStory {
  id: string;
  title: string;
  location: string;
  beforeImage: string;
  afterImage: string;
  solverName: string;
  solverAvatar?: string;
  solvedDate: string;
  category: string;
}

// Sample data for fallback
const sampleStories: SuccessStory[] = [
  {
    id: '1',
    title: 'Park Bench Restoration',
    location: 'Willowbrook Park',
    beforeImage: 'https://images.unsplash.com/photo-1604357209793-fca5dca89f97?q=80&w=400&auto=format&fit=crop',
    afterImage: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=400&auto=format&fit=crop',
    solverName: 'Sarah Johnson',
    solverAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=100&auto=format&fit=crop',
    solvedDate: '2024-10-15',
    category: 'Infrastructure'
  },
  {
    id: '2',
    title: 'Street Light Repair',
    location: 'Maple Avenue',
    beforeImage: 'https://images.unsplash.com/photo-1621556712457-1ec8a586daa7?q=80&w=400&auto=format&fit=crop',
    afterImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?q=80&w=400&auto=format&fit=crop',
    solverName: 'Mike Chen',
    solverAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop',
    solvedDate: '2024-10-12',
    category: 'Infrastructure'
  }
];

const HomepageSuccessStories: React.FC = () => {
  const [stories, setStories] = useState<SuccessStory[]>(sampleStories);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSuccessStories();
  }, []);

  const fetchSuccessStories = async () => {
    try {
      // Query for solved issues with before/after images
      const { data, error } = await supabase
        .from('issues')
        .select(`
          id,
          title,
          location,
          image,
          category,
          solved_date,
          solver_name,
          solver_avatar,
          after_image
        `)
        .eq('status', 'solved')
        .not('after_image', 'is', null)
        .order('solved_date', { ascending: false })
        .limit(3); // Show only 3 stories on homepage

      if (error) throw error;

      if (data && data.length > 0) {
        const transformedStories = data.map(story => ({
          id: story.id,
          title: story.title,
          location: story.location,
          beforeImage: story.image,
          afterImage: story.after_image,
          solverName: story.solver_name || 'Anonymous Helper',
          solverAvatar: story.solver_avatar,
          solvedDate: story.solved_date,
          category: story.category
        }));
        setStories(transformedStories);
      }
      // If no data, keep showing sample stories
    } catch (error) {
      console.error('Error fetching success stories:', error);
      // Keep showing sample stories on error
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  };

  return (
    <section className="py-16 px-4 md:px-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20">
      <div className="container mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
                <Award className="h-4 w-4 text-white" />
              </div>
              <h2 className="text-3xl font-semibold">Success Stories</h2>
            </div>
            <p className="text-muted-foreground">See how our community is making a real difference</p>
          </div>
          <Link to="/issues" className="text-primary flex items-center hover:underline font-medium">
            <span>View all stories</span>
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story, index) => (
            <div 
              key={story.id} 
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Before/After Images */}
              <div className="grid grid-cols-2 h-48">
                <div className="relative">
                  <img
                    src={story.beforeImage}
                    alt="Before"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                    Before
                  </div>
                </div>
                <div className="relative">
                  <img
                    src={story.afterImage}
                    alt="After"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                    After
                  </div>
                </div>
              </div>

              {/* Story Details */}
              <div className="p-5">
                <h3 className="font-semibold text-lg mb-2 line-clamp-1">{story.title}</h3>
                
                <div className="space-y-2 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate">{story.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    <span>Solved {formatDate(story.solvedDate)}</span>
                  </div>
                </div>

                {/* Solver Info */}
                <div className="flex items-center gap-3 pt-3 border-t border-border">
                  <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                    {story.solverAvatar ? (
                      <img
                        src={story.solverAvatar}
                        alt={story.solverName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{story.solverName}</p>
                    <p className="text-xs text-muted-foreground">Community Hero</p>
                  </div>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                    {story.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-8">
          <p className="text-muted-foreground mb-4">
            Want to be featured as a community hero? Help solve local issues!
          </p>
          <Link 
            to="/issues" 
            className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            <span>Find Issues to Solve</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomepageSuccessStories;