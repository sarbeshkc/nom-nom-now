// src/services/email.service.ts
import nodemailer from 'nodemailer';
import { User } from '@/types/auth.types';

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Create reusable transporter using SMTP
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  // Helper method to generate HTML email template
  private getEmailTemplate(type: 'VERIFY' | 'RESET', data: {
    name: string;
    token: string;
  }) {
    const baseUrl = process.env.FRONTEND_URL;
    const link = type === 'VERIFY' 
      ? `${baseUrl}/verify-email/${data.token}`
      : `${baseUrl}/reset-password/${data.token}`;

    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Hello ${data.name},</h2>
        
        ${type === 'VERIFY' 
          ? '<p>Welcome to Nom-Nom-Now! Please verify your email address to continue:</p>'
          : '<p>We received a request to reset your password. Click the link below to reset it:</p>'
        }
        
        <a href="${link}" 
           style="display: inline-block; padding: 10px 20px; 
                  background-color: #4CAF50; color: white; 
                  text-decoration: none; border-radius: 5px;">
          ${type === 'VERIFY' ? 'Verify Email' : 'Reset Password'}
        </a>
        
        <p>If you didn't request this, please ignore this email.</p>
        
        <p>Best regards,<br>The Nom-Nom-Now Team</p>
      </div>
    `;
  }

  async sendVerificationEmail(user: User, token: string) {
    try {
      await this.transporter.sendMail({
        from: `"Nom-Nom-Now" <${process.env.SMTP_FROM}>`,
        to: user.email,
        subject: 'Verify Your Email Address',
        html: this.getEmailTemplate('VERIFY', {
          name: user.name,
          token
        })
      });

      console.log('Verification email sent to:', user.email);
    } catch (error) {
      console.error('Failed to send verification email:', error);
      throw new Error('Failed to send verification email');
    }
  }

  async sendPasswordResetEmail(user: User, token: string) {
    try {
      await this.transporter.sendMail({
        from: `"Nom-Nom-Now" <${process.env.SMTP_FROM}>`,
        to: user.email,
        subject: 'Reset Your Password',
        html: this.getEmailTemplate('RESET', {
          name: user.name,
          token
        })
      });

      console.log('Password reset email sent to:', user.email);
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      throw new Error('Failed to send password reset email');
    }
  }
}

export const emailService = new EmailService();
