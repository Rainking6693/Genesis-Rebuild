import React, { FC, ReactNode, useCallback } from 'react';

interface Props {
  message: string;
}

const MAX_MESSAGE_LENGTH = 200; // Set a reasonable maximum message length

const validateMessage = useCallback((message: string) => {
  // Implement validation logic here, e.g., check for XSS attacks
  // If validation fails, return false and log the error for debugging
  try {
    // Your validation logic here

    // Check for XSS attacks using a library like DOMPurify
    // https://github.com/cure53/DOMPurify
    // If DOMPurify is not available, use a simple regex to check for script tags
    if (
      !message.length ||
      message.length > MAX_MESSAGE_LENGTH ||
      /<script[^>]*>([^<]*)<\/script>/i.test(message)
    ) {
      console.error('XSS attack or invalid input detected:', message);
      return false;
    }

    return true;
  } catch (error) {
    console.error('XSS attack or invalid input detected:', error);
    return false;
  }
}, []);

const MyComponent: FC<Props> = ({ message }) => {
  const validatedMessage = validateMessage(message) ? message : 'Invalid input';

  // Use a more semantic HTML element for the container
  return (
    <article
      dangerouslySetInnerHTML={{ __html: validatedMessage }}
      aria-label={validatedMessage} // Adding aria-label for accessibility
    />
  );
};

MyComponent.validateMessage = validateMessage;

export default MyComponent;

import React, { FC, ReactNode, useCallback } from 'react';

interface Props {
  message: string;
}

const MAX_MESSAGE_LENGTH = 200; // Set a reasonable maximum message length

const validateMessage = useCallback((message: string) => {
  // Implement validation logic here, e.g., check for XSS attacks
  // If validation fails, return false and log the error for debugging
  try {
    // Your validation logic here

    // Check for XSS attacks using a library like DOMPurify
    // https://github.com/cure53/DOMPurify
    // If DOMPurify is not available, use a simple regex to check for script tags
    if (
      !message.length ||
      message.length > MAX_MESSAGE_LENGTH ||
      /<script[^>]*>([^<]*)<\/script>/i.test(message)
    ) {
      console.error('XSS attack or invalid input detected:', message);
      return false;
    }

    return true;
  } catch (error) {
    console.error('XSS attack or invalid input detected:', error);
    return false;
  }
}, []);

const MyComponent: FC<Props> = ({ message }) => {
  const validatedMessage = validateMessage(message) ? message : 'Invalid input';

  // Use a more semantic HTML element for the container
  return (
    <article
      dangerouslySetInnerHTML={{ __html: validatedMessage }}
      aria-label={validatedMessage} // Adding aria-label for accessibility
    />
  );
};

MyComponent.validateMessage = validateMessage;

export default MyComponent;