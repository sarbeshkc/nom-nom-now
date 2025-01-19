import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/AuthContext';
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
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Shield, 
  Loader2, 
  Key,
  ArrowLeft 
} from 'lucide-react';

// Validation schema for 2FA code
const verifySchema = z.object({
  code: z.string()
    .min(6, 'Code must be 6 digits')
    .max(6, 'Code must be 6 digits')
    .regex(/^\d+$/, 'Code must contain only numbers'),
  trustDevice: z.boolean().optional()
});

type VerifyForm = z.infer<typeof verifySchema>;

export default function TwoFactorVerifyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyTwoFactor } = useAuth();
  const { toast } = useToast();

  // Get email from location state for display
  const email = location.state?.email;
  const tempToken = location.state?.tempToken;

  // Track states
  const [isVerifying, setIsVerifying] = useState(false);
  const [showBackupCode, setShowBackupCode] = useState(false);
  const [attemptsLeft, setAttemptsLeft] = useState(5); // Track remaining attempts

  // Initialize form
  const form = useForm<VerifyForm>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: '',
      trustDevice: false
    }
  });

  // Handle verification code submission
  const onSubmit = async (data: VerifyForm) => {
    if (!tempToken) {
      navigate('/login');
      return;
    }

    try {
      setIsVerifying(true);

      await verifyTwoFactor({
        code: data.code,
        tempToken,
        trustDevice: data.trustDevice,
        isBackupCode: showBackupCode
      });

      // Success handling is managed by Auth context
      // It will redirect to the appropriate page

    } catch (error: any) {
      console.error('2FA verification error:', error);
      
      // Handle different error cases
      if (error.response?.status === 429) {
        // Rate limit reached
        toast({
          variant: "destructive",
          title: "Too many attempts",
          description: "Please wait before trying again"
        });
      } else if (error.response?.status === 401) {
        // Invalid code
        setAttemptsLeft(prev => prev - 1);
        toast({
          variant: "destructive",
          title: "Invalid code",
          description: `Invalid verification code. ${attemptsLeft - 1} attempts remaining.`
        });
      } else {
        toast({
          variant: "destructive",
          title: "Verification failed",
          description: error.response?.data?.error || "Please try again"
        });
      }

      // If no attempts left, redirect to login
      if (attemptsLeft <= 1) {
        toast({
          variant: "destructive",
          title: "Too many failed attempts",
          description: "Please try logging in again"
        });
        setTimeout(() => navigate('/login'), 2000);
      }

    } finally {
      setIsVerifying(false);
    }
  };

  // Handle mode switch between regular and backup codes
  const toggleMode = () => {
    setShowBackupCode(!showBackupCode);
    form.reset({ code: '' });
  };

  // If no temp token, redirect to login
  if (!tempToken || !email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <Alert variant="destructive">
              <AlertDescription>
                Invalid verification session. Please try logging in again.
              </AlertDescription>
            </Alert>
            <Button
              className="w-full mt-4"
              onClick={() => navigate('/login')}
            >
              Back to Login
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
            Two-Factor Verification
          </CardTitle>
          <CardDescription className="text-center">
            {showBackupCode
              ? "Enter a backup code from your list of recovery codes"
              : "Enter the verification code from your authenticator app"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Show which account is being verified */}
          <div className="text-center text-sm text-muted-foreground">
            Verifying login for {email}
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Code Input Field */}
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        {showBackupCode ? (
                          <Key className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        ) : (
                          <Shield className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        )}
                        <Input
                          {...field}
                          placeholder={showBackupCode ? "Enter backup code" : "Enter 6-digit code"}
                          className="pl-10 text-center tracking-[0.5em] font-mono"
                          maxLength={showBackupCode ? 10 : 6}
                          autoComplete="one-time-code"
                          inputMode="numeric"
                          disabled={isVerifying}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Trust Device Option */}
              {!showBackupCode && (
                <FormField
                  control={form.control}
                  name="trustDevice"
                  render={({ field }) => (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="trustDevice"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <label
                        htmlFor="trustDevice"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Trust this device for 30 days
                      </label>
                    </div>
                  )}
                />
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isVerifying}
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify'
                )}
              </Button>
            </form>
          </Form>

          {/* Switch between regular and backup codes */}
          <div className="text-center">
            <Button
              variant="link"
              className="text-sm"
              onClick={toggleMode}
            >
              {showBackupCode
                ? "Use authenticator app instead"
                : "Use a backup code instead"}
            </Button>
          </div>

          {/* Help Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                className="text-sm w-full"
              >
                Need help?
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Having trouble?</DialogTitle>
                <DialogDescription className="space-y-4">
                  <p>
                    If you can't access your authenticator app, you can use one of
                    your backup codes to sign in.
                  </p>
                  <p>
                    If you've lost access to both your authenticator app and backup
                    codes, you'll need to contact support to verify your identity
                    and regain access to your account.
                  </p>
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={() => navigate('/support')}
                  >
                    Contact Support
                  </Button>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </CardContent>

        <CardFooter>
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => navigate('/login')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
