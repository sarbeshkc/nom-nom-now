// src/middleware/rate-limit.middleware.ts
import rateLimit from 'express-rate-limit';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Rate limiter for login attempts
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per window
  message: 'Too many login attempts, please try again later',
  // Store failed attempts in database
  handler: async (req, res) => {
    const email = req.body.email;
    if (email) {
      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (user) {
        // Increment login attempts
        await prisma.user.update({
          where: { id: user.id },
          data: {
            loginAttempts: {
              increment: 1
            },
            // If too many attempts, lock the account
            lockedUntil: user.loginAttempts >= 4 
              ? new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
              : null
          }
        });
      }
    }

    res.status(429).json({
      success: false,
      error: 'Too many login attempts, please try again later',
      code: 'RATE_LIMIT_EXCEEDED'
    });
  }
});
