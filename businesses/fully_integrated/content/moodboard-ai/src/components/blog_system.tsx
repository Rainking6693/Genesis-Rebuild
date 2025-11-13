// MyComponent.tsx
import React, { PropsWithChildren } from 'react';
import { sanitize } from 'dompurify'; // Import a library for XSS sanitization
import React from 'react'; // Import React at the top level to avoid potential issues

// Use PascalCase for component names for consistency
const MyComponent: React.FC<Props> = ({ message }) => {
  // Use JSX Fragment (<></>) instead of self-closing div for better performance and readability
  // Sanitize user-generated content (message) to prevent XSS attacks
  const sanitizedMessage = sanitize(message);

  // Edge case: Handle null or empty message
  if (!sanitizedMessage) {
    return <p>No message provided.</p>;
  }

  // Accessibility: Add aria-label for better screen reader support
  return (
    <>
      <div aria-label="User-generated message">{sanitizedMessage}</div>
    </>
  );
};

// Maintainability: Move interface to a separate file (e.g., MyComponent.interface.ts)

// MyComponent.interface.ts
import { PropsWithChildren } from 'react';

interface Props extends PropsWithChildren<{ message?: string }> {}

// Add optional message property to handle edge cases where no message is provided

// MyComponent.tsx
import React, { PropsWithChildren } from 'react';
import { sanitize } from 'dompurify'; // Import a library for XSS sanitization
import React from 'react'; // Import React at the top level to avoid potential issues

// Use PascalCase for component names for consistency
const MyComponent: React.FC<Props> = ({ message }) => {
  // Use JSX Fragment (<></>) instead of self-closing div for better performance and readability
  // Sanitize user-generated content (message) to prevent XSS attacks
  const sanitizedMessage = sanitize(message);

  // Edge case: Handle null or empty message
  if (!sanitizedMessage) {
    return <p>No message provided.</p>;
  }

  // Accessibility: Add aria-label for better screen reader support
  return (
    <>
      <div aria-label="User-generated message">{sanitizedMessage}</div>
    </>
  );
};

// Maintainability: Move interface to a separate file (e.g., MyComponent.interface.ts)

// MyComponent.interface.ts
import { PropsWithChildren } from 'react';

interface Props extends PropsWithChildren<{ message?: string }> {}

// Add optional message property to handle edge cases where no message is provided