import React, { ReactNode, useState } from 'react';
import { sanitizeUserInput } from '../../security/input_sanitization';

type SanitizedMessage = string | null;

const useSanitizedMessage = (message: string): SanitizedMessage => {
  try {
    const sanitizedMessage = sanitizeUserInput(message);
    return sanitizedMessage || null;
  } catch (error) {
    console.error('Error sanitizing message:', error);
    return null;
  }
};

interface Props {
  message: string;
}

const FunctionalComponent: React.FC<Props> = ({ message }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState<SanitizedMessage | null>(null);

  React.useEffect(() => {
    const sanitize = async () => {
      const sanitizedMessage = await useSanitizedMessage(message);
      setSanitizedMessage(sanitizedMessage);
    };
    sanitize();
  }, [message]);

  if (!sanitizedMessage) {
    return <div>Error: Unable to sanitize message</div>;
  }

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: sanitizedMessage,
      }}
      aria-label={`Message: ${message}`} // Adding aria-label for accessibility
    />
  );
};

export default FunctionalComponent;

import React, { ReactNode, useState } from 'react';
import { sanitizeUserInput } from '../../security/input_sanitization';

type SanitizedMessage = string | null;

const useSanitizedMessage = (message: string): SanitizedMessage => {
  try {
    const sanitizedMessage = sanitizeUserInput(message);
    return sanitizedMessage || null;
  } catch (error) {
    console.error('Error sanitizing message:', error);
    return null;
  }
};

interface Props {
  message: string;
}

const FunctionalComponent: React.FC<Props> = ({ message }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState<SanitizedMessage | null>(null);

  React.useEffect(() => {
    const sanitize = async () => {
      const sanitizedMessage = await useSanitizedMessage(message);
      setSanitizedMessage(sanitizedMessage);
    };
    sanitize();
  }, [message]);

  if (!sanitizedMessage) {
    return <div>Error: Unable to sanitize message</div>;
  }

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: sanitizedMessage,
      }}
      aria-label={`Message: ${message}`} // Adding aria-label for accessibility
    />
  );
};

export default FunctionalComponent;