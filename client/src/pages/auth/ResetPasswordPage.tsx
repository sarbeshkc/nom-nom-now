import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Lock, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import api from '@/services/api';

// Password requirements schema with strong validation
const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  // State management
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
  const [isValidating, setIsValidating] = useState(true);

  // Get token from URL
  const token = searchParams.get('token');
  
  // Initialize form
  const form = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  });

  // Validate token on component mount
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setIsTokenValid(false);
        setIsValidating(false);
        return;
      }

      try {
        // Verify token validity with backend
        await api.post('/auth/verify-reset-token', { token });
        setIsTokenValid(true);
      } catch (error) {
        console.error('Token validation error:', error);
        setIsTokenValid(false);
      } finally {
        setIsValidating(false);
      }
    };

    validateToken();
  }, [token]);

  // Calculate password strength
  const calculatePasswordStrength = (password: string): number => {
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 20;
    if (password.length >= 12) strength += 10;
    
    // Character type checks
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[a-z]/.test(password)) strength += 20;
    if (/[0-9]/.test(password)) strength += 20;
    if (/[^A-Za-z0-9]/.test(password)) strength += 20;
    
    return Math.min(strength, 100);
  };

  // Get color for password strength indicator
  const getStrengthColor = (strength: number): string => {
    if (strength < 30) return 'bg-red-500';
    if (strength < 60) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  // Handle form submission
  const onSubmit = async (data: ResetPasswordForm) => {
    if (!token) return;

    try {
      setIsSubmitting(true);

      await api.post('/auth/reset-password', {
        token,
        password: data.password
      });

      // Show success message
      toast({
        title: "Password reset successful",
        description: "You can now login with your new password.",
      });

      // Redirect to login
      navigate('/login', {
        state: { 
          resetSuccess: true,
          email: localStorage.getItem('passwordResetEmail')
        }
      });

      // Clean up stored email
      localStorage.removeItem('passwordResetEmail');

    } catch (error: any) {
      console.error('Password reset error:', error);
      
      toast({
        variant: "destructive",
        title: "Failed to reset password",
        description: error.response?.data?.error || 'Please try again or request a new reset link'
      });

    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center space-y-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p>Verifying reset link...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Invalid token state
  if (!isTokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>
                This password reset link is invalid or has expired.
                Please request a new password reset link.
              </AlertDescription>
            </Alert>
            <Button
              className="w-full"
              onClick={() => navigate('/auth/forgot-password')}
            >
              Request New Reset Link
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
            Reset your password
          </CardTitle>
          <CardDescription className="text-center">
            Please enter your new password below
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input
                          {...field}
                          type={showPassword ? 'text' : 'password'}
                          className="pl-10 pr-10"
                          disabled={isSubmitting}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                          tabIndex={-1}
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />

                    {/* Password strength indicator */}
                    {field.value && (
                      <div className="space-y-2">
                        <Progress 
                          value={calculatePasswordStrength(field.value)} 
                          className={`h-2 ${getStrengthColor(calculatePasswordStrength(field.value))}`}
                        />
                        <ul className="text-sm space-y-1">
                          <li className={field.value.length >= 8 ? 'text-green-600' : 'text-muted-foreground'}>
                            • At least 8 characters
                          </li>
                          <li className={/[A-Z]/.test(field.value) ? 'text-green-600' : 'text-muted-foreground'}>
                            • One uppercase letter
                          </li>
                          <li className={/[a-z]/.test(field.value) ? 'text-green-600' : 'text-muted-foreground'}>
                            • One lowercase letter
                          </li>
                          <li className={/[0-9]/.test(field.value) ? 'text-green-600' : 'text-muted-foreground'}>
                            • One number
                          </li>
                          <li className={/[^A-Za-z0-9]/.test(field.value) ? 'text-green-600' : 'text-muted-foreground'}>
                            • One special character
                          </li>
                        </ul>
                      </div>
                    )}
                  </FormItem>
                )}
              />

              {/* Confirm Password Field */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input
                          {...field}
                          type={showConfirmPassword ? 'text' : 'password'}
                          className="pl-10 pr-10"
                          disabled={isSubmitting}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                          tabIndex={-1}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resetting Password...
                  </>
                ) : (
                  'Reset Password'
                )}
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => navigate('/login')}
                disabled={isSubmitting}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to login
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
