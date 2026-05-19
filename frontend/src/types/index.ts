//  Auth 
export interface AuthPayload {
  id: number;
  role: 'admin' | 'user';
  exp?: number;
  iat?: number;
}

export interface AuthContextType {
  user: AuthPayload | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

//  API DTOs
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface ContactDTO {
  full_name: string;
  email: string;
  message: string;
}

//  Domain 
export interface User {
  id: number;
  name: string;
  email: string;
  role?: 'admin' | 'user';
  created_at?: number | string;
}

export interface ContactSubmission {
  id: number;
  full_name: string;
  email: string;
  message: string;
  created_at: string;
}

//  API response wrapper
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
