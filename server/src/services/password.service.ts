// src/services/password.service.ts

import { PrismaClient } from '@prisma/client';
import { emailService } from './email.service';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { 
  PasswordResetRequestDTO, 
  PasswordResetDTO,
  SecurityLog 
} from '../types';

export class PasswordService {
  private prisma: PrismaClient;
  private readonly TOKEN_EXPIRY = 60 * 60 * 1000; // 1 hour in milliseconds
  private readonly MIN_PASSWORD_LENGTH = 8;
  private readonly PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * Initiates the password reset process by generating and sending a reset token
   * @param data Contains email and optional recaptcha token
   * @param ipAddress IP address of the requester for security logging
   */
  async initiatePasswordReset(
    data: PasswordResetRequestDTO, 
    ipAddress: string
  ): Promise<void> {
    // Validate email exists
    const user = await this.prisma.user.findUnique({
      where: { email: data.email }
    });

    if (!user) {
      // We don't want to reveal if the email exists or not
      // Still log the attempt for security monitoring
      await this.logSecurityEvent({
        eventType: 'PASSWORD_RESET_REQUEST',
        status: 'FAILED',
        reason: 'EMAIL_NOT_FOUND',
        ipAddress,
        metadata: { email: data.email }
      });
      return;
    }

    // Check for recent reset requests to prevent abuse
    const recentRequest = await this.prisma.passwordResetToken.findFirst({
      where: {
        userId: user.id,
        createdAt: {
          gt: new Date(Date.now() - 15 * 60 * 1000) // 15 minutes
        }
      }
    });

    if (recentRequest) {
      throw new Error('Please wait before requesting another reset');
    }

    // Generate a secure random token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Store the hashed token
    await this.prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token: hashedToken,
        expiresAt: new Date(Date.now() + this.TOKEN_EXPIRY)
      }
    });

    // Send reset email
    await emailService.sendPasswordResetEmail(
      user.email,
      user.name,
      resetToken
    );

    // Log the reset request
    await this.logSecurityEvent({
      userId: user.id,
      eventType: 'PASSWORD_RESET_REQUEST',
      status: 'SUCCESS',
      ipAddress,
    });
  }

  /**
   * Validates password reset token and updates password
   * @param data Contains token and new password details
   * @param ipAddress IP address for security logging
   */
  async resetPassword(
    data: PasswordResetDTO, 
    ipAddress: string
  ): Promise<void> {
    // Validate password requirements
    this.validatePassword(data.newPassword);

    // Hash the token for comparison
    const hashedToken = crypto
      .createHash('sha256')
      .update(data.token)
      .digest('hex');

    // Find valid token
    const resetToken = await this.prisma.passwordResetToken.findFirst({
      where: {
        token: hashedToken,
        used: false,
        expiresAt: { gt: new Date() }
      },
      include: { user: true }
    });

    if (!resetToken) {
      throw new Error('Invalid or expired reset token');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(data.newPassword, 12);

    // Update password and invalidate token in a transaction
    await this.prisma.$transaction(async (prisma) => {
      // Update password
      await prisma.user.update({
        where: { id: resetToken.userId },
        data: { 
          password: hashedPassword,
          passwordChangedAt: new Date()
        }
      });

      // Mark token as used
      await prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { used: true }
      });

      // Optional: Invalidate all user sessions for security
      await prisma.session.deleteMany({
        where: { userId: resetToken.userId }
      });
    });

    // Send notification email
    await emailService.sendSecurityAlert(
      resetToken.user.email,
      resetToken.user.name,
      'PASSWORD_CHANGED',
      { timestamp: new Date(), ipAddress }
    );

    // Log the password change
    await this.logSecurityEvent({
      userId: resetToken.user.id,
      eventType: 'PASSWORD_RESET_COMPLETE',
      status: 'SUCCESS',
      ipAddress,
    });
  }

  /**
   * Validates password meets security requirements
   * @param password Password to validate
   * @throws Error if password doesn't meet requirements
   */
  private validatePassword(password: string): void {
    if (password.length < this.MIN_PASSWORD_LENGTH) {
      throw new Error('Password must be at least 8 characters long');
    }

    if (!this.PASSWORD_PATTERN.test(password)) {
      throw new Error(
        'Password must contain at least one uppercase letter, ' +
        'one lowercase letter, one number, and one special character'
      );
    }
  }

  /**
   * Logs security events for monitoring and auditing
   * @param event Security event details
   */
  private async logSecurityEvent(event: Partial<SecurityLog>): Promise<void> {
    await this.prisma.securityLog.create({
      data: {
        ...event,
        timestamp: new Date()
      } as SecurityLog
    });
  }
}

export const passwordService = new PasswordService();
