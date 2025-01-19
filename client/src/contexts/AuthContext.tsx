import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import api from '@/services/api';
import { useToast } from '@/hooks/use-toast';

// Define our core types
interface User {
  id: string;
  email: string;
  name: string;
  role: 'CUSTOMER' | 'RESTAURANT_OWNER' | 'ADMIN';
  emailVerified: boolean;
  twoFactorEnabled?: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  requiresTwoFactor?: boolean;
  tempToken?: string;
}

interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface SignupData {
  email: string;
  password: string;
  name: string;
  role?: string;
}

interface TwoFactorVerificationData {
  code: string;
  tempToken: string;
  trustDevice?: boolean;
  isBackupCode?: boolean;
}

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: (options?: { everywhere?: boolean }) => Promise<void>;
  verifyTwoFactor: (data: TwoFactorVerificationData) => Promise<void>;
  resendVerification: (email: string) => Promise<void>;
  refreshUserData: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
}

// Create the context with undefined initial value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Token refresh configuration
const TOKEN_REFRESH_INTERVAL = 14 * 60 * 1000; // 14 minutes
const TOKEN_CHECK_INTERVAL = 60 * 1000; // Check token every minute

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  
  // Initialize state
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    isInitialized: false
  });

  // Handle token refresh
  const refreshToken = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) throw new Error('No refresh token');

      const response = await api.post('/auth/refresh-token', { refreshToken });
      const { accessToken } = response.data;

      localStorage.setItem('accessToken', accessToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

      return accessToken;
    } catch (error) {
      console.error('Token refresh failed:', error);
      handleLogout();
      throw error;
    }
  }, []);

  // Initialize authentication from stored tokens
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');

        if (!accessToken || !refreshToken) {
          setState(prev => ({ ...prev, isLoading: false, isInitialized: true }));
          return;
        }

        // Set default auth header
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

        // Fetch user data
        const response = await api.get('/auth/me');
        
        setState({
          user: response.data.user,
          isAuthenticated: true,
          isLoading: false,
          isInitialized: true
        });

        // Setup token refresh
        setupTokenRefresh();
      } catch (error) {
        console.error('Auth initialization failed:', error);
        handleLogout();
      }
    };

    initializeAuth();
  }, []);

  // Setup automatic token refresh
  const setupTokenRefresh = useCallback(() => {
    const refreshInterval = setInterval(refreshToken, TOKEN_REFRESH_INTERVAL);

    // Check token expiration
    const checkTokenExpiration = setInterval(() => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) return;

      try {
        const tokenData = JSON.parse(atob(accessToken.split('.')[1]));
        if (tokenData.exp * 1000 < Date.now()) {
          refreshToken();
        }
      } catch (error) {
        console.error('Token check failed:', error);
      }
    }, TOKEN_CHECK_INTERVAL);

    return () => {
      clearInterval(refreshInterval);
      clearInterval(checkTokenExpiration);
    };
  }, [refreshToken]);

  // Login handler
  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      const { user, accessToken, refreshToken, requiresTwoFactor, tempToken } = response.data;

      // Handle 2FA if required
      if (requiresTwoFactor) {
        setState(prev => ({
          ...prev,
          requiresTwoFactor: true,
          tempToken,
          isLoading: false
        }));
        return;
      }

      // Store tokens
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      
      if (credentials.rememberMe) {
        localStorage.setItem('rememberedEmail', credentials.email);
      }

      // Update auth header
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

      // Update state
      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
        isInitialized: true
      });

      setupTokenRefresh();

      toast({
        title: 'Welcome back!',
        description: `Signed in as ${user.name}`
      });

    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Signup handler
  const signup = async (data: SignupData) => {
    try {
      const response = await api.post('/auth/signup', data);
      
      // Don't automatically log in - wait for email verification
      toast({
        title: 'Account created successfully!',
        description: 'Please check your email to verify your account.'
      });

      // Store email for verification page
      localStorage.setItem('pendingVerificationEmail', data.email);

    } catch (error: any) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  // Two-factor verification handler
  const verifyTwoFactor = async (data: TwoFactorVerificationData) => {
    try {
      const response = await api.post('/auth/verify-2fa', data);
      const { user, accessToken, refreshToken } = response.data;

      // Store tokens and update state
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
        isInitialized: true,
        requiresTwoFactor: false,
        tempToken: undefined
      });

      setupTokenRefresh();

      toast({
        title: 'Verification successful',
        description: 'You have been successfully logged in'
      });

    } catch (error) {
      console.error('2FA verification error:', error);
      throw error;
    }
  };

  // Resend verification email
  const resendVerification = async (email: string) => {
    try {
      await api.post('/auth/resend-verification', { email });
      
      toast({
        title: 'Verification email sent',
        description: 'Please check your inbox for the verification link'
      });

    } catch (error) {
      console.error('Failed to resend verification:', error);
      throw error;
    }
  };

  // Request password reset
  const requestPasswordReset = async (email: string) => {
    try {
      await api.post('/auth/forgot-password', { email });
      
      toast({
        title: 'Reset instructions sent',
        description: 'If an account exists with that email, you will receive password reset instructions'
      });

    } catch (error) {
      console.error('Password reset request error:', error);
      // Don't throw error to prevent email enumeration
    }
  };

  // Reset password
  const resetPassword = async (token: string, newPassword: string) => {
    try {
      await api.post('/auth/reset-password', { token, newPassword });
      
      toast({
        title: 'Password reset successful',
        description: 'You can now log in with your new password'
      });

    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  };

  // Refresh user data
  const refreshUserData = async () => {
    try {
      const response = await api.get('/auth/me');
      setState(prev => ({
        ...prev,
        user: response.data.user
      }));
    } catch (error) {
      console.error('Failed to refresh user data:', error);
      throw error;
    }
  };

  // Handle logout
  const handleLogout = async (options?: { everywhere?: boolean }) => {
    try {
      if (options?.everywhere) {
        await api.post('/auth/logout-all');
      }

      // Clear tokens and state
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      delete api.defaults.headers.common['Authorization'];

      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isInitialized: true
      });

    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local state even if API call fails
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      delete api.defaults.headers.common['Authorization'];

      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isInitialized: true
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        signup,
        logout: handleLogout,
        verifyTwoFactor,
        resendVerification,
        refreshUserData,
        requestPasswordReset,
        resetPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
