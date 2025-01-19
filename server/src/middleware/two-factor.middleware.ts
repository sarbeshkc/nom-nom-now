// src/middleware/two-factor.middleware.ts

import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { twoFactorService } from '../services/two-factor.service';
import { AuthError } from '../utils/errors';
import { rateLimit } from 'express-rate-limit';

const prisma = new PrismaClient();

// Rate limiter for 2FA attempts
export const twoFactorLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 5, // 5 attempts per hour
  message: 'Too many 2FA attempts. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

export class TwoFactorMiddleware {
  /**
   * Check if user requires 2FA verification for the current request
   */
  static async requireTwoFactor(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user = req.user;
      if (!user) {
        throw new AuthError('No authenticated user', 'AUTH_REQUIRED');
      }

      const userRecord = await prisma.user.findUnique({
        where: { id: user.id },
        select: {
          twoFactorEnabled: true,
          twoFactorVerified: true,
          lastTwoFactorAt: true
        }
      });

      if (!userRecord) {
        throw new AuthError('User not found', 'USER_NOT_FOUND');
      }

      // Skip if 2FA not enabled
      if (!userRecord.twoFactorEnabled) {
        return next();
      }

      // Check if 2FA was recently verified
      const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);
      if (userRecord.lastTwoFactorAt && userRecord.lastTwoFactorAt > twelveHoursAgo) {
        return next();
      }

      // Check for trusted device
      const deviceId = req.cookies['device_id'];
      if (deviceId) {
        const trustedDevice = await prisma.trustedDevice.findFirst({
          where: {
            userId: user.id,
            deviceId,
            trusted: true,
            expiresAt: { gt: new Date() }
          }
        });

        if (trustedDevice) {
          return next();
        }
      }

      // Require 2FA verification
      throw new AuthError('Two-factor authentication required', 'TWO_FACTOR_REQUIRED');

    } catch (error) {
      next(error);
    }
  }

  /**
   * Track and limit 2FA attempts
   */
  static async trackAttempts(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const user = req.user;
    if (!user) return next();

    try {
      // Track this attempt
      await prisma.twoFactorAttempt.create({
        data: {
          userId: user.id,
          ip: req.ip,
          userAgent: req.headers['user-agent'] || 'unknown',
          successful: false // Will be updated to true if verification succeeds
        }
      });

      // Check recent failed attempts
      const recentAttempts = await prisma.twoFactorAttempt.count({
        where: {
          userId: user.id,
          successful: false,
          createdAt: {
            gt: new Date(Date.now() - 60 * 60 * 1000) // Last hour
          }
        }
      });

      if (recentAttempts >= 5) {
        // Lock account temporarily
        await prisma.user.update({
          where: { id: user.id },
          data: {
            twoFactorLocked: true,
            twoFactorLockedUntil: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes
          }
        });

        throw new AuthError(
          'Too many failed attempts. Account locked for 30 minutes.',
          'TWO_FACTOR_LOCKED'
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  }

  /**
   * Verify 2FA backup codes
   */
  static async verifyBackupCode(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { backupCode } = req.body;
    const user = req.user;

    if (!backupCode || !user) {
      return next();
    }

    try {
      const validBackupCode = await prisma.backupCode.findFirst({
        where: {
          userId: user.id,
          code: backupCode,
          used: false,
          expiresAt: { gt: new Date() }
        }
      });

      if (validBackupCode) {
        // Mark backup code as used
        await prisma.backupCode.update({
          where: { id: validBackupCode.id },
          data: {
            used: true,
            usedAt: new Date()
          }
        });

        // Log the usage
        await prisma.securityLog.create({
          data: {
            userId: user.id,
            eventType: 'BACKUP_CODE_USED',
            ip: req.ip,
            userAgent: req.headers['user-agent'] || 'unknown'
          }
        });

        req.backupCodeVerified = true;
      }

      next();
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handle trusted devices
   */
  static async handleTrustedDevice(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { trustDevice } = req.body;
    const user = req.user;

    if (!trustDevice || !user) {
      return next();
    }

    try {
      const deviceId = `dev_${Math.random().toString(36).substr(2)}`;

      // Create trusted device record
      await prisma.trustedDevice.create({
        data: {
          userId: user.id,
          deviceId,
          userAgent: req.headers['user-agent'] || 'unknown',
          ip: req.ip,
          trusted: true,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        }
      });

      // Set cookie
      res.cookie('device_id', deviceId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        sameSite: 'lax'
      });

      next();
    } catch (error) {
      next(error);
    }
  }
}
