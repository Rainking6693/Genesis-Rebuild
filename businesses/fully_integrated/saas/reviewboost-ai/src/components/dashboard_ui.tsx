import React, { FC, ReactNode, RefObject, useRef } from 'react';

interface Props {
  message: string;
  dataTestid?: string;
}

const sanitizeMessage = (message: string): string => {
  // Implement a simple sanitization function to prevent XSS attacks
  // For production use, consider using a library like DOMPurify
  const sanitizedMessage = message
    .replace(/<script>/g, '')
    .replace(/<style>/g, '')
    .replace(/<iframe>/g, '')
    .replace(/<[^>]+>/g, ''); // Remove all HTML tags

  if (!sanitizedMessage) {
    throw new Error('Invalid or empty message');
  }

  return sanitizedMessage;
};

const MyComponent: FC<Props> = ({ message, dataTestid }) => {
  const messageRef: RefObject<HTMLSpanElement> = useRef(null);

  const sanitizedMessage = sanitizeMessage(message);

  if (!sanitizedMessage) {
    return <div data-testid={dataTestid} aria-label="Invalid or empty message" role="alert"></div>;
  }

  return (
    <div data-testid={dataTestid} role="alert">
      <span ref={messageRef} aria-label={sanitizedMessage}>
        {sanitizedMessage}
      </span>
    </div>
  );
};

MyComponent.defaultProps = {
  message: '',
  dataTestid: 'my-component',
};

MyComponent.sanitizeMessage = sanitizeMessage;

export default MyComponent;

import React, { FC, ReactNode, RefObject, useRef } from 'react';

interface Props {
  message: string;
  dataTestid?: string;
}

const sanitizeMessage = (message: string): string => {
  // Implement a simple sanitization function to prevent XSS attacks
  // For production use, consider using a library like DOMPurify
  const sanitizedMessage = message
    .replace(/<script>/g, '')
    .replace(/<style>/g, '')
    .replace(/<iframe>/g, '')
    .replace(/<[^>]+>/g, ''); // Remove all HTML tags

  if (!sanitizedMessage) {
    throw new Error('Invalid or empty message');
  }

  return sanitizedMessage;
};

const MyComponent: FC<Props> = ({ message, dataTestid }) => {
  const messageRef: RefObject<HTMLSpanElement> = useRef(null);

  const sanitizedMessage = sanitizeMessage(message);

  if (!sanitizedMessage) {
    return <div data-testid={dataTestid} aria-label="Invalid or empty message" role="alert"></div>;
  }

  return (
    <div data-testid={dataTestid} role="alert">
      <span ref={messageRef} aria-label={sanitizedMessage}>
        {sanitizedMessage}
      </span>
    </div>
  );
};

MyComponent.defaultProps = {
  message: '',
  dataTestid: 'my-component',
};

MyComponent.sanitizeMessage = sanitizeMessage;

export default MyComponent;