// src/types/security.types.ts

export interface SecurityPreferences {
  twoFactorEnabled: boolean;
  loginNotifications: boolean;
  allowMultipleSessions: boolean;
  trustedDevices: TrustedDevice[];
  loginHistory: LoginRecord[];
  securityQuestions: SecurityQuestion[];
}

export interface TrustedDevice {
  id: string;
  name: string;
  deviceId: string;
  lastUsed: Date;
  trust_expires: Date;
}

export interface LoginRecord {
  timestamp: Date;
  ip: string;
  location: string;
  deviceInfo: DeviceInfo;
  status: 'SUCCESS' | 'FAILED';
  failureReason?: string;
}

export interface DeviceInfo {
  browser: string;
  os: string;
  device: string;
  fingerprint: string;
}

export interface SecurityQuestion {
  id: string;
  question: string;
  answer: string; // Hashed
  lastUpdated: Date;
}

export interface RateLimitInfo {
  endpoint: string;
  maxAttempts: number;
  windowMs: number;
  remainingAttempts: number;
  resetTime: Date;
}

export interface SecurityAlert {
  id: string;
  userId: string;
  type: 'UNUSUAL_LOGIN' | 'PASSWORD_CHANGE' | 'ACCOUNT_RECOVERY' | 'SECURITY_UPDATE';
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  details: Record<string, any>;
  timestamp: Date;
  resolved: boolean;
  resolvedAt?: Date;
}
