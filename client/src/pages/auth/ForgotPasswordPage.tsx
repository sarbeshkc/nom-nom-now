import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import api from '@/services/api';

// Form validation schema
const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email('Please enter a valid email address')
    .min(1, 'Email is required'),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Track submission and success states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Initialize form
  const form = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  // Handle form submission
  const onSubmit = async (data: ForgotPasswordForm) => {
    try {
      setIsSubmitting(true);

      // Call password reset endpoint
      await api.post('/auth/forgot-password', {
        email: data.email,
      });

      // Show success state
      setIsSuccess(true);
      
      // Store email for potential use in verification
      localStorage.setItem('passwordResetEmail', data.email);

      toast({
        title: "Reset instructions sent",
        description: "Please check your email for password reset instructions.",
      });

    } catch (error: any) {
      console.error('Password reset request error:', error);
      
      // We don't want to reveal if an email exists or not
      // So we show a success message even if the email doesn't exist
      setIsSuccess(true);
      
      // But we log the error for debugging
      if (error.response?.status !== 404) {
        console.error('Unexpected error:', error);
      }

    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Reset your password
          </CardTitle>
          <CardDescription className="text-center">
            Enter your email address and we'll send you instructions to reset your password
          </CardDescription>
        </CardHeader>

        <CardContent>
          {isSuccess ? (
            // Success State
            <div className="space-y-4">
              <div className="p-6 flex flex-col items-center justify-center text-center space-y-4">
                <CheckCircle2 className="h-12 w-12 text-green-500" />
                <div className="space-y-2">
                  <h3 className="font-semibold">Check your email</h3>
                  <p className="text-sm text-muted-foreground">
                    If an account exists for {form.getValues('email')}, 
                    we've sent instructions to reset your password.
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate('/login')}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to login
              </Button>
            </div>
          ) : (
            // Request Form
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email address</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                          <Input
                            {...field}
                            type="email"
                            placeholder="you@example.com"
                            className="pl-10"
                            disabled={isSubmitting}
                          />
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
                      Sending Instructions...
                    </>
                  ) : (
                    'Send Reset Instructions'
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
          )}
        </CardContent>

        <CardFooter className="text-center text-sm text-muted-foreground">
          Remember your password?{' '}
          <Button
            variant="link"
            className="p-0 font-semibold"
            onClick={() => navigate('/login')}
          >
            Sign in
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
