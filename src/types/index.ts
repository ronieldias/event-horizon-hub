export type UserRole = 'user' | 'organizer';

export interface User {
  id: string;
  name: string;
  email: string;
  city?: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  category: string;
  date: string;
  time: string;
  endDate?: string;
  endTime?: string;
  location: string;
  city: string;
  state: string;
  address?: string;
  imageUrl?: string;
  capacity: number;
  registeredCount: number;
  price?: number;
  isFree: boolean;
  status: 'draft' | 'published' | 'closed' | 'finished';
  registrationsOpen: boolean;
  registrationDeadline?: string;
  organizerId: string;
  organizerName: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Registration {
  id: string;
  eventId: string;
  userId: string;
  status: 'confirmed' | 'cancelled' | 'pending';
  checkedIn: boolean;
  checkedInAt?: string;
  createdAt: string;
  event?: Event;
}

export interface Review {
  id: string;
  eventId: string;
  userId: string;
  rating: number;
  comment?: string;
  createdAt: string;
  user?: Pick<User, 'id' | 'name' | 'avatar'>;
}

export interface EventFilters {
  search?: string;
  category?: string;
  city?: string;
  state?: string;
  startDate?: string;
  endDate?: string;
  isFree?: boolean;
}
