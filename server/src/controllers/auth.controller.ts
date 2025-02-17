import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import crypto from 'crypto';
import { successResponse, errorResponse } from '../utils/response';
import { constants } from '../config/constants';
import { EmailService } from '../services/email.service';
import { google } from 'googleapis';

// Initialize Prisma client for database operations
const prisma = new PrismaClient();

// Initialize Google OAuth client for Google authentication
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const AuthController = {
  signup: async (req: Request, res: Response) => {
    try {
      console.log('Signup request body:', req.body);
      const { email, password, name } = req.body;

      // Input validation
      if (!email || !password || !name) {
        return res.status(400).json(errorResponse('All fields are required'));
      }

      if (password.length < constants.PASSWORD_MIN_LENGTH) {
        return res.status(400).json(
          errorResponse(`Password must be at least ${constants.PASSWORD_MIN_LENGTH} characters`)
        );
      }

      // Check for existing user
      try {
        const existingUser = await prisma.user.findUnique({
          where: { email },
        });

        if (existingUser) {
          return res.status(400).json(errorResponse(`User with email ${email} already exists`));
        }
      } catch (error) {
        console.error('Error checking existing user:', error);
        return res.status(500).json(errorResponse('Database error while checking user existence'));
      }

      // Generate verification token and hash password
      const verificationToken = crypto.randomBytes(32).toString('hex');
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create new user
      try {
        const user = await prisma.user.create({
          data: {
            email,
            password: hashedPassword,
            name,
            emailVerified: false,
            verificationToken,
            role: 'USER'
          },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            createdAt: true,
          },
        });

        // Send verification email
        try {
          await EmailService.sendVerificationEmail(email, verificationToken);
        } catch (emailError) {
          console.error('Error sending verification email:', emailError);
          // Don't fail the signup if email fails, but log it
        }

        return res.status(201).json(
          successResponse(
            { message: 'Please check your email to verify your account' },
            'User created successfully'
          )
        );
      } catch (createError) {
        console.error('Error creating user in database:', createError);
        return res.status(500).json(errorResponse('Database error while creating user'));
      }
    } catch (error) {
      console.error('Signup error:', error);
      return res.status(500).json(errorResponse('Error creating user'));
    }
  },

  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        return res.status(400).json(errorResponse('Email and password are required'));
      }

      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(401).json(errorResponse('Invalid credentials'));
      }

      // Check if email is verified
      if (!user.emailVerified) {
        return res.status(401).json(errorResponse('Please verify your email first'));
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json(errorResponse('Invalid credentials'));
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET!,
        { expiresIn: constants.JWT_EXPIRY }
      );

      // Create user object without sensitive data
      const userWithoutPassword = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
      };

      return res.json(
        successResponse({ user: userWithoutPassword, token }, 'Login successful')
      );
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json(errorResponse('Error during login'));
    }
  },

  googleAuth: async (req: Request, res: Response) => {
    try {
      const { code } = req.body;
      console.log('Received code:', code);
  
      if (!code) {
        return res.status(400).json(errorResponse('No authorization code provided'));
      }
  
      // Exchange code for tokens with proper redirect URI
      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.CLIENT_URL
      );
  
      try {
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);
  
        // Get user profile
        const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
        const { data } = await oauth2.userinfo.get();
  
        if (!data.email) {
          return res.status(400).json(errorResponse('Email not provided by Google'));
        }
  
        // Create or update user
        const user = await prisma.user.upsert({
          where: { email: data.email },
          update: {
            googleId: data.id,
            emailVerified: true,
            name: data.name || ''
          },
          create: {
            email: data.email,
            name: data.name || '',
            googleId: data.id,
            password: '',
            emailVerified: true,
            role: 'USER'
          }
        });
  
        const token = jwt.sign(
          { userId: user.id },
          process.env.JWT_SECRET!,
          { expiresIn: constants.JWT_EXPIRY }
        );
  
        return res.json(successResponse({
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
          },
          token
        }));
      } catch (tokenError) {
        console.error('Token exchange error:', tokenError);
        return res.status(401).json(errorResponse('Failed to authenticate with Google'));
      }
    } catch (error) {
      console.error('Google auth error:', error);
      return res.status(500).json(errorResponse('Error during Google authentication'));
    }
  },

  verifyEmail: async (req: Request, res: Response) => {
    try {
      const { token } = req.params;

      // Find user by verification token
      const user = await prisma.user.findFirst({
        where: { verificationToken: token }
      });

      if (!user) {
        return res.status(400).json(errorResponse('Invalid verification token'));
      }

      // Update user to verified status
      await prisma.user.update({
        where: { id: user.id },
        data: {
          emailVerified: true,
          verificationToken: null // Clear the verification token
        }
      });

      return res.json(successResponse({ 
        message: 'Email verified successfully' 
      }));
    } catch (error) {
      console.error('Email verification error:', error);
      return res.status(500).json(errorResponse('Error verifying email'));
    }
  },

  requestPasswordReset: async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      const user = await prisma.user.findUnique({
        where: { email }
      });

      // Don't reveal if user exists
      if (!user) {
        return res.json(successResponse({ 
          message: 'If an account exists with this email, you will receive a password reset link' 
        }));
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetToken,
          resetTokenExpiry
        }
      });

      // Send reset email
      try {
        await EmailService.sendPasswordResetEmail(email, resetToken);
      } catch (emailError) {
        console.error('Error sending password reset email:', emailError);
        return res.status(500).json(errorResponse('Error sending password reset email'));
      }

      return res.json(successResponse({ 
        message: 'Password reset instructions sent to your email' 
      }));
    } catch (error) {
      console.error('Password reset request error:', error);
      return res.status(500).json(errorResponse('Error processing password reset request'));
    }
  },

  resetPassword: async (req: Request, res: Response) => {
    try {
      const { token, newPassword } = req.body;

      // Validate password length
      if (newPassword.length < constants.PASSWORD_MIN_LENGTH) {
        return res.status(400).json(
          errorResponse(`Password must be at least ${constants.PASSWORD_MIN_LENGTH} characters`)
        );
      }

      // Find user by reset token and check expiry
      const user = await prisma.user.findFirst({
        where: {
          resetToken: token,
          resetTokenExpiry: {
            gt: new Date() // Token must not be expired
          }
        }
      });

      if (!user) {
        return res.status(400).json(errorResponse('Invalid or expired reset token'));
      }

      // Hash new password and update user
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      await prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          resetToken: null,
          resetTokenExpiry: null
        }
      });

      return res.json(successResponse({ 
        message: 'Password reset successful' 
      }));
    } catch (error) {
      console.error('Password reset error:', error);
      return res.status(500).json(errorResponse('Error resetting password'));
    }
  },


  // server/src/controllers/auth.controller.ts
// Add this method to your AuthController
async testEmail(req: Request, res: Response) {
  try {
    await EmailService.sendVerificationEmail(
      'sarbeshkcc07@gmail.com', // Use your email for testing
      'test-token-123'
    );
    return res.json(successResponse({ message: 'Test email sent successfully' }));
  } catch (error) {
    console.error('Test email error:', error);
    return res.status(500).json(errorResponse('Failed to send test email'));
  }
}
};