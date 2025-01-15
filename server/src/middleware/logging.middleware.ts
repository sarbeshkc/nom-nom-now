// src/middleware/logging.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class LoggingMiddleware {
  static async logSecurityEvent(
    req: Request,
    eventType: 'LOGIN' | 'LOGIN_FAILED' | 'PASSWORD_RESET' | 'ACCOUNT_LOCKED',
    details: Record<string, any>
  ) {
    try {
      await prisma.securityLog.create({
        data: {
          userId: req.user?.id,
          eventType,
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'] || 'unknown',
          details: details,
          createdAt: new Date()
        }
      });
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  }

  // Middleware to log all authenticated requests
  static async logRequest(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();

    // Capture the original end function
    const originalEnd = res.end;
    res.end = function(chunk?: any, encoding?: any, cb?: any) {
      const duration = Date.now() - startTime;
      
      if (req.user) {
        prisma.requestLog.create({
          data: {
            userId: req.user.id,
            method: req.method,
            path: req.path,
            statusCode: res.statusCode,
            duration,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'] || 'unknown'
          }
        }).catch(error => {
          console.error('Failed to log request:', error);
        });
      }

      // Call the original end function
      originalEnd.call(this, chunk, encoding, cb);
    };

    next();
  }
}
