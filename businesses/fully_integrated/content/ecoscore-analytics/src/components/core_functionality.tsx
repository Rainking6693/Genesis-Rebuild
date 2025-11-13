import React, { FC, PropsWithChildren, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  message?: string;
}

const MyComponent: FC<Props> = ({ children, message }) => {
  // Validate the message and set it as children if it's provided
  const validatedMessage = message ? validateMessage(message) : children;

  // Use the validated message or children in the component
  return (
    <div>
      {validatedMessage ? (
        <div
          // Use dangerouslySetInnerHTML only for user-generated content
          // and sanitize the input to prevent XSS attacks
          // Here, I'm using DOMPurify for sanitizing the HTML
          // You can install it using npm: npm install dompurify
          // and import it at the top of the file: import DOMPurify from 'dompurify';
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(validatedMessage) }}
        />
      ) : null}
    </div>
  );
};

// Add error handling and validation for input message
const validateMessage = (message: string) => {
  if (!message) {
    throw new Error('Message is required');
  }

  // Check if the message contains unsafe HTML
  if (/<script|<style|<iframe|<img/.test(message)) {
    throw new Error('Message contains unsafe HTML');
  }

  return message;
};

// Function to sanitize HTML using DOMPurify
const sanitizeHtml = (html: string) => {
  const sanitized = DOMPurify.sanitize(html);
  return sanitized.replace(/<[^>]+>/g, ''); // Remove any remaining empty tags
};

export default MyComponent;

import React, { FC, PropsWithChildren, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  message?: string;
}

const MyComponent: FC<Props> = ({ children, message }) => {
  // Validate the message and set it as children if it's provided
  const validatedMessage = message ? validateMessage(message) : children;

  // Use the validated message or children in the component
  return (
    <div>
      {validatedMessage ? (
        <div
          // Use dangerouslySetInnerHTML only for user-generated content
          // and sanitize the input to prevent XSS attacks
          // Here, I'm using DOMPurify for sanitizing the HTML
          // You can install it using npm: npm install dompurify
          // and import it at the top of the file: import DOMPurify from 'dompurify';
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(validatedMessage) }}
        />
      ) : null}
    </div>
  );
};

// Add error handling and validation for input message
const validateMessage = (message: string) => {
  if (!message) {
    throw new Error('Message is required');
  }

  // Check if the message contains unsafe HTML
  if (/<script|<style|<iframe|<img/.test(message)) {
    throw new Error('Message contains unsafe HTML');
  }

  return message;
};

// Function to sanitize HTML using DOMPurify
const sanitizeHtml = (html: string) => {
  const sanitized = DOMPurify.sanitize(html);
  return sanitized.replace(/<[^>]+>/g, ''); // Remove any remaining empty tags
};

export default MyComponent;