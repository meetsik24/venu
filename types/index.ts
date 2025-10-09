// Core API Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  is_active: boolean;
  created_at: string;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  date: string;
  location: string;
  category?: string;
  creator_id: string;
  created_at: string;
  updated_at: string;
  rsvp_count: number;
}

export interface CreateEvent {
  title: string;
  description?: string;
  date: string;
  location: string;
  category?: string;
}

export interface RSVP {
  id: string;
  event_id: string;
  user_id: string;
  created_at: string;
}

export interface CreateRSVP {
  eventId: string;
}

// Frontend-specific types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface EventFilters {
  category?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  isOnline?: boolean;
  isPublic?: boolean;
}

export interface EventSearchParams extends EventFilters, PaginationParams {}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
}

export interface EventFormData {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  image?: string;
  maxAttendees?: number;
  isOnline?: boolean;
  isPublic?: boolean;
  requiresApproval?: boolean;
  price?: number;
  currency?: string;
}

export interface RSVPFormData {
  name: string;
  email: string;
  phone?: string;
  notes?: string;
  ticketCount?: number;
}

export interface DashboardStats {
  totalEvents: number;
  totalRSVPs: number;
  upcomingEvents: number;
  pastEvents: number;
}

export interface EventStats {
  totalRSVPs: number;
  confirmedRSVPs: number;
  pendingRSVPs: number;
  cancelledRSVPs: number;
}

export interface NotificationData {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

export interface ThemeConfig {
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}
