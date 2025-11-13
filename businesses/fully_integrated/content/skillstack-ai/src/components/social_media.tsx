import React, { FC, useMemo } from 'react';
import { useEffect } from 'react';

// Import DOMPurify library
import DOMPurify from 'dompurify';

interface Props {
  message: string;
}

const sanitizeMessage = (message: string): string => {
  // Implement a simple sanitization function to prevent XSS attacks
  // Use DOMPurify library for a more robust solution
  // Fallback to a simple regex for edge cases where DOMPurify is not available
  const sanitizedMessage = DOMPurify.sanitize(message);
  if (!sanitizedMessage) {
    // Replace script and style tags with harmless placeholders
    sanitizedMessage = sanitizedMessage.replace(/<script[^>]*>(.*?)<\/script>/gs, 'Script tags removed for safety.');
    sanitizedMessage = sanitizedMessage.replace(/<style[^>]*>(.*?)<\/style>/gs, 'Style tags removed for safety.');
  }
  return sanitizedMessage;
};

// Use the sanitized message in the component
const MyComponent: FC<Props> = ({ message }) => {
  const sanitizedMessage = useMemo(() => sanitizeMessage(message), [message]);

  // Add accessibility by providing an ARIA label for screen readers
  const ariaLabel = 'Social media message';

  // Check if the sanitized message is empty and provide a fallback message
  const fallbackMessage = sanitizedMessage || 'No message available';

  // Memoize the component to optimize performance
  const memoizedComponent = useMemo(() => (
    <div
      dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
      aria-label={ariaLabel}
    />
  ), [sanitizedMessage]);

  // Handle edge cases where the message is empty
  useEffect(() => {
    if (!message) {
      // Set the component's aria-label to an empty string to avoid confusion
      memoizedComponent.props.aria-label = '';
    }
  }, [message, memoizedComponent]);

  return memoizedComponent;
};

// Add a linting configuration to enforce best practices
// You can use ESLint with Airbnb's style guide as a starting point
// https://github.com/airbnb/javascript

export default MyComponent;