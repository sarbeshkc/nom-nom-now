import { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import AuthService from '@/services/auth.service';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function GoogleLoginButton() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const login = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async (response) => {
      setIsLoading(true);
      try {
        const authResponse = await AuthService.googleLogin(response.code);
        if (authResponse.success && authResponse.data?.user) {
          setUser(authResponse.data.user);
          navigate('/');
        }
      } catch (error) {
        console.error('Google login error:', error);
        setError('Failed to login with Google');
      } finally {
        setIsLoading(false);
      }
    },
    onError: (error) => {
      console.error('Google OAuth error:', error);
      setError('Google login failed');
    }
  });

  return (
    <div>
      <Button
        type="button"
        variant="outline"
        className="w-full flex items-center justify-center"
        onClick={() => login()}
        disabled={isLoading}
      >
        {isLoading ? (
          <span>Signing in...</span>
        ) : (
          <>
            <img src="/google.svg" alt="Google" className="w-5 h-5 mr-2" />
            Continue with Google
          </>
        )}
      </Button>
      {error && (
        <p className="text-sm text-red-600 mt-2 text-center">{error}</p>
      )}
    </div>
  );
}
