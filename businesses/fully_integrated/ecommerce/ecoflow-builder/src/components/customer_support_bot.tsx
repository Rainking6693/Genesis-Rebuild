import React, { FC, useEffect, useRef, useState } from 'react';

interface Props {
  message?: string; // Adding a default value for message
  fallbackMessage?: string; // Adding a fallback message for sanitization errors
}

interface SanitizeReturnType {
  sanitizedMessage: string;
}

const CustomerSupportBot: FC<Props> = ({ message, fallbackMessage }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sanitizedMessage, setSanitizedMessage] = useState(message || '');
  const botRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;

    const sanitizeMessage = async () => {
      setLoading(true);
      try {
        const sanitizedMessage: SanitizeReturnType = await sanitize(message || '');
        if (isMounted) {
          setSanitizedMessage(sanitizedMessage.sanitizedMessage);
        }
      } catch (error) {
        if (isMounted) {
          setError(error.message || fallbackMessage || 'An error occurred while sanitizing the message.');
        }
      }
      setLoading(false);
    };

    if (message) {
      sanitizeMessage();
    }

    return () => {
      isMounted = false;
    };
  }, [message, fallbackMessage]);

  if (loading) {
    return <div className="customer-support-bot loading">Loading...</div>;
  }

  if (error) {
    return <div className="customer-support-bot error">Error: {error}</div>;
  }

  // Check if botRef.current exists before accessing its properties
  if (botRef.current) {
    botRef.current.setAttribute('aria-label', 'Customer Support Bot');
  }

  return (
    <div className="customer-support-bot" ref={botRef}>
      {sanitizedMessage}
    </div>
  );
};

// Add a unique key for each rendered element for performance optimization
CustomerSupportBot.defaultProps = {
  key: Math.random().toString(),
};

export default CustomerSupportBot;

import React, { FC, useEffect, useRef, useState } from 'react';

interface Props {
  message?: string; // Adding a default value for message
  fallbackMessage?: string; // Adding a fallback message for sanitization errors
}

interface SanitizeReturnType {
  sanitizedMessage: string;
}

const CustomerSupportBot: FC<Props> = ({ message, fallbackMessage }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sanitizedMessage, setSanitizedMessage] = useState(message || '');
  const botRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;

    const sanitizeMessage = async () => {
      setLoading(true);
      try {
        const sanitizedMessage: SanitizeReturnType = await sanitize(message || '');
        if (isMounted) {
          setSanitizedMessage(sanitizedMessage.sanitizedMessage);
        }
      } catch (error) {
        if (isMounted) {
          setError(error.message || fallbackMessage || 'An error occurred while sanitizing the message.');
        }
      }
      setLoading(false);
    };

    if (message) {
      sanitizeMessage();
    }

    return () => {
      isMounted = false;
    };
  }, [message, fallbackMessage]);

  if (loading) {
    return <div className="customer-support-bot loading">Loading...</div>;
  }

  if (error) {
    return <div className="customer-support-bot error">Error: {error}</div>;
  }

  // Check if botRef.current exists before accessing its properties
  if (botRef.current) {
    botRef.current.setAttribute('aria-label', 'Customer Support Bot');
  }

  return (
    <div className="customer-support-bot" ref={botRef}>
      {sanitizedMessage}
    </div>
  );
};

// Add a unique key for each rendered element for performance optimization
CustomerSupportBot.defaultProps = {
  key: Math.random().toString(),
};

export default CustomerSupportBot;