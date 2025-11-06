
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";
import { Upload, Camera, MapPin, CheckCircle, Loader2, FileText, Image as ImageIcon, X, Sparkles, Wand2, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import { analyzeMultipleImages, combineImageAnalyses } from "@/services/visionService";
import { checkForDuplicates, DuplicateDetectionResult } from "@/services/duplicateDetectionService";
import LocationPicker from "@/components/LocationPicker";
import DuplicateIssueModal from "@/components/DuplicateIssueModal";

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
  const [isCheckingDuplicates, setIsCheckingDuplicates] = useState(false);
  const [duplicateResult, setDuplicateResult] = useState<DuplicateDetectionResult | null>(null);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  
  // Enhanced form state
  const [formProgress, setFormProgress] = useState(0);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const [isDraftSaved, setIsDraftSaved] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  // Auto-fetch user location and load draft
  useEffect(() => {
    // Load draft from localStorage
    loadDraft();
    
    // Get user location
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        const locationString = `${pos.coords.latitude}, ${pos.coords.longitude}`;
        setLocation(locationString);
        setCoordinates({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      (error) => {
        console.warn('Location access denied:', error);
        setLocation("Location access denied - please enter manually");
      }
    );
  }, []);

  // Calculate form progress and validate
  useEffect(() => {
    calculateFormProgress();
    validateForm();
    saveDraft();
  }, [description, category, location, photos]);

  // Calculate form completion progress
  const calculateFormProgress = () => {
    let progress = 0;
    const totalFields = 4; // description, category, location, photos
    
    if (description.trim()) progress += 25;
    if (category) progress += 25;
    if (location.trim()) progress += 25;
    if (photos.length > 0) progress += 25;
    
    setFormProgress(progress);
  };

  // Enhanced form validation
  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!description.trim()) {
      errors.description = "Description is required";
    } else if (description.trim().length < 10) {
      errors.description = "Description must be at least 10 characters";
    }
    
    if (!category) {
      errors.category = "Please select a category";
    }
    
    if (!location.trim()) {
      errors.location = "Location is required";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Save draft to localStorage
  const saveDraft = () => {
    if (description || category || location || photos.length > 0) {
      const draft = {
        description,
        category,
        location,
        coordinates,
        timestamp: Date.now()
      };
      localStorage.setItem('issue_draft', JSON.stringify(draft));
      setIsDraftSaved(true);
    }
  };

  // Load draft from localStorage
  const loadDraft = () => {
    try {
      const draftStr = localStorage.getItem('issue_draft');
      if (draftStr) {
        const draft = JSON.parse(draftStr);
        // Only load if draft is less than 24 hours old
        if (Date.now() - draft.timestamp < 24 * 60 * 60 * 1000) {
          setDescription(draft.description || '');
          setCategory(draft.category || '');
          setLocation(draft.location || '');
          setCoordinates(draft.coordinates || null);
          
          toast({
            title: "Draft restored",
            description: "Your previous draft has been restored.",
          });
        } else {
          // Clear old draft
          localStorage.removeItem('issue_draft');
        }
      }
    } catch (error) {
      console.error('Error loading draft:', error);
    }
  };

  // Clear draft
  const clearDraft = () => {
    localStorage.removeItem('issue_draft');
    setIsDraftSaved(false);
  };

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

  // Convert images to base64 for database storage (temporary solution)
  const convertImagesToBase64 = async (files: File[]): Promise<string[]> => {
    const base64Images: string[] = [];
    
    for (let i = 0; i < files.length && i < 1; i++) { // Only take first image for now
      const file = files[i];
      
      try {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        
        base64Images.push(base64);
      } catch (error) {
        console.error('Error converting image to base64:', error);
      }
    }

    return base64Images;
  };

  // Handle duplicate check and submission
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

    // Step 1: Check for duplicates
    setIsCheckingDuplicates(true);
    try {
      toast({
        title: "Checking for duplicates...",
        description: "Analyzing your issue for potential duplicates.",
      });

      // Convert images for duplicate checking
      let imageBase64: string | undefined;
      if (photoFiles.length > 0) {
        const imageUrls = await convertImagesToBase64(photoFiles);
        imageBase64 = imageUrls[0];
      }

      // Map category for duplicate checking
      const categoryMap = {
        pothole: "Infrastructure",
        streetlight: "Electricity", 
        waste: "Trash",
        water: "Water",
        others: "Other"
      };

      const mappedCategory = categoryMap[category] || "Other";

      // Check for duplicates
      const duplicateCheck = await checkForDuplicates(
        description,
        location,
        coordinates,
        imageBase64,
        mappedCategory
      );

      setDuplicateResult(duplicateCheck);

      if (duplicateCheck.isDuplicate && duplicateCheck.confidence > 0.6) {
        // Show duplicate modal
        setShowDuplicateModal(true);
        setIsCheckingDuplicates(false);
        return;
      }

      // No duplicates found, proceed with submission
      await submitIssue();

    } catch (error) {
      console.error('Error checking for duplicates:', error);
      toast({
        title: "Duplicate check failed",
        description: "Proceeding with submission anyway.",
        variant: "destructive",
      });
      // Proceed with submission even if duplicate check fails
      await submitIssue();
    } finally {
      setIsCheckingDuplicates(false);
    }
  };

  // Actual submission function
  const submitIssue = async () => {
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

      // Convert images if any
      let imageUrls: string[] = [];
      if (photoFiles.length > 0) {
        toast({
          title: "Processing images...",
          description: "Please wait while we process your photos.",
        });
        imageUrls = await convertImagesToBase64(photoFiles);
      }

      // Prepare issue data
      const issueData = {
        title: title,
        description: description,
        location: location,
        category: categoryMap[category] || "Other",
        image: imageUrls.length > 0 ? imageUrls[0] : null, // Primary image (first uploaded image)
        created_by: currentUser.id,
        status: 'reported',
        comments_count: 0,
        volunteers_count: 0,
        created_at: new Date().toISOString(),
      };

      console.log('Submitting issue data:', issueData);

      // Submit issue to database
      const { data, error } = await supabase
        .from('issues')
        .insert([issueData])
        .select();

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
      
      let errorMessage = "An error occurred while submitting your report. Please try again.";
      
      if (error?.message) {
        errorMessage = `Submission failed: ${error.message}`;
      }
      
      toast({
        title: "Failed to submit report",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle duplicate modal actions
  const handleProceedAnyway = async () => {
    setShowDuplicateModal(false);
    await submitIssue();
  };

  const handleCancelSubmission = () => {
    setShowDuplicateModal(false);
    setDuplicateResult(null);
    toast({
      title: "Submission cancelled",
      description: "Your issue was not submitted. You can review the similar issues or modify your report.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-indigo-900 to-gray-900 text-white flex justify-center items-center p-6">
      <Card className="bg-white/10 border-none shadow-2xl w-full max-w-2xl p-6 rounded-3xl">
        <CardContent>
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center mb-6"
          >
            <h1 className="text-3xl font-bold mb-4">Report a Civic Issue</h1>
            
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm text-gray-300 mb-2">
                <span>Form Progress</span>
                <span>{formProgress}% Complete</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${formProgress}%` }}
                ></div>
              </div>
              {formProgress === 100 && (
                <p className="text-green-400 text-sm mt-2 flex items-center justify-center gap-1">
                  <CheckCircle className="h-4 w-4" />
                  Ready to submit!
                </p>
              )}
            </div>

            {/* Draft Status */}
            {isDraftSaved && (
              <div className="bg-blue-900/30 border border-blue-600/50 rounded-lg p-3 mb-4">
                <p className="text-blue-300 text-sm flex items-center justify-center gap-2">
                  <FileText className="h-4 w-4" />
                  Draft saved automatically
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearDraft}
                    className="text-blue-400 hover:text-blue-300 p-1 h-auto"
                  >
                    Clear
                  </Button>
                </p>
              </div>
            )}
          </motion.div>

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

          {/* Enhanced Description */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-gray-300 font-medium flex items-center gap-2">
                Description *
                {description.trim() && (
                  <CheckCircle className="h-4 w-4 text-green-400" />
                )}
              </label>
              {photos.length > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => analyzePhotosWithAI(photoFiles)}
                  disabled={isAnalyzing}
                  className="text-blue-400 hover:text-blue-300 border-gray-600 hover:border-blue-400"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-1" />
                      Generate Description
                    </>
                  )}
                </Button>
              )}
            </div>
            <Textarea
              placeholder="Describe the issue briefly or use AI to generate from photos"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`bg-gray-800 text-white border-gray-700 focus:ring-2 focus:ring-indigo-500 ${
                validationErrors.description ? 'border-red-500 focus:ring-red-500' : ''
              }`}
              rows={4}
            />
            <div className="flex items-center justify-between mt-2">
              <div>
                {validationErrors.description && (
                  <p className="text-red-400 text-sm">{validationErrors.description}</p>
                )}
              </div>
              <p className="text-gray-400 text-sm">
                {description.length}/500 characters
              </p>
            </div>
          </div>

          {/* AI Suggestions */}
          {aiSuggestion && (
            <div className="mb-6">
              <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border border-blue-600/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-5 w-5 text-blue-400" />
                  <span className="font-medium text-blue-300">AI Smart Suggestions</span>
                  {isAnalyzing && (
                    <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
                  )}
                </div>
                {aiSuggestion && (
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-300">Suggested Description:</span>
                      <p className="text-sm text-gray-400 bg-gray-800/50 p-2 rounded border border-gray-600">{aiSuggestion.description}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-300">Suggested Category:</span>
                      <p className="text-sm text-gray-400 bg-gray-800/50 p-2 rounded border border-gray-600">{aiSuggestion.category}</p>
                    </div>
                    <Button
                      type="button"
                      onClick={applyAISuggestions}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Wand2 className="h-4 w-4 mr-1" />
                      Apply Suggestions
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Enhanced Category */}
          <div className="mb-6">
            <label className="block mb-2 text-gray-300 font-medium flex items-center gap-2">
              Category *
              {category && (
                <CheckCircle className="h-4 w-4 text-green-400" />
              )}
            </label>
            <Select value={category} onValueChange={(value) => setCategory(value)}>
              <SelectTrigger className={`bg-gray-800 text-white border-gray-700 ${
                validationErrors.category ? 'border-red-500' : ''
              }`}>
                <SelectValue placeholder="Select issue category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pothole">🚧 Infrastructure - Pothole</SelectItem>
                <SelectItem value="streetlight">💡 Electricity - Streetlight</SelectItem>
                <SelectItem value="waste">🗑️ Waste Management</SelectItem>
                <SelectItem value="water">💧 Water - Leakage/Supply</SelectItem>
                <SelectItem value="others">🔧 Other Issues</SelectItem>
              </SelectContent>
            </Select>
            {validationErrors.category && (
              <p className="text-red-400 text-sm mt-1">{validationErrors.category}</p>
            )}
          </div>

          {/* Enhanced Location */}
          <div className="mb-6">
            <label className="block mb-2 text-gray-300 font-medium flex items-center gap-2">
              <MapPin className="w-4 h-4" /> 
              Location *
              {location.trim() && !location.includes("Unable to detect") && !location.includes("access denied") && (
                <CheckCircle className="h-4 w-4 text-green-400" />
              )}
            </label>
            
            <div className="space-y-3">
              <LocationPicker
                value={location}
                onChange={handleLocationChange}
                placeholder="Auto-detected or enter manually"
                className={validationErrors.location ? 'border-red-500' : ''}
              />
              
              {/* Location Actions */}
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.geolocation?.getCurrentPosition(
                      (pos) => {
                        const locationString = `${pos.coords.latitude}, ${pos.coords.longitude}`;
                        setLocation(locationString);
                        setCoordinates({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                        toast({
                          title: "Location updated",
                          description: "Current location has been detected.",
                        });
                      },
                      (error) => {
                        toast({
                          title: "Location access denied",
                          description: "Please enter location manually or enable location access.",
                          variant: "destructive",
                        });
                      }
                    );
                  }}
                  className="text-blue-400 hover:text-blue-300 border-gray-600"
                >
                  <MapPin className="h-4 w-4 mr-1" />
                  Detect Location
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowLocationPicker(!showLocationPicker)}
                  className="text-green-400 hover:text-green-300 border-gray-600"
                >
                  <MapPin className="h-4 w-4 mr-1" />
                  {showLocationPicker ? 'Hide Map' : 'Show Map'}
                </Button>
              </div>
              
              {validationErrors.location && (
                <p className="text-red-400 text-sm">{validationErrors.location}</p>
              )}
              
              {coordinates && (
                <p className="text-green-400 text-sm flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  GPS coordinates: {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
                </p>
              )}
            </div>
          </div>



          {/* Enhanced Submit Section */}
          <div className="space-y-4">
            {/* Form Validation Summary */}
            {Object.keys(validationErrors).length > 0 && (
              <div className="bg-red-900/30 border border-red-600/50 rounded-lg p-4">
                <h4 className="text-red-300 font-medium mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Please fix the following issues:
                </h4>
                <ul className="text-red-400 text-sm space-y-1">
                  {Object.entries(validationErrors).map(([field, error]) => (
                    <li key={field}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Submit Button */}
            <div className="text-center">
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || isCheckingDuplicates || Object.keys(validationErrors).length > 0}
                className={`px-8 py-3 text-lg rounded-full shadow-lg transition-all duration-300 ${
                  formProgress === 100 && Object.keys(validationErrors).length === 0
                    ? 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white'
                    : 'bg-gray-600 hover:bg-gray-700 text-gray-300'
                } disabled:opacity-50`}
              >
                {isCheckingDuplicates ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Checking for duplicates...
                  </span>
                ) : isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Submitting your report...
                  </span>
                ) : formProgress === 100 && Object.keys(validationErrors).length === 0 ? (
                  <span className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Submit Report
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Complete form to submit
                  </span>
                )}
              </Button>
              
              {formProgress < 100 && (
                <p className="text-gray-400 text-sm mt-2">
                  Complete all required fields to enable submission
                </p>
              )}
            </div>

            {/* Additional Actions */}
            <div className="flex justify-center gap-3 text-sm">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setDescription('');
                  setCategory('');
                  setLocation('');
                  setCoordinates(null);
                  clearAllPhotos();
                  clearDraft();
                  toast({
                    title: "Form cleared",
                    description: "All fields have been reset.",
                  });
                }}
                className="text-gray-400 hover:text-gray-300"
              >
                Clear Form
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/issues')}
                className="text-gray-400 hover:text-gray-300"
              >
                View Other Issues
              </Button>
            </div>
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

      {/* Duplicate Issue Modal */}
      {duplicateResult && (
        <DuplicateIssueModal
          isOpen={showDuplicateModal}
          onClose={() => setShowDuplicateModal(false)}
          duplicates={duplicateResult.duplicates}
          confidence={duplicateResult.confidence}
          onProceedAnyway={handleProceedAnyway}
          onCancel={handleCancelSubmission}
        />
      )}
    </div>
  );
}
