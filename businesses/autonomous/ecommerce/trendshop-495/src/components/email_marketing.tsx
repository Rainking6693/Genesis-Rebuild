// src/email_marketing/EmailMarketingService.ts

import nodemailer from 'nodemailer';

interface EmailOptions {
  from: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

class EmailMarketingService {
  private transporter: nodemailer.Transporter;

  constructor(
    private smtpHost: string,
    private smtpPort: number,
    private smtpUser: string,
    private smtpPass: string
  ) {
    this.transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465, // Use SSL if port is 465
      auth: {
        user: smtpUser,
        pass: smtpPass,
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
      // Log the error to an error tracking service like Sentry or similar
      // Sentry.captureException(error); // Example using Sentry
      return false;
    }
  }

  async sendWelcomeEmail(email: string, name: string): Promise<boolean> {
    const welcomeOptions: EmailOptions = {
      from: 'welcome@example.com',
      to: email,
      subject: 'Welcome to our Ecommerce Store!',
      html: `
        <html>
        <body>
          <h1>Welcome, ${name}!</h1>
          <p>Thank you for signing up for our ecommerce store. We're excited to have you!</p>
          <p>Explore our latest products and enjoy exclusive discounts.</p>
          <a href="https://www.example.com">Shop Now</a>
        </body>
        </html>
      `,
    };
    return this.sendEmail(welcomeOptions);
  }

  async sendPromotionalEmail(emails: string[], subject: string, body: string): Promise<number> {
    let successCount = 0;
    for (const email of emails) {
      try {
        const promoOptions: EmailOptions = {
          from: 'promotions@example.com',
          to: email,
          subject: subject,
          text: body,
        };
        const sent = await this.sendEmail(promoOptions);
        if (sent) {
          successCount++;
        }
      } catch (error: any) {
        console.error(`Failed to send promotional email to ${email}:`, error);
        // Optionally, implement retry logic or queue failed emails for later sending
      }
    }
    return successCount;
  }
}

export default EmailMarketingService;

// Example Usage (Remember to handle environment variables securely)
// const emailService = new EmailMarketingService(
//   process.env.SMTP_HOST || 'smtp.example.com',
//   parseInt(process.env.SMTP_PORT || '587'),
//   process.env.SMTP_USER || 'user@example.com',
//   process.env.SMTP_PASS || 'password'
// );

// emailService.sendWelcomeEmail('test@example.com', 'Test User');
// emailService.sendPromotionalEmail(['test@example.com'], 'Special Offer', 'Check out our latest deals!');

// src/email_marketing/EmailMarketingService.test.ts

import EmailMarketingService from './EmailMarketingService';
import nodemailer from 'nodemailer';

jest.mock('nodemailer');

describe('EmailMarketingService', () => {
  let emailService: EmailMarketingService;
  const mockedTransporter = {
    sendMail: jest.fn().mockResolvedValue({ messageId: 'test-message-id' }),
  };

  beforeEach(() => {
    (nodemailer.createTransport as jest.Mock).mockReturnValue(mockedTransporter);
    emailService = new EmailMarketingService(
      'smtp.example.com',
      587,
      'user@example.com',
      'password'
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should send an email successfully', async () => {
    const options = {
      from: 'test@example.com',
      to: 'recipient@example.com',
      subject: 'Test Email',
      text: 'This is a test email.',
    };

    const result = await emailService.sendEmail(options);
    expect(result).toBe(true);
    expect(mockedTransporter.sendMail).toHaveBeenCalledWith(options);
  });

  it('should handle email sending errors', async () => {
    mockedTransporter.sendMail.mockRejectedValue(new Error('Failed to send email'));

    const options = {
      from: 'test@example.com',
      to: 'recipient@example.com',
      subject: 'Test Email',
      text: 'This is a test email.',
    };

    const result = await emailService.sendEmail(options);
    expect(result).toBe(false);
  });

  it('should send a welcome email', async () => {
    const email = 'test@example.com';
    const name = 'Test User';
    const result = await emailService.sendWelcomeEmail(email, name);
    expect(result).toBe(true);
    expect(mockedTransporter.sendMail).toHaveBeenCalled();
  });

  it('should send promotional emails', async () => {
    const emails = ['test1@example.com', 'test2@example.com'];
    const subject = 'Special Offer';
    const body = 'Check out our latest deals!';
    const result = await emailService.sendPromotionalEmail(emails, subject, body);
    expect(result).toBe(2);
    expect(mockedTransporter.sendMail).toHaveBeenCalledTimes(2);
  });

  it('should handle errors when sending promotional emails', async () => {
    mockedTransporter.sendMail.mockRejectedValueOnce(new Error('Failed to send email'));
    const emails = ['test1@example.com', 'test2@example.com'];
    const subject = 'Special Offer';
    const body = 'Check out our latest deals!';
    const result = await emailService.sendPromotionalEmail(emails, subject, body);
    expect(result).toBe(1); // Only one email should be sent successfully
  });
});

// src/email_marketing/interfaces.ts

export interface EmailOptions {
    from: string;
    to: string;
    subject: string;
    text?: string;
    html?: string;
  }

// src/email_marketing/utils.ts

export function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

// src/email_marketing/config.ts

export const DEFAULT_SMTP_PORT = 587;
export const DEFAULT_FROM_EMAIL = 'no-reply@example.com';

// src/index.ts
import EmailMarketingService from './email_marketing/EmailMarketingService';
import { validateEmail } from './email_marketing/utils';
import { DEFAULT_SMTP_PORT, DEFAULT_FROM_EMAIL } from './email_marketing/config';
import { EmailOptions } from './email_marketing/interfaces';

// Example usage:
const smtpHost = process.env.SMTP_HOST || 'smtp.example.com';
const smtpPort = parseInt(process.env.SMTP_PORT || String(DEFAULT_SMTP_PORT), 10);
const smtpUser = process.env.SMTP_USER || 'user@example.com';
const smtpPass = process.env.SMTP_PASS || 'password';

const emailService = new EmailMarketingService(smtpHost, smtpPort, smtpUser, smtpPass);

async function main() {
  const recipientEmail = 'test@example.com';

  if (!validateEmail(recipientEmail)) {
    console.error('Invalid email address.');
    return;
  }

  const welcomeEmailOptions: EmailOptions = {
    from: DEFAULT_FROM_EMAIL,
    to: recipientEmail,
    subject: 'Welcome to our Ecommerce Store!',
    html: `<p>Welcome! Thank you for joining us.</p>`,
  };

  const success = await emailService.sendEmail(welcomeEmailOptions);

  if (success) {
    console.log('Welcome email sent successfully!');
  } else {
    console.error('Failed to send welcome email.');
  }
}

main().catch(console.error);

// src/email_marketing/EmailMarketingService.ts

import nodemailer from 'nodemailer';

interface EmailOptions {
  from: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

class EmailMarketingService {
  private transporter: nodemailer.Transporter;

  constructor(
    private smtpHost: string,
    private smtpPort: number,
    private smtpUser: string,
    private smtpPass: string
  ) {
    this.transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465, // Use SSL if port is 465
      auth: {
        user: smtpUser,
        pass: smtpPass,
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
      // Log the error to an error tracking service like Sentry or similar
      // Sentry.captureException(error); // Example using Sentry
      return false;
    }
  }

  async sendWelcomeEmail(email: string, name: string): Promise<boolean> {
    const welcomeOptions: EmailOptions = {
      from: 'welcome@example.com',
      to: email,
      subject: 'Welcome to our Ecommerce Store!',
      html: `
        <html>
        <body>
          <h1>Welcome, ${name}!</h1>
          <p>Thank you for signing up for our ecommerce store. We're excited to have you!</p>
          <p>Explore our latest products and enjoy exclusive discounts.</p>
          <a href="https://www.example.com">Shop Now</a>
        </body>
        </html>
      `,
    };
    return this.sendEmail(welcomeOptions);
  }

  async sendPromotionalEmail(emails: string[], subject: string, body: string): Promise<number> {
    let successCount = 0;
    for (const email of emails) {
      try {
        const promoOptions: EmailOptions = {
          from: 'promotions@example.com',
          to: email,
          subject: subject,
          text: body,
        };
        const sent = await this.sendEmail(promoOptions);
        if (sent) {
          successCount++;
        }
      } catch (error: any) {
        console.error(`Failed to send promotional email to ${email}:`, error);
        // Optionally, implement retry logic or queue failed emails for later sending
      }
    }
    return successCount;
  }
}

export default EmailMarketingService;

// Example Usage (Remember to handle environment variables securely)
// const emailService = new EmailMarketingService(
//   process.env.SMTP_HOST || 'smtp.example.com',
//   parseInt(process.env.SMTP_PORT || '587'),
//   process.env.SMTP_USER || 'user@example.com',
//   process.env.SMTP_PASS || 'password'
// );

// emailService.sendWelcomeEmail('test@example.com', 'Test User');
// emailService.sendPromotionalEmail(['test@example.com'], 'Special Offer', 'Check out our latest deals!');

// src/email_marketing/EmailMarketingService.test.ts

import EmailMarketingService from './EmailMarketingService';
import nodemailer from 'nodemailer';

jest.mock('nodemailer');

describe('EmailMarketingService', () => {
  let emailService: EmailMarketingService;
  const mockedTransporter = {
    sendMail: jest.fn().mockResolvedValue({ messageId: 'test-message-id' }),
  };

  beforeEach(() => {
    (nodemailer.createTransport as jest.Mock).mockReturnValue(mockedTransporter);
    emailService = new EmailMarketingService(
      'smtp.example.com',
      587,
      'user@example.com',
      'password'
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should send an email successfully', async () => {
    const options = {
      from: 'test@example.com',
      to: 'recipient@example.com',
      subject: 'Test Email',
      text: 'This is a test email.',
    };

    const result = await emailService.sendEmail(options);
    expect(result).toBe(true);
    expect(mockedTransporter.sendMail).toHaveBeenCalledWith(options);
  });

  it('should handle email sending errors', async () => {
    mockedTransporter.sendMail.mockRejectedValue(new Error('Failed to send email'));

    const options = {
      from: 'test@example.com',
      to: 'recipient@example.com',
      subject: 'Test Email',
      text: 'This is a test email.',
    };

    const result = await emailService.sendEmail(options);
    expect(result).toBe(false);
  });

  it('should send a welcome email', async () => {
    const email = 'test@example.com';
    const name = 'Test User';
    const result = await emailService.sendWelcomeEmail(email, name);
    expect(result).toBe(true);
    expect(mockedTransporter.sendMail).toHaveBeenCalled();
  });

  it('should send promotional emails', async () => {
    const emails = ['test1@example.com', 'test2@example.com'];
    const subject = 'Special Offer';
    const body = 'Check out our latest deals!';
    const result = await emailService.sendPromotionalEmail(emails, subject, body);
    expect(result).toBe(2);
    expect(mockedTransporter.sendMail).toHaveBeenCalledTimes(2);
  });

  it('should handle errors when sending promotional emails', async () => {
    mockedTransporter.sendMail.mockRejectedValueOnce(new Error('Failed to send email'));
    const emails = ['test1@example.com', 'test2@example.com'];
    const subject = 'Special Offer';
    const body = 'Check out our latest deals!';
    const result = await emailService.sendPromotionalEmail(emails, subject, body);
    expect(result).toBe(1); // Only one email should be sent successfully
  });
});

// src/email_marketing/interfaces.ts

export interface EmailOptions {
    from: string;
    to: string;
    subject: string;
    text?: string;
    html?: string;
  }

// src/email_marketing/utils.ts

export function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

// src/email_marketing/config.ts

export const DEFAULT_SMTP_PORT = 587;
export const DEFAULT_FROM_EMAIL = 'no-reply@example.com';

// src/index.ts
import EmailMarketingService from './email_marketing/EmailMarketingService';
import { validateEmail } from './email_marketing/utils';
import { DEFAULT_SMTP_PORT, DEFAULT_FROM_EMAIL } from './email_marketing/config';
import { EmailOptions } from './email_marketing/interfaces';

// Example usage:
const smtpHost = process.env.SMTP_HOST || 'smtp.example.com';
const smtpPort = parseInt(process.env.SMTP_PORT || String(DEFAULT_SMTP_PORT), 10);
const smtpUser = process.env.SMTP_USER || 'user@example.com';
const smtpPass = process.env.SMTP_PASS || 'password';

const emailService = new EmailMarketingService(smtpHost, smtpPort, smtpUser, smtpPass);

async function main() {
  const recipientEmail = 'test@example.com';

  if (!validateEmail(recipientEmail)) {
    console.error('Invalid email address.');
    return;
  }

  const welcomeEmailOptions: EmailOptions = {
    from: DEFAULT_FROM_EMAIL,
    to: recipientEmail,
    subject: 'Welcome to our Ecommerce Store!',
    html: `<p>Welcome! Thank you for joining us.</p>`,
  };

  const success = await emailService.sendEmail(welcomeEmailOptions);

  if (success) {
    console.log('Welcome email sent successfully!');
  } else {
    console.error('Failed to send welcome email.');
  }
}

main().catch(console.error);