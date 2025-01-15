// src/utils/token.ts
import jwt from 'jsonwebtoken';
import { AuthTokens, User } from '@/types/auth.types';

export class TokenService {
  private static readonly ACCESS_TOKEN_SECRET = process.env.JWT_SECRET!;
  private static readonly REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;
  private static readonly ACCESS_TOKEN_EXPIRY = '15m';  // 15 minutes
  private static readonly REFRESH_TOKEN_EXPIRY = '7d';  // 7 days

  static generateTokens(user: User): AuthTokens {
    // We exclude sensitive information from the token payload
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified
    };

    const accessToken = jwt.sign(
      tokenPayload,
      this.ACCESS_TOKEN_SECRET,
      { expiresIn: this.ACCESS_TOKEN_EXPIRY }
    );

    // Refresh token gets a different secret and longer expiry
    const refreshToken = jwt.sign(
      { userId: user.id },
      this.REFRESH_TOKEN_SECRET,
      { expiresIn: this.REFRESH_TOKEN_EXPIRY }
    );

    return { accessToken, refreshToken };
  }

  static async verifyAccessToken(token: string) {
    try {
      const decoded = jwt.verify(token, this.ACCESS_TOKEN_SECRET);
      return decoded as jwt.JwtPayload;
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('Token has expired');
      }
      throw new Error('Invalid token');
    }
  }

  static async verifyRefreshToken(token: string) {
    try {
      const decoded = jwt.verify(token, this.REFRESH_TOKEN_SECRET);
      return decoded as jwt.JwtPayload;
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }
}
