import React, { useEffect, useState } from 'react';
import { sanitizeInput } from './security';

interface Props {
  message: string;
}

const UsageAnalytics: React.FC<Props> = ({ message }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState(message);
  const [error, setError] = useState(false);

  useEffect(() => {
    const sanitizedMessage = sanitizeInput(message);
    if (!sanitizedMessage) {
      setError(true);
      return;
    }
    setSanitizedMessage(sanitizedMessage);
    setError(false);
  }, [message]);

  // Handle edge cases where the sanitized message is empty
  if (error) {
    return <div>An error occurred while sanitizing the message.</div>;
  }

  // Add ARIA attributes for accessibility
  return (
    <div>
      <p>{sanitizedMessage}</p>
      <p role="status" aria-live="assertive">
        {error ? 'An error occurred while loading usage analytics message.' : 'Usage analytics message loaded successfully.'}
      </p>
    </div>
  );
};

export default UsageAnalytics;

import React, { useEffect, useState } from 'react';
import { sanitizeInput } from './security';

interface Props {
  message: string;
}

const UsageAnalytics: React.FC<Props> = ({ message }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState(message);
  const [error, setError] = useState(false);

  useEffect(() => {
    const sanitizedMessage = sanitizeInput(message);
    if (!sanitizedMessage) {
      setError(true);
      return;
    }
    setSanitizedMessage(sanitizedMessage);
    setError(false);
  }, [message]);

  // Handle edge cases where the sanitized message is empty
  if (error) {
    return <div>An error occurred while sanitizing the message.</div>;
  }

  // Add ARIA attributes for accessibility
  return (
    <div>
      <p>{sanitizedMessage}</p>
      <p role="status" aria-live="assertive">
        {error ? 'An error occurred while loading usage analytics message.' : 'Usage analytics message loaded successfully.'}
      </p>
    </div>
  );
};

export default UsageAnalytics;