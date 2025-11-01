
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";
import { Upload, Camera, MapPin, Mic, CheckCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

export default function ReportIssuePage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
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
    navigator.geolocation?.getCurrentPosition(
      (pos) => setLocation(`${pos.coords.latitude}, ${pos.coords.longitude}`),
      () => setLocation("Unable to detect location")
    );
  }, []);

  // Handle photo upload
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPhoto(URL.createObjectURL(file));
    }
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

          {/* Photo Upload Section */}
          <div className="mb-6">
            <label className="block mb-2 text-gray-300 font-medium">Upload / Capture Photo</label>
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
                  className="w-16 h-16 rounded-lg object-cover border border-gray-500" 
                />
              )}
            </div>
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
            <Input
              placeholder="Auto-detected or enter manually"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="bg-gray-800 text-white border-gray-700"
            />
          </div>

          {/* Voice Note */}
          <div className="mb-6">
            <label className="block mb-2 text-gray-300 font-medium flex items-center gap-2">
              <Mic className="w-4 h-4" /> Add Voice Note (optional)
            </label>
            <Input
              type="file"
              accept="audio/*"
              capture="microphone"
              onChange={(e) => setVoiceNote(e.target.files[0])}
              className="bg-gray-800 text-white border-gray-700"
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
