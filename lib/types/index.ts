// User types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Database types (matching Supabase schema)
export interface Poll {
  id: string;
  title: string;
  description?: string;
  author_id: string;
  is_active: boolean;
  allow_multiple: boolean;
  expires_at?: string; // ISO string from database
  created_at: string; // ISO string from database
  updated_at: string; // ISO string from database
  total_votes: number;
}

export interface PollOption {
  id: string;
  poll_id: string;
  text: string;
  votes: number;
  created_at: string; // ISO string from database
  updated_at: string; // ISO string from database
}

export interface Vote {
  id: string;
  poll_id: string;
  option_id: string;
  user_id: string;
  created_at: string; // ISO string from database
}

// Application types (with computed fields and relationships)
export interface PollWithDetails extends Poll {
  options: PollOption[];
  author: User;
  isActive: boolean;
  allowMultiple: boolean;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  totalVotes: number;
}

export interface PollOptionWithDetails extends PollOption {
  pollId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface VoteWithDetails extends Vote {
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
export interface ApiResponse<T = unknown> {
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
