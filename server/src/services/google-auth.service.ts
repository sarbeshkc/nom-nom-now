// src/services/google-auth.service.ts
import { OAuth2Client } from 'google-auth-library';
import { AuthError } from '../utils/errors';
import { PrismaClient } from '@prisma/client';
import { TokenService } from '../utils/token';

const prisma = new PrismaClient();

export class GoogleAuthService {
  private static client = new OAuth2Client({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_REDIRECT_URI
  });

  static async verifyGoogleToken(token: string) {
    try {
      // Verify the token with Google
      const ticket = await this.client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID
      });

      const payload = ticket.getPayload();
      if (!payload) {
        throw new AuthError('Invalid Google token', 'GOOGLE_TOKEN_INVALID');
      }

      return {
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        googleId: payload.sub // This is Google's unique identifier
      };
    } catch (error) {
      console.error('Google token verification failed:', error);
      throw new AuthError('Failed to verify Google token', 'GOOGLE_AUTH_FAILED');
    }
  }

  static async handleGoogleLogin(token: string, role: string = 'CUSTOMER') {
    try {
      // Verify the Google token
      const googleUser = await this.verifyGoogleToken(token);

      // Look for existing user
      let user = await prisma.user.findFirst({
        where: {
          OR: [
            { email: googleUser.email },
            { googleId: googleUser.googleId }
          ]
        }
      });

      if (user) {
        // If user exists but doesn't have googleId, link accounts
        if (!user.googleId) {
          user = await prisma.user.update({
            where: { id: user.id },
            data: { googleId: googleUser.googleId }
          });
        }
      } else {
        // Create new user
        user = await prisma.user.create({
          data: {
            email: googleUser.email!,
            name: googleUser.name!,
            googleId: googleUser.googleId,
            role: role,
            emailVerified: true, // Google emails are pre-verified
            provider: 'GOOGLE'
          }
        });
      }

      // Generate authentication tokens
      const tokens = TokenService.generateTokens(user);

      // Create a new session
      await prisma.session.create({
        data: {
          userId: user.id,
          refreshToken: tokens.refreshToken,
          provider: 'GOOGLE',
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
        }
      });

      return { user, tokens };
    } catch (error) {
      console.error('Google authentication failed:', error);
      throw new AuthError(
        'Failed to authenticate with Google',
        'GOOGLE_AUTH_FAILED'
      );
    }
  }
}
