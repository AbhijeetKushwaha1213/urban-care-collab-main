import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
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
  Phone,
  Settings,
  Award,
  Calendar,
  Target,
  TrendingUp,
  Star,
  Edit,
  Camera,
  Home,
  Mail,
  Shield
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
  
  // Profile modal state
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [workerProfile, setWorkerProfile] = useState<any>(null);
  const [performanceStats, setPerformanceStats] = useState({
    totalTasksCompleted: 0,
    thisMonthCompleted: 0,
    averageRating: 0,
    totalWorkHours: 0,
    onTimeCompletion: 0,
    categoryExpertise: [],
    achievements: [],
    joinDate: '',
    lastActiveDate: ''
  });

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

      const workerData = userProfile || { 
        full_name: currentUser.email, 
        department: 'General',
        employee_id: 'EMP001',
        phone_number: '+91-9876543210',
        address: 'Municipal Office, City Center',
        avatar_url: null
      };
      
      setWorker(workerData);
      setWorkerProfile(workerData);
      
      // Load performance statistics (mock data)
      setPerformanceStats({
        totalTasksCompleted: 127,
        thisMonthCompleted: 23,
        averageRating: 4.7,
        totalWorkHours: 1240,
        onTimeCompletion: 94,
        categoryExpertise: [
          { category: 'Infrastructure', completed: 45, rating: 4.8 },
          { category: 'Electricity', completed: 32, rating: 4.6 },
          { category: 'Water', completed: 28, rating: 4.9 },
          { category: 'Trash', completed: 22, rating: 4.5 }
        ],
        achievements: [
          { title: 'Top Performer', description: 'Highest completion rate this quarter', date: '2024-01-15', icon: '🏆' },
          { title: 'Quick Responder', description: 'Average response time under 30 minutes', date: '2024-02-20', icon: '⚡' },
          { title: 'Quality Expert', description: 'Maintained 4.5+ rating for 6 months', date: '2024-03-10', icon: '⭐' },
          { title: 'Safety Champion', description: 'Zero safety incidents in 2024', date: '2024-04-05', icon: '🛡️' }
        ],
        joinDate: '2023-06-15',
        lastActiveDate: new Date().toISOString()
      });
      
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

  // Get worker initials for avatar
  const getWorkerInitials = () => {
    if (!workerProfile?.full_name) return "W";
    const names = workerProfile.full_name.split(" ");
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  // Calculate work experience
  const getWorkExperience = () => {
    if (!performanceStats.joinDate) return "New";
    const joinDate = new Date(performanceStats.joinDate);
    const now = new Date();
    const diffMonths = Math.floor((now.getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24 * 30));
    
    if (diffMonths < 1) return "New";
    if (diffMonths < 12) return `${diffMonths} months`;
    const years = Math.floor(diffMonths / 12);
    const remainingMonths = diffMonths % 12;
    return remainingMonths > 0 ? `${years}y ${remainingMonths}m` : `${years} years`;
  };

  // Get performance level based on rating
  const getPerformanceLevel = (rating: number) => {
    if (rating >= 4.5) return { level: "Excellent", color: "text-green-600", bg: "bg-green-100" };
    if (rating >= 4.0) return { level: "Good", color: "text-blue-600", bg: "bg-blue-100" };
    if (rating >= 3.5) return { level: "Average", color: "text-yellow-600", bg: "bg-yellow-100" };
    return { level: "Needs Improvement", color: "text-red-600", bg: "bg-red-100" };
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
      {/* Enhanced Mobile Header */}
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
          
          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2 text-white hover:bg-blue-500">
                <Avatar className="h-8 w-8 border-2 border-blue-300">
                  <AvatarImage src={workerProfile?.avatar_url || undefined} />
                  <AvatarFallback className="bg-blue-400 text-white text-sm font-semibold">
                    {getWorkerInitials()}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline text-sm">Profile</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-3 py-2 border-b">
                <p className="font-medium">{workerProfile?.full_name || 'Field Worker'}</p>
                <p className="text-sm text-gray-500">{workerProfile?.employee_id || 'EMP001'}</p>
              </div>
              <DropdownMenuItem onClick={() => setProfileModalOpen(true)}>
                <User className="mr-2 h-4 w-4" />
                <span>View Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setProfileModalOpen(true)}>
                <Award className="mr-2 h-4 w-4" />
                <span>Performance Record</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="p-4 grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 shadow-sm border border-orange-200">
          <div className="text-center">
            <div className="bg-orange-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-orange-600">{stats.pendingTasks}</div>
            <div className="text-sm font-medium text-gray-700">Pending</div>
            <div className="text-xs text-gray-500">बकाया</div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 shadow-sm border border-green-200">
          <div className="text-center">
            <div className="bg-green-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-green-600">{stats.completedTasks}</div>
            <div className="text-sm font-medium text-gray-700">Completed</div>
            <div className="text-xs text-gray-500">पूरा हुआ</div>
          </div>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="px-4 mb-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
            <Award className="h-4 w-4 mr-2 text-yellow-600" />
            Performance Summary
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">{performanceStats.totalTasksCompleted}</div>
              <div className="text-xs text-gray-600">Total Completed</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">{performanceStats.averageRating}⭐</div>
              <div className="text-xs text-gray-600">Average Rating</div>
            </div>
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

      {/* Emergency Contact & Support */}
      <div className="p-4 mt-6 space-y-4">
        <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-red-100 p-3 rounded-full shadow-sm">
                <Phone className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-red-800">Emergency Contact</h3>
                <p className="text-sm text-red-600">Supervisor: +91 98765 43210</p>
              </div>
            </div>
            <Button 
              size="sm" 
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => window.open('tel:+919876543210')}
            >
              📞 Call
            </Button>
          </div>
        </div>

        {/* App Info */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4 shadow-sm">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <div className="bg-blue-600 p-2 rounded-full">
                <Wrench className="h-4 w-4 text-white" />
              </div>
              <span className="ml-2 font-semibold text-blue-800">Nagar Setu Worker</span>
            </div>
            <p className="text-xs text-blue-600">Field Worker Portal v1.0</p>
            <p className="text-xs text-blue-500 mt-1">Making cities better, one task at a time 🏙️</p>
          </div>
        </div>
      </div>

      {/* Comprehensive Profile Modal */}
      <Dialog open={profileModalOpen} onOpenChange={setProfileModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <User className="h-6 w-6 text-blue-600" />
              Worker Profile & Performance Record
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Profile Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  <div className="relative">
                    <Avatar className="h-24 w-24 border-4 border-blue-200">
                      <AvatarImage src={workerProfile?.avatar_url || undefined} />
                      <AvatarFallback className="text-2xl font-bold bg-blue-100 text-blue-600">
                        {getWorkerInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute -bottom-2 -right-2 rounded-full p-2 h-8 w-8"
                    >
                      <Camera className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  <div className="flex-1 text-center md:text-left">
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">
                      {workerProfile?.full_name || 'Field Worker'}
                    </h2>
                    <p className="text-lg text-blue-600 mb-2">{workerProfile?.department || 'General'} Department</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Shield className="h-4 w-4" />
                        <span>ID: {workerProfile?.employee_id || 'EMP001'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="h-4 w-4" />
                        <span>{workerProfile?.phone_number || '+91-9876543210'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="h-4 w-4" />
                        <span>{currentUser?.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Home className="h-4 w-4" />
                        <span>{workerProfile?.address || 'Municipal Office, City Center'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPerformanceLevel(performanceStats.averageRating).bg} ${getPerformanceLevel(performanceStats.averageRating).color}`}>
                      <Star className="h-4 w-4 mr-1" />
                      {getPerformanceLevel(performanceStats.averageRating).level}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Experience: {getWorkExperience()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Target className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-green-600">{performanceStats.totalTasksCompleted}</div>
                  <div className="text-sm text-gray-600">Total Tasks</div>
                  <div className="text-xs text-gray-500">All time</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-blue-600">{performanceStats.thisMonthCompleted}</div>
                  <div className="text-sm text-gray-600">This Month</div>
                  <div className="text-xs text-gray-500">Current period</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className="bg-yellow-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Star className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="text-2xl font-bold text-yellow-600">{performanceStats.averageRating}</div>
                  <div className="text-sm text-gray-600">Avg Rating</div>
                  <div className="text-xs text-gray-500">Out of 5.0</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="text-2xl font-bold text-purple-600">{performanceStats.onTimeCompletion}%</div>
                  <div className="text-sm text-gray-600">On Time</div>
                  <div className="text-xs text-gray-500">Completion rate</div>
                </CardContent>
              </Card>
            </div>

            {/* Category Expertise */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5 text-blue-600" />
                  Category Expertise
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {performanceStats.categoryExpertise.map((category, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          {getCategoryIcon(category.category)}
                        </div>
                        <div>
                          <div className="font-medium">{category.category}</div>
                          <div className="text-sm text-gray-500">{category.completed} tasks completed</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-yellow-600">{category.rating}⭐</div>
                        <div className="text-xs text-gray-500">Rating</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-600" />
                  Achievements & Recognition
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {performanceStats.achievements.map((achievement, index) => (
                    <div key={index} className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{achievement.title}</h4>
                          <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                          <p className="text-xs text-gray-500">
                            Earned on {new Date(achievement.date).toLocaleDateString('en-IN')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Work History Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-green-600" />
                  Work History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-lg font-bold text-blue-600">{performanceStats.totalWorkHours}</div>
                    <div className="text-sm text-gray-600">Total Hours</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-lg font-bold text-green-600">
                      {new Date(performanceStats.joinDate).toLocaleDateString('en-IN')}
                    </div>
                    <div className="text-sm text-gray-600">Join Date</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-lg font-bold text-purple-600">
                      {new Date(performanceStats.lastActiveDate).toLocaleDateString('en-IN')}
                    </div>
                    <div className="text-sm text-gray-600">Last Active</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setProfileModalOpen(false)}>
                Close
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorkerDashboard;