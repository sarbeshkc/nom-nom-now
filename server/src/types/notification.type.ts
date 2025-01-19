// src/types/notification.types.ts

// These types handle all authentication-related notifications
export type NotificationChannel = 'EMAIL' | 'SMS' | 'PUSH' | 'IN_APP';

export type NotificationPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface AuthNotificationTemplate {
  type: AuthNotificationType;
  subject: string;
  template: string;
  channels: NotificationChannel[];
  priority: NotificationPriority;
}

export type AuthNotificationType = 
  | 'WELCOME'
  | 'EMAIL_VERIFICATION'
  | 'PASSWORD_RESET'
  | 'LOGIN_ALERT'
  | 'SECURITY_ALERT'
  | 'ACCOUNT_LOCKED'
  | 'BUSINESS_VERIFICATION_STATUS'
  | 'TWO_FACTOR_ENABLED'
  | 'TWO_FACTOR_DISABLED';

export interface NotificationPreferences {
  userId: string;
  channels: {
    [K in NotificationChannel]: boolean;
  };
  types: {
    [K in AuthNotificationType]: boolean;
  };
}

export interface NotificationRecord {
  id: string;
  userId: string;
  type: AuthNotificationType;
  channel: NotificationChannel;
  content: {
    subject?: string;
    body: string;
    data?: Record<string, any>;
  };
  status: 'PENDING' | 'SENT' | 'FAILED' | 'DELIVERED' | 'READ';
  sentAt?: Date;
  deliveredAt?: Date;
  readAt?: Date;
  error?: string;
}


export interface EmailOptions {
  to: string;
  subject: string;
  template: string;
  context: Record<string, any>;
  priority?: NotificationPriority;
  attachments?: Array<{
    filename: string;
    content: string | Buffer;
    contentType?: string;
  }>;
}

export interface NotificationTemplateContext {
  name: string;
  supportEmail: string;
  year: number;
  [key: string]: any;
}

export interface AuthNotificationTemplate {
  type: AuthNotificationType;
  subject: string;
  template: string;
  channels: NotificationChannel[];
  priority: NotificationPriority;
}
