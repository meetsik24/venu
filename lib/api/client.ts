import { Event, User, RSVP, CreateEvent, CreateRSVP } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://venu-engine.onrender.com';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const token = localStorage.getItem('auth_token');

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);
    formData.append('grant_type', 'password');
    
    return this.request<{ access_token: string; token_type: string }>('/api/v1/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });
  }

  async register(email: string, password: string, name: string, phone?: string) {
    return this.request<{ user: User; access_token: string }>('/api/v1/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name, phone }),
    });
  }

  async getCurrentUser() {
    return this.request<User>('/api/v1/auth/me');
  }

  // Event endpoints
  async getEvents(params?: {
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.set('category', params.category);
    if (params?.search) searchParams.set('search', params.search);
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());

    const queryString = searchParams.toString();
    const endpoint = queryString ? `/api/v1/events/?${queryString}` : '/api/v1/events/';
    
    return this.request<{ events: Event[]; total: number; page: number; limit: number }>(endpoint);
  }

  async getEvent(id: string) {
    return this.request<Event>(`/api/v1/events/${id}`);
  }

  async createEvent(eventData: CreateEvent) {
    return this.request<Event>('/api/v1/events/', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  }

  async updateEvent(id: string, eventData: Partial<CreateEvent>) {
    return this.request<Event>(`/api/v1/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    });
  }

  async deleteEvent(id: string) {
    return this.request<void>(`/api/v1/events/${id}`, {
      method: 'DELETE',
    });
  }

  async getUserEvents() {
    return this.request<Event[]>('/api/v1/events/user');
  }

  // RSVP endpoints
  async createRSVP(eventId: string) {
    return this.request<{ message: string; rsvp_id: string }>(`/api/v1/events/${eventId}/rsvp`, {
      method: 'POST',
    });
  }

}

export const apiClient = new ApiClient();
export default apiClient;
