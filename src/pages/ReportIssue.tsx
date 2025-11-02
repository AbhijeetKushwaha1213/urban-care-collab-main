
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";
import { Upload, Camera, MapPin, CheckCircle, Loader2, FileText, Image as ImageIcon, X, Sparkles, Wand2 } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import { analyzeMultipleImages, combineImageAnalyses } from "@/services/visionService";
import LocationPicker from "@/components/LocationPicker";

export default function ReportIssuePage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [photos, setPhotos] = useState<string[]>([]);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<{ description: string; category: string } | null>(null);

  // Auto-fetch user location
  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => setLocation(`${pos.coords.latitude}, ${pos.coords.longitude}`),
      () => setLocation("Unable to detect location")
    );
  }, []);

  // Handle multiple photo uploads with AI analysis
  const handlePhotoChange = async (e, captureType = 'file') => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Limit to 5 photos maximum
    const remainingSlots = 5 - photos.length;
    const filesToAdd = files.slice(0, remainingSlots);

    if (files.length > remainingSlots) {
      toast({
        title: "Photo limit reached",
        description: `You can only upload ${remainingSlots} more photo(s). Maximum 5 photos allowed.`,
        variant: "destructive",
      });
    }

    // Create preview URLs and add to state
    const newPhotoUrls = filesToAdd.map(file => URL.createObjectURL(file));
    setPhotos(prev => [...prev, ...newPhotoUrls]);
    setPhotoFiles(prev => [...prev, ...filesToAdd]);

    // Trigger AI analysis for new photos
    if (filesToAdd.length > 0) {
      analyzePhotosWithAI(filesToAdd);
    }

    // Reset input
    e.target.value = '';
  };

  // Analyze photos with Google Vision AI
  const analyzePhotosWithAI = async (newFiles: File[]) => {
    setIsAnalyzing(true);
    try {
      const analyses = await analyzeMultipleImages(newFiles);
      const combined = combineImageAnalyses(analyses);
      
      setAiSuggestion(combined);
      
      toast({
        title: "🤖 AI Analysis Complete",
        description: "Smart description and category suggestions generated!",
      });
    } catch (error) {
      console.error('AI analysis failed:', error);
      toast({
        title: "AI Analysis Failed",
        description: "Unable to analyze images automatically. Please add description manually.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Apply AI suggestions
  const applyAISuggestions = () => {
    if (aiSuggestion) {
      setDescription(aiSuggestion.description);
      setCategory(aiSuggestion.category);
      setAiSuggestion(null);
      
      toast({
        title: "AI Suggestions Applied",
        description: "Description and category have been updated with AI suggestions.",
      });
    }
  };

  // Remove photo from list
  const removePhoto = (index: number) => {
    // Revoke object URL to prevent memory leaks
    URL.revokeObjectURL(photos[index]);
    
    setPhotos(prev => prev.filter((_, i) => i !== index));
    setPhotoFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Clear all photos
  const clearAllPhotos = () => {
    photos.forEach(url => URL.revokeObjectURL(url));
    setPhotos([]);
    setPhotoFiles([]);
    setAiSuggestion(null);
  };

  // Handle location change
  const handleLocationChange = (newLocation: string, coords?: { lat: number; lng: number }) => {
    setLocation(newLocation);
    setCoordinates(coords || null);
  };

  // Handle real submit
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
      const { error } = await supabase
        .from('issues')
        .insert([
          {
            title: title,
            description: description,
            location: location,
            latitude: coordinates?.lat || null,
            longitude: coordinates?.lng || null,
            category: categoryMap[category] || "Other",
            image: null, // For now, we'll skip image upload to keep it simple
            created_by: currentUser.id,
            status: 'reported',
            comments_count: 0,
            volunteers_count: 0,
            created_at: new Date().toISOString(),
          }
        ]);

      if (error) throw error;

      setSubmitted(true);
      toast({
        title: "Issue reported successfully!",
        description: "Your report has been submitted and will be reviewed.",
      });

      // Reset form
      setDescription("");
      setCategory("");
      setLocation("");
      setCoordinates(null);
      setAiSuggestion(null);
      clearAllPhotos();

      // Redirect to issues page after 2 seconds
      setTimeout(() => {
        navigate('/issues');
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-indigo-900 to-gray-900 text-white flex justify-center items-center p-6">
      <Card className="bg-white/10 border-none shadow-2xl w-full max-w-2xl p-6 rounded-3xl">
        <CardContent>
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-3xl font-bold text-center mb-6"
          >
            Report a Civic Issue
          </motion.h1>

          {/* Enhanced Photo Upload Section */}
          <div className="mb-6">
            <label className="block mb-3 text-gray-300 font-medium">
              Add Photos ({photos.length}/5)
            </label>
            
            {/* Photo Upload Options */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              {/* Live Camera Capture */}
              <label className="cursor-pointer flex flex-col items-center gap-2 bg-blue-600 hover:bg-blue-700 p-4 rounded-lg text-white text-sm transition-colors">
                <Camera className="w-6 h-6" />
                <span className="text-center">Live Capture</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  capture="environment"
                  multiple
                  onChange={(e) => handlePhotoChange(e, 'camera')} 
                  className="hidden"
                  disabled={photos.length >= 5}
                />
              </label>

              {/* File Upload */}
              <label className="cursor-pointer flex flex-col items-center gap-2 bg-green-600 hover:bg-green-700 p-4 rounded-lg text-white text-sm transition-colors">
                <FileText className="w-6 h-6" />
                <span className="text-center">Upload Files</span>
                <input 
                  type="file" 
                  accept="image/*"
                  multiple
                  onChange={(e) => handlePhotoChange(e, 'file')} 
                  className="hidden"
                  disabled={photos.length >= 5}
                />
              </label>

              {/* Gallery Selection */}
              <label className="cursor-pointer flex flex-col items-center gap-2 bg-purple-600 hover:bg-purple-700 p-4 rounded-lg text-white text-sm transition-colors">
                <ImageIcon className="w-6 h-6" />
                <span className="text-center">From Gallery</span>
                <input 
                  type="file" 
                  accept="image/*"
                  multiple
                  onChange={(e) => handlePhotoChange(e, 'gallery')} 
                  className="hidden"
                  disabled={photos.length >= 5}
                />
              </label>
            </div>

            {/* Photo Preview Grid */}
            {photos.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-300">
                    Uploaded Photos ({photos.length})
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={clearAllPhotos}
                    className="text-red-400 hover:text-red-300 border-gray-600"
                  >
                    Clear All
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {photos.map((photoUrl, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={photoUrl} 
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 sm:h-32 rounded-lg object-cover border-2 border-gray-600 hover:border-blue-400 transition-colors" 
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="absolute bottom-1 left-1 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                        {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
                
                <p className="text-xs text-gray-400 text-center">
                  Click on photos to view larger. Use the X button to remove individual photos.
                </p>
              </div>
            )}

            {photos.length === 0 && (
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
                <Camera className="w-12 h-12 text-gray-500 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">
                  No photos added yet. Choose from the options above to add up to 5 photos.
                </p>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block mb-2 text-gray-300 font-medium">Description</label>
            <Textarea
              placeholder="Describe the issue briefly..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-gray-800 text-white border-gray-700 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Category */}
          <div className="mb-6">
            <label className="block mb-2 text-gray-300 font-medium">Category</label>
            <Select onValueChange={(value) => setCategory(value)}>
              <SelectTrigger className="bg-gray-800 text-white border-gray-700">
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
          <div className="mb-6">
            <label className="block mb-2 text-gray-300 font-medium flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Location
            </label>
            <LocationPicker
              value={location}
              onChange={handleLocationChange}
              placeholder="Auto-detected or enter manually"
            />
          </div>



          {/* Submit Button */}
          <div className="text-center">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 text-lg rounded-full shadow-lg disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
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
              className="mt-6 text-center flex flex-col items-center"
            >
              <CheckCircle className="w-10 h-10 text-green-400 mb-2" />
              <p className="text-green-300 font-medium">Report submitted successfully! You'll receive updates shortly.</p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
