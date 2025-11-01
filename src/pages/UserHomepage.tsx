import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Eye, ThumbsUp, MessageSquare, MapPin, Calendar, AlertCircle, CheckCircle, Clock, X } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from '@/components/ui/select';
import { Camera, Mic, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

const UserHomepage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [userIssues, setUserIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  
  // Report form state
  const [photo, setPhoto] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [voiceNote, setVoiceNote] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-fetch user location
  useEffect(() => {
    if (reportModalOpen) {
      navigator.geolocation?.getCurrentPosition(
        (pos) => setLocation(`${pos.coords.latitude}, ${pos.coords.longitude}`),
        () => setLocation("Unable to detect location")
      );
    }
  }, [reportModalOpen]);

  // Fetch user's issues
  useEffect(() => {
    const fetchUserIssues = async () => {
      if (!currentUser) return;
      
      try {
        const { data, error } = await supabase
          .from('issues')
          .select('*')
          .eq('created_by', currentUser.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setUserIssues(data || []);
      } catch (error) {
        console.error('Error fetching user issues:', error);
        toast({
          title: "Error loading issues",
          description: "Failed to load your reported issues",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserIssues();
  }, [currentUser]);

  // Handle photo upload
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPhoto(URL.createObjectURL(file));
    }
  };

  // Handle report submission
  const handleSubmit = async () => {
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "Please sign in to report an issue",
        variant: "destructive",
      });
      return;
    }

    // Basic validation
    if (!description.trim()) {
      toast({
        title: "Description required",
        description: "Please provide a description of the issue",
        variant: "destructive",
      });
      return;
    }

    if (!category) {
      toast({
        title: "Category required",
        description: "Please select a category for the issue",
        variant: "destructive",
      });
      return;
    }

    if (!location.trim()) {
      toast({
        title: "Location required",
        description: "Please provide a location for the issue",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Create a title from description (first 50 characters)
      const title = description.length > 50 ? description.substring(0, 47) + "..." : description;
      
      // Map category values to display names
      const categoryMap = {
        pothole: "Infrastructure",
        streetlight: "Electricity", 
        waste: "Trash",
        water: "Water",
        others: "Other"
      };

      // Submit issue to database
      const { data, error } = await supabase
        .from('issues')
        .insert([
          {
            title: title,
            description: description,
            location: location,
            category: categoryMap[category] || "Other",
            image: null, // For now, we'll skip image upload to keep it simple
            created_by: currentUser.id,
            status: 'reported',
            comments_count: 0,
            volunteers_count: 0,
            created_at: new Date().toISOString(),
          }
        ])
        .select();

      if (error) throw error;

      setSubmitted(true);
      toast({
        title: "Issue reported successfully!",
        description: "Your report has been submitted and will be reviewed.",
      });

      // Add the new issue to the list
      if (data && data[0]) {
        setUserIssues(prev => [data[0], ...prev]);
      }

      // Reset form and close modal after 2 seconds
      setTimeout(() => {
        setReportModalOpen(false);
        setSubmitted(false);
        setDescription("");
        setCategory("");
        setLocation("");
        setPhoto(null);
        setPhotoFile(null);
        setVoiceNote(null);
      }, 2000);

    } catch (error) {
      console.error("Error submitting issue:", error);
      toast({
        title: "Failed to submit report",
        description: "An error occurred while submitting your report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-red-500" />;
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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="flex-1 pt-20">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Reported Issues</h1>
                <p className="text-gray-600 mt-1">Track and manage your community reports</p>
              </div>
              <Button 
                onClick={() => setReportModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Report Issue
              </Button>
            </div>
          </div>
        </div>

        {/* Issues List */}
        <div className="container mx-auto px-4 py-8">
          {userIssues.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No issues reported yet</h3>
              <p className="text-gray-600 mb-6">Start by reporting your first community issue</p>
              <Button onClick={() => setReportModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Report Your First Issue
              </Button>
            </div>
          ) : (
            <div className="grid gap-6">
              {userIssues.map((issue) => (
                <Card key={issue.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      {/* Issue Image */}
                      <div className="flex-shrink-0">
                        {issue.image ? (
                          <img 
                            src={issue.image} 
                            alt={issue.title}
                            className="w-24 h-24 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-24 h-24 rounded-lg bg-gray-200 flex items-center justify-center">
                            <AlertCircle className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* Issue Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 truncate pr-4">
                            {issue.title}
                          </h3>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(issue.status)}
                            <Badge className={`${getStatusColor(issue.status)} border`}>
                              {getStatusText(issue.status)}
                            </Badge>
                          </div>
                        </div>

                        <p className="text-gray-600 mb-3 line-clamp-2">
                          {issue.description}
                        </p>

                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span className="truncate">{issue.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(issue.created_at).toLocaleDateString()}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {issue.category}
                          </Badge>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <ThumbsUp className="h-4 w-4" />
                              <span>{issue.volunteers_count || 0} upvotes</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageSquare className="h-4 w-4" />
                              <span>{issue.comments_count || 0} comments</span>
                            </div>
                          </div>
                          
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate(`/issues/${issue.id}`)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View Issue
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Report Issue Modal */}
      <Dialog open={reportModalOpen} onOpenChange={setReportModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">Report a Civic Issue</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Photo Upload Section */}
            <div>
              <label className="block mb-2 text-gray-700 font-medium">Upload / Capture Photo</label>
              <div className="flex items-center gap-4">
                <label className="cursor-pointer flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-full text-white text-sm">
                  <Camera className="w-5 h-5" /> Capture / Upload
                  <input 
                    type="file" 
                    accept="image/*" 
                    capture="camera" 
                    onChange={handlePhotoChange} 
                    className="hidden" 
                  />
                </label>
                {photo && (
                  <img 
                    src={photo} 
                    alt="Preview" 
                    className="w-16 h-16 rounded-lg object-cover border border-gray-300" 
                  />
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block mb-2 text-gray-700 font-medium">Description</label>
              <Textarea
                placeholder="Describe the issue briefly..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block mb-2 text-gray-700 font-medium">Category</label>
              <Select onValueChange={(value) => setCategory(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select issue category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pothole">🚧 Pothole</SelectItem>
                  <SelectItem value="streetlight">💡 Streetlight</SelectItem>
                  <SelectItem value="waste">🗑️ Waste Management</SelectItem>
                  <SelectItem value="water">💧 Water Leakage</SelectItem>
                  <SelectItem value="others">🔧 Others</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Location */}
            <div>
              <label className="block mb-2 text-gray-700 font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Location
              </label>
              <Input
                placeholder="Auto-detected or enter manually"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            {/* Voice Note */}
            <div>
              <label className="block mb-2 text-gray-700 font-medium flex items-center gap-2">
                <Mic className="w-4 h-4" /> Add Voice Note (optional)
              </label>
              <Input
                type="file"
                accept="audio/*"
                capture="microphone"
                onChange={(e) => setVoiceNote(e.target.files[0])}
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setReportModalOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-pink-600 hover:bg-pink-700"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting...
                  </span>
                ) : (
                  "Submit Report"
                )}
              </Button>
            </div>

            {/* Success Message */}
            {submitted && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center flex flex-col items-center p-4 bg-green-50 rounded-lg"
              >
                <CheckCircle className="w-10 h-10 text-green-500 mb-2" />
                <p className="text-green-700 font-medium">Report submitted successfully! You'll receive updates shortly.</p>
              </motion.div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserHomepage;