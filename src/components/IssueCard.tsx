
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, MessageSquare, Calendar, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

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
}

const categoryColors = {
  'Trash': 'bg-amber-50 text-amber-600 border-amber-200',
  'Water': 'bg-blue-50 text-blue-600 border-blue-200',
  'Infrastructure': 'bg-purple-50 text-purple-600 border-purple-200',
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
  className
}) => {
  return (
    <Link 
      to={`/issues/${id}`} 
      className={cn(
        "block rounded-xl overflow-hidden bg-white border border-border/50 shadow-subtle hover-scale",
        className
      )}
    >
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
        
        <div className="flex items-center justify-between pt-4 border-t border-border/30">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <MessageSquare className="h-3 w-3 mr-1" />
              <span className="text-xs">{commentsCount}</span>
            </div>
            <div className="flex items-center">
              <Users className="h-3 w-3 mr-1" />
              <span className="text-xs">{volunteersCount}</span>
            </div>
          </div>
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            <span className="text-xs">{date}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default IssueCard;
