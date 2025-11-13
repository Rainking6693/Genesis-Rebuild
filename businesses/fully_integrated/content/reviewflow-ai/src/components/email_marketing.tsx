import React, { useMemo, useState } from 'react';
import { sanitizeUserInput } from '../../security/input_sanitization';

interface Props {
  message: string;
}

const MyComponent: React.FC<Props> = ({ message }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState<string | null>(null);

  const sanitized = useMemo(() => {
    try {
      return sanitizeUserInput(message);
    } catch (error) {
      console.error('Error sanitizing user input:', error);
      return null;
    }
  }, [message]);

  useEffect(() => {
    if (sanitized) {
      setSanitizedMessage(sanitized);
    }
  }, [sanitized]);

  if (!sanitizedMessage) {
    return <div>Error: Unable to sanitize user input.</div>;
  }

  return (
    <div
      dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
      aria-label={`HTML content: ${sanitizedMessage}`}
    />
  );
};

export default MyComponent;

import React, { useMemo, useState } from 'react';
import { sanitizeUserInput } from '../../security/input_sanitization';

interface Props {
  message: string;
}

const MyComponent: React.FC<Props> = ({ message }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState<string | null>(null);

  const sanitized = useMemo(() => {
    try {
      return sanitizeUserInput(message);
    } catch (error) {
      console.error('Error sanitizing user input:', error);
      return null;
    }
  }, [message]);

  useEffect(() => {
    if (sanitized) {
      setSanitizedMessage(sanitized);
    }
  }, [sanitized]);

  if (!sanitizedMessage) {
    return <div>Error: Unable to sanitize user input.</div>;
  }

  return (
    <div
      dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
      aria-label={`HTML content: ${sanitizedMessage}`}
    />
  );
};

export default MyComponent;