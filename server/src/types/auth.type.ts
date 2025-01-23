// src/types/auth.types.ts

/**
 * Core enums that match our Prisma schema
 */
export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  RESTAURANT_OWNER = 'RESTAURANT_OWNER',
  ADMIN = 'ADMIN'
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  PENDING_VERIFICATION = 'PENDING_VERIFICATION'
}

export enum AuthProvider {
  EMAIL = 'EMAIL',
  GOOGLE = 'GOOGLE',
  FACEBOOK = 'FACEBOOK'
}

/**
 * Core user interface matching our Prisma schema
 */
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  phoneNumber?: string;
  phoneVerified: boolean;
  avatar?: string;
  provider: AuthProvider;
  providerId?: string;
  twoFactorEnabled: boolean;
  lastLoginAt?: Date;
  lastLoginIp?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

/**
 * Authentication request DTOs
 */
export interface SignupDTO {
  email: string;
  password: string;
  name: string;
  role?: UserRole;
  phoneNumber?: string;
  // For restaurant owners
  restaurantDetails?: RestaurantRegistrationDTO;
}

export interface LoginDTO {
  email: string;
  password: string;
  rememberMe?: boolean;
  deviceInfo?: DeviceInfo;
}

export interface RestaurantRegistrationDTO {
  businessName: string;
  businessAddress: string;
  businessPhone: string;
  businessEmail: string;
  description: string;
  cuisineTypes: string[];
  businessLicense?: string;
  foodSafetyCertification?: string;
}

/**
 * Authentication response types
 */
export interface AuthResponse {
  user: Omit<User, 'password'>; // Never return password
  tokens: AuthTokens;
  requiresTwoFactor?: boolean;
  tempToken?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

/**
 * Device and security types
 */
export interface DeviceInfo {
  deviceId?: string;
  deviceType?: string;
  browser?: string;
  os?: string;
  ip?: string;
  userAgent?: string;
}

export interface SecurityContext {
  ipAddress: string;
  userAgent?: string;
  location?: {
    country?: string;
    city?: string;
  };
  deviceInfo?: DeviceInfo;
}

/**
 * Email verification types
 */
export interface EmailVerificationRequest {
  token: string;
}

export interface ResendVerificationDTO {
  email: string;
}

/**
 * Password management types
 */
export interface PasswordResetRequestDTO {
  email: string;
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

/**
 * Two-factor authentication types
 */
export interface TwoFactorSetupResponse {
  otpauthUrl: string;
  secret: string;
  qrCode: string;
  backupCodes: string[];
}

export interface TwoFactorVerifyDTO {
  code: string;
  tempToken: string;
  trustDevice?: boolean;
}

/**
 * Session management types
 */
export interface Session {
  id: string;
  userId: string;
  token: string;
  deviceInfo?: DeviceInfo;
  expiresAt: Date;
  createdAt: Date;
  lastActiveAt: Date;
}

/**
 * Error types
 */
export interface AuthError {
  code: string;
  message: string;
  statusCode: number;
  details?: Record<string, any>;
}

/**
 * Validation result types
 */
export interface ValidationResult {
  valid: boolean;
  errors?: Record<string, string[]>;
}

/**
 * OAuth types
 */
export interface OAuthProfile {
  id: string;
  email: string;
  name?: string;
  picture?: string;
  provider: AuthProvider;
}

export interface OAuthTokens {
  accessToken: string;
  refreshToken?: string;
  idToken?: string;
  expiresIn: number;
}

/**
 * Notification types for auth events
 */
export interface AuthNotification {
  type: 'AUTH_SUCCESS' | 'AUTH_FAILURE' | 'PASSWORD_RESET' | 'EMAIL_VERIFIED';
  message: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

/**
 * Rate limiting types
 */
export interface RateLimitConfig {
  windowMs: number;  // Time window in milliseconds
  max: number;       // Max requests per window
  message: string;   // Error message when limit exceeded
}

/**
 * API Response types
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp?: Date;
}

/**
 * Audit log types
 */
export interface AuthAuditLog {
  userId: string;
  action: string;
  status: 'SUCCESS' | 'FAILURE';
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
  details?: Record<string, any>;
}