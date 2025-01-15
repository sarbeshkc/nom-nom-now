// src/components/auth/CustomerAuth.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, Lock, User, Phone } from 'lucide-react';

// Form validation schema
const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phoneNumber: z.string().optional(),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormData = z.infer<typeof signupSchema>;

export function CustomerSignup() {
  const { signup, socialLogin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    reset 
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema)
  });

  // Initialize Google Sign-In
  useEffect(() => {
    const loadGoogleScript = () => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleSignIn;
      document.head.appendChild(script);
    };

    const initializeGoogleSignIn = () => {
      if (window.google?.accounts) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleGoogleSignIn,
        });

        window.google.accounts.id.renderButton(
          document.getElementById('googleButton')!,
          {
            theme: 'outline',
            size: 'large',
            text: 'signup_with',
            width: 250,
          }
        );
      }
    };

    if (window.google?.accounts) {
      initializeGoogleSignIn();
    } else {
      loadGoogleScript();
    }
  }, []);

  // Handle form submission
  const onSubmit = async (data: SignupFormData) => {
    try {
      setLoading(true);
      setError('');
      
      await signup({
        ...data,
        role: 'CUSTOMER'
      });
      
      reset();
      // Success notification handled by AuthContext
    } catch (err: any) {
      setError(err.message || 'An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  // Handle Google Sign-In callback
  const handleGoogleSignIn = async (response: any) => {
    try {
      setLoading(true);
      setError('');
      await socialLogin('google', 'CUSTOMER');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Create Your Account
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Form fields */}
          <div className="space-y-2">
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                {...register('name')}
                placeholder="Full Name"
                className="pl-10"
                disabled={loading}
              />
            </div>
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Email field */}
          <div className="space-y-2">
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                {...register('email')}
                type="email"
                placeholder="Email Address"
                className="pl-10"
                disabled={loading}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          {/* Phone field */}
          <div className="space-y-2">
            <div className="relative">
              <Phone className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                {...register('phoneNumber')}
                type="tel"
                placeholder="Phone Number (Optional)"
                className="pl-10"
                disabled={loading}
              />
            </div>
            {errors.phoneNumber && (
              <p className="text-sm text-destructive">{errors.phoneNumber.message}</p>
            )}
          </div>

          {/* Password fields */}
          <div className="space-y-2">
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                {...register('password')}
                type="password"
                placeholder="Password"
                className="pl-10"
                disabled={loading}
              />
            </div>
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                {...register('confirmPassword')}
                type="password"
                placeholder="Confirm Password"
                className="pl-10"
                disabled={loading}
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>

        {/* Social login separator */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-background text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        {/* Google Sign-In button */}
        <div className="flex justify-center">
          <div id="googleButton" className="h-10"></div>
        </div>

        {/* Login link */}
        <div className="text-center text-sm">
          <span className="text-muted-foreground">Already have an account? </span>
          <Link
            to="/login"
            className="font-medium text-primary hover:underline"
          >
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default CustomerSignup;