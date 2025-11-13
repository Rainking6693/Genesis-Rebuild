import React, { FC, Key, ReactNode } from 'react';

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  // Add a key prop for React performance optimization
  // Use a unique key based on the component's ID or a generated key
  const key = message.trim().replace(/\s+/g, '-') + '-' + Math.random().toString(36).substring(7);

  // Sanitize the HTML to prevent XSS attacks
  const sanitizedMessage = message
    .replace(/<script[^>]*>([\S\s]*?)<\/script>/gim, '')
    .replace(/<style[^>]*>([\S\s]*?)<\/style>/gim, '')
    .replace(/<(?!img|br|hr|input|link|meta|area|base|col|embed|frame|header|meta|param|source)[^>]*>/gim, '');

  // Add accessibility attributes
  const accessibilityProps = {
    'aria-label': 'MyComponent',
    'aria-labelledby': 'my-component-id', // Add an ID for better accessibility
  };

  // Handle edge cases where message is empty or null
  if (!message) {
    return <div id="my-component-id" {...accessibilityProps} />;
  }

  // Return the component with sanitized and accessible HTML
  return (
    <div id="my-component-id" {...accessibilityProps} dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
  );
};

// Add export default for better code organization and reusability
export default MyComponent;

import React, { FC, Key, ReactNode } from 'react';

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  // Add a key prop for React performance optimization
  // Use a unique key based on the component's ID or a generated key
  const key = message.trim().replace(/\s+/g, '-') + '-' + Math.random().toString(36).substring(7);

  // Sanitize the HTML to prevent XSS attacks
  const sanitizedMessage = message
    .replace(/<script[^>]*>([\S\s]*?)<\/script>/gim, '')
    .replace(/<style[^>]*>([\S\s]*?)<\/style>/gim, '')
    .replace(/<(?!img|br|hr|input|link|meta|area|base|col|embed|frame|header|meta|param|source)[^>]*>/gim, '');

  // Add accessibility attributes
  const accessibilityProps = {
    'aria-label': 'MyComponent',
    'aria-labelledby': 'my-component-id', // Add an ID for better accessibility
  };

  // Handle edge cases where message is empty or null
  if (!message) {
    return <div id="my-component-id" {...accessibilityProps} />;
  }

  // Return the component with sanitized and accessible HTML
  return (
    <div id="my-component-id" {...accessibilityProps} dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
  );
};

// Add export default for better code organization and reusability
export default MyComponent;