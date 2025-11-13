import nodemailer from 'nodemailer';
import { Client } from 'pg';
import { validateEmail } from './utils/emailValidator';

// Database connection
const dbUrl = process.env.DB_URL || 'postgres://your_db_user:your_db_password@your_db_host:5432/your_db_name';
const client = new Client({ connectionString: dbUrl });

client.connect();

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your_email@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'your_email_password',
  },
});

// Function to validate an email address
function validateEmail(email: string) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

// Function to send an email marketing campaign
async function sendEmailCampaign(subject: string, htmlContent: string) {
  try {
    // Fetch recipients from the database
    const recipients = await getRecipients();

    // Validate and filter out invalid email addresses
    const validRecipients = recipients.filter((recipient) => validateEmail(recipient.email));

    // Send email to each valid recipient
    for (const recipient of validRecipients) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER || 'your_email@gmail.com',
        to: recipient.email,
        subject: subject,
        html: htmlContent,
      });
    }

    console.log(`Email campaign sent successfully to ${validRecipients.length} recipients.`);
  } catch (error) {
    console.error('Error sending email campaign:', error);
  } finally {
    client.end();
  }
}

// Function to fetch recipients from the database
async function getRecipients() {
  const result = await client.query('SELECT email FROM subscribers');
  return result.rows;
}

// Usage
sendEmailCampaign('New EcoProfit Analytics Features', '<html_content>');

// Add error handling for missing environment variables
if (!process.env.DB_URL || !process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
  console.error('Missing environment variables: DB_URL, EMAIL_USER, EMAIL_PASSWORD');
  process.exit(1);
}

import nodemailer from 'nodemailer';
import { Client } from 'pg';
import { validateEmail } from './utils/emailValidator';

// Database connection
const dbUrl = process.env.DB_URL || 'postgres://your_db_user:your_db_password@your_db_host:5432/your_db_name';
const client = new Client({ connectionString: dbUrl });

client.connect();

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your_email@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'your_email_password',
  },
});

// Function to validate an email address
function validateEmail(email: string) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

// Function to send an email marketing campaign
async function sendEmailCampaign(subject: string, htmlContent: string) {
  try {
    // Fetch recipients from the database
    const recipients = await getRecipients();

    // Validate and filter out invalid email addresses
    const validRecipients = recipients.filter((recipient) => validateEmail(recipient.email));

    // Send email to each valid recipient
    for (const recipient of validRecipients) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER || 'your_email@gmail.com',
        to: recipient.email,
        subject: subject,
        html: htmlContent,
      });
    }

    console.log(`Email campaign sent successfully to ${validRecipients.length} recipients.`);
  } catch (error) {
    console.error('Error sending email campaign:', error);
  } finally {
    client.end();
  }
}

// Function to fetch recipients from the database
async function getRecipients() {
  const result = await client.query('SELECT email FROM subscribers');
  return result.rows;
}

// Usage
sendEmailCampaign('New EcoProfit Analytics Features', '<html_content>');

// Add error handling for missing environment variables
if (!process.env.DB_URL || !process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
  console.error('Missing environment variables: DB_URL, EMAIL_USER, EMAIL_PASSWORD');
  process.exit(1);
}