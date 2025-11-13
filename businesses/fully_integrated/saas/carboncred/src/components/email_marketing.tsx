import nodemailer from 'nodemailer';
import { transports, createTransport } from 'nodemailer';
import { env } from 'process';

type EmailOptions = {
  from: string;
  to: string;
  subject: string;
  text: string;
  html?: string; // Add support for HTML emails
  cc?: string[]; // Add support for CC recipients
  bcc?: string[]; // Add support for BCC recipients
};

const defaultTransport = createTransport({
  host: env.EMAIL_HOST,
  port: Number(env.EMAIL_PORT),
  secure: true, // Use SSL
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASSWORD,
  },
});

const smtpTransport = createTransport(defaultTransport.options);

const emailTransporter = nodemailer.createTransport(
  process.env.EMAIL_TRANSPORTATION_METHOD === 'smtp'
    ? smtpTransport
    : transports.sendmail
);

async function sendEmail(options: EmailOptions) {
  try {
    const mailOptions = { ...options };
    if (mailOptions.html) {
      mailOptions.html = Buffer.from(mailOptions.html); // Encode HTML content as Buffer
    }

    const info = await emailTransporter.sendMail(mailOptions);
    console.log(`Message sent: ${info.messageId}`);
  } catch (error) {
    console.error(`Error sending email: ${error}`);

    // Retry with a different transport method (e.g. sendmail) if SMTP fails
    if (process.env.EMAIL_TRANSPORTATION_METHOD === 'smtp') {
      await sendEmail({
        ...options,
        transport: transports.sendmail,
      });
    }

    // If the email fails to send, log the error and the original options for debugging
    if (process.env.NODE_ENV !== 'production') {
      console.error(`Failed to send email: ${JSON.stringify(options)}`);
    }
  }
}

export default sendEmail;

import nodemailer from 'nodemailer';
import { transports, createTransport } from 'nodemailer';
import { env } from 'process';

type EmailOptions = {
  from: string;
  to: string;
  subject: string;
  text: string;
  html?: string; // Add support for HTML emails
  cc?: string[]; // Add support for CC recipients
  bcc?: string[]; // Add support for BCC recipients
};

const defaultTransport = createTransport({
  host: env.EMAIL_HOST,
  port: Number(env.EMAIL_PORT),
  secure: true, // Use SSL
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASSWORD,
  },
});

const smtpTransport = createTransport(defaultTransport.options);

const emailTransporter = nodemailer.createTransport(
  process.env.EMAIL_TRANSPORTATION_METHOD === 'smtp'
    ? smtpTransport
    : transports.sendmail
);

async function sendEmail(options: EmailOptions) {
  try {
    const mailOptions = { ...options };
    if (mailOptions.html) {
      mailOptions.html = Buffer.from(mailOptions.html); // Encode HTML content as Buffer
    }

    const info = await emailTransporter.sendMail(mailOptions);
    console.log(`Message sent: ${info.messageId}`);
  } catch (error) {
    console.error(`Error sending email: ${error}`);

    // Retry with a different transport method (e.g. sendmail) if SMTP fails
    if (process.env.EMAIL_TRANSPORTATION_METHOD === 'smtp') {
      await sendEmail({
        ...options,
        transport: transports.sendmail,
      });
    }

    // If the email fails to send, log the error and the original options for debugging
    if (process.env.NODE_ENV !== 'production') {
      console.error(`Failed to send email: ${JSON.stringify(options)}`);
    }
  }
}

export default sendEmail;