import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  MapPin, 
  User, 
  LogOut,
  Wrench,
  Zap,
  Trash2,
  Droplets,
  Construction,
  Phone
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { WorkerTask, WorkerDashboardStats } from '@/types';

const WorkerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, userProfile, logOut } = useAuth();
  const [worker, setWorker] = useState<any>(null);
  const [stats, setStats] = useState<WorkerDashboardStats>({
    pendingTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    todayTasks: 0
  });
  const [pendingTasks, setPendingTasks] = useState<WorkerTask[]>([]);
  const [completedTasks, setCompletedTasks] = useState<WorkerTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWorkerData();
  }, []);

  const loadWorkerData = async () => {
    try {
      if (!currentUser) {
        navigate('/');
        return;
      }

      // Handle case where profile might not be loaded yet or user_type is undefined
      if (userProfile && userProfile.user_type && userProfile.user_type !== 'worker') {
        // Only redirect if we're sure they're not a worker
        navigate('/');
        return;
      }

      setWorker(userProfile || { full_name: currentUser.email, department: 'General' });
      
      // Load tasks and stats (mock data for now)
      const mockPendingTasks: WorkerTask[] = [
        {
          id: '1',
          issue_id: 'P-1045',
          worker_id: userProfile?.id || currentUser.id,
          title: 'Pothole Repair',
          description: 'Large pothole causing vehicle damage near City Bank',
          location: '123 Main St, Sector 5',
          category: 'Infrastructure',
          priority: 'critical',
          status: 'pending',
          assigned_at: new Date().toISOString(),
          coordinates: { lat: 40.7128, lng: -74.0060 },
          before_image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400'
        },
        {
          id: '2',
          issue_id: 'S-2031',
          worker_id: userProfile?.id || currentUser.id,
          title: 'Streetlight Repair',
          description: 'Non-functional streetlight creating safety hazard',
          location: '456 Oak Avenue, Downtown',
          category: 'Electricity',
          priority: 'high',
          status: 'pending',
          assigned_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          coordinates: { lat: 40.7589, lng: -73.9851 },
          before_image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'
        },
        {
          id: '3',
          issue_id: 'T-3012',
          worker_id: userProfile?.id || currentUser.id,
          title: 'Trash Collection',
          description: 'Overflowing garbage bins need immediate attention',
          location: '789 Pine Road, North District',
          category: 'Trash',
          priority: 'high',
          status: 'pending',
          assigned_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          coordinates: { lat: 40.7505, lng: -73.9934 }
        }
      ];

      const mockCompletedTasks: WorkerTask[] = [
        {
          id: '4',
          issue_id: 'W-4001',
          worker_id: userProfile?.id || currentUser.id,
          title: 'Water Leak Fixed',
          description: 'Repaired water pipe leak on Elm Street',
          location: '321 Elm Street, Central',
          category: 'Water',
          priority: 'high',
          status: 'completed',
          assigned_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          completed_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          after_image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400'
        }
      ];

      setPendingTasks(mockPendingTasks);
      setCompletedTasks(mockCompletedTasks);
      
      setStats({
        pendingTasks: mockPendingTasks.length,
        completedTasks: mockCompletedTasks.length,
        inProgressTasks: 0,
        todayTasks: mockPendingTasks.filter(task => 
          new Date(task.assigned_at).toDateString() === new Date().toDateString()
        ).length
      });

    } catch (error) {
      console.error('Error loading worker data:', error);
      toast({
        title: "Error",
        description: "Failed to load worker data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logOut();
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out",
      });
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Infrastructure': return <Construction className="h-6 w-6" />;
      case 'Electricity': return <Zap className="h-6 w-6" />;
      case 'Trash': return <Trash2 className="h-6 w-6" />;
      case 'Water': return <Droplets className="h-6 w-6" />;
      default: return <Wrench className="h-6 w-6" />;
    }
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
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-500 p-3 rounded-full shadow-md">
              <Wrench className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">{worker?.full_name || 'Field Worker'}</h1>
              <p className="text-blue-100 text-sm">
                {worker?.department || 'General'} Department
              </p>
              <p className="text-blue-200 text-xs">
                🕒 {new Date().toLocaleDateString('en-IN', { 
                  weekday: 'long', 
                  day: 'numeric', 
                  month: 'short' 
                })}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-white hover:bg-blue-500 p-2"
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="p-4 grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.pendingTasks}</div>
            <div className="text-sm text-gray-600">Pending</div>
            <div className="text-xs text-gray-500">बकाया</div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.completedTasks}</div>
            <div className="text-sm text-gray-600">Completed</div>
            <div className="text-xs text-gray-500">पूरा हुआ</div>
          </div>
        </div>
      </div>

      {/* Task Tabs */}
      <div className="px-4">
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pending ({stats.pendingTasks})
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Completed ({stats.completedTasks})
            </TabsTrigger>
          </TabsList>

          {/* Pending Tasks */}
          <TabsContent value="pending" className="space-y-4">
            {pendingTasks.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No pending tasks</p>
                <p className="text-sm text-gray-500">Great job! All caught up.</p>
              </div>
            ) : (
              pendingTasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white rounded-lg p-4 shadow-sm border cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate(`/worker/task/${task.id}`)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
                      {getCategoryIcon(task.category)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                          {task.priority === 'critical' ? '🔴 CRITICAL' : '🟠 HIGH'}
                        </Badge>
                        <span className="text-xs text-gray-500">#{task.issue_id}</span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">{task.title}</h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{task.description}</p>
                      <div className="flex items-center text-xs text-gray-500 space-x-4">
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span className="truncate">{task.location}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{formatTime(task.assigned_at)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          {/* Completed Tasks */}
          <TabsContent value="completed" className="space-y-4">
            {completedTasks.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No completed tasks yet</p>
                <p className="text-sm text-gray-500">Completed tasks will appear here</p>
              </div>
            ) : (
              completedTasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white rounded-lg p-4 shadow-sm border"
                >
                  <div className="flex items-start space-x-3">
                    <div className="bg-green-100 p-2 rounded-lg flex-shrink-0">
                      {getCategoryIcon(task.category)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className="text-xs bg-green-500 text-white">
                          ✅ COMPLETED
                        </Badge>
                        <span className="text-xs text-gray-500">#{task.issue_id}</span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">{task.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{task.location}</p>
                      <div className="text-xs text-gray-500">
                        Completed {formatTime(task.completed_at || task.assigned_at)}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Emergency Contact */}
      <div className="p-4 mt-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-red-100 p-2 rounded-full">
              <Phone className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold text-red-800">Emergency Contact</h3>
              <p className="text-sm text-red-600">Supervisor: +91 98765 43210</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerDashboard;