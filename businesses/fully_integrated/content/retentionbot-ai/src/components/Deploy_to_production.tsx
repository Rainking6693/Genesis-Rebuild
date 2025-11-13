import React, { FC, ReactNode, PropsWithChildren } from 'react';
import DOMPurify from 'dompurify';

interface Props extends PropsWithChildren<{ message?: string }> {
  'aria-label': string;
}

const MyComponent: FC<Props> = ({ children, message, 'aria-label': ariaLabel }) => {
  const sanitizedMessage = message ? safeHtml(message) : children;

  return (
    <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} aria-label={ariaLabel} />
  );
};

const safeHtml = (raw: string): ReactNode => {
  const DOMParser = new DOMParser();
  const sanitizedDoc = DOMParser.parseFromString(raw, 'text/html');

  // Sanitize the HTML using DOMPurify
  sanitizedDoc.body.innerHTML = DOMPurify.sanitize(sanitizedDoc.body.innerHTML);

  return sanitizedDoc.body.children;
};

// Add error handling and logging for potential issues with the message content
MyComponent.error = (error: Error) => {
  console.error('Error in MyComponent:', error);
};

// Add accessibility support by providing an aria-label for screen readers
MyComponent.defaultProps = {
  'aria-label': 'MyComponent',
};

export default MyComponent;

import React, { FC, ReactNode, PropsWithChildren } from 'react';
import DOMPurify from 'dompurify';

interface Props extends PropsWithChildren<{ message?: string }> {
  'aria-label': string;
}

const MyComponent: FC<Props> = ({ children, message, 'aria-label': ariaLabel }) => {
  const sanitizedMessage = message ? safeHtml(message) : children;

  return (
    <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} aria-label={ariaLabel} />
  );
};

const safeHtml = (raw: string): ReactNode => {
  const DOMParser = new DOMParser();
  const sanitizedDoc = DOMParser.parseFromString(raw, 'text/html');

  // Sanitize the HTML using DOMPurify
  sanitizedDoc.body.innerHTML = DOMPurify.sanitize(sanitizedDoc.body.innerHTML);

  return sanitizedDoc.body.children;
};

// Add error handling and logging for potential issues with the message content
MyComponent.error = (error: Error) => {
  console.error('Error in MyComponent:', error);
};

// Add accessibility support by providing an aria-label for screen readers
MyComponent.defaultProps = {
  'aria-label': 'MyComponent',
};

export default MyComponent;