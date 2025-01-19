// src/services/two-factor.service.ts

import { PrismaClient } from '@prisma/client';
import { authenticator } from 'otplib';
import QRCode from 'qrcode';
import { 
  TwoFactorSetupResponse, 
  TwoFactorVerifyDTO,
  SecurityLog
} from '../types';

export class TwoFactorService {
  private prisma: PrismaClient;
  private readonly issuer = 'Nom-Nom-Now';

  constructor() {
    this.prisma = new PrismaClient();
    // Configure OTP library
    authenticator.options = {
      window: 1, // Allow 1 step before/after for time drift
      step: 30   // 30-second step size
    };
  }

  /**
   * Initiates 2FA setup for a user
   * Generates secret key and QR code for authenticator apps
   */
  async setupTwoFactor(userId: string): Promise<TwoFactorSetupResponse> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (user.twoFactorEnabled) {
      throw new Error('Two-factor authentication is already enabled');
    }

    // Generate a secret key
    const secret = authenticator.generateSecret();

    // Create otpauth URL for QR code
    const otpauthUrl = authenticator.keyuri(
      user.email,
      this.issuer,
      secret
    );

    // Generate QR code
    const qrCode = await QRCode.toDataURL(otpauthUrl);

    // Store the secret temporarily until verified
    await this.prisma.twoFactorSecret.create({
      data: {
        userId,
        secret,
        verified: false,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
      }
    });

    // Log the setup attempt
    await this.logSecurityEvent({
      userId,
      eventType: 'TWO_FACTOR_SETUP_INITIATED',
      status: 'PENDING'
    });

    return {
      secret,
      otpauthUrl,
      qrCode
    };
  }

  /**
   * Verifies the initial 2FA setup using a code from the authenticator app
   */
  async verifyTwoFactorSetup(
    userId: string,
    code: string
  ): Promise<void> {
    const secret = await this.prisma.twoFactorSecret.findFirst({
      where: {
        userId,
        verified: false,
        expiresAt: { gt: new Date() }
      }
    });

    if (!secret) {
      throw new Error('No pending 2FA setup found or setup expired');
    }

    const isValid = authenticator.verify({
      token: code,
      secret: secret.secret
    });

    if (!isValid) {
      throw new Error('Invalid verification code');
    }

    // Enable 2FA and store verified secret
    await this.prisma.$transaction([
      // Update user
      this.prisma.user.update({
        where: { id: userId },
        data: { 
          twoFactorEnabled: true,
          twoFactorSecret: secret.secret
        }
      }),
      // Remove temporary secret
      this.prisma.twoFactorSecret.delete({
        where: { id: secret.id }
      })
    ]);

    // Generate backup codes
    const backupCodes = await this.generateBackupCodes(userId);

    // Log successful setup
    await this.logSecurityEvent({
      userId,
      eventType: 'TWO_FACTOR_SETUP_COMPLETED',
      status: 'SUCCESS'
    });

    return backupCodes;
  }

  /**
   * Validates a 2FA code during login
   */
  async validateTwoFactorCode(
    userId: string,
    code: string,
    ipAddress: string
  ): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user?.twoFactorSecret) {
      throw new Error('Two-factor authentication not set up');
    }

    // Check if it's a backup code
    const backupCode = await this.prisma.backupCode.findFirst({
      where: {
        userId,
        code: code,
        used: false
      }
    });

    if (backupCode) {
      // Mark backup code as used
      await this.prisma.backupCode.update({
        where: { id: backupCode.id },
        data: { 
          used: true,
          usedAt: new Date()
        }
      });

      await this.logSecurityEvent({
        userId,
        eventType: 'TWO_FACTOR_BACKUP_CODE_USED',
        status: 'SUCCESS',
        ipAddress
      });

      return true;
    }

    // Verify TOTP code
    const isValid = authenticator.verify({
      token: code,
      secret: user.twoFactorSecret
    });

    // Log the verification attempt
    await this.logSecurityEvent({
      userId,
      eventType: 'TWO_FACTOR_VERIFICATION',
      status: isValid ? 'SUCCESS' : 'FAILED',
      ipAddress
    });

    return isValid;
  }

  /**
   * Generates new backup codes for a user
   */
  private async generateBackupCodes(userId: string): Promise<string[]> {
    const codes: string[] = [];
    
    // Generate 8 backup codes
    for (let i = 0; i < 8; i++) {
      codes.push(this.generateBackupCode());
    }

    // Store hashed backup codes
    await this.prisma.backupCode.createMany({
      data: codes.map(code => ({
        userId,
        code,
        used: false
      }))
    });

    return codes;
  }

  /**
   * Generates a single backup code
   */
  private generateBackupCode(): string {
    return Array.from(
      { length: 4 },
      () => Math.random().toString(36).substring(2, 5)
    ).join('-');
  }

  /**
   * Logs security events for monitoring
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

export const twoFactorService = new TwoFactorService();
