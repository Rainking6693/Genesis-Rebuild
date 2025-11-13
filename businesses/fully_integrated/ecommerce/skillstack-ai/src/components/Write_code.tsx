import React, { FC, Key, ReactNode } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  message: string;
  isTrusted?: boolean; // Add an optional isTrusted prop for safer usage of dangerouslySetInnerHTML
}

const MyComponent: FC<Props> = ({ message, isTrusted = false }) => {
  // Add a key prop for React performance optimization
  const keyValue: Key = isTrusted ? message : `my-component-${message}`;

  // Use a sanitizer library like DOMPurify to ensure the safety of user-provided HTML
  // https://github.com/cure53/DOMPurify
  const sanitizedMessage = isTrusted
    ? message
    : DOMPurify.sanitize(message, {
        ALLOWED_TAGS: ['b', 'i', 'a', 'strong', 'em', 'span', 'br', 'p', 'ul', 'ol', 'li'],
        ALLOWED_ATTRS: {
          a: ['href', 'target', 'rel'],
          '*': ['class', 'style'],
        },
      });

  // Ensure that the sanitizedMessage is a valid ReactNode
  const validatedMessage = (React.isValidElement(sanitizedMessage) || typeof sanitizedMessage === 'string')
    ? sanitizedMessage
    : <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />;

  return <div key={keyValue} className="my-component">{validatedMessage}</div>;
};

// Add a default export for better compatibility with other modules
export default MyComponent;

import React, { FC, Key, ReactNode } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  message: string;
  isTrusted?: boolean; // Add an optional isTrusted prop for safer usage of dangerouslySetInnerHTML
}

const MyComponent: FC<Props> = ({ message, isTrusted = false }) => {
  // Add a key prop for React performance optimization
  const keyValue: Key = isTrusted ? message : `my-component-${message}`;

  // Use a sanitizer library like DOMPurify to ensure the safety of user-provided HTML
  // https://github.com/cure53/DOMPurify
  const sanitizedMessage = isTrusted
    ? message
    : DOMPurify.sanitize(message, {
        ALLOWED_TAGS: ['b', 'i', 'a', 'strong', 'em', 'span', 'br', 'p', 'ul', 'ol', 'li'],
        ALLOWED_ATTRS: {
          a: ['href', 'target', 'rel'],
          '*': ['class', 'style'],
        },
      });

  // Ensure that the sanitizedMessage is a valid ReactNode
  const validatedMessage = (React.isValidElement(sanitizedMessage) || typeof sanitizedMessage === 'string')
    ? sanitizedMessage
    : <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />;

  return <div key={keyValue} className="my-component">{validatedMessage}</div>;
};

// Add a default export for better compatibility with other modules
export default MyComponent;