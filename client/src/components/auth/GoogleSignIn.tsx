// src/components/auth/GoogleSignIn.tsx
import { useAuth } from '@/contexts/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';
import { Button } from '@/components/ui/button';
import { Google } from 'lucide-react';

interface GoogleSignInProps {
  role?: 'CUSTOMER' | 'RESTAURANT_OWNER';
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const GoogleSignIn = ({ 
  role = 'CUSTOMER', 
  onSuccess, 
  onError 
}: GoogleSignInProps) => {
  const { loginWithGoogle } = useAuth();

  // Initialize Google login
  const googleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        await loginWithGoogle(response.access_token, role);
        onSuccess?.();
      } catch (error) {
        onError?.(error.message);
      }
    },
    onError: (error) => {
      onError?.('Google sign in failed: ' + error.message);
    }
  });

  return (
    <Button 
      variant="outline" 
      onClick={() => googleLogin()} 
      className="w-full"
    >
      <Google className="mr-2 h-4 w-4" />
      Continue with Google
    </Button>
  );
};