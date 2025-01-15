// src/middleware/error.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { AuthError } from '../utils/errors';
import { LoggingMiddleware } from './logging.middleware';

export class ErrorMiddleware {
  static async handleError(
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    // Log the error
    console.error('Error:', error);

    // If it's a known authentication error
    if (error instanceof AuthError) {
      await LoggingMiddleware.logSecurityEvent(req, 'LOGIN_FAILED', {
        reason: error.message,
        code: error.code
      });

      return res.status(error.statusCode || 401).json({
        success: false,
        error: error.message,
        code: error.code
      });
    }

    // For unknown errors
    await LoggingMiddleware.logSecurityEvent(req, 'ERROR', {
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });

    // Don't expose internal errors to the client
    res.status(500).json({
      success: false,
      error: 'An internal server error occurred',
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
}
