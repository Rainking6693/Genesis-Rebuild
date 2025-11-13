import React, { FC, Key, ReactNode } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  message: string;
  className?: string;
  ariaLabel?: string;
  // Add error handling for message
  errorMessage?: string;
}

const sanitizeHtml = (html: string) => {
  try {
    return DOMPurify.sanitize(html);
  } catch (error) {
    console.error('Error sanitizing HTML:', error);
    return '';
  }
};

const MyComponent: FC<Props> = ({ message, className, ariaLabel, errorMessage }) => {
  const sanitizedMessage = sanitizeHtml(message);

  // Check if message is sanitized and set a default message if not
  const displayedMessage = sanitizedMessage || errorMessage || 'No message provided';

  return (
    <div data-testid="my-component" className={className} aria-label={ariaLabel}>
      {displayedMessage}
    </div>
  );
};

export default MyComponent;

import React, { FC, Key, ReactNode } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  message: string;
  className?: string;
  ariaLabel?: string;
  // Add error handling for message
  errorMessage?: string;
}

const sanitizeHtml = (html: string) => {
  try {
    return DOMPurify.sanitize(html);
  } catch (error) {
    console.error('Error sanitizing HTML:', error);
    return '';
  }
};

const MyComponent: FC<Props> = ({ message, className, ariaLabel, errorMessage }) => {
  const sanitizedMessage = sanitizeHtml(message);

  // Check if message is sanitized and set a default message if not
  const displayedMessage = sanitizedMessage || errorMessage || 'No message provided';

  return (
    <div data-testid="my-component" className={className} aria-label={ariaLabel}>
      {displayedMessage}
    </div>
  );
};

export default MyComponent;