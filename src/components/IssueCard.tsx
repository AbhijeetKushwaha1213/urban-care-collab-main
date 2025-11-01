
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, MessageSquare, Calendar, Users, ThumbsUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

interface IssueCardProps {
  id: string;
  title: string;
  description: string;
  location: string;
  category: string;
  image?: string;
  date: string;
  commentsCount: number;
  volunteersCount: number;
  isFeatured?: boolean;
  className?: string;
  onUpvoteUpdate?: (id: string, newCount: number) => void;
}

const categoryColors = {
  'Trash': 'bg-amber-50 text-amber-600 border-amber-200',
  'Water': 'bg-blue-50 text-blue-600 border-blue-200',
  'Infrastructure': 'bg-purple-50 text-purple-600 border-purple-200',
  'Electricity': 'bg-yellow-50 text-yellow-600 border-yellow-200',
  'Drainage': 'bg-green-50 text-green-600 border-green-200',
  'Other': 'bg-gray-50 text-gray-600 border-gray-200'
};

const getCategoryClass = (category: string) => {
  return categoryColors[category as keyof typeof categoryColors] || categoryColors['Other'];
};

const IssueCard: React.FC<IssueCardProps> = ({
  id,
  title,
  description,
  location,
  category,
  image,
  date,
  commentsCount,
  volunteersCount,
  isFeatured = false,
  className,
  onUpvoteUpdate
}) => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [upvoted, setUpvoted] = useState(false);
  const [currentUpvoteCount, setCurrentUpvoteCount] = useState(volunteersCount);
  const [isUpvoting, setIsUpvoting] = useState(false);

  // Check if user has upvoted this issue
  useEffect(() => {
    if (currentUser) {
      const userUpvotes = JSON.parse(localStorage.getItem('userUpvotes') || '[]');
      setUpvoted(userUpvotes.includes(id));
    }
  }, [id, currentUser]);

  // Update local count when prop changes
  useEffect(() => {
    setCurrentUpvoteCount(volunteersCount);
  }, [volunteersCount]);

  // Handle upvote
  const handleUpvote = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to detail page
    e.stopPropagation();

    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "Please sign in to upvote issues",
        variant: "destructive",
      });
      return;
    }

    if (isUpvoting) return; // Prevent double clicks

    setIsUpvoting(true);

    try {
      const newUpvoteState = !upvoted;
      const newCount = newUpvoteState ? currentUpvoteCount + 1 : currentUpvoteCount - 1;
      
      // Update database
      const { error } = await supabase
        .from('issues')
        .update({ volunteers_count: newCount })
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setUpvoted(newUpvoteState);
      setCurrentUpvoteCount(newCount);
      
      // Update parent component if callback provided
      if (onUpvoteUpdate) {
        onUpvoteUpdate(id, newCount);
      }
      
      // Store user's upvote in localStorage
      const userUpvotes = JSON.parse(localStorage.getItem('userUpvotes') || '[]');
      if (newUpvoteState) {
        userUpvotes.push(id);
      } else {
        const index = userUpvotes.indexOf(id);
        if (index > -1) userUpvotes.splice(index, 1);
      }
      localStorage.setItem('userUpvotes', JSON.stringify(userUpvotes));
      
      toast({
        title: newUpvoteState ? "Issue upvoted!" : "Upvote removed",
        description: newUpvoteState ? "Thanks for supporting this issue!" : "You removed your upvote",
      });
    } catch (error) {
      console.error('Error updating upvote:', error);
      toast({
        title: "Error",
        description: "Failed to update upvote",
        variant: "destructive",
      });
    } finally {
      setIsUpvoting(false);
    }
  };

  return (
    <div className={cn(
      "rounded-xl overflow-hidden bg-white border border-border/50 shadow-subtle hover:shadow-md transition-shadow",
      className
    )}>
      <Link to={`/issues/${id}`} className="block">
        {image && (
          <div className="relative w-full h-48 overflow-hidden">
            <img 
              src={image} 
              alt={title} 
              className="w-full h-full object-cover" 
              loading="lazy" 
            />
            <div 
              className={cn(
                "absolute top-3 left-3 px-2 py-1 rounded-md text-xs font-medium border",
                getCategoryClass(category)
              )}
            >
              {category}
            </div>
          </div>
        )}
        
        <div className="p-5">
          {!image && (
            <div 
              className={cn(
                "inline-flex mb-2 px-2 py-1 rounded-md text-xs font-medium border",
                getCategoryClass(category)
              )}
            >
              {category}
            </div>
          )}
          
          <h3 className={cn(
            "font-semibold mb-2 text-balance",
            isFeatured ? "text-2xl" : "text-lg"
          )}>
            {title}
          </h3>
          
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
            {description}
          </p>
          
          <div className="flex items-center text-xs text-muted-foreground mb-3">
            <MapPin className="h-3 w-3 mr-1" />
            <span className="truncate">{location}</span>
          </div>
        </div>
      </Link>
      
      {/* Action Bar - Outside the Link to prevent navigation conflicts */}
      <div className="px-5 pb-4">
        <div className="flex items-center justify-between pt-4 border-t border-border/30">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleUpvote}
              disabled={isUpvoting}
              className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-colors",
                upvoted 
                  ? "bg-blue-100 text-blue-700 hover:bg-blue-200" 
                  : "text-gray-600 hover:bg-gray-100",
                isUpvoting && "opacity-50 cursor-not-allowed"
              )}
            >
              <ThumbsUp className={cn("h-3 w-3", upvoted && "fill-current")} />
              <span>{currentUpvoteCount}</span>
            </button>
            
            <Link 
              to={`/issues/${id}`}
              className="flex items-center gap-1 text-gray-600 hover:text-gray-800 text-xs"
            >
              <MessageSquare className="h-3 w-3" />
              <span>{commentsCount}</span>
            </Link>
          </div>
          
          <div className="flex items-center text-xs text-gray-500">
            <Calendar className="h-3 w-3 mr-1" />
            <span>{date}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueCard;
