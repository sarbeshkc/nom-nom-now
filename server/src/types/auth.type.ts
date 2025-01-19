// src/types/auth.types.ts

export type UserRole = 'ADMIN' | 'CUSTOMER' | 'RESTAURANT_OWNER';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION';
export type AuthProvider = 'EMAIL' | 'GOOGLE' | 'FACEBOOK';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  phoneNumber?: string;
  phoneVerified: boolean;
  provider: AuthProvider;
  providerId?: string;
  avatar?: string;
  twoFactorEnabled: boolean;
  lastLoginAt: Date;
  lastLoginIp?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

// Device and Session Information
export interface DeviceInfo {
  userAgent?: string;
  ipAddress?: string;
  browser?: string;
  os?: string;
  device?: string;
}

// Restaurant Verification
export interface RestaurantVerificationData {
  businessName: string;
  businessAddress: string;
  businessPhone: string;
  businessEmail: string;
  description: string;
  cuisine: string[];
  businessLicense?: string;
  foodSafetyCertification?: string;
  verificationStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
  verificationNotes?: string;
}

// Authentication Request/Response Types
export interface AuthResponse {
  user: Omit<User, 'password'>;
  token: string;
  refreshToken: string;
  expiresIn: string;
}

// Login and Signup DTOs
export interface LoginDTO {
  email: string;
  password: string;
  rememberMe?: boolean;
  recaptchaToken?: string;
  deviceInfo?: DeviceInfo;
}

export interface SignupDTO {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  phoneNumber?: string;
  restaurantDetails?: RestaurantVerificationData;
}

// Password Management
export interface PasswordResetRequestDTO {
  email: string;
  recaptchaToken?: string;
}

export interface PasswordResetDTO {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordDTO {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Two-Factor Authentication
export interface TwoFactorSetupResponse {
  otpauthUrl: string;
  secret: string;
  qrCode: string;
}

export interface TwoFactorVerifyDTO {
  code: string;
  rememberDevice?: boolean;
}

// Social Authentication
export interface SocialAuthDTO {
  provider: AuthProvider;
  token: string;
  role?: UserRole;
  deviceInfo?: DeviceInfo;
}

export interface GoogleAuthDTO {
  idToken: string;
  role?: UserRole;
  deviceInfo?: DeviceInfo;
}

// Account Management
export interface UpdateProfileDTO {
  name?: string;
  phoneNumber?: string;
  avatar?: string;
}

export interface EmailChangeRequestDTO {
  newEmail: string;
  password: string;
}

export interface PhoneVerificationDTO {
  phoneNumber: string;
  code: string;
}

// Sessions and Security
export interface Session {
  id: string;
  userId: string;
  deviceInfo: DeviceInfo;
  lastActiveAt: Date;
  expiresAt: Date;
}

export interface SecurityLog {
  id: string;
  userId: string;
  eventType: 'LOGIN' | 'LOGOUT' | 'PASSWORD_CHANGE' | 'PROFILE_UPDATE' | 'TWO_FACTOR_SETUP' | 'FAILED_LOGIN';
  ip: string;
  userAgent: string;
  location?: {
    country?: string;
    city?: string;
  };
  timestamp: Date;
}

// Account Recovery
export interface RecoveryOption {
  type: 'EMAIL' | 'PHONE' | 'BACKUP_CODES';
  value: string;
  verified: boolean;
}

export interface AccountRecoveryDTO {
  type: RecoveryOption['type'];
  token: string;
  newPassword?: string;
}

// Activity and Notifications
export interface LoginNotification {
  type: 'NEW_LOGIN' | 'UNUSUAL_ACTIVITY' | 'PASSWORD_CHANGED';
  deviceInfo: DeviceInfo;
  timestamp: Date;
  location?: SecurityLog['location'];
}

export interface AuthToken {
  accessToken: string;
  refreshToken?: string;
}