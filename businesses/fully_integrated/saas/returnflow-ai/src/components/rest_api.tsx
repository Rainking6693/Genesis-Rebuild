import React, { FC, useRef, useEffect } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  message: string;
  isTrusted?: boolean; // Added for better control over the HTML content
}

const MyComponent: FC<Props> = ({ message, isTrusted = false }) => {
  const divRef = useRef<HTMLDivElement>(null);

  // Sanitize the HTML content to prevent XSS attacks
  const sanitizedMessage = DOMPurify.sanitize(message, {
    ALLOWED_TAGS: ['div', 'p', 'strong', 'em', 'a', 'span'], // Added 'span' for potential custom styles
    ALLOWED_ATTRS: {
      a: ['href', 'target', 'rel'], // Added 'target' and 'rel' for link attributes
      '*': ['class'], // Allows class attribute for all elements
    },
    FORBID_TAGS: ['script'], // Prevents script tags
    FORBID_ATTR: ['on*'], // Prevents event attributes
  });

  // Use useEffect to set the innerHTML only when the component is mounted
  useEffect(() => {
    if (divRef.current && isTrusted) {
      divRef.current.innerHTML = sanitizedMessage;
    }
  }, [sanitizedMessage, isTrusted]);

  // Add aria-label for accessibility
  const ariaLabel = 'Safe HTML content';

  return (
    <div ref={divRef} data-testid="my-component">
      <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} aria-label={ariaLabel} />
    </div>
  );
};

export default MyComponent;

import React, { FC, useRef, useEffect } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  message: string;
  isTrusted?: boolean; // Added for better control over the HTML content
}

const MyComponent: FC<Props> = ({ message, isTrusted = false }) => {
  const divRef = useRef<HTMLDivElement>(null);

  // Sanitize the HTML content to prevent XSS attacks
  const sanitizedMessage = DOMPurify.sanitize(message, {
    ALLOWED_TAGS: ['div', 'p', 'strong', 'em', 'a', 'span'], // Added 'span' for potential custom styles
    ALLOWED_ATTRS: {
      a: ['href', 'target', 'rel'], // Added 'target' and 'rel' for link attributes
      '*': ['class'], // Allows class attribute for all elements
    },
    FORBID_TAGS: ['script'], // Prevents script tags
    FORBID_ATTR: ['on*'], // Prevents event attributes
  });

  // Use useEffect to set the innerHTML only when the component is mounted
  useEffect(() => {
    if (divRef.current && isTrusted) {
      divRef.current.innerHTML = sanitizedMessage;
    }
  }, [sanitizedMessage, isTrusted]);

  // Add aria-label for accessibility
  const ariaLabel = 'Safe HTML content';

  return (
    <div ref={divRef} data-testid="my-component">
      <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} aria-label={ariaLabel} />
    </div>
  );
};

export default MyComponent;