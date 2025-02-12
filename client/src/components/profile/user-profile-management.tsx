// src/components/profile/user-profile-management.tsx
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  User,
  MapPin,
  Clock,
  Star,
  Loader2,
  Bell,
} from 'lucide-react';
import { AddressesTab } from './tabs/addresses-tab';
import { OrdersTab } from './tabs/orders-tab';
import { ReviewsTab } from './tabs/reviews-tab';
import NotificationsTab from './tabs/notifications-tab';
import api from '@/services/api';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  emailVerified: boolean;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export function UserProfileManagement() {
  const { user, setUser } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState<UserProfile>({
    id: '',
    name: '',
    email: '',
    phone: null,
    emailVerified: false,
    role: 'USER',
    createdAt: '',
    updatedAt: ''
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    orderUpdates: true,
    promotionalEmails: false,
    specialOffers: true
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await api.get('/user/profile');
      if (response.data.success) {
        setProfile(response.data.data);
      }
    } catch (error) {
      handleError(error, 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await api.put('/user/profile', {
        name: profile.name,
        phone: profile.phone
      });

      if (response.data.success) {
        setProfile(response.data.data);
        setUser(prev => prev ? { ...prev, name: response.data.data.name } : null);
        
        toast({
          title: 'Success',
          description: 'Profile updated successfully',
        });
      }
    } catch (error) {
      handleError(error, 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleNotificationsUpdate = async () => {
    try {
      const response = await api.put('/user/notification-settings', notificationSettings);
      if (response.data.success) {
        toast({
          title: 'Success',
          description: 'Notification preferences updated',
        });
      }
    } catch (error) {
      handleError(error, 'Failed to update notification settings');
    }
  };

  const handleError = (error: any, defaultMessage: string) => {
    console.error('Error:', error);
    toast({
      title: 'Error',
      description: error.response?.data?.error || defaultMessage,
      variant: 'destructive',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs defaultValue="profile" className="space-y-8">
        <TabsList className="grid grid-cols-2 lg:grid-cols-5 gap-2">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="addresses" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>Addresses</span>
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Orders</span>
          </TabsTrigger>
          <TabsTrigger value="reviews" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            <span>Reviews</span>
          </TabsTrigger>
        </TabsList>

        <div>
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profile.name}
                        onChange={(e) =>
                          setProfile({ ...profile, name: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        disabled
                        className="bg-gray-50"
                      />
                      {!profile.emailVerified && (
                        <p className="text-sm text-yellow-600">
                          Email not verified
                        </p>
                      )}
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={profile.phone || ''}
                        onChange={(e) =>
                          setProfile({ ...profile, phone: e.target.value })
                        }
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="bg-[#FF4500] hover:bg-[#FF4500]/90 text-white"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationsTab 
              settings={notificationSettings}
              setSettings={setNotificationSettings}
              onSave={handleNotificationsUpdate}
            />
          </TabsContent>

          <TabsContent value="addresses">
            <AddressesTab />
          </TabsContent>

          <TabsContent value="orders">
            <OrdersTab />
          </TabsContent>

          <TabsContent value="reviews">
            <ReviewsTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}

export default UserProfileManagement;