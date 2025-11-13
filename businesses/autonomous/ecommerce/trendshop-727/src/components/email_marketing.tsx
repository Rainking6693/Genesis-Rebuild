// src/components/EmailMarketing.ts

import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';

interface EmailOptions {
  from: string;
  to: string;
  subject: string;
  template: string;
  context: any;
}

class EmailMarketing {
  private transporter: nodemailer.Transporter;

  constructor(
    private smtpHost: string,
    private smtpPort: number,
    private smtpUser: string,
    private smtpPass: string
  ) {
    this.transporter = nodemailer.createTransport({
      host: this.smtpHost,
      port: this.smtpPort,
      secure: this.smtpPort === 465, // Use SSL if port is 465
      auth: {
        user: this.smtpUser,
        pass: this.smtpPass,
      },
    });
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      const templatePath = path.join(__dirname, 'templates', `${options.template}.hbs`);
      const templateSource = fs.readFileSync(templatePath, 'utf-8');
      const compiledTemplate = handlebars.compile(templateSource);
      const html = compiledTemplate(options.context);

      const mailOptions = {
        from: options.from,
        to: options.to,
        subject: options.subject,
        html: html,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent: %s', info.messageId);
      return true;

    } catch (error: any) {
      console.error('Error sending email:', error);
      // Log the error to a more persistent logging system (e.g., a file or database)
      return false;
    }
  }

  async addSubscriber(email: string): Promise<boolean> {
    // Placeholder for subscriber management logic (e.g., adding to a database)
    try {
      console.log(`Adding subscriber: ${email}`);
      // Simulate adding to a database
      return new Promise((resolve) => setTimeout(() => resolve(true), 500));
    } catch (error: any) {
      console.error('Error adding subscriber:', error);
      return false;
    }
  }

  async removeSubscriber(email: string): Promise<boolean> {
    // Placeholder for subscriber removal logic
    try {
      console.log(`Removing subscriber: ${email}`);
      // Simulate removing from a database
      return new Promise((resolve) => setTimeout(() => resolve(true), 500));
    } catch (error: any) {
      console.error('Error removing subscriber:', error);
      return false;
    }
  }
}

export default EmailMarketing;

// Example Usage (for demonstration purposes)
async function main() {
  const emailMarketing = new EmailMarketing(
    'smtp.example.com',
    587,
    'your_email@example.com',
    'your_password'
  );

  const emailOptions: EmailOptions = {
    from: 'your_email@example.com',
    to: 'recipient@example.com',
    subject: 'Welcome to our E-commerce Store!',
    template: 'welcome',
    context: {
      name: 'John Doe',
      storeName: 'Awesome Gadgets',
    },
  };

  const success = await emailMarketing.sendEmail(emailOptions);
  if (success) {
    console.log('Email sent successfully!');
  } else {
    console.log('Failed to send email.');
  }

  const addSuccess = await emailMarketing.addSubscriber('newsubscriber@example.com');
  if (addSuccess) {
    console.log('Subscriber added successfully!');
  } else {
    console.log('Failed to add subscriber.');
  }
}

// Only run the example if this is the main module
if (require.main === module) {
  main();
}

// src/components/EmailMarketing.ts

import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';

interface EmailOptions {
  from: string;
  to: string;
  subject: string;
  template: string;
  context: any;
}

class EmailMarketing {
  private transporter: nodemailer.Transporter;

  constructor(
    private smtpHost: string,
    private smtpPort: number,
    private smtpUser: string,
    private smtpPass: string
  ) {
    this.transporter = nodemailer.createTransport({
      host: this.smtpHost,
      port: this.smtpPort,
      secure: this.smtpPort === 465, // Use SSL if port is 465
      auth: {
        user: this.smtpUser,
        pass: this.smtpPass,
      },
    });
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      const templatePath = path.join(__dirname, 'templates', `${options.template}.hbs`);
      const templateSource = fs.readFileSync(templatePath, 'utf-8');
      const compiledTemplate = handlebars.compile(templateSource);
      const html = compiledTemplate(options.context);

      const mailOptions = {
        from: options.from,
        to: options.to,
        subject: options.subject,
        html: html,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent: %s', info.messageId);
      return true;

    } catch (error: any) {
      console.error('Error sending email:', error);
      // Log the error to a more persistent logging system (e.g., a file or database)
      return false;
    }
  }

  async addSubscriber(email: string): Promise<boolean> {
    // Placeholder for subscriber management logic (e.g., adding to a database)
    try {
      console.log(`Adding subscriber: ${email}`);
      // Simulate adding to a database
      return new Promise((resolve) => setTimeout(() => resolve(true), 500));
    } catch (error: any) {
      console.error('Error adding subscriber:', error);
      return false;
    }
  }

  async removeSubscriber(email: string): Promise<boolean> {
    // Placeholder for subscriber removal logic
    try {
      console.log(`Removing subscriber: ${email}`);
      // Simulate removing from a database
      return new Promise((resolve) => setTimeout(() => resolve(true), 500));
    } catch (error: any) {
      console.error('Error removing subscriber:', error);
      return false;
    }
  }
}

export default EmailMarketing;

// Example Usage (for demonstration purposes)
async function main() {
  const emailMarketing = new EmailMarketing(
    'smtp.example.com',
    587,
    'your_email@example.com',
    'your_password'
  );

  const emailOptions: EmailOptions = {
    from: 'your_email@example.com',
    to: 'recipient@example.com',
    subject: 'Welcome to our E-commerce Store!',
    template: 'welcome',
    context: {
      name: 'John Doe',
      storeName: 'Awesome Gadgets',
    },
  };

  const success = await emailMarketing.sendEmail(emailOptions);
  if (success) {
    console.log('Email sent successfully!');
  } else {
    console.log('Failed to send email.');
  }

  const addSuccess = await emailMarketing.addSubscriber('newsubscriber@example.com');
  if (addSuccess) {
    console.log('Subscriber added successfully!');
  } else {
    console.log('Failed to add subscriber.');
  }
}

// Only run the example if this is the main module
if (require.main === module) {
  main();
}