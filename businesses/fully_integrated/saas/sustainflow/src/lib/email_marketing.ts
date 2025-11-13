import React, { FunctionComponent, ReactNode } from 'react';
import { MailjetRequest } from 'nodemailer/lib/mailjet/request';
import nodemailer from 'nodemailer';

interface Props {
  children: ReactNode; // Using ReactNode for flexibility
}

const EmailMarketingComponent: FunctionComponent<Props> = ({ children }) => {
  return <div className="sustainflow-email-marketing" data-testid="email-marketing-component">{children}</div>;
};

// Add a unique identifier for the component for future updates and maintenance
EmailMarketingComponent.displayName = 'SustainFlowEmailMarketing';

// Import necessary libraries for handling email functionality

// Create a function to validate environment variables
const validateEnvVars = () => {
  if (!process.env.MAILJET_API_KEY || !process.env.MAILJET_API_SECRET) {
    throw new Error('Missing Mailjet API credentials');
  }
};

// Create a function to send emails with sustainability scores and ESG reports
const sendEmail = async (props: Props) => {
  try {
    validateEnvVars();

    // Configure the email transporter
    const transporter = nodemailer.createTransport({
      service: 'Mailjet',
      auth: {
        user: process.env.MAILJET_API_KEY,
        pass: process.env.MAILJET_API_SECRET,
      },
    });

    // Define the email options
    const mailOptions: MailjetRequest = {
      Subject: 'Your Sustainability Score and ESG Report',
      TextBody: props.children,
      From: '"SustainFlow <noreply@sustainflow.com>" <noreply@sustainflow.com>',
      To: 'customer@example.com',
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// Export the EmailMarketingComponent and the sendEmail function
export { EmailMarketingComponent, sendEmail };

import React, { FunctionComponent, ReactNode } from 'react';
import { MailjetRequest } from 'nodemailer/lib/mailjet/request';
import nodemailer from 'nodemailer';

interface Props {
  children: ReactNode; // Using ReactNode for flexibility
}

const EmailMarketingComponent: FunctionComponent<Props> = ({ children }) => {
  return <div className="sustainflow-email-marketing" data-testid="email-marketing-component">{children}</div>;
};

// Add a unique identifier for the component for future updates and maintenance
EmailMarketingComponent.displayName = 'SustainFlowEmailMarketing';

// Import necessary libraries for handling email functionality

// Create a function to validate environment variables
const validateEnvVars = () => {
  if (!process.env.MAILJET_API_KEY || !process.env.MAILJET_API_SECRET) {
    throw new Error('Missing Mailjet API credentials');
  }
};

// Create a function to send emails with sustainability scores and ESG reports
const sendEmail = async (props: Props) => {
  try {
    validateEnvVars();

    // Configure the email transporter
    const transporter = nodemailer.createTransport({
      service: 'Mailjet',
      auth: {
        user: process.env.MAILJET_API_KEY,
        pass: process.env.MAILJET_API_SECRET,
      },
    });

    // Define the email options
    const mailOptions: MailjetRequest = {
      Subject: 'Your Sustainability Score and ESG Report',
      TextBody: props.children,
      From: '"SustainFlow <noreply@sustainflow.com>" <noreply@sustainflow.com>',
      To: 'customer@example.com',
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// Export the EmailMarketingComponent and the sendEmail function
export { EmailMarketingComponent, sendEmail };