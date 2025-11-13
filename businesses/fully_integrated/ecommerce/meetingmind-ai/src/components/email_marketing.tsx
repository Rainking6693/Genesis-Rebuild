import React, { useState, useEffect, useCallback } from 'react';

interface EmailMarketingProps {
  title?: string;
  content?: string;
  sendEmail: (title: string, content: string) => Promise<boolean>;
}

const EmailMarketing: React.FC<EmailMarketingProps> = ({
  title = 'Email Marketing',
  content = 'Please enter your email content.',
  sendEmail,
}) => {
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
  }, [title, content]);

  const handleSendEmail = useCallback(async () => {
    try {
      setIsSending(true);
      const success = await sendEmail(title, content);
      if (!success) {
        setError('Failed to send email. Please try again later.');
      }
    } catch (err) {
      console.error('Error sending email:', err);
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setIsSending(false);
    }
  }, [sendEmail, title, content]);

  return (
    <div data-testid="email-marketing">
      <h1 data-testid="title">{title}</h1>
      <p data-testid="content">{content}</p>
      <button
        data-testid="send-button"
        onClick={handleSendEmail}
        disabled={isSending}
        aria-label="Send Email"
      >
        {isSending ? 'Sending...' : 'Send Email'}
      </button>
      {error && (
        <div data-testid="error-message" role="alert" aria-live="assertive">
          {error}
        </div>
      )}
    </div>
  );
};

export default EmailMarketing;

import React, { useState, useEffect, useCallback } from 'react';

interface EmailMarketingProps {
  title?: string;
  content?: string;
  sendEmail: (title: string, content: string) => Promise<boolean>;
}

const EmailMarketing: React.FC<EmailMarketingProps> = ({
  title = 'Email Marketing',
  content = 'Please enter your email content.',
  sendEmail,
}) => {
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
  }, [title, content]);

  const handleSendEmail = useCallback(async () => {
    try {
      setIsSending(true);
      const success = await sendEmail(title, content);
      if (!success) {
        setError('Failed to send email. Please try again later.');
      }
    } catch (err) {
      console.error('Error sending email:', err);
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setIsSending(false);
    }
  }, [sendEmail, title, content]);

  return (
    <div data-testid="email-marketing">
      <h1 data-testid="title">{title}</h1>
      <p data-testid="content">{content}</p>
      <button
        data-testid="send-button"
        onClick={handleSendEmail}
        disabled={isSending}
        aria-label="Send Email"
      >
        {isSending ? 'Sending...' : 'Send Email'}
      </button>
      {error && (
        <div data-testid="error-message" role="alert" aria-live="assertive">
          {error}
        </div>
      )}
    </div>
  );
};

export default EmailMarketing;