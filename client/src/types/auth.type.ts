
export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    createdAt: string;
  }
  
  export type UserRole = 'USER' | 'ADMIN' | 'RESTAURANT_OWNER';
  
  export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
  }
  
  export interface LoginCredentials {
    email: string;
    password: string;
  }
  
  export interface SignupCredentials {
    email: string;
    password: string;
    name: string;
  }
  
  export interface AuthResponse {
    success: boolean;
    data?: {
      user: User;
      token: string;
    };
    error?: string;
    message?: string;
  }
  
  export interface PasswordResetRequest {
    email: string;
  }
  
  export interface PasswordResetSubmission {
    token: string;
    newPassword: string;
  }