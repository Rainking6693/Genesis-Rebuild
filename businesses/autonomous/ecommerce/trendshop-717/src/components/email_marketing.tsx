// src/email_marketing/EmailMarketingService.ts

import nodemailer from 'nodemailer';

interface EmailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
}

class EmailMarketingService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      const info = await this.transporter.sendMail(options);
      console.log('Message sent: %s', info.messageId);
      return true;
    } catch (error: any) {
      console.error('Error sending email:', error);
      // Implement robust error logging here (e.g., Sentry, Datadog)
      console.error('Email sending error details:', {
        to: options.to,
        subject: options.subject,
        error: error.message,
        stack: error.stack,
      });
      return false;
    }
  }

  async sendWelcomeEmail(email: string, name: string): Promise<boolean> {
    const options: EmailOptions = {
      from: process.env.EMAIL_FROM || 'welcome@example.com',
      to: email,
      subject: 'Welcome to our Ecommerce Store!',
      html: `<h1>Welcome, ${name}!</h1><p>Thanks for joining our community.</p>`,
    };
    return this.sendEmail(options);
  }

  async sendPromotionEmail(email: string, promotionDetails: string): Promise<boolean> {
    const options: EmailOptions = {
      from: process.env.EMAIL_FROM || 'promotions@example.com',
      to: email,
      subject: 'Exclusive Promotion Just For You!',
      html: `<h1>Exclusive Promotion!</h1><p>${promotionDetails}</p>`,
    };
    return this.sendEmail(options);
  }

  // Add more methods for different email types (e.g., order confirmation, shipping updates)
}

export default EmailMarketingService;

// Example Usage (in a separate file, e.g., src/index.ts or a route handler)
// const emailService = new EmailMarketingService();
// emailService.sendWelcomeEmail('user@example.com', 'John Doe');

// Error Boundary Example (in a React component or similar)
// import { ErrorBoundary } from 'react-error-boundary';
// <ErrorBoundary fallback={<div>Something went wrong with email sending.</div>}>
//   <MyComponentThatSendsEmails />
// </ErrorBoundary>

// src/email_marketing/EmailMarketingService.ts

import nodemailer from 'nodemailer';

interface EmailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
}

class EmailMarketingService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      const info = await this.transporter.sendMail(options);
      console.log('Message sent: %s', info.messageId);
      return true;
    } catch (error: any) {
      console.error('Error sending email:', error);
      // Implement robust error logging here (e.g., Sentry, Datadog)
      console.error('Email sending error details:', {
        to: options.to,
        subject: options.subject,
        error: error.message,
        stack: error.stack,
      });
      return false;
    }
  }

  async sendWelcomeEmail(email: string, name: string): Promise<boolean> {
    const options: EmailOptions = {
      from: process.env.EMAIL_FROM || 'welcome@example.com',
      to: email,
      subject: 'Welcome to our Ecommerce Store!',
      html: `<h1>Welcome, ${name}!</h1><p>Thanks for joining our community.</p>`,
    };
    return this.sendEmail(options);
  }

  async sendPromotionEmail(email: string, promotionDetails: string): Promise<boolean> {
    const options: EmailOptions = {
      from: process.env.EMAIL_FROM || 'promotions@example.com',
      to: email,
      subject: 'Exclusive Promotion Just For You!',
      html: `<h1>Exclusive Promotion!</h1><p>${promotionDetails}</p>`,
    };
    return this.sendEmail(options);
  }

  // Add more methods for different email types (e.g., order confirmation, shipping updates)
}

export default EmailMarketingService;

// Example Usage (in a separate file, e.g., src/index.ts or a route handler)
// const emailService = new EmailMarketingService();
// emailService.sendWelcomeEmail('user@example.com', 'John Doe');

// Error Boundary Example (in a React component or similar)
// import { ErrorBoundary } from 'react-error-boundary';
// <ErrorBoundary fallback={<div>Something went wrong with email sending.</div>}>
//   <MyComponentThatSendsEmails />
// </ErrorBoundary>