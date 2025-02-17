// src/components/profile/tabs/notifications-tab.tsx
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';

interface NotificationSettings {
  emailNotifications: boolean;
  orderUpdates: boolean;
  promotionalEmails: boolean;
  specialOffers: boolean;
}

interface NotificationsTabProps {
  settings: NotificationSettings;
  setSettings: (settings: NotificationSettings) => void;
  onSave: () => void;
}

export function NotificationsTab({ settings, setSettings, onSave }: NotificationsTabProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-[#FF4500]" />
          <CardTitle>Notification Preferences</CardTitle>
        </div>
        <CardDescription>
          Manage how you receive notifications and updates
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Email Notifications</Label>
              <p className="text-sm text-gray-500">
                Receive order confirmations and updates via email
              </p>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, emailNotifications: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Order Updates</Label>
              <p className="text-sm text-gray-500">
                Get notified about your order status
              </p>
            </div>
            <Switch
              checked={settings.orderUpdates}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, orderUpdates: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Promotional Emails</Label>
              <p className="text-sm text-gray-500">
                Stay updated with our latest offers and promotions
              </p>
            </div>
            <Switch
              checked={settings.promotionalEmails}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, promotionalEmails: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Special Offers</Label>
              <p className="text-sm text-gray-500">
                Receive notifications about special deals and events
              </p>
            </div>
            <Switch
              checked={settings.specialOffers}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, specialOffers: checked })
              }
            />
          </div>
        </div>

        <Button 
          onClick={onSave}
          className="bg-[#FF4500] hover:bg-[#FF4500]/90 text-white"
        >
          Save Preferences
        </Button>
      </CardContent>
    </Card>
  );
}

export default NotificationsTab;