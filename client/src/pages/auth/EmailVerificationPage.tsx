import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, Loader2, ArrowLeft, RefreshCw } from 'lucide-react';

export default function EmailVerificationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { resendVerification } = useAuth();

  // States for various processes
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [verificationStatus, setVerificationStatus] = useState<
    'pending' | 'success' | 'error' | null
  >(null);

  // Get email from location state or localStorage
  const email = location.state?.email || localStorage.getItem('pendingVerificationEmail');

  useEffect(() => {
    // Handle verification token if present in URL
    const token = searchParams.get('token');
    if (token) {
      verifyEmail(token);
    }
  }, [searchParams]);

  // Countdown timer for resend button
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCountdown > 0) {
      timer = setInterval(() => {
        setResendCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCountdown]);

  // Verify email token
  const verifyEmail = async (token: string) => {
    try {
      setIsVerifying(true);
      setVerificationStatus('pending');

      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });

      if (!response.ok) {
        throw new Error('Verification failed');
      }

      setVerificationStatus('success');
      
      // Show success message
      toast({
        title: 'Email verified successfully!',
        description: 'You can now sign in to your account.'
      });

      // Clear stored email
      localStorage.removeItem('pendingVerificationEmail');

      // Redirect to login after a short delay
      setTimeout(() => {
        navigate('/login', {
          state: { 
            verificationSuccess: true,
            email 
          }
        });
      }, 2000);

    } catch (error) {
      console.error('Verification error:', error);
      setVerificationStatus('error');
      
      toast({
        variant: 'destructive',
        title: 'Verification failed',
        description: 'The verification link may have expired. Please request a new one.'
      });
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle resend verification email
  const handleResendVerification = async () => {
    if (!email || isResending || resendCountdown > 0) return;

    try {
      setIsResending(true);

      await resendVerification(email);
      
      // Set countdown for resend button (60 seconds)
      setResendCountdown(60);

      toast({
        title: 'Verification email sent',
        description: 'Please check your inbox for the verification link.'
      });

    } catch (error) {
      console.error('Failed to resend verification:', error);
      
      toast({
        variant: 'destructive',
        title: 'Failed to send verification email',
        description: 'Please try again later.'
      });
    } finally {
      setIsResending(false);
    }
  };

  // Show error if no email is available
  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <Alert variant="destructive">
              <AlertDescription>
                No email address found. Please try signing up again.
              </AlertDescription>
            </Alert>
            <Button
              className="w-full mt-4"
              onClick={() => navigate('/signup')}
            >
              Back to Sign Up
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Verify your email
          </CardTitle>
          <CardDescription className="text-center">
            We've sent a verification link to
            <br />
            <span className="font-medium">{email}</span>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Verification Status Messages */}
          {verificationStatus === 'pending' && (
            <Alert className="bg-blue-50 text-blue-800 border-blue-200">
              <AlertDescription className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Verifying your email...
              </AlertDescription>
            </Alert>
          )}

          {verificationStatus === 'success' && (
            <Alert className="bg-green-50 text-green-800 border-green-200">
              <AlertDescription>
                Your email has been verified successfully!
                Redirecting to login...
              </AlertDescription>
            </Alert>
          )}

          {verificationStatus === 'error' && (
            <Alert variant="destructive">
              <AlertDescription>
                The verification link may have expired.
                Please request a new one below.
              </AlertDescription>
            </Alert>
          )}

          {/* Instructions */}
          <div className="space-y-4 text-center">
            <div className="p-4 bg-muted/50 rounded-lg">
              <Mail className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                Check your email and click the verification link to activate your account
              </p>
            </div>

            {/* Resend Button */}
            <Button
              variant="outline"
              className="w-full"
              onClick={handleResendVerification}
              disabled={isResending || resendCountdown > 0}
            >
              {isResending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : resendCountdown > 0 ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Resend in {resendCountdown}s
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Resend verification email
                </>
              )}
            </Button>

            {/* Back to Login */}
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => navigate('/login')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
