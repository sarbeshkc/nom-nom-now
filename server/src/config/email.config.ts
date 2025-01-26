// server/src/config/email.config.ts
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create the transporter with the consolidated configuration
const transport = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false, // Set to true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  // Enable debug logs during development
  ...(process.env.NODE_ENV === 'development' && {
    debug: true,
    logger: true
  })
});

// Verify the connection on server startup
transport.verify((error, success) => {
  if (error) {
    console.error('SMTP connection error:', error);
  } else {
    console.log('SMTP connection successful:', success);
  }
});

export const emailConfig = {
  transport,
  from: process.env.EMAIL_FROM
};