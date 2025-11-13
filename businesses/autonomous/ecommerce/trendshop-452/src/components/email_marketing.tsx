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
      // Log the error to a monitoring service (e.g., Sentry, CloudWatch)
      console.error('Failed to send email to:', options.to);
      console.error('Error details:', error.message);
      return false;
    }
  }

  async sendWelcomeEmail(email: string, name: string): Promise<boolean> {
    const options: EmailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@example.com',
      to: email,
      subject: 'Welcome to our Ecommerce Store!',
      html: `
        <html>
        <body>
          <h1>Welcome, ${name}!</h1>
          <p>Thank you for signing up for our ecommerce store. We're excited to have you!</p>
          <p>Explore our latest products and enjoy exclusive discounts.</p>
          <a href="${process.env.STORE_URL}">Shop Now</a>
        </body>
        </html>
      `,
    };
    return this.sendEmail(options);
  }

  async sendOrderConfirmationEmail(email: string, orderId: string, items: string[]): Promise<boolean> {
    const options: EmailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@example.com',
      to: email,
      subject: 'Order Confirmation',
      html: `
        <html>
        <body>
          <h1>Order Confirmation</h1>
          <p>Your order with ID ${orderId} has been confirmed.</p>
          <p>Items ordered:</p>
          <ul>
            ${items.map(item => `<li>${item}</li>`).join('')}
          </ul>
          <p>Thank you for your purchase!</p>
        </body>
        </html>
      `,
    };
    return this.sendEmail(options);
  }

  async sendPasswordResetEmail(email: string, resetLink: string): Promise<boolean> {
    const options: EmailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@example.com',
      to: email,
      subject: 'Password Reset Request',
      html: `
        <html>
        <body>
          <h1>Password Reset</h1>
          <p>You have requested to reset your password.</p>
          <p>Please click the following link to reset your password:</p>
          <a href="${resetLink}">Reset Password</a>
          <p>If you did not request a password reset, please ignore this email.</p>
        </body>
        </html>
      `,
    };
    return this.sendEmail(options);
  }
}

export default EmailMarketingService;

// Example Usage (for testing purposes - remove in production)
async function main() {
  const emailService = new EmailMarketingService();

  // Ensure environment variables are set
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_PORT || !process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.error("Error: Email environment variables are not set.");
    return;
  }

  const welcomeEmailSent = await emailService.sendWelcomeEmail('test@example.com', 'Test User');
  if (welcomeEmailSent) {
    console.log('Welcome email sent successfully!');
  } else {
    console.error('Failed to send welcome email.');
  }

  const orderConfirmationSent = await emailService.sendOrderConfirmationEmail('test@example.com', '12345', ['Product A', 'Product B']);
  if (orderConfirmationSent) {
    console.log('Order confirmation email sent successfully!');
  } else {
    console.error('Failed to send order confirmation email.');
  }

  const resetLink = 'https://example.com/reset-password?token=1234567890';
  const passwordResetSent = await emailService.sendPasswordResetEmail('test@example.com', resetLink);
  if (passwordResetSent) {
    console.log('Password reset email sent successfully!');
  } else {
    console.error('Failed to send password reset email.');
  }
}

if (process.env.NODE_ENV !== 'production') {
  // Only run the example usage if not in production
  main().catch(console.error);
}

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
      // Log the error to a monitoring service (e.g., Sentry, CloudWatch)
      console.error('Failed to send email to:', options.to);
      console.error('Error details:', error.message);
      return false;
    }
  }

  async sendWelcomeEmail(email: string, name: string): Promise<boolean> {
    const options: EmailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@example.com',
      to: email,
      subject: 'Welcome to our Ecommerce Store!',
      html: `
        <html>
        <body>
          <h1>Welcome, ${name}!</h1>
          <p>Thank you for signing up for our ecommerce store. We're excited to have you!</p>
          <p>Explore our latest products and enjoy exclusive discounts.</p>
          <a href="${process.env.STORE_URL}">Shop Now</a>
        </body>
        </html>
      `,
    };
    return this.sendEmail(options);
  }

  async sendOrderConfirmationEmail(email: string, orderId: string, items: string[]): Promise<boolean> {
    const options: EmailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@example.com',
      to: email,
      subject: 'Order Confirmation',
      html: `
        <html>
        <body>
          <h1>Order Confirmation</h1>
          <p>Your order with ID ${orderId} has been confirmed.</p>
          <p>Items ordered:</p>
          <ul>
            ${items.map(item => `<li>${item}</li>`).join('')}
          </ul>
          <p>Thank you for your purchase!</p>
        </body>
        </html>
      `,
    };
    return this.sendEmail(options);
  }

  async sendPasswordResetEmail(email: string, resetLink: string): Promise<boolean> {
    const options: EmailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@example.com',
      to: email,
      subject: 'Password Reset Request',
      html: `
        <html>
        <body>
          <h1>Password Reset</h1>
          <p>You have requested to reset your password.</p>
          <p>Please click the following link to reset your password:</p>
          <a href="${resetLink}">Reset Password</a>
          <p>If you did not request a password reset, please ignore this email.</p>
        </body>
        </html>
      `,
    };
    return this.sendEmail(options);
  }
}

export default EmailMarketingService;

// Example Usage (for testing purposes - remove in production)
async function main() {
  const emailService = new EmailMarketingService();

  // Ensure environment variables are set
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_PORT || !process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.error("Error: Email environment variables are not set.");
    return;
  }

  const welcomeEmailSent = await emailService.sendWelcomeEmail('test@example.com', 'Test User');
  if (welcomeEmailSent) {
    console.log('Welcome email sent successfully!');
  } else {
    console.error('Failed to send welcome email.');
  }

  const orderConfirmationSent = await emailService.sendOrderConfirmationEmail('test@example.com', '12345', ['Product A', 'Product B']);
  if (orderConfirmationSent) {
    console.log('Order confirmation email sent successfully!');
  } else {
    console.error('Failed to send order confirmation email.');
  }

  const resetLink = 'https://example.com/reset-password?token=1234567890';
  const passwordResetSent = await emailService.sendPasswordResetEmail('test@example.com', resetLink);
  if (passwordResetSent) {
    console.log('Password reset email sent successfully!');
  } else {
    console.error('Failed to send password reset email.');
  }
}

if (process.env.NODE_ENV !== 'production') {
  // Only run the example usage if not in production
  main().catch(console.error);
}