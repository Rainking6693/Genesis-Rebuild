// src/components/EmailMarketing.tsx
import * as SendGrid from '@sendgrid/mail';

interface EmailMarketingProps {
  apiKey: string;
  fromEmail: string;
}

interface EmailData {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export default function EmailMarketing({ apiKey, fromEmail }: EmailMarketingProps) {
  SendGrid.setApiKey(apiKey);

  const sendEmail = async (emailData: EmailData): Promise<boolean> => {
    try {
      const msg = {
        to: emailData.to,
        from: fromEmail,
        subject: emailData.subject,
        text: emailData.text,
        html: emailData.html,
      };

      await SendGrid.send(msg);
      console.log(`Email sent successfully to ${emailData.to}`);
      return true;
    } catch (error: any) {
      console.error(`Error sending email to ${emailData.to}:`, error);
      if (error.response) {
        console.error(error.response.body);
      }
      return false;
    }
  };

  const subscribeUser = async (email: string): Promise<boolean> => {
    // Placeholder for subscribing a user.  In a real application, this would
    // likely involve storing the email address in a database and potentially
    // sending a confirmation email.
    try {
      console.log(`Subscribing user: ${email}`);
      // Simulate a database operation
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate latency

      // Send confirmation email
      const confirmationEmailData: EmailData = {
        to: email,
        from: fromEmail,
        subject: 'Welcome to our Newsletter!',
        text: 'Thank you for subscribing to our newsletter!',
        html: '<p>Thank you for subscribing to our newsletter!</p>',
      };
      return await sendEmail(confirmationEmailData);

    } catch (error: any) {
      console.error(`Error subscribing user ${email}:`, error);
      return false;
    }
  };

  return { sendEmail, subscribeUser };
}

// Example Usage (Not part of the component, but shows how to use it)
// const emailMarketing = EmailMarketing({ apiKey: 'YOUR_SENDGRID_API_KEY', fromEmail: 'noreply@example.com' });
// emailMarketing.sendEmail({ to: 'test@example.com', subject: 'Test Email', text: 'This is a test email', html: '<p>This is a test email</p>' });
// emailMarketing.subscribeUser('newuser@example.com');

// src/components/EmailMarketing.tsx
import * as SendGrid from '@sendgrid/mail';

interface EmailMarketingProps {
  apiKey: string;
  fromEmail: string;
}

interface EmailData {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export default function EmailMarketing({ apiKey, fromEmail }: EmailMarketingProps) {
  SendGrid.setApiKey(apiKey);

  const sendEmail = async (emailData: EmailData): Promise<boolean> => {
    try {
      const msg = {
        to: emailData.to,
        from: fromEmail,
        subject: emailData.subject,
        text: emailData.text,
        html: emailData.html,
      };

      await SendGrid.send(msg);
      console.log(`Email sent successfully to ${emailData.to}`);
      return true;
    } catch (error: any) {
      console.error(`Error sending email to ${emailData.to}:`, error);
      if (error.response) {
        console.error(error.response.body);
      }
      return false;
    }
  };

  const subscribeUser = async (email: string): Promise<boolean> => {
    // Placeholder for subscribing a user.  In a real application, this would
    // likely involve storing the email address in a database and potentially
    // sending a confirmation email.
    try {
      console.log(`Subscribing user: ${email}`);
      // Simulate a database operation
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate latency

      // Send confirmation email
      const confirmationEmailData: EmailData = {
        to: email,
        from: fromEmail,
        subject: 'Welcome to our Newsletter!',
        text: 'Thank you for subscribing to our newsletter!',
        html: '<p>Thank you for subscribing to our newsletter!</p>',
      };
      return await sendEmail(confirmationEmailData);

    } catch (error: any) {
      console.error(`Error subscribing user ${email}:`, error);
      return false;
    }
  };

  return { sendEmail, subscribeUser };
}

// Example Usage (Not part of the component, but shows how to use it)
// const emailMarketing = EmailMarketing({ apiKey: 'YOUR_SENDGRID_API_KEY', fromEmail: 'noreply@example.com' });
// emailMarketing.sendEmail({ to: 'test@example.com', subject: 'Test Email', text: 'This is a test email', html: '<p>This is a test email</p>' });
// emailMarketing.subscribeUser('newuser@example.com');