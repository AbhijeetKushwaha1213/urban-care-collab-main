import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, 
  BarChart3, 
  MapPin, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Search,
  Filter,
  Eye,
  MessageSquare,
  Calendar,
  TrendingUp,
  TrendingDown,
  Activity,
  FileText,
  Settings,
  Bell,
  Download
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { getDashboardStats, getIssuesWithPriority, updateIssueStatus as updateStatus } from '@/services/authorityService';
import NotificationCenter from '@/components/NotificationCenter';
import IssueDetailModal from '@/components/IssueDetailModal';

interface Issue {
  id: string;
  title: string;
  description: string;
  location: string;
  category: string;
  status: string;
  created_at: string;
  image?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
}

interface DashboardStats {
  totalReports: number;
  pendingIssues: number;
  resolvedToday: number;
  inProgress: number;
  avgResponseTime: string;
  satisfactionRate: number;
}

export default function AuthorityDashboard() {
  const navigate = useNavigate();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalReports: 0,
    pendingIssues: 0,
    resolvedToday: 0,
    inProgress: 0,
    avgResponseTime: '0h',
    satisfactionRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [notificationCenterOpen, setNotificationCenterOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [issueDetailOpen, setIssueDetailOpen] = useState(false);

  useEffect(() => {
    fetchDashboardData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch dashboard stats and issues
      const [statsData, issuesData] = await Promise.all([
        getDashboardStats(),
        getIssuesWithPriority()
      ]);

      setStats(statsData);
      setIssues(issuesData);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getPriorityByCategory = (category: string): string => {
    const priorityMap: { [key: string]: string } = {
      'Safety': 'critical',
      'Water': 'high',
      'Electricity': 'high',
      'Infrastructure': 'medium',
      'Transportation': 'medium',
      'Trash': 'low',
      'Noise': 'low',
      'Drainage': 'medium',
      'Public Space': 'low'
    };
    return priorityMap[category] || 'medium';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'reported': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const updateIssueStatus = async (issueId: string, newStatus: string) => {
    try {
      await updateStatus(issueId, newStatus);

      // Update local state
      setIssues(prev => prev.map(issue => 
        issue.id === issueId ? { ...issue, status: newStatus } : issue
      ));

      toast({
        title: "Status Updated",
        description: `Issue status changed to ${newStatus}`,
      });

      // Refresh stats
      fetchDashboardData();
    } catch (error) {
      console.error('Error updating issue status:', error);
      toast({
        title: "Error",
        description: "Failed to update issue status",
        variant: "destructive",
      });
    }
  };

  const handleViewIssue = (issue: Issue) => {
    setSelectedIssue(issue);
    setIssueDetailOpen(true);
  };

  const filteredIssues = issues.filter(issue => {
    const matchesStatus = selectedStatus === 'all' || issue.status === selectedStatus;
    const matchesCategory = selectedCategory === 'all' || issue.category === selectedCategory;
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/')}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">Authority Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setNotificationCenterOpen(true)}
              >
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <div className="text-sm text-gray-500">
                Welcome, Authority User
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalReports}</div>
              <p className="text-xs text-muted-foreground flex items-center">
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Issues</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingIssues}</div>
              <p className="text-xs text-muted-foreground">
                Requires immediate attention
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Activity className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.inProgress}</div>
              <p className="text-xs text-muted-foreground">
                Currently being addressed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved Today</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.resolvedToday}</div>
              <p className="text-xs text-muted-foreground flex items-center">
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                +8% from yesterday
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="issues" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="issues">Issue Management</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="map">Issue Map</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* Issue Management Tab */}
          <TabsContent value="issues" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Issue Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search issues..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="reported">Reported</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                      <SelectItem value="Water">Water</SelectItem>
                      <SelectItem value="Electricity">Electricity</SelectItem>
                      <SelectItem value="Safety">Safety</SelectItem>
                      <SelectItem value="Transportation">Transportation</SelectItem>
                      <SelectItem value="Trash">Trash</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Issues List */}
                <div className="space-y-4">
                  {filteredIssues.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No issues found matching your criteria</p>
                    </div>
                  ) : (
                    filteredIssues.map((issue) => (
                      <Card key={issue.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-semibold text-lg">{issue.title}</h3>
                                <Badge className={getPriorityColor(issue.priority || 'medium')}>
                                  {issue.priority?.toUpperCase()}
                                </Badge>
                                <Badge className={getStatusColor(issue.status)}>
                                  {issue.status.replace('-', ' ').toUpperCase()}
                                </Badge>
                              </div>
                              <p className="text-gray-600 mb-3 line-clamp-2">{issue.description}</p>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <div className="flex items-center">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  {issue.location}
                                </div>
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  {new Date(issue.created_at).toLocaleDateString()}
                                </div>
                                <Badge variant="outline">{issue.category}</Badge>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              <Select
                                value={issue.status}
                                onValueChange={(value) => updateIssueStatus(issue.id, value)}
                              >
                                <SelectTrigger className="w-[140px]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="reported">Reported</SelectItem>
                                  <SelectItem value="in-progress">In Progress</SelectItem>
                                  <SelectItem value="resolved">Resolved</SelectItem>
                                  <SelectItem value="closed">Closed</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleViewIssue(issue)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Average Response Time</span>
                    <span className="text-2xl font-bold text-blue-600">{stats.avgResponseTime}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Satisfaction Rate</span>
                    <span className="text-2xl font-bold text-green-600">{stats.satisfactionRate}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Resolution Rate</span>
                    <span className="text-2xl font-bold text-purple-600">78%</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Category Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {['Infrastructure', 'Water', 'Safety', 'Transportation', 'Other'].map((category, index) => (
                      <div key={category} className="flex items-center justify-between">
                        <span className="text-sm">{category}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${Math.max(20, 80 - index * 15)}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{Math.max(5, 25 - index * 4)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Map Tab */}
          <TabsContent value="map" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-blue-500" />
                  Interactive Issue Map
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg h-96 flex items-center justify-center border-2 border-dashed border-blue-200">
                  <div className="text-center text-blue-600">
                    <MapPin className="h-16 w-16 mx-auto mb-4 opacity-60" />
                    <h3 className="text-lg font-semibold mb-2">Interactive Map Coming Soon</h3>
                    <p className="text-sm opacity-80 max-w-md">
                      Real-time visualization of all reported issues with clustering, filtering, and heat map capabilities.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-green-500" />
                  Generate Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Available Reports</h3>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Monthly Performance Report
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Issue Trends Analysis
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Users className="h-4 w-4 mr-2" />
                        Department Performance
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <MapPin className="h-4 w-4 mr-2" />
                        Geographic Distribution
                      </Button>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-medium mb-4">Quick Stats</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span>This Month's Reports:</span>
                        <span className="font-semibold">{stats.totalReports}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Resolution Rate:</span>
                        <span className="font-semibold text-green-600">78%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Avg. Response Time:</span>
                        <span className="font-semibold">{stats.avgResponseTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Citizen Satisfaction:</span>
                        <span className="font-semibold text-blue-600">{stats.satisfactionRate}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Notification Center */}
      <NotificationCenter 
        isOpen={notificationCenterOpen}
        onClose={() => setNotificationCenterOpen(false)}
      />

      {/* Issue Detail Modal */}
      <IssueDetailModal
        issue={selectedIssue}
        isOpen={issueDetailOpen}
        onClose={() => {
          setIssueDetailOpen(false);
          setSelectedIssue(null);
        }}
        onStatusUpdate={updateIssueStatus}
      />
    </div>
  );
}