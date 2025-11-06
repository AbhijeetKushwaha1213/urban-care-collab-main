import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowLeft, 
  Camera, 
  CheckCircle, 
  Upload,
  X,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { WorkerTask } from '@/types';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const WorkerTaskComplete: React.FC = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [task, setTask] = useState<WorkerTask | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [afterPhoto, setAfterPhoto] = useState<string | null>(null);
  const [afterPhotoFile, setAfterPhotoFile] = useState<File | null>(null);
  const [finalNote, setFinalNote] = useState('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  useEffect(() => {
    loadTaskDetails();
  }, [taskId]);

  const loadTaskDetails = async () => {
    try {
      if (!currentUser || !taskId) {
        throw new Error('User not authenticated or task ID missing');
      }

      // Fetch real task data from database
      const { data: issue, error } = await supabase
        .from('issues')
        .select(`
          *,
          user_profiles!issues_created_by_fkey(full_name, avatar_url)
        `)
        .eq('id', taskId)
        .eq('assigned_to', currentUser.id)
        .single();

      if (error) throw error;

      if (!issue) {
        throw new Error('Task not found or not assigned to you');
      }

      // Transform to WorkerTask format
      const transformedTask: WorkerTask = {
        id: issue.id,
        issue_id: `ISS-${issue.id.slice(-4).toUpperCase()}`,
        worker_id: currentUser.id,
        title: issue.title,
        description: issue.description,
        location: issue.location,
        category: issue.category,
        priority: issue.priority || 'medium',
        status: issue.status,
        assigned_at: issue.assigned_at || issue.created_at,
        coordinates: parseCoordinates(issue.location),
        before_image: issue.image,
        after_image: issue.after_image,
        created_by_name: issue.user_profiles?.full_name || 'Anonymous Citizen'
      };

      setTask(transformedTask);
      
      // Pre-fill final note if worker notes exist
      if (issue.worker_notes) {
        setFinalNote(issue.worker_notes);
      }
    } catch (error) {
      console.error('Error loading task:', error);
      toast({
        title: "Error",
        description: "Failed to load task details. Please try again.",
        variant: "destructive",
      });
      navigate('/worker/dashboard');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to parse coordinates
  const parseCoordinates = (location: string) => {
    const coordRegex = /(-?\d+\.?\d*),\s*(-?\d+\.?\d*)/;
    const match = location.match(coordRegex);
    
    if (match) {
      return {
        lat: parseFloat(match[1]),
        lng: parseFloat(match[2])
      };
    }
    
    return {
      lat: 28.6139 + (Math.random() - 0.5) * 0.1,
      lng: 77.2090 + (Math.random() - 0.5) * 0.1
    };
  };

  const handlePhotoCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select an image smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    setUploadingPhoto(true);
    try {
      // Upload to Supabase storage
      const fileExt = file.name.split('.').pop();
      const fileName = `after-${taskId}-${Date.now()}.${fileExt}`;
      const filePath = `task-completions/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('user-uploads')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('user-uploads')
        .getPublicUrl(filePath);

      setAfterPhoto(publicUrl);
      setAfterPhotoFile(file);

      toast({
        title: "Photo Uploaded",
        description: "After photo has been uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload photo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploadingPhoto(false);
    }
  };

  const removePhoto = () => {
    setAfterPhoto(null);
    setAfterPhotoFile(null);
    
    // Reset file input
    const fileInput = document.getElementById('photo-input') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSubmitCompletion = async () => {
    if (!afterPhoto) {
      toast({
        title: "Photo Required",
        description: "Please take an 'After' photo to prove the work is completed",
        variant: "destructive",
      });
      return;
    }

    if (!currentUser || !taskId) {
      toast({
        title: "Error",
        description: "User not authenticated or task ID missing",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      // Update issue status and add completion data
      const { error } = await supabase
        .from('issues')
        .update({
          status: 'resolved',
          after_image: afterPhoto,
          worker_notes: finalNote,
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', taskId)
        .eq('assigned_to', currentUser.id);

      if (error) throw error;

      toast({
        title: "Task Completed! 🎉",
        description: "Your work has been submitted for authority review",
      });

      // Navigate back to dashboard
      navigate('/worker/dashboard');
    } catch (error) {
      console.error('Error submitting completion:', error);
      toast({
        title: "Submission Failed",
        description: "Failed to submit task completion. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading task details...</p>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Task not found</p>
          <Button onClick={() => navigate('/worker/dashboard')} className="mt-4">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="bg-green-600 text-white p-4 shadow-lg">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/worker/task/${taskId}`)}
            className="mr-3 text-white hover:bg-green-500"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold">Complete Job #{task.issue_id}</h1>
            <p className="text-green-100 text-sm">{task.title}</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">
            Instructions
          </h2>
          <p className="text-blue-700 mb-1">
            Please take a photo of the completed work.
          </p>
          <p className="text-blue-600 text-sm">
            कृपया काम पूरा होने की एक तस्वीर लें।
          </p>
        </div>

        {/* Before Photo Reference */}
        {task?.before_image && (
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <h2 className="text-lg font-semibold mb-3 flex items-center">
              <Camera className="h-5 w-5 mr-2 text-blue-600" />
              'Before' Photo (Reference)
            </h2>
            <div className="space-y-2">
              <img
                src={task.before_image}
                alt="Before - Issue reported by citizen"
                className="w-full rounded-lg border shadow-sm"
              />
              <p className="text-xs text-gray-500 text-center">
                Original photo submitted by citizen - Use this as reference for your 'After' photo
              </p>
            </div>
          </div>
        )}

        {/* Photo Upload Section */}
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Camera className="h-5 w-5 mr-2 text-green-600" />
            Upload 'After' Photo
          </h2>

          {uploadingPhoto ? (
            <div className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-blue-300 rounded-lg bg-blue-50">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-lg font-semibold text-blue-800 mb-2">
                  Uploading Photo...
                </p>
                <p className="text-sm text-blue-600">
                  Please wait while we upload your image
                </p>
              </div>
            </div>
          ) : !afterPhoto ? (
            <div className="space-y-4">
              {/* Camera Button */}
              <label
                htmlFor="photo-input"
                className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-green-300 rounded-lg cursor-pointer bg-green-50 hover:bg-green-100 transition-colors"
              >
                <div className="text-center">
                  <Camera className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <p className="text-lg font-semibold text-green-800 mb-2">
                    📷 UPLOAD 'AFTER' PHOTO
                  </p>
                  <p className="text-sm text-green-600">
                    Tap to open camera or select from gallery
                  </p>
                </div>
              </label>
              
              <input
                id="photo-input"
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handlePhotoCapture}
                className="hidden"
              />

              {/* Alternative Upload Button */}
              <label
                htmlFor="photo-input"
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center cursor-pointer"
              >
                <Upload className="h-5 w-5 mr-2" />
                Choose Photo from Gallery
              </label>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Photo Preview */}
              <div className="relative">
                <img
                  src={afterPhoto}
                  alt="After - Completed work"
                  className="w-full rounded-lg border shadow-sm"
                />
                <Button
                  onClick={removePhoto}
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-green-800 font-medium">Photo captured successfully!</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Before/After Comparison */}
        {task?.before_image && afterPhoto && (
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
              Before vs After Comparison
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">BEFORE (Citizen Report)</h3>
                <img
                  src={task.before_image}
                  alt="Before - Issue reported"
                  className="w-full rounded-lg border shadow-sm"
                />
                <p className="text-xs text-gray-500 mt-1 text-center">Original issue</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">AFTER (Your Work)</h3>
                <img
                  src={afterPhoto}
                  alt="After - Work completed"
                  className="w-full rounded-lg border shadow-sm"
                />
                <p className="text-xs text-gray-500 mt-1 text-center">Completed work</p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-green-800 font-medium">Ready for authority review!</span>
              </div>
              <p className="text-green-700 text-sm mt-1">
                The authority will see this comparison to verify your work completion.
              </p>
            </div>
          </div>
        )}

        {/* Optional Note Section */}
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <h2 className="text-lg font-semibold mb-3">
            Add Completion Note (Optional)
          </h2>
          <Textarea
            placeholder="Add a final note about the completed work... (e.g., 'Fixed. Used 2 bags of asphalt. Road is now clear.')"
            value={finalNote}
            onChange={(e) => setFinalNote(e.target.value)}
            rows={3}
            className="mb-2"
          />
          <p className="text-xs text-gray-500">
            Optional: Add any details about materials used, time taken, or special notes for the authority
          </p>
        </div>

        {/* Submit Button */}
        <div className="pb-6">
          <Button
            onClick={handleSubmitCompletion}
            disabled={!afterPhoto || submitting}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-4 text-lg font-semibold disabled:opacity-50"
            size="lg"
          >
            {submitting ? (
              <>
                <Loader2 className="h-6 w-6 mr-3 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <CheckCircle className="h-6 w-6 mr-3" />
                SUBMIT & FINISH JOB
              </>
            )}
          </Button>
          
          {!afterPhoto && (
            <p className="text-center text-sm text-red-600 mt-2">
              Please upload an 'After' photo to complete the task
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkerTaskComplete;