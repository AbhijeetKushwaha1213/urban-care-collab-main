
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, ArrowLeft, Send, ThumbsUp, MessageSquare, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/supabase';

// Helper functions
const getStatusIcon = (status) => {
  switch (status) {
    case 'resolved':
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case 'in_progress':
      return <Clock className="h-5 w-5 text-yellow-500" />;
    default:
      return <AlertCircle className="h-5 w-5 text-red-500" />;
  }
};

const getStatusText = (status) => {
  switch (status) {
    case 'resolved':
      return 'Resolved';
    case 'in_progress':
      return 'In Progress';
    case 'assigned':
      return 'Assigned';
    default:
      return 'Pending';
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'resolved':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'in_progress':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'assigned':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    default:
      return 'bg-red-100 text-red-800 border-red-200';
  }
};

const IssueDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([
    {
      id: "c1",
      user: { name: "Sarah Miller", avatar: "" },
      content: "I noticed this issue too. It really needs attention from the authorities.",
      timestamp: "2 days ago"
    },
    {
      id: "c2",
      user: { name: "David Wilson", avatar: "" },
      content: "Thanks for reporting this. I'll help spread awareness in the community.",
      timestamp: "1 day ago"
    }
  ]);
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [upvoted, setUpvoted] = useState(false);
  const [upvoteCount, setUpvoteCount] = useState(0);

  // Fetch issue data
  useEffect(() => {
    const fetchIssue = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from('issues')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        
        setIssue(data);
        setUpvoteCount(data.volunteers_count || 0);
      } catch (error) {
        console.error('Error fetching issue:', error);
        toast({
          title: "Error loading issue",
          description: "Failed to load issue details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchIssue();
  }, [id, toast]);

  // Handle upvote
  const handleUpvote = async () => {
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "Please sign in to upvote issues",
        variant: "destructive",
      });
      return;
    }

    try {
      const newCount = upvoted ? upvoteCount - 1 : upvoteCount + 1;
      
      const { error } = await supabase
        .from('issues')
        .update({ volunteers_count: newCount })
        .eq('id', id);

      if (error) throw error;

      setUpvoted(!upvoted);
      setUpvoteCount(newCount);
      
      toast({
        title: upvoted ? "Upvote removed" : "Issue upvoted",
        description: upvoted ? "You removed your upvote" : "Thanks for supporting this issue!",
      });
    } catch (error) {
      console.error('Error updating upvote:', error);
      toast({
        title: "Error",
        description: "Failed to update upvote",
        variant: "destructive",
      });
    }
  };
  
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "Please sign in to comment",
        variant: "destructive",
      });
      return;
    }
    
    if (!comment.trim()) return;
    
    const newComment = {
      id: `c${comments.length + 1}`,
      user: { name: currentUser.displayName || "You", avatar: "" },
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

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-32 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading issue details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-32 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Issue not found</h2>
            <p className="text-gray-600 mb-4">The issue you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/issues')}>Back to Issues</Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="pt-32 pb-20 px-4 md:px-6 container mx-auto">
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={() => navigate('/issues')}
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span>Back to Issues</span>
          </button>
          
          {/* Issue Image */}
          <div className="rounded-xl overflow-hidden mb-6">
            <div className="h-64 md:h-80 bg-secondary flex items-center justify-center overflow-hidden">
              {issue.image ? (
                <img 
                  src={issue.image} 
                  alt={issue.title} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center">
                  <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No image available</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Issue Title and Status */}
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-3xl md:text-4xl font-semibold flex-1 pr-4">{issue.title}</h1>
            <div className="flex items-center gap-2">
              {getStatusIcon(issue.status)}
              <Badge className={`${getStatusColor(issue.status)} border`}>
                {getStatusText(issue.status)}
              </Badge>
            </div>
          </div>
          
          {/* Issue Meta Information */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-1.5" />
              <span>Reported {new Date(issue.created_at).toLocaleDateString()}</span>
            </div>
            
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mr-1.5" />
              <span>{issue.location}</span>
            </div>
            
            <Badge variant="outline" className="text-xs">
              {issue.category}
            </Badge>
          </div>
          
          {/* Issue Description */}
          <div className="bg-card border rounded-xl p-6 mb-8">
            <div className="prose prose-sm max-w-none">
              {issue.description.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-4 text-foreground/90 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
          
          {/* Upvote and Engagement Section */}
          <div className="bg-card border rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <button
                  onClick={handleUpvote}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    upvoted 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-secondary hover:bg-secondary/80'
                  }`}
                >
                  <ThumbsUp className="h-4 w-4" />
                  <span>{upvoteCount} upvotes</span>
                </button>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MessageSquare className="h-4 w-4" />
                  <span>{issue.comments_count || 0} comments</span>
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground">
                Status: <span className="font-medium">{getStatusText(issue.status)}</span>
              </div>
            </div>
          </div>
          
          {/* Comments Section */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Discussion ({comments.length})</h2>
            
            {comments.length > 0 ? (
              <div className="space-y-6 mb-8">
                {comments.map((comment) => (
                  <div key={comment.id} className="bg-card border rounded-lg p-4">
                    <div className="flex items-start gap-3 mb-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <div className="font-semibold text-xs text-primary">
                          {comment.user.name.charAt(0)}
                        </div>
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
            ) : (
              <div className="text-center py-8 mb-8">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No comments yet. Be the first to share your thoughts!</p>
              </div>
            )}
            
            {currentUser ? (
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
            ) : (
              <div className="bg-card border rounded-lg p-6 text-center">
                <p className="text-gray-600 mb-4">Sign in to join the discussion</p>
                <Button onClick={() => navigate('/')}>Sign In</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueDetail;
