import nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
import { SustainScoreClient } from './sustainscore-client';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sustainScoreClient = new SustainScoreClient();

type MailOptions = nodemailer.Options<nodemailer.SentMessageInfo>;

function validateEmail(email: string): boolean {
  // Add a simple email validation function to ensure the recipient email is valid
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function validateUrl(url: string): boolean {
  // Add a simple URL validation function to ensure the report URL is valid
  const re = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([/\w \.-]*)*\/?$/;
  return re.test(String(url).toLowerCase());
}

async function sendEmail(businessName: string, reportUrl: string, mailOptions: MailOptions) {
  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully for ${businessName}`);
  } catch (error) {
    console.error(`Error occurred while sending email for ${businessName}:`, error);
  }
}

async function generateAndSendEmail(businessName: string) {
  let reportUrl = '';

  if (!validateEmail(process.env.EMAIL_RECIPIENT)) {
    console.error('Invalid recipient email address');
    return;
  }

  if (!validateUrl(process.env.REPORT_URL_TEMPLATE)) {
    console.error('Invalid report URL template');
    return;
  }

  try {
    const report = await sustainScoreClient.generateReport(businessName);
    reportUrl = process.env.REPORT_URL_TEMPLATE.replace('{businessName}', businessName);
  } catch (error) {
    console.error('Error occurred while generating the report:', error);
    return;
  }

  if (!validateUrl(reportUrl)) {
    console.error('Invalid report URL');
    return;
  }

  const mailOptions: MailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_RECIPIENT,
    subject: `SustainScore Report for ${businessName}`,
    text: `Dear Recipient,\n\nWe are excited to share the SustainScore report for ${businessName}. Please find the detailed environmental impact report and improvement roadmap at the following link:\n\n${reportUrl}\n\nBest Regards,\nThe SustainScore Team`,
  };

  sendEmail(businessName, reportUrl, mailOptions);
}

export { generateAndSendEmail };

import nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
import { SustainScoreClient } from './sustainscore-client';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sustainScoreClient = new SustainScoreClient();

type MailOptions = nodemailer.Options<nodemailer.SentMessageInfo>;

function validateEmail(email: string): boolean {
  // Add a simple email validation function to ensure the recipient email is valid
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function validateUrl(url: string): boolean {
  // Add a simple URL validation function to ensure the report URL is valid
  const re = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([/\w \.-]*)*\/?$/;
  return re.test(String(url).toLowerCase());
}

async function sendEmail(businessName: string, reportUrl: string, mailOptions: MailOptions) {
  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully for ${businessName}`);
  } catch (error) {
    console.error(`Error occurred while sending email for ${businessName}:`, error);
  }
}

async function generateAndSendEmail(businessName: string) {
  let reportUrl = '';

  if (!validateEmail(process.env.EMAIL_RECIPIENT)) {
    console.error('Invalid recipient email address');
    return;
  }

  if (!validateUrl(process.env.REPORT_URL_TEMPLATE)) {
    console.error('Invalid report URL template');
    return;
  }

  try {
    const report = await sustainScoreClient.generateReport(businessName);
    reportUrl = process.env.REPORT_URL_TEMPLATE.replace('{businessName}', businessName);
  } catch (error) {
    console.error('Error occurred while generating the report:', error);
    return;
  }

  if (!validateUrl(reportUrl)) {
    console.error('Invalid report URL');
    return;
  }

  const mailOptions: MailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_RECIPIENT,
    subject: `SustainScore Report for ${businessName}`,
    text: `Dear Recipient,\n\nWe are excited to share the SustainScore report for ${businessName}. Please find the detailed environmental impact report and improvement roadmap at the following link:\n\n${reportUrl}\n\nBest Regards,\nThe SustainScore Team`,
  };

  sendEmail(businessName, reportUrl, mailOptions);
}

export { generateAndSendEmail };