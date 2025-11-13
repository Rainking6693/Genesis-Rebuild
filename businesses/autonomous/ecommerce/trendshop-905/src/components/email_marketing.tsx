// src/components/EmailMarketing.tsx
import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';

interface EmailData {
  to: string;
  subject: string;
  template: string;
  context: any;
}

interface EmailMarketingProps {
  smtpConfig: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      pass: string;
    };
  };
}

export default function EmailMarketing({ smtpConfig }: EmailMarketingProps) {

  const transporter = nodemailer.createTransport(smtpConfig);

  const sendEmail = async (emailData: EmailData) => {
    try {
      const templatePath = path.join(__dirname, 'templates', `${emailData.template}.hbs`);
      const source = fs.readFileSync(templatePath, 'utf-8');
      const compiledTemplate = handlebars.compile(source);
      const html = compiledTemplate(emailData.context);

      const mailOptions = {
        from: smtpConfig.auth.user,
        to: emailData.to,
        subject: emailData.subject,
        html: html,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent: %s', info.messageId);
      return info;

    } catch (error: any) {
      console.error('Error sending email:', error);
      throw new Error(`Failed to send email: ${error.message}`); // Re-throw for error boundary
    }
  };

  const subscribeUser = async (email: string) => {
    // Placeholder for subscription logic (e.g., add to database)
    try {
      // Simulate adding to a database
      console.log(`User subscribed: ${email}`);
      return { success: true, message: `User ${email} subscribed successfully.` };
    } catch (error: any) {
      console.error('Error subscribing user:', error);
      return { success: false, message: `Failed to subscribe user: ${error.message}` };
    }
  };

  const unsubscribeUser = async (email: string) => {
    // Placeholder for unsubscription logic (e.g., remove from database)
    try {
      // Simulate removing from a database
      console.log(`User unsubscribed: ${email}`);
      return { success: true, message: `User ${email} unsubscribed successfully.` };
    } catch (error: any) {
      console.error('Error unsubscribing user:', error);
      return { success: false, message: `Failed to unsubscribe user: ${error.message}` };
    }
  };

  return { sendEmail, subscribeUser, unsubscribeUser };
}

// Example Usage (not part of the component, but shows how to use it)
// const emailMarketing = EmailMarketing({
//   smtpConfig: {
//     host: 'your_smtp_host',
//     port: 587,
//     secure: false,
//     auth: {
//       user: 'your_email',
//       pass: 'your_password',
//     },
//   },
// });

// emailMarketing.sendEmail({
//   to: 'test@example.com',
//   subject: 'Welcome to our store!',
//   template: 'welcome',
//   context: { userName: 'John Doe' },
// });

// src/components/EmailMarketing.tsx
import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';

interface EmailData {
  to: string;
  subject: string;
  template: string;
  context: any;
}

interface EmailMarketingProps {
  smtpConfig: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      pass: string;
    };
  };
}

export default function EmailMarketing({ smtpConfig }: EmailMarketingProps) {

  const transporter = nodemailer.createTransport(smtpConfig);

  const sendEmail = async (emailData: EmailData) => {
    try {
      const templatePath = path.join(__dirname, 'templates', `${emailData.template}.hbs`);
      const source = fs.readFileSync(templatePath, 'utf-8');
      const compiledTemplate = handlebars.compile(source);
      const html = compiledTemplate(emailData.context);

      const mailOptions = {
        from: smtpConfig.auth.user,
        to: emailData.to,
        subject: emailData.subject,
        html: html,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent: %s', info.messageId);
      return info;

    } catch (error: any) {
      console.error('Error sending email:', error);
      throw new Error(`Failed to send email: ${error.message}`); // Re-throw for error boundary
    }
  };

  const subscribeUser = async (email: string) => {
    // Placeholder for subscription logic (e.g., add to database)
    try {
      // Simulate adding to a database
      console.log(`User subscribed: ${email}`);
      return { success: true, message: `User ${email} subscribed successfully.` };
    } catch (error: any) {
      console.error('Error subscribing user:', error);
      return { success: false, message: `Failed to subscribe user: ${error.message}` };
    }
  };

  const unsubscribeUser = async (email: string) => {
    // Placeholder for unsubscription logic (e.g., remove from database)
    try {
      // Simulate removing from a database
      console.log(`User unsubscribed: ${email}`);
      return { success: true, message: `User ${email} unsubscribed successfully.` };
    } catch (error: any) {
      console.error('Error unsubscribing user:', error);
      return { success: false, message: `Failed to unsubscribe user: ${error.message}` };
    }
  };

  return { sendEmail, subscribeUser, unsubscribeUser };
}

// Example Usage (not part of the component, but shows how to use it)
// const emailMarketing = EmailMarketing({
//   smtpConfig: {
//     host: 'your_smtp_host',
//     port: 587,
//     secure: false,
//     auth: {
//       user: 'your_email',
//       pass: 'your_password',
//     },
//   },
// });

// emailMarketing.sendEmail({
//   to: 'test@example.com',
//   subject: 'Welcome to our store!',
//   template: 'welcome',
//   context: { userName: 'John Doe' },
// });