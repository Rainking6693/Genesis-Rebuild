import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';

interface EmailData {
  to: string;
  subject: string;
  text: string;
  html?: string;
  cc?: string; // Added optional cc field
}

type RequiredEmailData = Omit<EmailData, 'html' | 'cc'> & {
  html?: string;
  cc?: string;
};

const transporter = nodemailer.createTransport({
  // SMTP configuration (e.g., Gmail, SendGrid, etc.)
});

function validateEmailData(data: EmailData): data is RequiredEmailData {
  const requiredFields = ['to', 'subject', 'text'];
  return requiredFields.every((field) => data[field] !== undefined);
}

export function sendEmail(data: EmailData): data is RequiredEmailData extends void {
  if (!validateEmailData(data)) {
    throw new Error('Missing required fields: to, subject, text');
  }

  const mailOptions: nodemailer.Options = {
    from: 'EcoScore Analytics <noreply@ecoscore.ai>',
    to: data.to,
    subject: data.subject,
    text: data.text,
  };

  // Add unique ID to each email for tracking purposes if not provided
  if (!data.cc) {
    mailOptions.cc = `EcoScore Analytics <ecoscore-analytics-email-tracking+${uuidv4()}@ecoscore.ai>`;
  } else {
    mailOptions.cc = data.cc;
  }

  if (data.html) {
    mailOptions.html = data.html;
  }

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        reject(error);
      } else {
        console.log(`Email sent: ${info.response}`);
        resolve();
      }
    });
  });
}

import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';

interface EmailData {
  to: string;
  subject: string;
  text: string;
  html?: string;
  cc?: string; // Added optional cc field
}

type RequiredEmailData = Omit<EmailData, 'html' | 'cc'> & {
  html?: string;
  cc?: string;
};

const transporter = nodemailer.createTransport({
  // SMTP configuration (e.g., Gmail, SendGrid, etc.)
});

function validateEmailData(data: EmailData): data is RequiredEmailData {
  const requiredFields = ['to', 'subject', 'text'];
  return requiredFields.every((field) => data[field] !== undefined);
}

export function sendEmail(data: EmailData): data is RequiredEmailData extends void {
  if (!validateEmailData(data)) {
    throw new Error('Missing required fields: to, subject, text');
  }

  const mailOptions: nodemailer.Options = {
    from: 'EcoScore Analytics <noreply@ecoscore.ai>',
    to: data.to,
    subject: data.subject,
    text: data.text,
  };

  // Add unique ID to each email for tracking purposes if not provided
  if (!data.cc) {
    mailOptions.cc = `EcoScore Analytics <ecoscore-analytics-email-tracking+${uuidv4()}@ecoscore.ai>`;
  } else {
    mailOptions.cc = data.cc;
  }

  if (data.html) {
    mailOptions.html = data.html;
  }

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        reject(error);
      } else {
        console.log(`Email sent: ${info.response}`);
        resolve();
      }
    });
  });
}