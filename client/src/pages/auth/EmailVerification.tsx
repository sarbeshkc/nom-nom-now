import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AuthService from '@/services/auth.service';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function EmailVerification() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
    const token = searchParams.get('token');
  
    useEffect(() => {
      const verifyEmail = async () => {
        if (!token) {
          setStatus('error');
          return;
        }
  
        try {
          await AuthService.verifyEmail(token);
          setStatus('success');
          // Redirect to login after successful verification
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        } catch (error) {
          console.error('Verification error:', error);
          setStatus('error');
        }
      };
  
      verifyEmail();
    }, [token, navigate]);
  
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            {status === 'verifying' && (
              <div className="text-center">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Verifying Email</h2>
                <p className="text-gray-600">Please wait while we verify your email address...</p>
              </div>
            )}
  
            {status === 'success' && (
              <div className="text-center">
                <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-green-600 mb-2">Email Verified!</h2>
                <p className="text-gray-600 mb-4">
                  Your email has been successfully verified. You will be redirected to login...
                </p>
                <Button onClick={() => navigate('/login')}>
                  Go to Login
                </Button>
              </div>
            )}
  
            {status === 'error' && (
              <div className="text-center">
                <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-red-600 mb-2">Verification Failed</h2>
                <p className="text-gray-600 mb-4">
                  We couldn't verify your email. The link may be expired or invalid.
                </p>
                <Button onClick={() => navigate('/signup')}>
                  Back to Sign Up
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }