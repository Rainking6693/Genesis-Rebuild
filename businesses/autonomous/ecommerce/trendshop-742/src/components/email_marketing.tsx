// src/components/EmailMarketing.tsx
import { useState, useEffect } from 'react';

interface EmailMarketingProps {
  apiKey: string;
  senderEmail: string;
}

interface EmailData {
  recipientEmail: string;
  subject: string;
  body: string;
}

const EmailMarketing = ({ apiKey, senderEmail }: EmailMarketingProps) => {
  const [status, setStatus] = useState<string>('idle');
  const [error, setError] = useState<string | null>(null);

  const sendEmail = async (emailData: EmailData) => {
    setStatus('sending');
    setError(null);

    try {
      const response = await fetch('https://api.example.com/send-email', { // Replace with actual API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          ...emailData,
          senderEmail: senderEmail,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Email sending failed with status: ${response.status}`);
      }

      setStatus('sent');
    } catch (e: any) {
      setError(e.message);
      setStatus('error');
      console.error('Error sending email:', e); // Log the error for debugging
    }
  };

  useEffect(() => {
    if (error) {
      console.warn("Email Marketing Component Error:", error);
    }
  }, [error]);

  return (
    <div>
      {status === 'error' && (
        <div style={{ color: 'red' }}>Error: {error}</div>
      )}
      {/* UI elements for composing and sending emails would go here */}
      {/* This is a placeholder for the actual UI */}
      <button onClick={() => sendEmail({ recipientEmail: 'test@example.com', subject: 'Test Email', body: 'This is a test email.' })}>
        Send Test Email
      </button>
      {status === 'sending' && <p>Sending...</p>}
      {status === 'sent' && <p>Email Sent!</p>}
    </div>
  );
};

export default EmailMarketing;

// src/components/EmailMarketing.tsx
import { useState, useEffect } from 'react';

interface EmailMarketingProps {
  apiKey: string;
  senderEmail: string;
}

interface EmailData {
  recipientEmail: string;
  subject: string;
  body: string;
}

const EmailMarketing = ({ apiKey, senderEmail }: EmailMarketingProps) => {
  const [status, setStatus] = useState<string>('idle');
  const [error, setError] = useState<string | null>(null);

  const sendEmail = async (emailData: EmailData) => {
    setStatus('sending');
    setError(null);

    try {
      const response = await fetch('https://api.example.com/send-email', { // Replace with actual API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          ...emailData,
          senderEmail: senderEmail,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Email sending failed with status: ${response.status}`);
      }

      setStatus('sent');
    } catch (e: any) {
      setError(e.message);
      setStatus('error');
      console.error('Error sending email:', e); // Log the error for debugging
    }
  };

  useEffect(() => {
    if (error) {
      console.warn("Email Marketing Component Error:", error);
    }
  }, [error]);

  return (
    <div>
      {status === 'error' && (
        <div style={{ color: 'red' }}>Error: {error}</div>
      )}
      {/* UI elements for composing and sending emails would go here */}
      {/* This is a placeholder for the actual UI */}
      <button onClick={() => sendEmail({ recipientEmail: 'test@example.com', subject: 'Test Email', body: 'This is a test email.' })}>
        Send Test Email
      </button>
      {status === 'sending' && <p>Sending...</p>}
      {status === 'sent' && <p>Email Sent!</p>}
    </div>
  );
};

export default EmailMarketing;