import { AuthResponse, Event, EventFilters, Registration, User } from '@/types';

const API_BASE_URL = 'http://localhost:3333';
const TOKEN_KEY = 'xe_auth_token';

class ApiClient {
  private getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getToken();
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Auth endpoints
  async login(email: string, password: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(data: {
    name: string;
    email: string;
    password: string;
    city?: string;
    role: 'user' | 'organizer';
  }): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getProfile(): Promise<User> {
    return this.request<User>('/auth/profile');
  }

  // Events endpoints
  async getEvents(filters?: EventFilters): Promise<Event[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    const query = params.toString();
    return this.request<Event[]>(`/events${query ? `?${query}` : ''}`);
  }

  async getEvent(id: string): Promise<Event> {
    return this.request<Event>(`/events/${id}`);
  }

  async getOrganizerEvents(): Promise<Event[]> {
    return this.request<Event[]>('/events/organizer');
  }

  async createEvent(data: Partial<Event>): Promise<Event> {
    return this.request<Event>('/events', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateEvent(id: string, data: Partial<Event>): Promise<Event> {
    return this.request<Event>(`/events/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async publishEvent(id: string): Promise<Event> {
    return this.request<Event>(`/events/${id}/publish`, {
      method: 'PATCH',
    });
  }

  async toggleRegistrations(id: string): Promise<Event> {
    return this.request<Event>(`/events/${id}/registrations`, {
      method: 'PATCH',
    });
  }

  // Registrations endpoints
  async registerForEvent(eventId: string): Promise<Registration> {
    return this.request<Registration>(`/events/${eventId}/register`, {
      method: 'POST',
    });
  }

  async getMyRegistrations(): Promise<Registration[]> {
    return this.request<Registration[]>('/registrations');
  }

  async cancelRegistration(registrationId: string): Promise<Registration> {
    return this.request<Registration>(`/registrations/${registrationId}/cancel`, {
      method: 'PATCH',
    });
  }
}

export const api = new ApiClient();
export { TOKEN_KEY };
