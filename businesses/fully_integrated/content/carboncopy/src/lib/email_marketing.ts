import nodemailer from 'nodemailer';
import { MailOptions } from 'nodemailer';

type Content = {
  title: string;
  link: string;
};

type EmailData = {
  to: string;
  subject: string;
  content: string;
};

async function sendEmail(data: EmailData): Promise<void> {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions: MailOptions = {
    from: process.env.EMAIL_USER,
    to: data.to,
    subject: data.subject,
    text: data.content,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

async function sendContentEmail(content: Content, recipientEmail: string): Promise<void> {
  const subject = 'New Content Available';
  const contentText = `Hello,\n\nWe have a new content available for you: ${content.title}\n\n${content.link}\n\nBest regards,\nYour Content Team`;

  const emailData: EmailData = {
    to: recipientEmail,
    subject,
    content: contentText,
  };

  await sendEmail(emailData);
}

// Example usage
const content: Content = {
  title: 'The Ultimate Guide to TypeScript',
  link: 'https://example.com/ultimate-guide-typescript',
};

const recipientEmail = 'example@example.com';
sendContentEmail(content, recipientEmail);

import nodemailer from 'nodemailer';
import { MailOptions } from 'nodemailer';

type Content = {
  title: string;
  link: string;
};

type EmailData = {
  to: string;
  subject: string;
  content: string;
};

async function sendEmail(data: EmailData): Promise<void> {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions: MailOptions = {
    from: process.env.EMAIL_USER,
    to: data.to,
    subject: data.subject,
    text: data.content,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

async function sendContentEmail(content: Content, recipientEmail: string): Promise<void> {
  const subject = 'New Content Available';
  const contentText = `Hello,\n\nWe have a new content available for you: ${content.title}\n\n${content.link}\n\nBest regards,\nYour Content Team`;

  const emailData: EmailData = {
    to: recipientEmail,
    subject,
    content: contentText,
  };

  await sendEmail(emailData);
}

// Example usage
const content: Content = {
  title: 'The Ultimate Guide to TypeScript',
  link: 'https://example.com/ultimate-guide-typescript',
};

const recipientEmail = 'example@example.com';
sendContentEmail(content, recipientEmail);