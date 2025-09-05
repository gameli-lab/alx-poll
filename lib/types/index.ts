// User types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Poll types
export interface Poll {
  id: string;
  title: string;
  description?: string;
  options: PollOption[];
  author: User;
  isActive: boolean;
  allowMultiple: boolean;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  totalVotes: number;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
  pollId: string;
}

// Vote types
export interface Vote {
  id: string;
  pollId: string;
  optionId: string;
  userId: string;
  createdAt: Date;
}

// Auth types
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Form types
export interface CreatePollForm {
  title: string;
  description?: string;
  options: string[];
  allowMultiple: boolean;
  expiresAt?: Date;
}

export interface PollFilters {
  search?: string;
  author?: string;
  isActive?: boolean;
  sortBy?: 'createdAt' | 'totalVotes' | 'title';
  sortOrder?: 'asc' | 'desc';
}
