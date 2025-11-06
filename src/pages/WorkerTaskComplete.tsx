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

const WorkerTaskComplete: React.FC = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState<WorkerTask | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [afterPhoto, setAfterPhoto] = useState<string | null>(null);
  const [afterPhotoFile, setAfterPhotoFile] = useState<File | null>(null);
  const [finalNote, setFinalNote] = useState('');

  useEffect(() => {
    loadTaskDetails();
  }, [taskId]);

  const loadTaskDetails = async () => {
    try {
      // Mock task data - in real app, fetch from API
      const mockTask: WorkerTask = {
        id: taskId || '1',
        issue_id: 'P-1045',
        worker_id: 'worker-123',
        title: 'Pothole Repair',
        description: 'Large pothole causing vehicle damage near City Bank',
        location: '123 Main St, Sector 5, Near City Bank',
        category: 'Infrastructure',
        priority: 'critical',
        status: 'pending',
        assigned_at: new Date().toISOString(),
        coordinates: { lat: 40.7128, lng: -74.0060 }
      };

      setTask(mockTask);
    } catch (error) {
      console.error('Error loading task:', error);
      toast({
        title: "Error",
        description: "Failed to load task details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    setAfterPhotoFile(file);

    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setAfterPhoto(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    toast({
      title: "Photo Captured",
      description: "After photo has been captured successfully",
    });
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

    setSubmitting(true);
    try {
      // In real app, upload photo and update task status
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call

      // Mock API call to complete task
      const completionData = {
        task_id: taskId,
        after_photo: afterPhoto,
        worker_notes: finalNote,
        completed_at: new Date().toISOString(),
        status: 'completed_by_worker'
      };

      console.log('Submitting completion:', completionData);

      toast({
        title: "Task Completed! 🎉",
        description: "Your work has been submitted for review",
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

        {/* Photo Upload Section */}
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Camera className="h-5 w-5 mr-2 text-green-600" />
            Upload 'After' Photo
          </h2>

          {!afterPhoto ? (
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

        {/* Optional Note Section */}
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <h2 className="text-lg font-semibold mb-3">
            Add Note (Optional)
          </h2>
          <Textarea
            placeholder="Add a final note about the completed work... (e.g., 'Fixed. Used 2 bags of asphalt. Road is now clear.')"
            value={finalNote}
            onChange={(e) => setFinalNote(e.target.value)}
            rows={3}
            className="mb-2"
          />
          <p className="text-xs text-gray-500">
            Optional: Add any details about materials used, time taken, or special notes
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