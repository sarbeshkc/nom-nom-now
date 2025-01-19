import nodemailer, { Transporter } from 'nodemailer';
import { PrismaClient } from '@prisma/client';
import handlebars from 'handlebars';
import path from 'path';
import fs from 'fs/promises';
import { 
  NotificationChannel, 
  NotificationPriority,
  NotificationRecord,
  SecurityLog,
  LoginNotification,
  DeviceInfo,
  Session }
  from '@/types/auth.type

interface EmailTemplate {
  name: string;
  subject: string;
  template: HandlebarsTemplateDelegate;
}

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  priority?: 'high' | 'normal' | 'low';
}

export class EmailService {
  private transporter: Transporter;
  private prisma: PrismaClient;
  private templates: Map<string, EmailTemplate>;

  constructor() {
    this.prisma = new PrismaClient();
    this.templates = new Map();

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

    // Load templates
    this.loadTemplates().catch(console.error);
  }

  private async loadTemplates(): Promise<void> {
    try {
      const templatesDir = path.join(__dirname, '../templates/email');
      const templates = await fs.readdir(templatesDir);

      for (const file of templates) {
        if (file.endsWith('.hbs')) {
          const templateName = file.replace('.hbs', '');
          const templatePath = path.join(templatesDir, file);
          const templateContent = await fs.readFile(templatePath, 'utf-8');

          this.templates.set(templateName, {
            name: templateName,
            subject: this.getDefaultSubject(templateName),
            template: handlebars.compile(templateContent)
          });
        }
      }
    } catch (error) {
      console.error('Failed to load email templates:', error);
      throw error;
    }
  }

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

  private async sendEmail(
    userId: string,
    to: string,
    templateName: string,
    context: Record<string, any>,
    priority: NotificationPriority = 'MEDIUM'
  ): Promise<void> {
    const template = this.templates.get(templateName);
    if (!template) {
      throw new Error(`Template ${templateName} not found`);
    }

    const html = template.template({
      ...context,
      supportEmail: process.env.SUPPORT_EMAIL,
      year: new Date().getFullYear()
    });

    const mailOptions: EmailOptions = {
      to,
      subject: template.subject,
      html,
      priority: this.mapPriority(priority)
    };

    try {
      await this.transporter.sendMail({
        ...mailOptions,
        from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM_ADDRESS}>`
      });

      await this.createNotificationRecord(userId, templateName, 'EMAIL', {
        subject: template.subject,
        body: html,
        data: context
      }, 'SENT', priority);

    } catch (error) {
      await this.createNotificationRecord(userId, templateName, 'EMAIL', {
        subject: template.subject,
        body: html,
        data: { error: (error as Error).message }
      }, 'FAILED', priority);
      throw error;
    }
  }

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

  // Public methods
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
      securitySettingsLink: `${process.env.CLIENT_URL}/settings/security`
    };

    await this.sendEmail(
      userId,
      email,
      'security-alert',
      context,
      'URGENT'
    );
  }

  async sendRestaurantVerificationStatus(
    userId: string,
    email: string,
    name: string,
    status: 'APPROVED' | 'REJECTED',
    notes?: string
  ): Promise<void> {
    const context = {
      name,
      status,
      notes,
      loginLink: `${process.env.CLIENT_URL}/login`
    };

    await this.sendEmail(
      userId,
      email,
      'restaurant-verification',
      context,
      'HIGH'
    );
  }

  async sendTwoFactorEnabled(
    userId: string,
    email: string,
    name: string,
    backupCodes: string[]
  ): Promise<void> {
    await this.sendEmail(
      userId,
      email,
      'two-factor-enabled',
      { name, backupCodes },
      'HIGH'
    );
  }

  async sendWelcomeEmail(
    userId: string,
    email: string,
    name: string
  ): Promise<void> {
    await this.sendEmail(
      userId,
      email,
      'welcome',
      { name },
      'MEDIUM'
    );
  }
}

export const emailService = new EmailService();