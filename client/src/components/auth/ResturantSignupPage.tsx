// src/pages/auth/RestaurantSignupPage.tsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function RestaurantSignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    // Personal Information
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    
    // Business Information
    businessDetails: {
      businessName: '',
      businessAddress: '',
      businessPhone: '',
      businessEmail: '',
      description: '',
      cuisine: '',
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('business.')) {
      const [, field] = name.split('.');
      setFormData({
        ...formData,
        businessDetails: {
          ...formData.businessDetails,
          [field]: value,
        },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate passwords
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const { confirmPassword, ...signupData } = formData;
      await signup({
        ...signupData,
        role: 'RESTAURANT_OWNER',
      });
      navigate('/restaurant/pending-verification');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return(
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Partner with Nom Nom Now</h1>
          <p className="text-muted-foreground mt-2">
            Join the leading food delivery platform in Kathmandu
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information Section */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Personal Information</h2>
                <Input
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <Input
                  type="email"
                  name="email"
                  placeholder="Personal Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <Input
                  type="tel"
                  name="phoneNumber"
                  placeholder="Personal Phone Number"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                />
                <Input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                />
                <Input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  minLength={8}
                />
              </div>

              {/* Business Information Section */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Restaurant Information</h2>
                <Input
                  name="business.businessName"
                  placeholder="Restaurant Name"
                  value={formData.businessDetails.businessName}
                  onChange={handleChange}
                  required
                />
                <Textarea
                  name="business.description"
                  placeholder="Restaurant Description"
                  value={formData.businessDetails.description}
                  onChange={handleChange}
                  required
                />
                <Input
                  name="business.businessAddress"
                  placeholder="Restaurant Address"
                  value={formData.businessDetails.businessAddress}
                  onChange={handleChange}
                  required
                />
                <Input
                  type="tel"
                  name="business.businessPhone"
                  placeholder="Restaurant Phone"
                  value={formData.businessDetails.businessPhone}
                  onChange={handleChange}
                  required
                />
                <Input
                  type="email"
                  name="business.businessEmail"
                  placeholder="Restaurant Email"
                  value={formData.businessDetails.businessEmail}
                  onChange={handleChange}
                  required
                />
                <Input
                  name="business.cuisine"
                  placeholder="Cuisine Type (e.g., Nepali, Indian, Chinese)"
                  value={formData.businessDetails.cuisine}
                  onChange={handleChange}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Submitting Application...' : 'Submit Restaurant Application'}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                By submitting this application, you agree to our{' '}
                <Link to="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </div>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link to="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="text-sm text-muted-foreground space-y-4">
          <h3 className="font-medium text-foreground">What happens next?</h3>
          <ol className="list-decimal pl-4 space-y-2">
            <li>Our team will review your application within 24-48 hours</li>
            <li>We'll verify your business documents and location</li>
            <li>Once approved, you can start setting up your menu and receiving orders</li>
            <li>Our support team will guide you through the entire process</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
