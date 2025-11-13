import React, { FC, Key, ReactNode } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  message: string;
}

const sanitizeContent = (content: string): ReactNode => {
  try {
    const sanitizedContent = DOMPurify.sanitize(content);
    return sanitizedContent;
  } catch (error) {
    console.error('Error sanitizing content:', error);
    return <div data-testid="sanitization-error">Error sanitizing content</div>;
  }
};

// AI-powered mental wellness blog system component
// Renders a div with sanitized user-generated content
const MyComponent: FC<Props> = ({ message }) => {
  const sanitizedMessage = sanitizeContent(message);

  // Adding aria-label for accessibility
  const ariaLabel = `Blog post by ${message.split(' ')[0]}`;

  return (
    <div key={message} data-testid="blog-post">
      <div aria-label={ariaLabel}>{sanitizedMessage}</div>
    </div>
  );
};

export default MyComponent;

import React, { FC, Key, ReactNode } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  message: string;
}

const sanitizeContent = (content: string): ReactNode => {
  try {
    const sanitizedContent = DOMPurify.sanitize(content);
    return sanitizedContent;
  } catch (error) {
    console.error('Error sanitizing content:', error);
    return <div data-testid="sanitization-error">Error sanitizing content</div>;
  }
};

// AI-powered mental wellness blog system component
// Renders a div with sanitized user-generated content
const MyComponent: FC<Props> = ({ message }) => {
  const sanitizedMessage = sanitizeContent(message);

  // Adding aria-label for accessibility
  const ariaLabel = `Blog post by ${message.split(' ')[0]}`;

  return (
    <div key={message} data-testid="blog-post">
      <div aria-label={ariaLabel}>{sanitizedMessage}</div>
    </div>
  );
};

export default MyComponent;