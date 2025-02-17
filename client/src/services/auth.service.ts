// src/services/auth.service.ts
import api from './api';
import type { 
  SignupCredentials, 
  LoginCredentials, 
  AuthResponse,
  PasswordResetRequest,
  PasswordResetSubmission 
} from '../types/auth.type';

class AuthService {
  async login(data: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/login', data);
      if (response.data.success) {
        this.setToken(response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        this.initializeAuth();
      }
      return response.data;
    } catch (error: any) {
      console.error('Login error:', error.response?.data || error);
      throw error;
    }
  }

  async signup(data: SignupCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/signup', data);
      return response.data;
    } catch (error: any) {
      console.error('Signup error:', error.response?.data || error);
      throw error;
    }
  }

  async googleLogin(code: string): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/google', { code });
      if (response.data.success) {
        this.setToken(response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        this.initializeAuth();
      }
      return response.data;
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  }

  async verifyEmail(token: string): Promise<AuthResponse> {
    try {
      const response = await api.get(`/auth/verify-email/${token}`);
      return response.data;
    } catch (error: any) {
      console.error('Email verification error:', error);
      throw error;
    }
  }

  async requestPasswordReset(data: PasswordResetRequest): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/request-password-reset', data);
      return response.data;
    } catch (error: any) {
      console.error('Password reset request error:', error);
      throw error;
    }
  }

  async resetPassword(data: PasswordResetSubmission): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/reset-password', data);
      return response.data;
    } catch (error: any) {
      console.error('Password reset error:', error);
      throw error;
    }
  }

  checkAuthState() {
    const token = this.getToken();
    const userStr = localStorage.getItem('user');
    
    if (!token || !userStr) {
      return null;
    }

    try {
      const user = JSON.parse(userStr);
      return { user, token };
    } catch (error) {
      this.logout();
      return null;
    }
  }

  initializeAuth() {
    const token = this.getToken();
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }

  private setToken(token: string) {
    localStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  getToken() {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
  }

  isAuthenticated() {
    return !!this.getToken() && !!localStorage.getItem('user');
  }
}

export default new AuthService();