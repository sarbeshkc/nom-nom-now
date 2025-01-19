// src/components/auth/GoogleSignIn.tsx
import { useAuth } from '@/contexts/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';
import { Button } from '@/components/ui/button';
import { Google } from 'lucide-react';

export const GoogleSignIn = () => {
  const { loginWithGoogle } = useAuth();

  const googleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        await loginWithGoogle(response.access_token);
      } catch (error) {
        console.error('Google sign-in failed:', error);
      }
    },
    onError: (error) => {
      console.error('Google sign-in error:', error);
    }
  });

  return (
    <Button variant="outline" onClick={() => googleLogin()} className="w-full">
      <Google className="mr-2 h-4 w-4" />
      Continue with Google
    </Button>
  );
};