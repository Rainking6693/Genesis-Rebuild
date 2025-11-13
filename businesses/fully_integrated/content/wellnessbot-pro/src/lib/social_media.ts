import React, { FC, useMemo } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  // Sanitize user-generated messages to prevent potential threats
  const sanitizedMessage = useMemo(() => sanitizeMessage(message), [message]);

  // Ensure the sanitized message is not empty before rendering
  if (!sanitizedMessage) return null;

  // Use a safe HTML parser to prevent XSS attacks
  // https://github.com/facebook/react/issues/10228
  const safeHtml = DOMParser.parseFromString(sanitizedMessage, 'text/html').body.innerHTML;

  return (
    <div
      // Use aria-label for accessibility
      aria-label="Social media message"
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  );
};

const sanitizeMessage = (message: string) => {
  // Implement a function to sanitize user-generated messages, e.g., remove HTML tags, script tags, and other potential threats
  // You can use libraries like DOMPurify (https://github.com/cure53/DOMPurify) for this purpose
  const sanitized = new DOMPurify().sanitize(message);
  return sanitized;
};

// Optimize performance by memoizing the component if message prop is not changing
MyComponent.whyDidYouRender = true; // Enable Why Did You Render for debugging purposes

// Add type checks for props and sanitizeMessage function
interface Props {
  message: string;
}

interface MyComponent {
  (props: Props): React.ReactElement;
  sanitizeMessage: (message: string) => string;
}

export const MyComponent: MyComponent = ({ message }: Props) => {
  // ...
};

import React, { FC, useMemo } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  // Sanitize user-generated messages to prevent potential threats
  const sanitizedMessage = useMemo(() => sanitizeMessage(message), [message]);

  // Ensure the sanitized message is not empty before rendering
  if (!sanitizedMessage) return null;

  // Use a safe HTML parser to prevent XSS attacks
  // https://github.com/facebook/react/issues/10228
  const safeHtml = DOMParser.parseFromString(sanitizedMessage, 'text/html').body.innerHTML;

  return (
    <div
      // Use aria-label for accessibility
      aria-label="Social media message"
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  );
};

const sanitizeMessage = (message: string) => {
  // Implement a function to sanitize user-generated messages, e.g., remove HTML tags, script tags, and other potential threats
  // You can use libraries like DOMPurify (https://github.com/cure53/DOMPurify) for this purpose
  const sanitized = new DOMPurify().sanitize(message);
  return sanitized;
};

// Optimize performance by memoizing the component if message prop is not changing
MyComponent.whyDidYouRender = true; // Enable Why Did You Render for debugging purposes

// Add type checks for props and sanitizeMessage function
interface Props {
  message: string;
}

interface MyComponent {
  (props: Props): React.ReactElement;
  sanitizeMessage: (message: string) => string;
}

export const MyComponent: MyComponent = ({ message }: Props) => {
  // ...
};