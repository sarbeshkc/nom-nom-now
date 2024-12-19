import api from './api';

export interface SignupData {
  email: string;
  password: string;
  name: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  data?: {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      createdAt: string;
    };
    token: string;
  };
  error?: string;
  message?: string;
}

const TOKEN_KEY = 'auth_token';

class AuthService {
  async login(data: LoginData): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/login', data);
      console.log('Login response:', response.data);

      if (response.data.success) {
        localStorage.setItem(TOKEN_KEY, response.data.data.token);
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.data.token}`;
      }
      return response.data;
    } catch (error: any) {
      console.error('Login error:', error.response?.data || error);
      throw error;
    }
  }

  async signup(data: SignupData): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/signup', data);
      if (response.data.success) {
        localStorage.setItem(TOKEN_KEY, response.data.data.token);
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.data.token}`;
      }
      return response.data;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  }

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    delete api.defaults.headers.common['Authorization'];
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