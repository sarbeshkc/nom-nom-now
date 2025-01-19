import { PrismaClient } from '@prisma/client';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";
import { emailService } from "./email.service";
import {
  User,
  UserRole,
  DeviceInfo,
  RestaurantVerificationData,
  SignupDTO,
  LoginDTO,
  AuthResponse,
  AuthToken } from "@/types/auth.type";

export class AuthService {
  private prisma: PrismaClient;
  private googleClient: OAuth2Client;

  constructor() {
    this.prisma = new PrismaClient();
    this.googleClient = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID
    );
  }

  async signupWithEmail(data: SignupDTO): Promise<AuthResponse> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email }
    });

    if (existingUser) {
      throw new Error('Email Already Registered');
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hrs

    const result = await this.prisma.$transaction(async (prisma) => {
      const user = await prisma.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          name: data.name,
          role: data.role,
          status: data.role === 'RESTAURANT_OWNER' ? 'PENDING_VERIFICATION' : 'ACTIVE',
          provider: 'EMAIL',
          emailVerified: false,
          phoneVerified: false,
          twoFactorEnabled: false,
          verificationToken,
          verificationExpires
        }
      });

      if (data.role === 'RESTAURANT_OWNER' && data.restaurantDetails) {
        await prisma.restaurantVerification.create({
          data: {
            userId: user.id,
            ...data.restaurantDetails,
            verificationStatus: 'PENDING'
          }
        });
      }

      return user;
    });

    await emailService.sendVerification(
      result.id,
      result.email,
      result.name,
      verificationToken
    );

    const tokens = await this.generateAuthToken(result.id);

    return {
      user: this.excludeSensitiveInfo(result),
      token: tokens.accessToken,
      refreshToken: tokens.refreshToken || '',
      expiresIn: '15m'
    };
  }

  async loginWithEmail({ email, password, rememberMe, deviceInfo }: LoginDTO): Promise<AuthResponse> {
    const user = await this.prisma.user.findUnique({
      where: { email }
    });

    if (!user || !user.password) {
      throw new Error('Invalid Credentials');
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      throw new Error('Invalid Credentials');
    }

    if (!user.emailVerified) {
      throw new Error('Please verify your email first');
    }

    if (user.status !== 'ACTIVE') {
      throw new Error('Account Not Active');
    }

    const tokens = await this.generateAuthToken(
      user.id,
      rememberMe,
      deviceInfo
    );

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        lastLoginAt: new Date(),
        lastLoginIp: deviceInfo?.ipAddress
      }
    });

    if (deviceInfo) {
      await emailService.sendSecurityAlert(
        user.id,
        user.email,
        user.name,
        'NEW_LOGIN',
        {
          deviceInfo: {
            browser: deviceInfo.browser || 'Unknown',
            os: deviceInfo.os || 'Unknown',
            device: deviceInfo.device || 'Unknown',
            ip: deviceInfo.ipAddress || 'Unknown'
          },
          timestamp: new Date()
        }
      );
    }

    return {
      user: this.excludeSensitiveInfo(user),
      token: tokens.accessToken,
      refreshToken: tokens.refreshToken || '',
      expiresIn: '15m'
    };
  }

  async handleGoogleAuth(token: string, role: UserRole = 'CUSTOMER', deviceInfo?: DeviceInfo): Promise<AuthResponse> {
    const ticket = await this.googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    if (!payload) throw new Error('Invalid Google Token');
    if (!payload.email) throw new Error('Email not provided by Google');

    let user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: payload.email },
          { providerId: payload.sub }
        ]
      }
    });

    if (user) {
      if (!user.providerId) {
        user = await this.prisma.user.update({
          where: { id: user.id },
          data: {
            providerId: payload.sub,
            provider: 'GOOGLE'
          }
        });
      }
    } else {
      user = await this.prisma.user.create({
        data: {
          email: payload.email,
          name: payload.name || 'User',
          providerId: payload.sub,
          provider: 'GOOGLE',
          role,
          emailVerified: true,
          phoneVerified: false,
          twoFactorEnabled: false,
          status: role === 'RESTAURANT_OWNER' ? 'PENDING_VERIFICATION' : 'ACTIVE'
        }
      });
    }

    const tokens = await this.generateAuthToken(
      user.id,
      true,
      deviceInfo
    );

    return {
      user: this.excludeSensitiveInfo(user),
      token: tokens.accessToken,
      refreshToken: tokens.refreshToken || '',
      expiresIn: '15m'
    };
  }

  async requestPasswordReset(email: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return; // Silent return for security
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpires
      }
    });

    await emailService.sendPasswordResetEmail(
      user.id,
      user.email,
      user.name,
      resetToken
    );
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpires: {
          gt: new Date()
        }
      }
    });

    if (!user) {
      throw new Error('Invalid or Expired Reset Token');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpires: null
      }
    });

    await this.prisma.refreshToken.deleteMany({
      where: { userId: user.id }
    });

    await emailService.sendSecurityAlert(
      user.id,
      user.email,
      user.name,
      'PASSWORD_CHANGED',
      {
        timestamp: new Date()
      }
    );
  }

  async verifyEmail(token: string): Promise<boolean> {
    const user = await this.prisma.user.findFirst({
      where: {
        verificationToken: token,
        verificationExpires: {
          gt: new Date()
        }
      }
    });

    if (!user) {
      throw new Error('Invalid or expired verification token');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationToken: null,
        verificationExpires: null
      }
    });

    return true;
  }

  private async generateAuthToken(
    userId: string,
    rememberMe: boolean = false,
    deviceInfo?: DeviceInfo
  ): Promise<AuthToken> {
    const accessToken = jwt.sign(
      { userId },
      process.env.JWT_SECRET!,
      { expiresIn: '15m' }
    );

    let refreshToken = null;
    if (rememberMe) {
      const token = crypto.randomBytes(40).toString('hex');
      refreshToken = await this.prisma.refreshToken.create({
        data: {
          token,
          userId,
          userAgent: deviceInfo?.userAgent,
          ipAddress: deviceInfo?.ipAddress,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        }
      });
    }

    return {
      accessToken,
      refreshToken: refreshToken?.token
    };
  }

  private excludeSensitiveInfo(user: User): Omit<User, 'password' | 'verificationToken' | 'resetToken'> {
    const {
      password,
      verificationToken,
      resetToken,
      ...safeUser
    } = user as any;
    return safeUser;
  }
}

export const authService = new AuthService();