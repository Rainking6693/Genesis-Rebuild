import nodemailer from 'nodemailer';
import { Customer } from '../customer/customer.model';

export interface EmailOptions {
  from: string;
  to: string;
  subject: string;
  text: string;
}

export async function sendDiscountEmail(customer: Customer, discount: number) {
  // 1. Check correctness, completeness, and quality
  if (!customer || !discount || typeof discount !== 'number' || !customer.name || !customer.email) {
    throw new Error('Invalid input. Both customer and discount should be provided, and customer should have name and email.');
  }

  // 2. Ensure consistency with business context
  const emailSubject = `Test E-Commerce Store - Exclusive Discount Offer for You!`;
  const emailBody = `Dear ${customer.name},\n\nWe are excited to offer you an exclusive discount of ${discount}% on your next purchase at Test E-Commerce Store. Don't miss out on this amazing opportunity! Shop now at <https://test-ecommerce-store.com>.\n\nBest Regards,\nTest E-Commerce Store Team`;

  // 3. Apply security best practices
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: Boolean(process.env.EMAIL_SECURE),
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // 4. Optimize performance
  const emailOptions: EmailOptions = {
    from: process.env.EMAIL_FROM,
    to: customer.email,
    subject: emailSubject,
    text: emailBody,
  };

  try {
    await transporter.sendMail(emailOptions);
    console.log(`Sent discount email to ${customer.email} with discount ${discount}%`);
  } catch (error) {
    console.error(`Failed to send discount email to ${customer.email}:`, error);
    throw error;
  }
}

import nodemailer from 'nodemailer';
import { Customer } from '../customer/customer.model';

export interface EmailOptions {
  from: string;
  to: string;
  subject: string;
  text: string;
}

export async function sendDiscountEmail(customer: Customer, discount: number) {
  // 1. Check correctness, completeness, and quality
  if (!customer || !discount || typeof discount !== 'number' || !customer.name || !customer.email) {
    throw new Error('Invalid input. Both customer and discount should be provided, and customer should have name and email.');
  }

  // 2. Ensure consistency with business context
  const emailSubject = `Test E-Commerce Store - Exclusive Discount Offer for You!`;
  const emailBody = `Dear ${customer.name},\n\nWe are excited to offer you an exclusive discount of ${discount}% on your next purchase at Test E-Commerce Store. Don't miss out on this amazing opportunity! Shop now at <https://test-ecommerce-store.com>.\n\nBest Regards,\nTest E-Commerce Store Team`;

  // 3. Apply security best practices
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: Boolean(process.env.EMAIL_SECURE),
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // 4. Optimize performance
  const emailOptions: EmailOptions = {
    from: process.env.EMAIL_FROM,
    to: customer.email,
    subject: emailSubject,
    text: emailBody,
  };

  try {
    await transporter.sendMail(emailOptions);
    console.log(`Sent discount email to ${customer.email} with discount ${discount}%`);
  } catch (error) {
    console.error(`Failed to send discount email to ${customer.email}:`, error);
    throw error;
  }
}