// src/services/session.service.ts
import { PrismaClient } from '@prisma/client';
import { User } from '@/types/auth.types';

const prisma = new PrismaClient();

export class SessionService {
  private static readonly MAX_SESSIONS_PER_USER = 5;

  static async createSession(user: User, refreshToken: string) {
    // First, count existing sessions
    const sessionCount = await prisma.session.count({
      where: { userId: user.id }
    });

    // If max sessions reached, delete oldest session
    if (sessionCount >= this.MAX_SESSIONS_PER_USER) {
      const oldestSession = await prisma.session.findFirst({
        where: { userId: user.id },
        orderBy: { createdAt: 'asc' }
      });
      
      if (oldestSession) {
        await prisma.session.delete({
          where: { id: oldestSession.id }
        });
      }
    }

    // Create new session
    return prisma.session.create({
      data: {
        userId: user.id,
        refreshToken: refreshToken,
        userAgent: user.userAgent,
        lastActiveAt: new Date(),
      }
    });
  }
}
