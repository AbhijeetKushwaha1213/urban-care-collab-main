// Core application types
export interface User {
  id: string;
  email: string;
  full_name: string;
  user_type: 'citizen' | 'authority' | 'worker';
  department?: string;
  employee_id?: string;
  phone_number?: string;
  created_at: string;
  is_onboarding_complete: boolean;
}

export interface Worker {
  id: string;
  employee_id: string;
  full_name: string;
  phone_number: string;
  department: string;
  user_id: string;
  is_active: boolean;
  created_at: string;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  location: string;
  category: IssueCategory;
  image?: string;
  status: IssueStatus;
  urgency?: IssueUrgency;
  latitude?: number;
  longitude?: number;
  created_by: string;
  assigned_to?: string;
  department?: string;
  created_at: string;
  updated_at?: string;
  comments_count: number;
  volunteers_count: number;
  upvotes_count?: number;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  status: EventStatus;
  time_remaining?: string;
  categories: string[];
  volunteers_count: number;
  created_by: string;
  created_at: string;
}

export interface Comment {
  id: string;
  content: string;
  issue_id: string;
  user_id: string;
  user_name: string;
  created_at: string;
}

// Enums for better type safety
export type IssueCategory = 
  | 'Trash' 
  | 'Water' 
  | 'Infrastructure' 
  | 'Electricity' 
  | 'Drainage' 
  | 'Transportation'
  | 'Health'
  | 'Safety'
  | 'Other';

export type IssueStatus = 
  | 'reported' 
  | 'assigned'
  | 'in_progress' 
  | 'completed_by_worker'
  | 'pending_review'
  | 'resolved' 
  | 'closed';

export type IssueUrgency = 
  | 'low' 
  | 'medium' 
  | 'high' 
  | 'critical';

export type EventStatus = 
  | 'upcoming' 
  | 'ongoing' 
  | 'completed' 
  | 'cancelled';

export type UserType = 'citizen' | 'authority' | 'worker';

// API Response types
export interface ApiResponse<T> {
  data: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  hasMore: boolean;
  page: number;
  limit: number;
}

// Form types
export interface CreateIssueForm {
  title: string;
  description: string;
  location: string;
  category: IssueCategory;
  image?: File;
  latitude?: number;
  longitude?: number;
}

export interface CreateEventForm {
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  categories: string[];
}

export interface AuthForm {
  email: string;
  password: string;
  name?: string;
  userType?: UserType;
  department?: string;
  authorityAccessCode?: string;
}

// Component prop types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

// Map related types
export interface MapLocation {
  lat: number;
  lng: number;
  address?: string;
}

export interface MapMarker extends MapLocation {
  id: string;
  title: string;
  type: 'issue' | 'event';
  status?: string;
  urgency?: IssueUrgency;
}

// Notification types
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
  action_url?: string;
}

// Filter types
export interface IssueFilters {
  category?: IssueCategory;
  status?: IssueStatus;
  urgency?: IssueUrgency;
  location?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface EventFilters {
  status?: EventStatus;
  category?: string;
  location?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

// Authority specific types
export interface AuthorityDashboardStats {
  totalIssues: number;
  pendingIssues: number;
  resolvedIssues: number;
  assignedToMe: number;
  criticalIssues: number;
}

export interface IssueAssignment {
  issue_id: string;
  assigned_to: string;
  assigned_by: string;
  department: string;
  assigned_at: string;
  notes?: string;
}

// Worker specific types
export interface WorkerTask {
  id: string;
  issue_id: string;
  worker_id: string;
  title: string;
  description: string;
  location: string;
  category: IssueCategory;
  priority: IssueUrgency;
  status: 'pending' | 'in_progress' | 'completed';
  assigned_at: string;
  started_at?: string;
  completed_at?: string;
  before_image?: string;
  after_image?: string;
  worker_notes?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface WorkerDashboardStats {
  pendingTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  todayTasks: number;
}

export interface WorkerLoginForm {
  employee_id: string;
  password: string;
}

export interface WorkerOTPForm {
  phone_number: string;
  otp?: string;
}