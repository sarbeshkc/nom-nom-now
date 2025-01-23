// src/services/auth.service.ts

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { 
  SignupInput, 
  LoginInput, 
  PasswordResetRequestInput, 
  PasswordResetInput 
} from '../validations/auth.validation';
import { TokenService } from '../utils/token';
import { TokenGenerator } from '../utils/token-generator';
import { emailService } from './email.service';
import { AuthError, ERROR_CODES } from '../utils/error';
import { LoggingMiddleware } from '../middleware/logging.middleware';
import { AuthResponse, DeviceInfo, User } from '../types/auth.type'

class AuthService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * Handle user registration
   * Includes email verification and optional restaurant registration
   */
  async signup(data: SignupInput, securityContext: { ip: string; userAgent?: string }): Promise<AuthResponse> {
    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email }
    });

    if (existingUser) {
      throw new AuthError(
        'Email already registered',
        ERROR_CODES.EMAIL_IN_USE,
        400
      );
    }

    // Hash password securely
    const hashedPassword = await bcrypt.hash(data.password, 12);

    // Begin transaction to ensure all operations succeed or fail together
    const result = await this.prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          name: data.name,
          role: data.role,
          phoneNumber: data.phoneNumber,
          status: 'PENDING_VERIFICATION',
          provider: 'EMAIL',
          lastLoginIp: securityContext.ip
        }
      });

      // If restaurant owner, create restaurant profile
      if (data.role === 'RESTAURANT_OWNER' && data.restaurantDetails) {
        await tx.restaurant.create({
          data: {
            ownerId: user.id,
            name: data.restaurantDetails.businessName,
            description: data.restaurantDetails.description,
            email: data.restaurantDetails.businessEmail,
            phoneNumber: data.restaurantDetails.businessPhone,
            cuisineTypes: data.restaurantDetails.cuisineTypes,
            status: 'PENDING_VERIFICATION'
          }
        });
      }

      // Generate verification token
      const verificationToken = await TokenGenerator.createEmailVerificationToken(user.id);

      // Save verification token
      await tx.user.update({
        where: { id: user.id },
        data: {
          verificationToken,
          verificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
        }
      });

      // Send verification email
      await emailService.sendVerification(
        user.id,
        user.email,
        user.name,
        verificationToken
      );

      return user;
    });

    // Generate auth tokens
    const tokens = TokenService.generateTokens(result);

    // Log the signup event
    await LoggingMiddleware.logSecurityEvent({
      userId: result.id,
      action: 'SIGNUP',
      status: 'SUCCESS',
      ipAddress: securityContext.ip,
      userAgent: securityContext.userAgent
    });

    // Remove sensitive data before returning
    const { password: _, ...userWithoutPassword } = result;

    return {
      user: userWithoutPassword,
      tokens,
      message: 'Please check your email to verify your account'
    };
  }

  /**
   * Handle user login with optional 2FA
   */
  async login(
    data: LoginInput, 
    securityContext: { ip: string; userAgent?: string }
  ): Promise<AuthResponse> {
    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email: data.email }
    });

    if (!user) {
      throw new AuthError(
        'Invalid credentials',
        ERROR_CODES.INVALID_CREDENTIALS,
        401
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(data.password, user.password);
    if (!isValidPassword) {
      // Log failed attempt
      await this.handleFailedLogin(user.id, securityContext);
      throw new AuthError(
        'Invalid credentials',
        ERROR_CODES.INVALID_CREDENTIALS,
        401
      );
    }

    // Check if email is verified
    if (!user.emailVerified) {
      throw new AuthError(
        'Please verify your email first',
        ERROR_CODES.EMAIL_NOT_VERIFIED,
        403
      );
    }

    // Check account status
    if (user.status !== 'ACTIVE') {
      throw new AuthError(
        'Account is not active',
        ERROR_CODES.ACCOUNT_LOCKED,
        403
      );
    }

    // Handle 2FA if enabled
    if (user.twoFactorEnabled) {
      const tempToken = await this.generateTempToken(user.id);
      return {
        requiresTwoFactor: true,
        tempToken,
        user: { id: user.id, email: user.email }
      };
    }

    // Generate tokens
    const tokens = TokenService.generateTokens(user);

    // Update last login info
    await this.updateLoginInfo(user.id, securityContext);

    // Log successful login
    await LoggingMiddleware.logSecurityEvent({
      userId: user.id,
      action: 'LOGIN',
      status: 'SUCCESS',
      ipAddress: securityContext.ip,
      userAgent: securityContext.userAgent
    });

    // Remove sensitive data
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      tokens
    };
  }

  /**
   * Handle email verification
   */
  async verifyEmail(token: string): Promise<boolean> {
    const user = await this.prisma.user.findFirst({
      where: {
        verificationToken: token,
        verificationExpires: { gt: new Date() }
      }
    });

    if (!user) {
      throw new AuthError(
        'Invalid or expired verification token',
        ERROR_CODES.INVALID_VERIFICATION_TOKEN,
        400
      );
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        status: 'ACTIVE',
        verificationToken: null,
        verificationExpires: null
      }
    });

    // Send welcome email
    await emailService.sendWelcomeEmail(
      user.id,
      user.email,
      user.name
    );

    return true;
  }

  /**
   * Handle password reset request
   */
  async requestPasswordReset(
    data: PasswordResetRequestInput,
    securityContext: { ip: string }
  ): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email }
    });

    // Don't reveal if user exists
    if (!user) {
      return;
    }

    const resetToken = await TokenGenerator.createPasswordResetToken(user.id);

    await emailService.sendPasswordResetEmail(
      user.id,
      user.email,
      user.name,
      resetToken
    );

    await LoggingMiddleware.logSecurityEvent({
      userId: user.id,
      action: 'PASSWORD_RESET_REQUESTED',
      status: 'SUCCESS',
      ipAddress: securityContext.ip
    });
  }

  /**
   * Reset password with token
   */
  async resetPassword(data: PasswordResetInput, securityContext: { ip: string }): Promise<void> {
    const user = await this.prisma.user.findFirst({
      where: {
        resetToken: data.token,
        resetTokenExpires: { gt: new Date() }
      }
    });

    if (!user) {
      throw new AuthError(
        'Invalid or expired reset token',
        ERROR_CODES.INVALID_RESET_TOKEN,
        400
      );
    }

    const hashedPassword = await bcrypt.hash(data.newPassword, 12);

    await this.prisma.$transaction(async (tx) => {
      // Update password
      await tx.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          resetToken: null,
          resetTokenExpires: null
        }
      });

      // Invalidate all sessions
      await tx.session.deleteMany({
        where: { userId: user.id }
      });
    });

    // Send notification
    await emailService.sendSecurityAlert(
      user.id,
      user.email,
      user.name,
      'PASSWORD_CHANGED',
      {
        timestamp: new Date(),
        ipAddress: securityContext.ip
      }
    );

    await LoggingMiddleware.logSecurityEvent({
      userId: user.id,
      action: 'PASSWORD_RESET_COMPLETED',
      status: 'SUCCESS',
      ipAddress: securityContext.ip
    });
  }

  /**
   * Handle failed login attempts
   */
  private async handleFailedLogin(userId: string, context: { ip: string; userAgent?: string }) {
    const failedAttempts = await this.prisma.loginAttempt.count({
      where: {
        userId,
        success: false,
        createdAt: {
          gt: new Date(Date.now() - 15 * 60 * 1000) // 15 minutes
        }
      }
    });

    if (failedAttempts >= 5) {
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          status: 'SUSPENDED',
          lockedUntil: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes
        }
      });
    }

    await this.prisma.loginAttempt.create({
      data: {
        userId,
        success: false,
        ipAddress: context.ip,
        userAgent: context.userAgent
      }
    });

    await LoggingMiddleware.logSecurityEvent({
      userId,
      action: 'LOGIN_FAILED',
      status: 'FAILURE',
      ipAddress: context.ip,
      userAgent: context.userAgent
    });
  }

  /**
   * Update user's login information
   */
  private async updateLoginInfo(userId: string, context: { ip: string; deviceInfo?: DeviceInfo }) {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        lastLoginAt: new Date(),
        lastLoginIp: context.ip
      }
    });

    if (context.deviceInfo) {
      await this.prisma.device.create({
        data: {
          userId,
          ...context.deviceInfo,
          lastUsedAt: new Date()
        }
      });
    }
  }

  /**
   * Generate temporary token for 2FA
   */
  private async generateTempToken(userId: string): Promise<string> {
    const token = TokenService.generateTempToken(userId);
    
    await this.prisma.tempToken.create({
      data: {
        userId,
        token,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
      }
    });

    return token;
  }
}

export const authService = new AuthService();