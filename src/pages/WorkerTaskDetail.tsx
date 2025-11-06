import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowLeft, 
  MapPin, 
  Navigation, 
  MessageSquare, 
  CheckCircle, 
  Camera,
  ExternalLink,
  Clock,
  User,
  AlertTriangle
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { WorkerTask } from '@/types';

const WorkerTaskDetail: React.FC = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState<WorkerTask | null>(null);
  const [loading, setLoading] = useState(true);
  const [workerNote, setWorkerNote] = useState('');
  const [showNoteDialog, setShowNoteDialog] = useState(false);

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
        description: 'This pothole is huge! It almost damaged my car. It\'s right in front of the blue bank building. The hole is approximately 2 feet wide and 6 inches deep. Multiple vehicles have been affected.',
        location: '123 Main St, Sector 5, Near City Bank',
        category: 'Infrastructure',
        priority: 'critical',
        status: 'pending',
        assigned_at: new Date().toISOString(),
        coordinates: { lat: 40.7128, lng: -74.0060 },
        before_image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop'
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

  const handleGetDirections = () => {
    if (!task?.coordinates) {
      toast({
        title: "Location Error",
        description: "Coordinates not available for this task",
        variant: "destructive",
      });
      return;
    }

    const { lat, lng } = task.coordinates;
    const destination = `${lat},${lng}`;
    
    // Detect device and open appropriate maps app
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    
    let mapsUrl = '';
    
    if (isIOS) {
      // Apple Maps
      mapsUrl = `maps://maps.google.com/maps?daddr=${destination}&amp;ll=`;
    } else if (isAndroid) {
      // Google Maps
      mapsUrl = `google.navigation:q=${destination}`;
    } else {
      // Web fallback - Google Maps
      mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
    }

    // Try to open native app, fallback to web
    try {
      window.location.href = mapsUrl;
    } catch (error) {
      // Fallback to web Google Maps
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${destination}`, '_blank');
    }

    toast({
      title: "Opening Maps",
      description: "Launching navigation to task location",
    });
  };

  const handleAddNote = () => {
    if (!workerNote.trim()) {
      toast({
        title: "Note Required",
        description: "Please enter a note before submitting",
        variant: "destructive",
      });
      return;
    }

    // In real app, save note to database
    toast({
      title: "Note Added",
      description: "Your note has been saved successfully",
    });

    setWorkerNote('');
    setShowNoteDialog(false);
  };

  const handleMarkCompleted = () => {
    navigate(`/worker/task/${taskId}/complete`);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      default: return 'bg-blue-500 text-white';
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
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
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="flex items-center p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/worker/dashboard')}
            className="mr-3"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-gray-900">{task.category}</h1>
            <div className="flex items-center space-x-2">
              <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                {task.priority === 'critical' ? '🔴 CRITICAL' : '🟠 HIGH'}
              </Badge>
              <span className="text-sm text-gray-500">#{task.issue_id}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Location & Map Section */}
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <h2 className="text-lg font-semibold mb-3 flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-blue-600" />
            Location & Map
          </h2>
          
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-700">Address:</p>
              <p className="text-gray-900">{task.location}</p>
            </div>

            {/* Simple Map Placeholder */}
            <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center border">
              <div className="text-center">
                <MapPin className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Interactive Map</p>
                <p className="text-xs text-gray-500">
                  Lat: {task.coordinates?.lat}, Lng: {task.coordinates?.lng}
                </p>
              </div>
            </div>

            {/* Magic Button */}
            <Button
              onClick={handleGetDirections}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-4 text-lg font-semibold"
              size="lg"
            >
              <Navigation className="h-6 w-6 mr-3" />
              ➔ GET DIRECTIONS
            </Button>
            <p className="text-xs text-gray-500 text-center">
              Opens your phone's default maps app with navigation
            </p>
          </div>
        </div>

        {/* Original Report Details */}
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <h2 className="text-lg font-semibold mb-3 flex items-center">
            <User className="h-5 w-5 mr-2 text-blue-600" />
            Original Report Details
          </h2>
          
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Citizen's Report:</p>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-900 italic">"{task.description}"</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Assigned:</p>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="h-4 w-4 mr-1" />
                {formatTime(task.assigned_at)}
              </div>
            </div>
          </div>
        </div>

        {/* Before Photo */}
        {task.before_image && (
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <h2 className="text-lg font-semibold mb-3 flex items-center">
              <Camera className="h-5 w-5 mr-2 text-blue-600" />
              "Before" Photo
            </h2>
            <div className="space-y-2">
              <img
                src={task.before_image}
                alt="Before - Issue reported by citizen"
                className="w-full rounded-lg border"
              />
              <p className="text-xs text-gray-500 text-center">
                Photo submitted by citizen showing the issue
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3 pb-6">
          <Button
            onClick={() => setShowNoteDialog(true)}
            variant="outline"
            className="w-full py-4 text-lg border-2 border-orange-200 hover:bg-orange-50"
            size="lg"
          >
            <MessageSquare className="h-6 w-6 mr-3" />
            💬 ADD NOTE / REPORT PROBLEM
          </Button>

          <Button
            onClick={handleMarkCompleted}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-4 text-lg font-semibold"
            size="lg"
          >
            <CheckCircle className="h-6 w-6 mr-3" />
            ✅ MARK AS COMPLETED
          </Button>
        </div>
      </div>

      {/* Note Dialog */}
      {showNoteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add Note</h3>
            <Textarea
              placeholder="Enter your note here... (e.g., 'Need bigger team', 'Wrong equipment', 'Cannot find the issue')"
              value={workerNote}
              onChange={(e) => setWorkerNote(e.target.value)}
              className="mb-4"
              rows={4}
            />
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowNoteDialog(false);
                  setWorkerNote('');
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddNote}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Save Note
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkerTaskDetail;