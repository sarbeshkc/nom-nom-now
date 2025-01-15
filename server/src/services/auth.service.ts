import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { SignupCredentials, LoginCredentials } from '../types/auth.types';

const prisma = new PrismaClient();

export class AuthService {
  private generateTokens(userId: string) {
    const token = jwt.sign(
      { userId },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );
    
    const refreshToken = jwt.sign(
      { userId },
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: '7d' }
    );

    return { token, refreshToken };
  }

  async signup(credentials: SignupCredentials) {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: credentials.email }
    });

    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(credentials.password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: credentials.email,
        password: hashedPassword,
        name: credentials.name,
        role: credentials.role,
        // Add business details for restaurant owners
        ...(credentials.role === 'RESTAURANT_OWNER' && {
          restaurantProfile: {
            create: credentials.businessDetails
          }
        })
      }
    });

    // Generate tokens
    const tokens = this.generateTokens(user.id);

    return {
      user: this.sanitizeUser(user),
      ...tokens
    };
  }

  async login(credentials: LoginCredentials) {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: credentials.email }
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(
      credentials.password,
      user.password
    );

    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Generate tokens
    const tokens = this.generateTokens(user.id);

    return {
      user: this.sanitizeUser(user),
      ...tokens
    };
  }

  async validateToken(token: string) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId }
      });

      if (!user) {
        throw new Error('User not found');
      }

      return this.sanitizeUser(user);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  async refreshToken(refreshToken: string) {
    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET!
      ) as { userId: string };

      const tokens = this.generateTokens(decoded.userId);
      return tokens;
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  private sanitizeUser(user: any) {
    // Remove sensitive data before sending to client
    const { password, ...sanitizedUser } = user;
    return sanitizedUser;
  }
}

export default new AuthService();
