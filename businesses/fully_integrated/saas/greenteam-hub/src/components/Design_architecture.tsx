import React, { FunctionComponent, ReactNode, PropsWithChildren } from 'react';
import DOMPurify from 'dompurify';

interface Props extends PropsWithChildren {
  id?: string;
  message: string;
  isTrusted?: boolean; // Added to handle edge cases where the HTML is trusted
}

const MyComponent: FunctionComponent<Props> = ({ id, message, isTrusted = false }) => {
  // Sanitize the input to prevent XSS attacks
  const sanitizedMessage = DOMPurify.sanitize(message, {
    ALLOWED_TAGS: ['b', 'i', 'u', 'a[href]', 'strong', 'em'],
    ALLOWED_ATTRS: {
      a: ['href', 'target', 'rel'],
    },
    FORBID_TAGS: ['script'],
    FORBID_ATTR: ['on*'],
  });

  // Check if the HTML is trusted before setting it directly
  if (isTrusted) {
    return (
      <div id={id} dangerouslySetInnerHTML={{ __html: sanitizedMessage }} aria-label={sanitizedMessage} />
    );
  }

  // If the HTML is not trusted, render the message as plain text
  return (
    <div id={id} dangerouslySetInnerHTML={{ __html: sanitizedMessage }} suppressContentEditableWarning={true} aria-label={sanitizedMessage} />
  );
};

// Add a default export for better maintainability
export default MyComponent;

import React, { FunctionComponent, ReactNode, PropsWithChildren } from 'react';
import DOMPurify from 'dompurify';

interface Props extends PropsWithChildren {
  id?: string;
  message: string;
  isTrusted?: boolean; // Added to handle edge cases where the HTML is trusted
}

const MyComponent: FunctionComponent<Props> = ({ id, message, isTrusted = false }) => {
  // Sanitize the input to prevent XSS attacks
  const sanitizedMessage = DOMPurify.sanitize(message, {
    ALLOWED_TAGS: ['b', 'i', 'u', 'a[href]', 'strong', 'em'],
    ALLOWED_ATTRS: {
      a: ['href', 'target', 'rel'],
    },
    FORBID_TAGS: ['script'],
    FORBID_ATTR: ['on*'],
  });

  // Check if the HTML is trusted before setting it directly
  if (isTrusted) {
    return (
      <div id={id} dangerouslySetInnerHTML={{ __html: sanitizedMessage }} aria-label={sanitizedMessage} />
    );
  }

  // If the HTML is not trusted, render the message as plain text
  return (
    <div id={id} dangerouslySetInnerHTML={{ __html: sanitizedMessage }} suppressContentEditableWarning={true} aria-label={sanitizedMessage} />
  );
};

// Add a default export for better maintainability
export default MyComponent;