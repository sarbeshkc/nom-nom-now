// src/middleware/csrf.middleware.ts
import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

export class CsrfMiddleware {
  // Store for CSRF tokens - in production, use Redis or similar
  private static tokenStore = new Map<string, { token: string, expires: number }>();

  // Generate a new CSRF token
  static generateToken(req: Request, res: Response, next: NextFunction) {
    const token = crypto.randomBytes(32).toString('hex');
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required for CSRF token'
      });
    }

    // Store token with 1-hour expiry
    this.tokenStore.set(userId, {
      token,
      expires: Date.now() + 3600000 // 1 hour
    });

    // Set token in cookie
    res.cookie('XSRF-TOKEN', token, {
      httpOnly: false, // Frontend needs to read this
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600000 // 1 hour
    });

    next();
  }

  // Verify CSRF token
  static verifyToken(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['x-csrf-token'] as string;
    const userId = req.user?.id;

    if (!userId || !token) {
      return res.status(403).json({
        success: false,
        error: 'CSRF token missing'
      });
    }

    const storedData = this.tokenStore.get(userId);

    if (!storedData || 
        storedData.token !== token || 
        storedData.expires < Date.now()) {
      return res.status(403).json({
        success: false,
        error: 'Invalid or expired CSRF token'
      });
    }

    next();
  }

  // Clean up expired tokens periodically
  static cleanupTokens() {
    for (const [userId, data] of this.tokenStore.entries()) {
      if (data.expires < Date.now()) {
        this.tokenStore.delete(userId);
      }
    }
  }
}
