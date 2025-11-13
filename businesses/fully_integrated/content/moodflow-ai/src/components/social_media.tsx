import React, { FC, useEffect, useMemo } from 'react';
import { errorLogger } from '../../utils/errorLogger';
import sanitizeHtml from 'dompurify';

type Error = {
  message: string;
  stack: string;
};

interface Props {
  message: string;
  error?: Error;
}

const MyComponent: FC<Props> = ({ message, error }) => {
  const sanitizedMessage = useMemo(() => {
    try {
      return sanitizeHtml(message || '');
    } catch (error) {
      errorLogger(error.message, error.stack, message || '');
      return '';
    }
  }, [message]);

  if (!sanitizedMessage) {
    return <div>Error: Unable to display message</div>;
  }

  return (
    <div
      dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
      aria-label={`Social media message: ${message || ''}`} // Adding aria-label for accessibility
    />
  );
};

export default MyComponent;

// Improved errorLogger function
const errorLogger = (message: string, stack: string, additionalInfo: string) => {
  console.error(`Error: ${message}`);
  console.error(`Stack trace:\n${stack}`);
  console.error(`Additional information:\n${additionalInfo}`);
};

import React, { FC, useEffect, useMemo } from 'react';
import { errorLogger } from '../../utils/errorLogger';
import sanitizeHtml from 'dompurify';

type Error = {
  message: string;
  stack: string;
};

interface Props {
  message: string;
  error?: Error;
}

const MyComponent: FC<Props> = ({ message, error }) => {
  const sanitizedMessage = useMemo(() => {
    try {
      return sanitizeHtml(message || '');
    } catch (error) {
      errorLogger(error.message, error.stack, message || '');
      return '';
    }
  }, [message]);

  if (!sanitizedMessage) {
    return <div>Error: Unable to display message</div>;
  }

  return (
    <div
      dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
      aria-label={`Social media message: ${message || ''}`} // Adding aria-label for accessibility
    />
  );
};

export default MyComponent;

// Improved errorLogger function
const errorLogger = (message: string, stack: string, additionalInfo: string) => {
  console.error(`Error: ${message}`);
  console.error(`Stack trace:\n${stack}`);
  console.error(`Additional information:\n${additionalInfo}`);
};