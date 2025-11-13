import { Customer, Product } from '../models';
import nodemailer from 'nodemailer';
import moment from 'moment';
import { EmailTemplate } from '../templates';
import { EmailLogger } from '../loggers';
import { EmailError } from './email-error';
import { config as dotenvConfig } from 'dotenv';

export enum EmailServiceProvider {
  GMAIL = 'gmail',
  AMAZON_SES = 'amazon_ses',
  // Add more email service providers as needed
}

export interface EmailServiceConfig {
  service: EmailServiceProvider;
  auth: {
    user: string;
    pass: string;
  };
  host: string;
  port: number;
  secure: boolean;
  // Add other config options as needed
}

dotenvConfig(); // Load email service config from .env file

export function getEmailServiceConfig(): EmailServiceConfig | null {
  const service = process.env.EMAIL_SERVICE;
  if (!service) {
    return null;
  }

  const authUser = process.env.EMAIL_AUTH_USER;
  const authPass = process.env.EMAIL_AUTH_PASS;
  const host = process.env.EMAIL_HOST;
  const port = parseInt(process.env.EMAIL_PORT, 10);
  const secure = process.env.EMAIL_SECURE === 'true';

  if (!authUser || !authPass || !host || isNaN(port)) {
    return null;
  }

  return {
    service,
    auth: {
      user: authUser,
      pass: authPass,
    },
    host,
    port,
    secure,
  };
}

export function createTransporter(config: EmailServiceConfig): nodemailer.Transporter {
  if (!config) {
    throw new Error('Email service config is required');
  }

  switch (config.service) {
    case EmailServiceProvider.GMAIL:
      return nodemailer.createTransport({
        host,
        port,
        secure,
        auth: {
          user: config.auth.user,
          pass: config.auth.pass,
        },
      });
    case EmailServiceProvider.AMAZON_SES:
      // Configure Amazon SES transporter settings
      // ...
    // Add more email service providers as needed
    default:
      throw new Error(`Unsupported email service provider: ${config.service}`);
  }
}

export function sendReviewRequestEmail(customer: Customer, product: Product): void {
  // Validate customer email address
  if (!customer.email) {
    throw new EmailError('Customer email address is required');
  }

  const emailServiceConfig = getEmailServiceConfig();
  if (!emailServiceConfig) {
    throw new EmailError('Email service config is not found or invalid');
  }

  const transporter = createTransporter(emailServiceConfig);

  // Generate personalized email content
  const emailContent = EmailTemplate.reviewRequest(customer, product);

  // Schedule email delivery based on customer behavior patterns
  const deliveryTime = moment().add(customer.behaviorPattern.emailDelay, 'minutes');

  // Set email options
  const mailOptions = {
    from: 'Review Rocket <noreply@reviewrocket.com>',
    to: customer.email,
    subject: 'Review Request for [Product Name]',
    text: emailContent,
  };

  // Log email delivery details
  EmailLogger.info(`Scheduling email delivery for customer ${customer.id} at ${deliveryTime.format()}`);

  // Schedule email delivery using nodemailer's transport.sendMailAt function
  transporter.sendMailAt(mailOptions, deliveryTime);
}

import { Customer, Product } from '../models';
import nodemailer from 'nodemailer';
import moment from 'moment';
import { EmailTemplate } from '../templates';
import { EmailLogger } from '../loggers';
import { EmailError } from './email-error';
import { config as dotenvConfig } from 'dotenv';

export enum EmailServiceProvider {
  GMAIL = 'gmail',
  AMAZON_SES = 'amazon_ses',
  // Add more email service providers as needed
}

export interface EmailServiceConfig {
  service: EmailServiceProvider;
  auth: {
    user: string;
    pass: string;
  };
  host: string;
  port: number;
  secure: boolean;
  // Add other config options as needed
}

dotenvConfig(); // Load email service config from .env file

export function getEmailServiceConfig(): EmailServiceConfig | null {
  const service = process.env.EMAIL_SERVICE;
  if (!service) {
    return null;
  }

  const authUser = process.env.EMAIL_AUTH_USER;
  const authPass = process.env.EMAIL_AUTH_PASS;
  const host = process.env.EMAIL_HOST;
  const port = parseInt(process.env.EMAIL_PORT, 10);
  const secure = process.env.EMAIL_SECURE === 'true';

  if (!authUser || !authPass || !host || isNaN(port)) {
    return null;
  }

  return {
    service,
    auth: {
      user: authUser,
      pass: authPass,
    },
    host,
    port,
    secure,
  };
}

export function createTransporter(config: EmailServiceConfig): nodemailer.Transporter {
  if (!config) {
    throw new Error('Email service config is required');
  }

  switch (config.service) {
    case EmailServiceProvider.GMAIL:
      return nodemailer.createTransport({
        host,
        port,
        secure,
        auth: {
          user: config.auth.user,
          pass: config.auth.pass,
        },
      });
    case EmailServiceProvider.AMAZON_SES:
      // Configure Amazon SES transporter settings
      // ...
    // Add more email service providers as needed
    default:
      throw new Error(`Unsupported email service provider: ${config.service}`);
  }
}

export function sendReviewRequestEmail(customer: Customer, product: Product): void {
  // Validate customer email address
  if (!customer.email) {
    throw new EmailError('Customer email address is required');
  }

  const emailServiceConfig = getEmailServiceConfig();
  if (!emailServiceConfig) {
    throw new EmailError('Email service config is not found or invalid');
  }

  const transporter = createTransporter(emailServiceConfig);

  // Generate personalized email content
  const emailContent = EmailTemplate.reviewRequest(customer, product);

  // Schedule email delivery based on customer behavior patterns
  const deliveryTime = moment().add(customer.behaviorPattern.emailDelay, 'minutes');

  // Set email options
  const mailOptions = {
    from: 'Review Rocket <noreply@reviewrocket.com>',
    to: customer.email,
    subject: 'Review Request for [Product Name]',
    text: emailContent,
  };

  // Log email delivery details
  EmailLogger.info(`Scheduling email delivery for customer ${customer.id} at ${deliveryTime.format()}`);

  // Schedule email delivery using nodemailer's transport.sendMailAt function
  transporter.sendMailAt(mailOptions, deliveryTime);
}