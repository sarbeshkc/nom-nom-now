// src/services/auth.service.ts

import api from './api';
import type { 
  SignupCredentials, 
  LoginCredentials, 
  AuthResponse,
  PasswordResetRequest,
  PasswordResetSubmission 
} from '../types/auth.type';

const TOKEN_KEY = 'auth_token';

class AuthService {
  async login(data: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/login', data);
      if (response.data.success) {
        this.setToken(response.data.data.token);
      }
      return response.data;
    } catch (error: any) {
      console.error('Login error:', error.response?.data || error);
      throw error;
    }
  }

// client/src/services/auth.service.ts
async signup(data: SignupCredentials): Promise<AuthResponse> {
  try {
    console.log('Sending signup request with data:', data);
    const response = await api.post('/auth/signup', data);
    console.log('Signup response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Signup error details:', {
      response: error.response?.data,
      status: error.response?.status,
      message: error.message
    });
    throw error;
  }
}

async googleLogin(code: string): Promise<AuthResponse> {
  try {
    const response = await api.post('/auth/google', { code });
    if (response.data.success) {
      this.setToken(response.data.data.token);
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
      console.error('Email verification error:', error.response?.data || error);
      throw error;
    }
  }

  async requestPasswordReset(data: PasswordResetRequest): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/request-password-reset', data);
      return response.data;
    } catch (error: any) {
      console.error('Password reset request error:', error.response?.data || error);
      throw error;
    }
  }

  async resetPassword(data: PasswordResetSubmission): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/reset-password', data);
      return response.data;
    } catch (error: any) {
      console.error('Password reset error:', error.response?.data || error);
      throw error;
    }
  }

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    delete api.defaults.headers.common['Authorization'];
  }

  private setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  isAuthenticated() {
    return !!this.getToken();
  }

  initializeAuth() {
    const token = this.getToken();
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }
}

export default new AuthService();