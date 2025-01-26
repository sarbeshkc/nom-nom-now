// src/validations/auth.validation.ts

import * as z from 'zod';
import { UserRole, UserStatus, AuthProvider } from '../types/auth.type'

// Common validation patterns
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const PHONE_REGEX = /^(\+977)?[0-9]{10}$/;  // Nepal phone number format
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Helper validation messages
const messages = {
  required: (field: string) => `${field} is required`,
  invalid: (field: string) => `Invalid ${field.toLowerCase()}`,
  min: (field: string, min: number) => `${field} must be at least ${min} characters`,
  max: (field: string, max: number) => `${field} cannot exceed ${max} characters`,
  pattern: {
    password: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    phone: 'Invalid phone number format. Must be a valid Nepal phone number',
    email: 'Invalid email address format'
  }
};

// Base schemas for reusable fields
const emailSchema = z.string()
  .min(1, messages.required('Email'))
  .email(messages.invalid('email'))
  .regex(EMAIL_REGEX, messages.pattern.email)
  .transform(email => email.toLowerCase());

const passwordSchema = z.string()
  .min(8, messages.min('Password', 8))
  .max(100, messages.max('Password', 100))
  .regex(PASSWORD_REGEX, messages.pattern.password);

const phoneSchema = z.string()
  .regex(PHONE_REGEX, messages.pattern.phone)
  .optional();

/**
 * Device Information Schema
 */
export const deviceInfoSchema = z.object({
  deviceId: z.string().optional(),
  deviceType: z.string().optional(),
  browser: z.string().optional(),
  os: z.string().optional(),
  ip: z.string().optional(),
  userAgent: z.string().optional()
});

/**
 * Restaurant Registration Schema
 */
export const restaurantDetailsSchema = z.object({
  businessName: z.string()
    .min(2, messages.min('Business name', 2))
    .max(100, messages.max('Business name', 100)),
  businessAddress: z.string()
    .min(5, messages.min('Business address', 5))
    .max(200, messages.max('Business address', 200)),
  businessPhone: z.string()
    .regex(PHONE_REGEX, messages.pattern.phone),
  businessEmail: emailSchema,
  description: z.string()
    .min(20, messages.min('Description', 20))
    .max(1000, messages.max('Description', 1000)),
  cuisineTypes: z.array(z.string())
    .min(1, 'At least one cuisine type must be selected')
    .max(5, 'Maximum 5 cuisine types allowed'),
  businessLicense: z.string().optional(),
  foodSafetyCertification: z.string().optional()
});

/**
 * Signup Schema
 */
export const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  name: z.string()
    .min(2, messages.min('Name', 2))
    .max(50, messages.max('Name', 50))
    .regex(/^[a-zA-Z\s]*$/, 'Name can only contain letters and spaces'),
  role: z.nativeEnum(UserRole).optional().default(UserRole.CUSTOMER),
  phoneNumber: phoneSchema,
  restaurantDetails: restaurantDetailsSchema.optional()
    .superRefine((val, ctx) => {
      // If role is RESTAURANT_OWNER, restaurantDetails is required
      if (ctx.parent?.role === UserRole.RESTAURANT_OWNER && !val) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Restaurant details are required for restaurant owners'
        });
      }
    })
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

/**
 * Login Schema
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, messages.required('Password')),
  rememberMe: z.boolean().optional().default(false),
  deviceInfo: deviceInfoSchema.optional()
});

/**
 * Password Reset Request Schema
 */
export const passwordResetRequestSchema = z.object({
  email: emailSchema
});

/**
 * Password Reset Schema
 */
export const passwordResetSchema = z.object({
  token: z.string().min(1, messages.required('Reset token')),
  newPassword: passwordSchema,
  confirmPassword: z.string()
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

/**
 * Email Verification Schema
 */
export const emailVerificationSchema = z.object({
  token: z.string().min(1, messages.required('Verification token'))
});

/**
 * Two Factor Authentication Schema
 */
export const twoFactorVerifySchema = z.object({
  code: z.string()
    .length(6, 'Verification code must be 6 digits')
    .regex(/^\d+$/, 'Code must contain only numbers'),
  tempToken: z.string().min(1, messages.required('Temporary token')),
  trustDevice: z.boolean().optional().default(false)
});

/**
 * Change Password Schema
 */
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, messages.required('Current password')),
  newPassword: passwordSchema,
  confirmPassword: z.string()
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
}).refine(data => data.currentPassword !== data.newPassword, {
  message: "New password must be different from current password",
  path: ["newPassword"]
});

/**
 * Error Response Schema
 */
export const errorResponseSchema = z.object({
  code: z.string(),
  message: z.string(),
  statusCode: z.number(),
  details: z.record(z.any()).optional()
});

// Type inference helpers
export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type PasswordResetRequestInput = z.infer<typeof passwordResetRequestSchema>;
export type PasswordResetInput = z.infer<typeof passwordResetSchema>;
export type TwoFactorVerifyInput = z.infer<typeof twoFactorVerifySchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;