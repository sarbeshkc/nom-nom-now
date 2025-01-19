import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { 
  Shield, 
  Loader2, 
  Smartphone, 
  Copy, 
  Download,
  ArrowLeft,
  CheckCircle2 
} from 'lucide-react';
import api from '@/services/api';

// Validation schema for verification code
const verificationSchema = z.object({
  code: z.string()
    .min(6, 'Code must be 6 digits')
    .max(6, 'Code must be 6 digits')
    .regex(/^\d+$/, 'Code must contain only numbers')
});

type VerificationForm = z.infer<typeof verificationSchema>;

export default function TwoFactorSetupPage() {
  const navigate = useNavigate();
  const { refreshUserData } = useAuth();
  const { toast } = useToast();

  // State management
  const [setupData, setSetupData] = useState<{
    qrCode: string;
    secret: string;
    backupCodes: string[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);
  const [backupCodesDownloaded, setBackupCodesDownloaded] = useState(false);

  // Initialize form
  const form = useForm<VerificationForm>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      code: ''
    }
  });

  // Initialize 2FA setup on component mount
  useEffect(() => {
    initializeSetup();
  }, []);

  // Handle initial setup
  const initializeSetup = async () => {
    try {
      const response = await api.post('/auth/2fa/initialize');
      setSetupData({
        qrCode: response.data.qrCode,
        secret: response.data.secret,
        backupCodes: response.data.backupCodes
      });
    } catch (error) {
      console.error('2FA initialization error:', error);
      toast({
        variant: "destructive",
        title: "Setup failed",
        description: "Unable to initialize 2FA setup. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle verification code submission
  const onSubmit = async (data: VerificationForm) => {
    if (!setupData) return;

    try {
      setIsVerifying(true);

      // Verify the code and complete setup
      await api.post('/auth/2fa/verify-setup', {
        code: data.code,
        secret: setupData.secret
      });

      // Update user data to reflect 2FA status
      await refreshUserData();

      setSetupComplete(true);
      
      toast({
        title: "2FA Enabled",
        description: "Two-factor authentication has been successfully enabled for your account."
      });

    } catch (error: any) {
      console.error('2FA verification error:', error);
      
      toast({
        variant: "destructive",
        title: "Verification failed",
        description: error.response?.data?.error || "Invalid verification code. Please try again."
      });

    } finally {
      setIsVerifying(false);
    }
  };

  // Handle backup codes download
  const downloadBackupCodes = () => {
    if (!setupData?.backupCodes) return;

    const content = [
      "BACKUP CODES - KEEP THESE SAFE",
      "These codes can be used to access your account if you lose your authenticator device.",
      "Each code can only be used once.",
      "",
      ...setupData.backupCodes
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'backup-codes.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setBackupCodesDownloaded(true);
  };

  // Copy secret to clipboard
  const copySecret = () => {
    if (!setupData?.secret) return;
    
    navigator.clipboard.writeText(setupData.secret);
    toast({
      title: "Copied!",
      description: "Secret key copied to clipboard"
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center space-y-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p>Initializing 2FA setup...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Setup completion state
  if (setupComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center space-y-4">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
              <h2 className="text-xl font-semibold text-center">
                2FA Setup Complete
              </h2>
              <p className="text-center text-muted-foreground">
                Two-factor authentication has been successfully enabled for your account.
              </p>

              {!backupCodesDownloaded && (
                <Alert className="mt-4">
                  <AlertDescription>
                    Don't forget to save your backup codes! You'll need these if you
                    lose access to your authenticator app.
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex flex-col w-full gap-2">
                {!backupCodesDownloaded && (
                  <Button
                    className="w-full"
                    onClick={downloadBackupCodes}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Backup Codes
                  </Button>
                )}

                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => navigate('/settings/security')}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Security Settings
                </Button>
              </div>
            </div>
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
            Set up two-factor authentication
          </CardTitle>
          <CardDescription className="text-center">
            Protect your account with an additional layer of security
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {setupData && (
            <>
              {/* Step 1: Install authenticator app */}
              <div className="space-y-4">
                <h3 className="font-semibold">1. Install an authenticator app</h3>
                <p className="text-sm text-muted-foreground">
                  Install an authenticator app like Google Authenticator or Authy on your
                  mobile device if you haven't already.
                </p>
                <div className="flex items-center justify-center">
                  <Smartphone className="h-12 w-12 text-muted-foreground" />
                </div>
              </div>

              {/* Step 2: Scan QR code or enter secret */}
              <div className="space-y-4">
                <h3 className="font-semibold">2. Scan QR code or enter secret</h3>
                <p className="text-sm text-muted-foreground">
                  Open your authenticator app and scan this QR code or enter the secret
                  key manually.
                </p>
                
                {/* QR Code */}
                <div className="flex justify-center p-4 bg-white rounded-lg">
                  <img 
                    src={setupData.qrCode} 
                    alt="QR Code" 
                    className="w-48 h-48"
                  />
                </div>

                {/* Secret Key */}
                <div className="flex items-center gap-2">
                  <code className="flex-1 p-2 bg-muted rounded text-sm font-mono break-all">
                    {setupData.secret}
                  </code>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={copySecret}
                    className="shrink-0"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Step 3: Enter verification code */}
              <div className="space-y-4">
                <h3 className="font-semibold">3. Enter verification code</h3>
                <p className="text-sm text-muted-foreground">
                  Enter the 6-digit code shown in your authenticator app to verify setup.
                </p>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                              <Shield className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                              <Input
                                {...field}
                                placeholder="Enter 6-digit code"
                                className="pl-10"
                                disabled={isVerifying}
                                maxLength={6}
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
                      disabled={isVerifying}
                    >
                      {isVerifying ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        'Verify and Enable 2FA'
                      )}
                    </Button>
                  </form>
                </Form>
              </div>
            </>
          )}
        </CardContent>

        <CardFooter>
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => navigate('/settings/security')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Security Settings
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
