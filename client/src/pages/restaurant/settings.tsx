// src/pages/restaurant/settings.tsx

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import {
  Settings,
  Clock,
  MapPin,
  DollarSign,
  Truck,
  BellRing,
  Shield,
} from 'lucide-react';

interface BusinessHours {
  monday: { open: string; close: string };
  tuesday: { open: string; close: string };
  wednesday: { open: string; close: string };
  thursday: { open: string; close: string };
  friday: { open: string; close: string };
  saturday: { open: string; close: string };
  sunday: { open: string; close: string };
}

interface RestaurantSettings {
  businessName: string;
  description: string;
  phone: string;
  alternatePhone: string;
  email: string;
  address: {
    street: string;
    city: string;
    province: string;
    postalCode: string;
  };
  businessHours: BusinessHours;
  deliverySettings: {
    minimumOrder: number;
    deliveryRadius: number;
    freeDeliveryThreshold: number;
    baseDeliveryFee: number;
  };
  notificationSettings: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    orderAlerts: boolean;
    marketingUpdates: boolean;
  };
}

export default function RestaurantSettingsPage() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<RestaurantSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/restaurant/settings');
        const data = await response.json();
        
        if (data.success) {
          setSettings(data.data);
        } else {
          throw new Error(data.error);
        }
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load restaurant settings',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSaveSettings = async (section: string, data: any) => {
    try {
      const response = await fetch(`/api/restaurant/settings/${section}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      
      if (responseData.success) {
        // Update the local state with the new settings
        setSettings(prev => ({
          ...prev!,
          [section]: data
        }));

        // Show success message to user
        toast({
          title: 'Success',
          description: `${section.charAt(0).toUpperCase() + section.slice(1)} settings updated successfully`,
        });
      } else {
        throw new Error(responseData.error);
      }
    } catch (error) {
      // Show error message if update fails
      toast({
        title: 'Error',
        description: `Failed to update ${section} settings`,
        variant: 'destructive',
      });
    }
  };

  // Show loading state while fetching initial settings
  if (isLoading || !settings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Restaurant Settings</h1>
            {/* Help text for users */}
            <p className="text-sm text-gray-500">
              Changes are saved automatically for each section
            </p>
          </div>

          {/* Restaurant Profile Section */}
          <div className="grid gap-8 mb-8">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-primary" />
                  <CardTitle>Restaurant Profile</CardTitle>
                </div>
                <CardDescription>
                  Basic information about your restaurant
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Restaurant Name</Label>
                    <Input
                      id="businessName"
                      value={settings.businessName}
                      onChange={(e) => setSettings({
                        ...settings,
                        businessName: e.target.value
                      })}
                      placeholder="Enter restaurant name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={settings.phone}
                      onChange={(e) => setSettings({
                        ...settings,
                        phone: e.target.value
                      })}
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Restaurant Description</Label>
                  <Textarea
                    id="description"
                    value={settings.description}
                    onChange={(e) => setSettings({
                      ...settings,
                      description: e.target.value
                    })}
                    placeholder="Describe your restaurant"
                    className="min-h-[100px]"
                  />
                </div>
                <Button 
                  onClick={() => handleSaveSettings('profile', {
                    businessName: settings.businessName,
                    phone: settings.phone,
                    description: settings.description
                  })}
                >
                  Save Profile
                </Button>
              </CardContent>
            </Card>

            {/* Operating Hours Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <CardTitle>Operating Hours</CardTitle>
                </div>
                <CardDescription>
                  Set your restaurant's business hours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(settings.businessHours).map(([day, hours]) => (
                    <div key={day} className="grid grid-cols-3 gap-4 items-center">
                      <Label className="capitalize">{day}</Label>
                      <div>
                        <Input
                          type="time"
                          value={hours.open}
                          onChange={(e) => {
                            const updatedHours = {
                              ...settings.businessHours,
                              [day]: {
                                ...hours,
                                open: e.target.value
                              }
                            };
                            setSettings({
                              ...settings,
                              businessHours: updatedHours
                            });
                          }}
                        />
                      </div>
                      <div>
                        <Input
                          type="time"
                          value={hours.close}
                          onChange={(e) => {
                            const updatedHours = {
                              ...settings.businessHours,
                              [day]: {
                                ...hours,
                                close: e.target.value
                              }
                            };
                            setSettings({
                              ...settings,
                              businessHours: updatedHours
                            });
                          }}
                        />
                      </div>
                    </div>
                  ))}
                  <Button 
                    onClick={() => handleSaveSettings('businessHours', settings.businessHours)}
                    className="mt-4"
                  >
                    Update Hours
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Settings Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-primary" />
                  <CardTitle>Delivery Settings</CardTitle>
                </div>
                <CardDescription>
                  Configure your delivery options and fees
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="minimumOrder">Minimum Order (NPR)</Label>
                    <Input
                      id="minimumOrder"
                      type="number"
                      value={settings.deliverySettings.minimumOrder}
                      onChange={(e) => {
                        const updatedSettings = {
                          ...settings.deliverySettings,
                          minimumOrder: Number(e.target.value)
                        };
                        setSettings({
                          ...settings,
                          deliverySettings: updatedSettings
                        });
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deliveryRadius">Delivery Radius (km)</Label>
                    <Input
                      id="deliveryRadius"
                      type="number"
                      value={settings.deliverySettings.deliveryRadius}
                      onChange={(e) => {
                        const updatedSettings = {
                          ...settings.deliverySettings,
                          deliveryRadius: Number(e.target.value)
                        };
                        setSettings({
                          ...settings,
                          deliverySettings: updatedSettings
                        });
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="baseDeliveryFee">Base Delivery Fee (NPR)</Label>
                    <Input
                      id="baseDeliveryFee"
                      type="number"
                      value={settings.deliverySettings.baseDeliveryFee}
                      onChange={(e) => {
                        const updatedSettings = {
                          ...settings.deliverySettings,
                          baseDeliveryFee: Number(e.target.value)
                        };
                        setSettings({
                          ...settings,
                          deliverySettings: updatedSettings
                        });
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="freeDeliveryThreshold">
                      Free Delivery Threshold (NPR)
                    </Label>
                    <Input
                      id="freeDeliveryThreshold"
                      type="number"
                      value={settings.deliverySettings.freeDeliveryThreshold}
                      onChange={(e) => {
                        const updatedSettings = {
                          ...settings.deliverySettings,
                          freeDeliveryThreshold: Number(e.target.value)
                        };
                        setSettings({
                          ...settings,
                          deliverySettings: updatedSettings
                        });
                      }}
                    />
                  </div>
                </div>
                <Button 
                  onClick={() => handleSaveSettings('deliverySettings', settings.deliverySettings)}
                >
                  Update Delivery Settings
                </Button>
              </CardContent>
            </Card>

            {/* Notification Preferences */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <BellRing className="w-5 h-5 text-primary" />
                  <CardTitle>Notification Preferences</CardTitle>
                </div>
                <CardDescription>
                  Manage how you receive updates and alerts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {Object.entries(settings.notificationSettings).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">
                          {key.split(/(?=[A-Z])/).join(' ')}
                        </Label>
                        <p className="text-sm text-gray-500">
                          {getNotificationDescription(key)}
                        </p>
                      </div>
                      <Switch
                        checked={value}
                        onCheckedChange={(checked) => {
                          const updatedSettings = {
                            ...settings.notificationSettings,
                            [key]: checked
                          };
                          setSettings({
                            ...settings,
                            notificationSettings: updatedSettings
                          });
                          handleSaveSettings('notificationSettings', updatedSettings);
                        }}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// Helper function to get notification descriptions
function getNotificationDescription(key: string): string {
  const descriptions: Record<string, string> = {
    emailNotifications: 'Receive order updates and important alerts via email',
    smsNotifications: 'Get instant notifications via SMS',
    orderAlerts: 'Get notified immediately when new orders arrive',
    marketingUpdates: 'Receive promotional materials and platform updates'
  };
  return descriptions[key] || '';
}