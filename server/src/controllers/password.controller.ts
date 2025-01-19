// src/controllers/password.controller.ts

import { Request, Response } from 'express';
import { passwordService } from '../services/password.service';
import { PasswordResetRequestDTO, PasswordResetDTO } from '../types';
import { rateLimit } from 'express-rate-limit';

// Rate limiting for password reset attempts
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 requests per IP per hour
  message: 'Too many reset attempts. Please try again later.'
});

export class PasswordController {
  /**
   * Handles password reset request
   * POST /api/auth/forgot-password
   */
  static async requestPasswordReset(
    req: Request<{}, {}, PasswordResetRequestDTO>,
    res: Response
  ) {
    try {
      const ipAddress = req.ip;

      await passwordService.initiatePasswordReset(req.body, ipAddress);

      // Always return success to prevent email enumeration
      return res.json({
        success: true,
        message: 'If an account exists with that email, a reset link will be sent.'
      });

    } catch (error) {
      console.error('Password reset request error:', error);
      
      // Don't expose internal errors
      return res.status(400).json({
        success: false,
        error: 'Unable to process reset request. Please try again later.'
      });
    }
  }

  /**
   * Handles password reset completion
   * POST /api/auth/reset-password
   */
  static async resetPassword(
    req: Request<{}, {}, PasswordResetDTO>,
    res: Response
  ) {
    try {
      const ipAddress = req.ip;

      await passwordService.resetPassword(req.body, ipAddress);

      return res.json({
        success: true,
        message: 'Password has been reset successfully.'
      });

    } catch (error: any) {
      console.error('Password reset error:', error);

      // Return user-friendly error messages for known errors
      if (error.message.includes('Password must')) {
        return res.status(400).json({
          success: false,
          error: error.message
        });
      }

      return res.status(400).json({
        success: false,
        error: 'Unable to reset password. Please try again.'
      });
    }
  }
}
