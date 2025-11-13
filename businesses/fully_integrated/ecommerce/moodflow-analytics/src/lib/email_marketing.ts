import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

interface EmailData {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

async function sendEmail(data: EmailData): Promise<void> {
  const transporter: Transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: Boolean(process.env.EMAIL_SECURE),
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  try {
    await transporter.sendMail(data);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

async function sendCampaign(recipients: string[], subject: string, text: string, html?: string): Promise<void> {
  for (const recipient of recipients) {
    const emailData: EmailData = {
      to: recipient,
      subject,
      text,
      html,
    };

    try {
      await sendEmail(emailData);
    } catch (error) {
      console.error(`Error sending email to ${recipient}:`, error);
    }
  }
}

// Usage example
(async () => {
  const recipients = ['example@example.com'];
  const subject = 'Welcome to Our Store!';
  const text = 'Thank you for joining us!';
  const html = '<h1>Welcome to Our Store!</h1><p>Thank you for joining us!</p>';

  try {
    await sendCampaign(recipients, subject, text, html);
    console.log('Email campaign sent successfully');
  } catch (error) {
    console.error('Error sending email campaign:', error);
  }
})();

import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

interface EmailData {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

async function sendEmail(data: EmailData): Promise<void> {
  const transporter: Transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: Boolean(process.env.EMAIL_SECURE),
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  try {
    await transporter.sendMail(data);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

async function sendCampaign(recipients: string[], subject: string, text: string, html?: string): Promise<void> {
  for (const recipient of recipients) {
    const emailData: EmailData = {
      to: recipient,
      subject,
      text,
      html,
    };

    try {
      await sendEmail(emailData);
    } catch (error) {
      console.error(`Error sending email to ${recipient}:`, error);
    }
  }
}

// Usage example
(async () => {
  const recipients = ['example@example.com'];
  const subject = 'Welcome to Our Store!';
  const text = 'Thank you for joining us!';
  const html = '<h1>Welcome to Our Store!</h1><p>Thank you for joining us!</p>';

  try {
    await sendCampaign(recipients, subject, text, html);
    console.log('Email campaign sent successfully');
  } catch (error) {
    console.error('Error sending email campaign:', error);
  }
})();

Next, create a new TypeScript file (e.g., `email-marketing.ts`) and add the following code: