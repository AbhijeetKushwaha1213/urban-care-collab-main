
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Calendar, ArrowLeft, Send } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Navbar from '@/components/Navbar';
import IssueStatus from '@/components/IssueStatus';
import CommunityEvent from '@/components/CommunityEvent';

// Mock issue data
const issueData = {
  id: "1",
  title: "Broken Park Benches in Willowbrook Park",
  description: "Several park benches in Willowbrook Park have been damaged and need repair. This has been an ongoing issue for several months, making it difficult for elderly visitors to enjoy the park.\n\nThe benches located near the central fountain and along the eastern pathway are in the worst condition, with splintered wood and missing slats. Some have graffiti and the metal frames of a few are bent or rusted.\n\nThis issue affects many park visitors, especially seniors who need places to rest while enjoying the park.",
  category: "Infrastructure",
  status: "in-progress" as const,
  location: "Willowbrook Park, Main Avenue",
  createdAt: "3 days ago",
  updatedAt: "1 day ago",
  images: [
    "https://images.unsplash.com/photo-1604357209793-fca5dca89f97?q=80&w=900&auto=format&fit=crop"
  ],
  user: {
    name: "Michael Johnson",
    avatar: ""
  },
  volunteersCount: 12,
  supportCount: 24,
  commentsCount: 5,
  comments: [
    {
      id: "c1",
      user: { name: "Sarah Miller", avatar: "" },
      content: "I noticed this too. The benches on the east side are completely unusable.",
      timestamp: "2 days ago"
    },
    {
      id: "c2",
      user: { name: "David Wilson", avatar: "" },
      content: "We should organize a community repair day. I have some woodworking skills I can contribute.",
      timestamp: "2 days ago"
    },
    {
      id: "c3",
      user: { name: "Rebecca Taylor", avatar: "" },
      content: "I've contacted the parks department about this. They said they'll look into it but don't have immediate funds for repairs.",
      timestamp: "1 day ago"
    },
    {
      id: "c4",
      user: { name: "John Smith", avatar: "" },
      content: "I can donate some materials if we organize a community repair event.",
      timestamp: "1 day ago"
    },
    {
      id: "c5",
      user: { name: "Michael Johnson", avatar: "" },
      content: "Thanks everyone for the support! I'll help coordinate a community repair day.",
      timestamp: "12 hours ago"
    }
  ]
};

// Mock community event data
const eventData = {
  title: "Willowbrook Park Bench Repair Day",
  date: "Saturday, June 15th, 2024",
  time: "10:00 AM - 2:00 PM",
  location: "Willowbrook Park, Main Entrance",
  organizer: "Michael Johnson",
  attendees: 12,
  description: "Join us for a community event to repair the damaged benches in Willowbrook Park. We'll be focusing on sanding, replacing damaged slats, and repainting. Tools and materials will be provided, but feel free to bring your own if you have them!"
};

const IssueDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(issueData.comments);
  
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!comment.trim()) return;
    
    const newComment = {
      id: `c${comments.length + 1}`,
      user: { name: "You", avatar: "" },
      content: comment,
      timestamp: "Just now"
    };
    
    setComments([...comments, newComment]);
    setComment('');
    
    toast({
      title: "Comment Posted",
      description: "Your comment has been added to the discussion.",
    });
  };
  
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="pt-32 pb-20 px-4 md:px-6 container mx-auto">
        <div className="max-w-4xl mx-auto">
          <a href="/issues" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span>Back to Issues</span>
          </a>
          
          <div className="rounded-xl overflow-hidden mb-6">
            <div className="h-64 md:h-80 bg-secondary flex items-center justify-center overflow-hidden">
              <img 
                src={issueData.images[0]} 
                alt={issueData.title} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-semibold mb-4">{issueData.title}</h1>
          
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-1.5" />
              <span>Reported {issueData.createdAt}</span>
            </div>
            
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mr-1.5" />
              <span>{issueData.location}</span>
            </div>
          </div>
          
          <div className="bg-card border rounded-xl p-6 mb-8">
            <div className="flex items-start gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                {issueData.user.avatar ? (
                  <img 
                    src={issueData.user.avatar} 
                    alt={issueData.user.name} 
                    className="h-full w-full object-cover rounded-full"
                  />
                ) : (
                  <div className="font-semibold text-primary">
                    {issueData.user.name.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <div className="font-medium">{issueData.user.name}</div>
                <div className="text-sm text-muted-foreground">Issue Reporter</div>
              </div>
            </div>
            
            <div className="prose prose-sm max-w-none">
              {issueData.description.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-4 text-foreground/90 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
          
          {/* Issue Status Component */}
          <IssueStatus 
            status={issueData.status}
            createdAt={issueData.createdAt}
            updatedAt={issueData.updatedAt}
            volunteersCount={issueData.volunteersCount}
            supportCount={issueData.supportCount}
            commentsCount={issueData.commentsCount}
          />
          
          {/* Community Event Component */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Community Event</h2>
            <CommunityEvent {...eventData} />
          </div>
          
          {/* Comments Section */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Discussion ({comments.length})</h2>
            
            <div className="space-y-6 mb-8">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-card border rounded-lg p-4">
                  <div className="flex items-start gap-3 mb-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      {comment.user.avatar ? (
                        <img 
                          src={comment.user.avatar} 
                          alt={comment.user.name} 
                          className="h-full w-full object-cover rounded-full"
                        />
                      ) : (
                        <div className="font-semibold text-xs text-primary">
                          {comment.user.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{comment.user.name}</span>
                        <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                      </div>
                      <p className="text-sm mt-1">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <form onSubmit={handleCommentSubmit} className="bg-card border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-3">Add your comment</h3>
              <div className="mb-3">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-3 rounded-lg border border-input bg-background resize-none"
                  placeholder="Share your thoughts on this issue..."
                  rows={3}
                  required
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit" className="flex items-center">
                  <span>Post Comment</span>
                  <Send className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueDetail;
