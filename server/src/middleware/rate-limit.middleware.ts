// src/middleware/rate-limit.middleware.ts

import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { RateLimitConfig } from '../types/auth.types';
import { errorResponse } from '../utils/response';
import { LoggingMiddleware } from './logging.middleware';

const prisma = new PrismaClient();

/**
 * In-memory store for rate limiting
 * Used as a first line of defense before database checks
 */
class MemoryStore {
  private store: Map<string, { count: number; resetAt: number }>;
  private readonly cleanupInterval: number = 60000; // Cleanup every minute

  constructor() {
    this.store = new Map();
    // Periodically cleanup expired entries
    setInterval(() => this.cleanup(), this.cleanupInterval);
  }

  async increment(key: string, windowMs: number): Promise<number> {
    const now = Date.now();
    const record = this.store.get(key);

    if (!record || record.resetAt < now) {
      this.store.set(key, {
        count: 1,
        resetAt: now + windowMs
      });
      return 1;
    }

    record.count += 1;
    return record.count;
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, value] of this.store.entries()) {
      if (value.resetAt < now) {
        this.store.delete(key);
      }
    }
  }
}

const memoryStore = new MemoryStore();

/**
 * Factory function to create rate limiting middleware
 * Supports different configurations for different endpoints
 */
export const createRateLimiter = (config: RateLimitConfig) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const key = generateKey(req);
      
      // First check memory store for quick rejection
      const memoryCount = await memoryStore.increment(key, config.windowMs);
      if (memoryCount > config.max) {
        await handleRateLimitExceeded(req, config);
        return res.status(429).json(
          errorResponse(config.message || 'Too many requests, please try again later')
        );
      }

      // Then check/update database records for persistence
      const attempt = await trackRateLimit(key, config);
      if (attempt > config.max) {
        await handleRateLimitExceeded(req, config);
        return res.status(429).json(
          errorResponse(config.message || 'Too many requests, please try again later')
        );
      }

      // Add rate limit info to response headers
      setRateLimitHeaders(res, config.max, attempt, config.windowMs);

      next();
    } catch (error) {
      console.error('Rate limiting error:', error);
      // On error, allow the request to proceed but log the issue
      next();
    }
  };
};

/**
 * Predefined rate limiters for common scenarios
 */
export const rateLimiters = {
  // Login attempts limiter
  login: createRateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per window
    message: 'Too many login attempts. Please try again later.'
  }),

  // Sign up limiter
  signup: createRateLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // 3 accounts per hour
    message: 'Too many accounts created. Please try again later.'
  }),

  // Password reset limiter
  passwordReset: createRateLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // 3 reset requests per hour
    message: 'Too many password reset requests. Please try again later.'
  }),

  // General API limiter
  api: createRateLimiter({
    windowMs: 60 * 1000, // 1 minute
    max: 60, // 60 requests per minute
    message: 'Too many requests. Please try again later.'
  })
};

/**
 * Generate a unique key for rate limiting based on request properties
 */
function generateKey(req: Request): string {
  const identifier = req.user?.id || req.ip;
  const endpoint = req.originalUrl;
  return `${identifier}:${endpoint}`;
}

/**
 * Track rate limit attempts in the database
 */
async function trackRateLimit(
  key: string,
  config: RateLimitConfig
): Promise<number> {
  const now = new Date();
  const windowStart = new Date(now.getTime() - config.windowMs);

  // Use upsert to atomically update or create the rate limit record
  const result = await prisma.rateLimit.upsert({
    where: { key },
    create: {
      key,
      count: 1,
      resetAt: new Date(now.getTime() + config.windowMs)
    },
    update: {
      count: {
        increment: 1
      },
      resetAt: {
        set: new Date(now.getTime() + config.windowMs)
      }
    }
  });

  return result.count;
}

/**
 * Handle rate limit exceeded events
 */
async function handleRateLimitExceeded(
  req: Request,
  config: RateLimitConfig
): Promise<void> {
  // Log the rate limit event
  await LoggingMiddleware.logSecurityEvent({
    userId: req.user?.id,
    action: 'RATE_LIMIT_EXCEEDED',
    status: 'FAILURE',
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
    details: {
      endpoint: req.originalUrl,
      windowMs: config.windowMs,
      max: config.max
    }
  });

  // If it's a login attempt, increment failed login counter
  if (req.originalUrl.includes('/auth/login') && req.user?.id) {
    await prisma.user.update({
      where: { id: req.user.id },
      data: {
        loginAttempts: {
          increment: 1
        }
      }
    });
  }
}

/**
 * Set rate limit headers in response
 */
function setRateLimitHeaders(
  res: Response,
  limit: number,
  current: number,
  windowMs: number
): void {
  res.setHeader('X-RateLimit-Limit', limit);
  res.setHeader('X-RateLimit-Remaining', Math.max(0, limit - current));
  res.setHeader('X-RateLimit-Reset', new Date(Date.now() + windowMs).getTime());
}

// Additional schema for database (add to prisma.schema)
/*
model RateLimit {
  id        String   @id @default(cuid())
  key       String   @unique
  count     Int      @default(0)
  resetAt   DateTime
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([key])
  @@index([resetAt])
}
*/