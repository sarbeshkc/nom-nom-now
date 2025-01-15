// src/utils/token-generator.ts
import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class TokenGenerator {
  // Generate a secure random token
  private static generateToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  // Create verification token
  static async createEmailVerificationToken(userId: string) {
    const token = this.generateToken();
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Save hashed token in database
    await prisma.user.update({
      where: { id: userId },
      data: {
        verificationToken: hashedToken,
        verificationTokenExpires: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      }
    });

    return token; // Return unhashed token for email
  }

  // Create password reset token
  static async createPasswordResetToken(userId: string) {
    const token = this.generateToken();
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Save hashed token in database
    await prisma.user.update({
      where: { id: userId },
      data: {
        resetPasswordToken: hashedToken,
        resetPasswordExpires: new Date(Date.now() + 60 * 60 * 1000) // 1 hour
      }
    });

    return token; // Return unhashed token for email
  }

  // Verify a token (works for both types)
  static async verifyToken(token: string, type: 'reset' | 'verification') {
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await prisma.user.findFirst({
      where: type === 'reset' 
        ? {
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { gt: new Date() }
          }
        : {
            verificationToken: hashedToken,
            verificationTokenExpires: { gt: new Date() }
          }
    });

    return user;
  }
}
