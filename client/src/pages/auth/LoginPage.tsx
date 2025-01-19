import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/AuthContext';
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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { 
  Mail, 
  Lock, 
  Loader2, 
  Eye, 
  EyeOff, 
  AlertCircle,
  Info 
} from 'lucide-react';

// Form validation schema
const loginSchema = z.object({
  email: z
    .string()
    .email('Please enter a valid email address')
    .min(1, 'Email is required'),
  password: z
    .string()
    .min(1, 'Password is required'),
  rememberMe: z.boolean().optional()
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  // Form state
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [securityAlert, setSecurityAlert] = useState<string | null>(null);

  // Get previous verification success message if any
  const verificationSuccess = location.state?.verificationSuccess;
  const verifiedEmail = location.state?.email;

  // Initialize form with react-hook-form
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: verifiedEmail || '',
      password: '',
      rememberMe: false
    }
  });

  // Handle form submission
  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      setSecurityAlert(null);

      // Attempt login
      await login({
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe
      });

      // Login successful - redirection is handled in AuthContext

    } catch (error: any) {
      console.error('Login error:', error);
      
      // Handle different error cases
      if (error.response?.status === 401) {
        setError('Invalid email or password');
        
        // Check for security-related messages
        const securityMessage = error.response?.data?.securityAlert;
        if (securityMessage) {
          setSecurityAlert(securityMessage);
        }
      } else if (error.response?.status === 403 && error.response?.data?.reason === 'EMAIL_NOT_VERIFIED') {
        // Email not verified - offer to resend verification
        navigate('/auth/verify-email', { 
          state: { email: data.email } 
        });
      } else {
        setError(error.response?.data?.error || 'An error occurred during login');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Welcome back
          </CardTitle>
          <CardDescription className="text-center">
            Sign in to your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Success message after email verification */}
          {verificationSuccess && (
            <Alert className="mb-6 bg-green-50 text-green-800 border-green-200">
              <AlertDescription>
                Your email has been verified successfully! You can now sign in.
              </AlertDescription>
            </Alert>
          )}

          {/* Error message */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Security alert */}
          {securityAlert && (
            <Alert className="mb-6 bg-yellow-50 text-yellow-800 border-yellow-200">
              <Info className="h-4 w-4" />
              <AlertDescription>{securityAlert}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input
                          {...field}
                          type="email"
                          placeholder="you@example.com"
                          className="pl-10"
                          disabled={isSubmitting}
                          autoComplete="email"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input
                          {...field}
                          type={showPassword ? 'text' : 'password'}
                          className="pl-10 pr-10"
                          disabled={isSubmitting}
                          autoComplete="current-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
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
                  </FormItem>
                )}
              />

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="rememberMe"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <label
                        htmlFor="rememberMe"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Remember me
                      </label>
                    </div>
                  )}
                />

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="link"
                        className="px-0 font-semibold"
                        onClick={() => navigate('/auth/forgot-password')}
                      >
                        Forgot password?
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Reset your password via email</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter>
          <p className="text-center w-full text-sm">
            Don't have an account?{' '}
            <Button
              variant="link"
              className="p-0 font-semibold"
              onClick={() => navigate('/signup')}
            >
              Sign up
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
