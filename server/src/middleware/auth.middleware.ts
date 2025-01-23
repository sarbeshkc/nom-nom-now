// src/middleware/auth.middleware.ts

import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { TokenService } from '../utils/token';
import { AuthError, ERROR_CODES } from '../utils/error';
import { UserRole } from '../types/auth.types';
import { errorResponse } from '../utils/response';
import { LoggingMiddleware } from './logging.middleware';

const prisma = new PrismaClient();

/**
 * Middleware to authenticate requests using JWT tokens.
 * Extracts the token from Authorization header and verifies it.
 * Attaches the user object to the request if authentication is successful.
 */
export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1]; // Bearer <token>

    if (!token) {
      throw new AuthError(
        'Authentication required',
        ERROR_CODES.NO_TOKEN,
        401
      );
    }

    // Verify token and extract payload
    const decoded = await TokenService.verifyAccessToken(token);

    // Check if token is blacklisted (for logged out tokens)
    const isBlacklisted = await prisma.tokenBlacklist.findUnique({
      where: { token }
    });

    if (isBlacklisted) {
      throw new AuthError(
        'Token has been invalidated',
        ERROR_CODES.INVALID_TOKEN,
        401
      );
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        emailVerified: true,
        twoFactorEnabled: true,
        lastLoginAt: true
      }
    });

    if (!user) {
      throw new AuthError(
        'User not found',
        ERROR_CODES.USER_NOT_FOUND,
        401
      );
    }

    // Check if user is active
    if (user.status !== 'ACTIVE') {
      throw new AuthError(
        'Account is not active',
        ERROR_CODES.ACCOUNT_LOCKED,
        403
      );
    }

    // Check if email is verified
    if (!user.emailVerified) {
      throw new AuthError(
        'Email not verified',
        ERROR_CODES.EMAIL_NOT_VERIFIED,
        403
      );
    }

    // Attach user to request object
    req.user = user;

    // Log authentication event
    await LoggingMiddleware.logSecurityEvent({
      userId: user.id,
      action: 'AUTHENTICATE',
      status: 'SUCCESS',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    next();
  } catch (error) {
    if (error instanceof AuthError) {
      return res.status(error.statusCode).json(
        errorResponse(error.message)
      );
    }

    // Handle JWT-specific errors
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json(
        errorResponse('Token has expired')
      );
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json(
        errorResponse('Invalid token')
      );
    }

    // Log unexpected errors
    console.error('Authentication error:', error);
    return res.status(500).json(
      errorResponse('Authentication failed')
    );
  }
};

/**
 * Middleware to enforce role-based access control.
 * Checks if the authenticated user has the required role(s).
 * Must be used after authenticateToken middleware.
 */
export const authorizeRoles = (...allowedRoles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AuthError(
          'Authentication required',
          ERROR_CODES.NO_TOKEN,
          401
        );
      }

      if (!allowedRoles.includes(req.user.role)) {
        // Log unauthorized access attempt
        await LoggingMiddleware.logSecurityEvent({
          userId: req.user.id,
          action: 'UNAUTHORIZED_ACCESS',
          status: 'FAILURE',
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'],
          details: {
            requiredRoles: allowedRoles,
            userRole: req.user.role
          }
        });

        throw new AuthError(
          'Insufficient permissions',
          ERROR_CODES.INSUFFICIENT_PERMISSIONS,
          403
        );
      }

      next();
    } catch (error) {
      if (error instanceof AuthError) {
        return res.status(error.statusCode).json(
          errorResponse(error.message)
        );
      }

      return res.status(500).json(
        errorResponse('Authorization failed')
      );
    }
  };
};

/**
 * Middleware to verify ownership of a resource.
 * Checks if the authenticated user owns the requested resource.
 * Must be used after authenticateToken middleware.
 */
export const authorizeOwnership = (resourceType: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AuthError(
          'Authentication required',
          ERROR_CODES.NO_TOKEN,
          401
        );
      }

      const resourceId = req.params.id;
      if (!resourceId) {
        throw new AuthError(
          'Resource ID is required',
          ERROR_CODES.INVALID_REQUEST,
          400
        );
      }

      // Check ownership based on resource type
      let isOwner = false;
      switch (resourceType) {
        case 'restaurant':
          const restaurant = await prisma.restaurant.findUnique({
            where: { id: resourceId }
          });
          isOwner = restaurant?.ownerId === req.user.id;
          break;

        case 'order':
          const order = await prisma.order.findUnique({
            where: { id: resourceId }
          });
          isOwner = order?.userId === req.user.id;
          break;

        // Add more resource types as needed
        default:
          throw new Error(`Unknown resource type: ${resourceType}`);
      }

      if (!isOwner) {
        // Log unauthorized access attempt
        await LoggingMiddleware.logSecurityEvent({
          userId: req.user.id,
          action: 'UNAUTHORIZED_ACCESS',
          status: 'FAILURE',
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'],
          details: {
            resourceType,
            resourceId
          }
        });

        throw new AuthError(
          'Resource access denied',
          ERROR_CODES.INSUFFICIENT_PERMISSIONS,
          403
        );
      }

      next();
    } catch (error) {
      if (error instanceof AuthError) {
        return res.status(error.statusCode).json(
          errorResponse(error.message)
        );
      }

      return res.status(500).json(
        errorResponse('Authorization failed')
      );
    }
  };
};

/**
 * Middleware to handle two-factor authentication requirements.
 * Checks if 2FA is enabled and properly verified for the user.
 * Must be used after authenticateToken middleware.
 */
export const requireTwoFactor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new AuthError(
        'Authentication required',
        ERROR_CODES.NO_TOKEN,
        401
      );
    }

    // Skip if 2FA is not enabled
    if (!req.user.twoFactorEnabled) {
      return next();
    }

    // Check if 2FA is already verified for this session
    const twoFactorVerified = await prisma.twoFactorSession.findFirst({
      where: {
        userId: req.user.id,
        expiresAt: { gt: new Date() }
      }
    });

    if (!twoFactorVerified) {
      throw new AuthError(
        'Two-factor authentication required',
        ERROR_CODES.TWO_FACTOR_REQUIRED,
        403
      );
    }

    next();
  } catch (error) {
    if (error instanceof AuthError) {
      return res.status(error.statusCode).json(
        errorResponse(error.message)
      );
    }

    return res.status(500).json(
      errorResponse('Two-factor authentication check failed')
    );
  }
};