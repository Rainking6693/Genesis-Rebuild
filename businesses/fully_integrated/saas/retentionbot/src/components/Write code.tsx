import React, { FC, Key, ReactNode } from 'react';

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  // Add a key prop for React performance optimization
  // Use a unique key based on the component's ID or a generated UUID
  const key = message.trim() || (Math.random() + Date.now()).toString(36);

  // Sanitize the input to prevent XSS attacks
  const sanitizedMessage = message
    .replace(/[&<>"']/g, (match) => {
      switch (match) {
        case '<':
          return '&lt;';
        case '>':
          return '&gt;';
        case '&':
          return '&amp;';
        case '"':
          return '&quot;';
        case "'":
          return '&#039;';
        default:
          return match;
      }
    })
    .trim();

  // Add aria-label for accessibility
  // Provide a meaningful label for screen readers
  const ariaLabel = sanitizedMessage ? `Message: ${sanitizedMessage}` : 'Empty dynamic message';

  // Handle edge cases where the message is empty or null
  let content: ReactNode;
  if (sanitizedMessage) {
    content = <div key={key} dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />;
  } else {
    content = <div key={key} aria-hidden={true}>No message provided</div>;
  }

  return (
    <div>
      {content}
      <div aria-label={ariaLabel} /> {/* Hidden focusable element for accessibility */}
    </div>
  );
};

// Add export default for proper module export
export default MyComponent;

import React, { FC, Key, ReactNode } from 'react';

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  // Add a key prop for React performance optimization
  // Use a unique key based on the component's ID or a generated UUID
  const key = message.trim() || (Math.random() + Date.now()).toString(36);

  // Sanitize the input to prevent XSS attacks
  const sanitizedMessage = message
    .replace(/[&<>"']/g, (match) => {
      switch (match) {
        case '<':
          return '&lt;';
        case '>':
          return '&gt;';
        case '&':
          return '&amp;';
        case '"':
          return '&quot;';
        case "'":
          return '&#039;';
        default:
          return match;
      }
    })
    .trim();

  // Add aria-label for accessibility
  // Provide a meaningful label for screen readers
  const ariaLabel = sanitizedMessage ? `Message: ${sanitizedMessage}` : 'Empty dynamic message';

  // Handle edge cases where the message is empty or null
  let content: ReactNode;
  if (sanitizedMessage) {
    content = <div key={key} dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />;
  } else {
    content = <div key={key} aria-hidden={true}>No message provided</div>;
  }

  return (
    <div>
      {content}
      <div aria-label={ariaLabel} /> {/* Hidden focusable element for accessibility */}
    </div>
  );
};

// Add export default for proper module export
export default MyComponent;