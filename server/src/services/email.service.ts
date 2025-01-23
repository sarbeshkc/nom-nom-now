// src/services/email.service.ts

import nodemailer, { Transporter } from 'nodemailer';
import fs from 'fs/promises';
import path from 'path';
import handlebars from 'handlebars';
import { PrismaClient } from '@prisma/client';
import { LoggingMiddleware } from '../middleware/logging.middleware';

// Import necessary types
import { 
  NotificationChannel, 
  NotificationPriority,
  NotificationRecord,
  SecurityLog,
  LoginNotification,
  DeviceInfo,
  Session 
} from '../types/auth.type';

// Define email template interface
interface EmailTemplate {
  name: string;
  subject: string;
  template: HandlebarsTemplateDelegate;
}

// Define email options interface
interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  priority?: 'high' | 'normal' | 'low';
}

class EmailService {
  private transporter: Transporter;
  private prisma: PrismaClient;
  private templates: Map<string, EmailTemplate>;
  private readonly DEFAULT_FROM_NAME: string;
  private readonly DEFAULT_FROM_EMAIL: string;

  constructor() {
    // Initialize dependencies
    this.prisma = new PrismaClient();
    this.templates = new Map();
    this.DEFAULT_FROM_NAME = process.env.EMAIL_FROM_NAME || 'Nom Nom Now';
    this.DEFAULT_FROM_EMAIL = process.env.EMAIL_FROM_ADDRESS || 'noreply@nomnow.com';

    // Initialize nodemailer transporter
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      }
    });

    // Load email templates
    this.loadTemplates().catch(error => {
      console.error('Failed to load email templates:', error);
      throw error;
    });
  }

  /**
   * Load and compile email templates
   * Templates are loaded once and cached for future use
   */
  private async loadTemplates(): Promise<void> {
    try {
      // Get path to email templates directory
      const templatesDir = path.join(__dirname, '../templates/email');
      
      // Load main layout template first
      const layoutPath = path.join(templatesDir, 'layouts/main.hbs');
      const layoutContent = await fs.readFile(layoutPath, 'utf-8');
      handlebars.registerPartial('layout', layoutContent);

      // Read all template files
      const templates = await fs.readdir(templatesDir);

      // Load and compile each template
      for (const file of templates) {
        if (file.endsWith('.hbs') && !file.includes('layout')) {
          const templateName = file.replace('.hbs', '');
          const templatePath = path.join(templatesDir, file);
          const templateContent = await fs.readFile(templatePath, 'utf-8');

          // Register template with layout
          this.templates.set(templateName, {
            name: templateName,
            subject: this.getDefaultSubject(templateName),
            template: handlebars.compile(templateContent)
          });
        }
      }

      console.log(`Loaded ${this.templates.size} email templates successfully`);
    } catch (error) {
      console.error('Error loading email templates:', error);
      throw error;
    }
  }

  /**
   * Get default subject line for different email types
   */
  private getDefaultSubject(templateName: string): string {
    const subjects: Record<string, string> = {
      'verification': 'Verify Your Email Address',
      'password-reset': 'Reset Your Password',
      'security-alert': 'Security Alert',
      'welcome': 'Welcome to Nom Nom Now',
      'two-factor-enabled': 'Two-Factor Authentication Enabled',
      'two-factor-disabled': 'Two-Factor Authentication Disabled',
      'restaurant-verification': 'Restaurant Verification Status'
    };
    return subjects[templateName] || 'Notification from Nom Nom Now';
  }

  /**
   * Send an email using a template
   */
  private async sendEmail(
    userId: string,
    to: string,
    templateName: string,
    context: Record<string, any>,
    priority: NotificationPriority = 'MEDIUM'
  ): Promise<void> {
    const template = this.templates.get(templateName);
    if (!template) {
      throw new Error(`Email template '${templateName}' not found`);
    }

    // Add common template variables
    const fullContext = {
      ...context,
      supportEmail: process.env.SUPPORT_EMAIL,
      supportPhone: process.env.SUPPORT_PHONE,
      logoUrl: process.env.LOGO_URL,
      currentYear: new Date().getFullYear(),
      appName: 'Nom Nom Now'
    };

    // Render email template
    const html = template.template(fullContext);

    // Prepare email options
    const mailOptions: EmailOptions = {
      to,
      subject: template.subject,
      html,
      priority: this.mapPriority(priority)
    };

    try {
      // Send email
      await this.transporter.sendMail({
        ...mailOptions,
        from: `"${this.DEFAULT_FROM_NAME}" <${this.DEFAULT_FROM_EMAIL}>`
      });

      // Log successful email send
      await this.createNotificationRecord(
        userId,
        templateName,
        'EMAIL',
        {
          subject: template.subject,
          body: html,
          data: context
        },
        'SENT',
        priority
      );

    } catch (error) {
      // Log failed email attempt
      await this.createNotificationRecord(
        userId,
        templateName,
        'EMAIL',
        {
          subject: template.subject,
          body: html,
          data: { error: (error as Error).message }
        },
        'FAILED',
        priority
      );

      // Re-throw error for handling upstream
      throw error;
    }
  }

  /**
   * Create notification record in database
   */
  private async createNotificationRecord(
    userId: string,
    type: string,
    channel: NotificationChannel,
    content: NotificationRecord['content'],
    status: 'SENT' | 'FAILED',
    priority: NotificationPriority
  ): Promise<void> {
    await this.prisma.notificationRecord.create({
      data: {
        userId,
        type: type.toUpperCase(),
        channel,
        content,
        status,
        priority,
        sentAt: status === 'SENT' ? new Date() : undefined
      }
    });
  }

  /**
   * Map priority levels to email priority
   */
  private mapPriority(priority: NotificationPriority): 'high' | 'normal' | 'low' {
    switch (priority) {
      case 'URGENT':
      case 'HIGH':
        return 'high';
      case 'LOW':
        return 'low';
      default:
        return 'normal';
    }
  }

  /**
   * Public methods for sending specific types of emails
   */

  // Send email verification
  async sendVerification(
    userId: string,
    email: string,
    name: string,
    token: string
  ): Promise<void> {
    const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
    await this.sendEmail(
      userId,
      email,
      'verification',
      { name, verificationLink },
      'HIGH'
    );
  }

  // Send password reset email
  async sendPasswordResetEmail(
    userId: string,
    email: string,
    name: string,
    token: string
  ): Promise<void> {
    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
    await this.sendEmail(
      userId,
      email,
      'password-reset',
      { name, resetLink },
      'HIGH'
    );
  }

  // Send security alert
  async sendSecurityAlert(
    userId: string,
    email: string,
    name: string,
    alertType: LoginNotification['type'],
    details: {
      deviceInfo?: Session['deviceInfo'];
      location?: SecurityLog['location'];
      timestamp: Date;
    }
  ): Promise<void> {
    const context = {
      name,
      alertType,
      deviceInfo: details.deviceInfo,
      location: details.location,
      timestamp: details.timestamp.toLocaleString(),
      securitySettingsUrl: `${process.env.CLIENT_URL}/settings/security`,
      isNewLogin: alertType === 'NEW_LOGIN'
    };

    await this.sendEmail(
      userId,
      email,
      'security-alert',
      context,
      'URGENT'
    );
  }

  // Send welcome email
  async sendWelcomeEmail(
    userId: string,
    email: string,
    name: string,
    isRestaurantOwner: boolean = false
  ): Promise<void> {
    await this.sendEmail(
      userId,
      email,
      'welcome',
      {
        name,
        isRestaurantOwner,
        dashboardUrl: `${process.env.CLIENT_URL}/dashboard`,
        helpUrl: `${process.env.CLIENT_URL}/help`,
        appStoreUrl: process.env.APP_STORE_URL,
        playStoreUrl: process.env.PLAY_STORE_URL
      },
      'MEDIUM'
    );
  }

  // Send 2FA setup email with backup codes
  async sendTwoFactorEnabled(
    userId: string,
    email: string,
    name: string,
    backupCodes: string[]
  ): Promise<void> {
    await this.sendEmail(
      userId,
      email,
      'two-factor',
      {
        name,
        backupCodes,
        isSetup: true,
        securitySettingsUrl: `${process.env.CLIENT_URL}/settings/security`
      },
      'HIGH'
    );
  }

  // Test email connection
  async testConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error('Email service connection test failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const emailService = new EmailService();