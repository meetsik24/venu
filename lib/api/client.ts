import { ApiEvent, User, RSVP, CreateEvent, CreateRSVP } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION || 'v1';

if (!API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_URL environment variable is required');
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || API_BASE_URL!;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const token = localStorage.getItem('auth_token');

    const defaultHeaders: Record<string, string> = {
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    // Only set Content-Type when caller hasn't provided it
    const hasContentType = !!(options.headers as Record<string, string> | undefined)?.['Content-Type'];
    if (!hasContentType && options.body !== undefined) {
      defaultHeaders['Content-Type'] = 'application/json';
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...(options.headers || {}),
      },
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      const errorBody = await response.json().catch(() => null);
      let message = 'Request failed';
      if (errorBody) {
        if (typeof errorBody.detail === 'string') {
          message = errorBody.detail;
        } else if (Array.isArray(errorBody.detail) && errorBody.detail.length > 0) {
          message = errorBody.detail[0]?.msg || message;
        } else if (typeof errorBody.error === 'string') {
          message = errorBody.error;
        } else if (typeof errorBody.message === 'string') {
          message = errorBody.message;
        }
      }
      throw new Error(message);
    }

    return response.json();
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);
    formData.append('grant_type', 'password');
    
    return this.request<{ access_token: string; token_type: string }>(`/api/${API_VERSION}/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });
  }

  async register(email: string, password: string, name: string, phone?: string) {
    return this.request<{ user: User; access_token: string }>(`/api/${API_VERSION}/auth/signup`, {
      method: 'POST',
      body: JSON.stringify({ email, password, name, phone }),
    });
  }

  async getCurrentUser() {
    return this.request<User>(`/api/${API_VERSION}/auth/me`);
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
    const endpoint = queryString ? `/api/${API_VERSION}/events/?${queryString}` : `/api/${API_VERSION}/events/`;
    
    return this.request<{ events: ApiEvent[]; total: number; page: number; limit: number }>(endpoint);
  }

  async getEvent(id: string) {
    return this.request<ApiEvent>(`/api/${API_VERSION}/events/${id}`);
  }

  async createEvent(eventData: CreateEvent) {
    return this.request<ApiEvent>(`/api/${API_VERSION}/events/`, {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  }

  async updateEvent(id: string, eventData: Partial<CreateEvent>) {
    return this.request<ApiEvent>(`/api/${API_VERSION}/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    });
  }

  async deleteEvent(id: string) {
    return this.request<void>(`/api/${API_VERSION}/events/${id}`, {
      method: 'DELETE',
    });
  }

  async getUserEvents() {
    return this.request<ApiEvent[]>(`/api/${API_VERSION}/events/user`);
  }

  // RSVP endpoints
  async createRSVP(eventId: string) {
    return this.request<{ message: string; rsvp_id: string }>(`/api/${API_VERSION}/events/${eventId}/rsvp`, {
      method: 'POST',
    });
  }

}

export const apiClient = new ApiClient();
export default apiClient;
