import React, { useState, useEffect, useCallback } from 'react';

interface EmailMarketingProps {
  title: string;
  content: string;
  sendEmail: (title: string, content: string) => Promise<boolean>;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

const EmailMarketing: React.FC<EmailMarketingProps> = ({
  title,
  content,
  sendEmail,
  onSuccess,
  onError,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (error) {
      setError(null);
    }
  }, [title, content, error]);

  const handleSendEmail = useCallback(async () => {
    try {
      setIsLoading(true);
      const success = await sendEmail(title, content);
      setIsLoading(false);

      if (success) {
        onSuccess?.();
      } else {
        setError(new Error('Failed to send email'));
      }
    } catch (err) {
      setIsLoading(false);
      const error = err instanceof Error ? err : new Error('An unknown error occurred');
      setError(error);
      onError?.(error);
    }
  }, [sendEmail, title, content, onSuccess, onError]);

  return (
    <div className="email-marketing">
      <h1 className="email-marketing__title">{title}</h1>
      <p className="email-marketing__content">{content}</p>
      <button
        className="email-marketing__send-button"
        onClick={handleSendEmail}
        disabled={isLoading}
        aria-label="Send Email"
        aria-live="polite"
      >
        {isLoading ? 'Sending...' : 'Send Email'}
      </button>
      {error && (
        <div className="email-marketing__error" role="alert">
          {error.message}
        </div>
      )}
    </div>
  );
};

export default EmailMarketing;

import React, { useState, useEffect, useCallback } from 'react';

interface EmailMarketingProps {
  title: string;
  content: string;
  sendEmail: (title: string, content: string) => Promise<boolean>;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

const EmailMarketing: React.FC<EmailMarketingProps> = ({
  title,
  content,
  sendEmail,
  onSuccess,
  onError,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (error) {
      setError(null);
    }
  }, [title, content, error]);

  const handleSendEmail = useCallback(async () => {
    try {
      setIsLoading(true);
      const success = await sendEmail(title, content);
      setIsLoading(false);

      if (success) {
        onSuccess?.();
      } else {
        setError(new Error('Failed to send email'));
      }
    } catch (err) {
      setIsLoading(false);
      const error = err instanceof Error ? err : new Error('An unknown error occurred');
      setError(error);
      onError?.(error);
    }
  }, [sendEmail, title, content, onSuccess, onError]);

  return (
    <div className="email-marketing">
      <h1 className="email-marketing__title">{title}</h1>
      <p className="email-marketing__content">{content}</p>
      <button
        className="email-marketing__send-button"
        onClick={handleSendEmail}
        disabled={isLoading}
        aria-label="Send Email"
        aria-live="polite"
      >
        {isLoading ? 'Sending...' : 'Send Email'}
      </button>
      {error && (
        <div className="email-marketing__error" role="alert">
          {error.message}
        </div>
      )}
    </div>
  );
};

export default EmailMarketing;