import React, { FC, ReactNode } from 'react';
import DOMPurify from 'dompurify';

type Props = {
  message?: string;
};

const sanitizeMessage = (message: string): string => {
  // Implement a function to sanitize user-generated messages
  // Use DOMPurify to remove any potentially harmful HTML tags
  const sanitized = DOMPurify.sanitize(message);

  // Handle edge cases where sanitization fails (e.g., invalid HTML)
  if (!sanitized || typeof sanitized !== 'string') {
    console.error('Failed to sanitize message:', message);
    return '';
  }

  return sanitized;
};

const MyComponent: FC<Props> = ({ message }: Props) => {
  const sanitizedMessage = sanitizeMessage(message || '');

  // Add accessibility by providing an ARIA-label for screen readers
  const ariaLabel = sanitizedMessage.length > 0 ? sanitizedMessage : 'Empty message';

  return (
    <div
      dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
      aria-label={ariaLabel}
    />
  );
};

export default MyComponent;

import React, { FC, ReactNode } from 'react';
import DOMPurify from 'dompurify';

type Props = {
  message?: string;
};

const sanitizeMessage = (message: string): string => {
  // Implement a function to sanitize user-generated messages
  // Use DOMPurify to remove any potentially harmful HTML tags
  const sanitized = DOMPurify.sanitize(message);

  // Handle edge cases where sanitization fails (e.g., invalid HTML)
  if (!sanitized || typeof sanitized !== 'string') {
    console.error('Failed to sanitize message:', message);
    return '';
  }

  return sanitized;
};

const MyComponent: FC<Props> = ({ message }: Props) => {
  const sanitizedMessage = sanitizeMessage(message || '');

  // Add accessibility by providing an ARIA-label for screen readers
  const ariaLabel = sanitizedMessage.length > 0 ? sanitizedMessage : 'Empty message';

  return (
    <div
      dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
      aria-label={ariaLabel}
    />
  );
};

export default MyComponent;