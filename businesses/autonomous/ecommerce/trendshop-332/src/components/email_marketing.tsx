// src/components/EmailMarketing.tsx

import * as SendGrid from '@sendgrid/mail';

interface EmailMarketingProps {
  sendGridApiKey: string;
  fromEmail: string;
}

interface Subscriber {
  email: string;
  name?: string;
}

export default function EmailMarketing({ sendGridApiKey, fromEmail }: EmailMarketingProps) {
  SendGrid.setApiKey(sendGridApiKey);

  const subscribeUser = async (subscriber: Subscriber): Promise<boolean> => {
    try {
      // Add subscriber to SendGrid contact list
      // (Simplified example - requires SendGrid API integration)
      console.log(`Subscribing user: ${subscriber.email}`);
      // In a real implementation, you would use the SendGrid API to add the contact.
      return true; // Assume success for now
    } catch (error: any) {
      console.error(`Error subscribing user: ${error.message}`);
      return false;
    }
  };

  const sendTransactionalEmail = async (to: string, subject: string, text: string, html: string): Promise<boolean> => {
    try {
      const msg = {
        to: to,
        from: fromEmail,
        subject: subject,
        text: text,
        html: html,
      };

      await SendGrid.send(msg);
      console.log(`Transactional email sent to ${to}`);
      return true;
    } catch (error: any) {
      console.error(`Error sending transactional email: ${error.message}`);
      return false;
    }
  };

  const sendMarketingEmail = async (to: string, subject: string, text: string, html: string): Promise<boolean> => {
    try {
      const msg = {
        to: to,
        from: fromEmail,
        subject: subject,
        text: text,
        html: html,
      };

      await SendGrid.send(msg);
      console.log(`Marketing email sent to ${to}`);
      return true;
    } catch (error: any) {
      console.error(`Error sending marketing email: ${error.message}`);
      return false;
    }
  };

  const unsubscribeUser = async (email: string): Promise<boolean> => {
    try {
      // Remove subscriber from SendGrid contact list
      // (Simplified example - requires SendGrid API integration)
      console.log(`Unsubscribing user: ${email}`);
      // In a real implementation, you would use the SendGrid API to remove the contact.
      return true; // Assume success for now
    } catch (error: any) {
      console.error(`Error unsubscribing user: ${error.message}`);
      return false;
    }
  };

  return {
    subscribeUser,
    sendTransactionalEmail,
    sendMarketingEmail,
    unsubscribeUser,
  };
}

// Example Usage (for demonstration purposes)
// const emailMarketing = EmailMarketing({ sendGridApiKey: 'YOUR_SENDGRID_API_KEY', fromEmail: 'noreply@example.com' });
// emailMarketing.sendTransactionalEmail('user@example.com', 'Order Confirmation', 'Your order has been confirmed.', '<p>Your order has been confirmed.</p>');

// src/components/EmailMarketing.tsx

import * as SendGrid from '@sendgrid/mail';

interface EmailMarketingProps {
  sendGridApiKey: string;
  fromEmail: string;
}

interface Subscriber {
  email: string;
  name?: string;
}

export default function EmailMarketing({ sendGridApiKey, fromEmail }: EmailMarketingProps) {
  SendGrid.setApiKey(sendGridApiKey);

  const subscribeUser = async (subscriber: Subscriber): Promise<boolean> => {
    try {
      // Add subscriber to SendGrid contact list
      // (Simplified example - requires SendGrid API integration)
      console.log(`Subscribing user: ${subscriber.email}`);
      // In a real implementation, you would use the SendGrid API to add the contact.
      return true; // Assume success for now
    } catch (error: any) {
      console.error(`Error subscribing user: ${error.message}`);
      return false;
    }
  };

  const sendTransactionalEmail = async (to: string, subject: string, text: string, html: string): Promise<boolean> => {
    try {
      const msg = {
        to: to,
        from: fromEmail,
        subject: subject,
        text: text,
        html: html,
      };

      await SendGrid.send(msg);
      console.log(`Transactional email sent to ${to}`);
      return true;
    } catch (error: any) {
      console.error(`Error sending transactional email: ${error.message}`);
      return false;
    }
  };

  const sendMarketingEmail = async (to: string, subject: string, text: string, html: string): Promise<boolean> => {
    try {
      const msg = {
        to: to,
        from: fromEmail,
        subject: subject,
        text: text,
        html: html,
      };

      await SendGrid.send(msg);
      console.log(`Marketing email sent to ${to}`);
      return true;
    } catch (error: any) {
      console.error(`Error sending marketing email: ${error.message}`);
      return false;
    }
  };

  const unsubscribeUser = async (email: string): Promise<boolean> => {
    try {
      // Remove subscriber from SendGrid contact list
      // (Simplified example - requires SendGrid API integration)
      console.log(`Unsubscribing user: ${email}`);
      // In a real implementation, you would use the SendGrid API to remove the contact.
      return true; // Assume success for now
    } catch (error: any) {
      console.error(`Error unsubscribing user: ${error.message}`);
      return false;
    }
  };

  return {
    subscribeUser,
    sendTransactionalEmail,
    sendMarketingEmail,
    unsubscribeUser,
  };
}

// Example Usage (for demonstration purposes)
// const emailMarketing = EmailMarketing({ sendGridApiKey: 'YOUR_SENDGRID_API_KEY', fromEmail: 'noreply@example.com' });
// emailMarketing.sendTransactionalEmail('user@example.com', 'Order Confirmation', 'Your order has been confirmed.', '<p>Your order has been confirmed.</p>');