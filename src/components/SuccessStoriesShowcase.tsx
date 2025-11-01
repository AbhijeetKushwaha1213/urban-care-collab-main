import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Award, Calendar, MapPin, User } from 'lucide-react';
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
  },
  {
    id: '3',
    title: 'Community Garden Revival',
    location: 'East Side Garden',
    beforeImage: 'https://images.unsplash.com/photo-1543674892-7d64d45facad?q=80&w=400&auto=format&fit=crop',
    afterImage: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=400&auto=format&fit=crop',
    solverName: 'Emma Rodriguez',
    solverAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop',
    solvedDate: '2024-10-08',
    category: 'Environment'
  }
];

const SuccessStoriesShowcase: React.FC = () => {
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSuccessStories();
  }, []);

  const fetchSuccessStories = async () => {
    setLoading(true);
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
        .limit(10);

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
      } else {
        // Use sample data if no real data available
        setStories(sampleStories);
      }
    } catch (error) {
      console.error('Error fetching success stories:', error);
      // Fallback to sample data
      setStories(sampleStories);
    } finally {
      setLoading(false);
    }
  };

  const nextStory = () => {
    setCurrentIndex((prev) => (prev + 1) % stories.length);
  };

  const prevStory = () => {
    setCurrentIndex((prev) => (prev - 1 + stories.length) % stories.length);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading || stories.length === 0) {
    return null; // Don't show anything if loading or no stories
  }

  const currentStory = stories[currentIndex];

  return (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 py-8 mb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
              <Award className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Success Stories</h2>
              <p className="text-sm text-muted-foreground">See how our community is making a difference</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={prevStory}
              className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
              disabled={stories.length <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm text-muted-foreground px-2">
              {currentIndex + 1} of {stories.length}
            </span>
            <button
              onClick={nextStory}
              className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
              disabled={stories.length <= 1}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Before Image */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Before</h3>
              <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                <img
                  src={currentStory.beforeImage}
                  alt="Before solving the issue"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* After Image */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">After</h3>
              <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                <img
                  src={currentStory.afterImage}
                  alt="After solving the issue"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Story Details */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">{currentStory.title}</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{currentStory.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Solved on {formatDate(currentStory.solvedDate)}</span>
                  </div>
                </div>
              </div>

              {/* Solver Info */}
              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground mb-3">Solved by:</p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700">
                    {currentStory.solverAvatar ? (
                      <img
                        src={currentStory.solverAvatar}
                        alt={currentStory.solverName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{currentStory.solverName}</p>
                    <p className="text-sm text-muted-foreground">Community Hero</p>
                  </div>
                </div>
              </div>

              {/* Category Badge */}
              <div className="pt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                  {currentStory.category}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessStoriesShowcase;