import React, { FC, useCallback, useMemo, useEffect, useRef } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  message?: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const sanitizedMessageRef = useRef<HTMLDivElement | null>(null);
  const sanitizedMessage = useMemo(() => {
    // Sanitize the message to prevent XSS attacks
    return DOMPurify.sanitize(message || '');
  }, [message]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    // Handle keyboard events for better accessibility
    if (event.key === 'Tab') {
      event.preventDefault();
      event.stopPropagation();
    }
  }, []);

  useEffect(() => {
    // Ensure the sanitized message is set when the component is mounted
    if (sanitizedMessageRef.current) {
      sanitizedMessageRef.current.innerHTML = sanitizedMessage;
    }
  }, [sanitizedMessage]);

  return (
    <div
      ref={sanitizedMessageRef} // Store the DOM element for later use
      role="presentation" // Prevent screen reader focus
      tabIndex={-1} // Prevent keyboard interaction
      onKeyDown={handleKeyDown}
      key={sanitizedMessage} // For better React performance and accessibility
    />
  );
};

export default MyComponent;

import React, { FC, useCallback, useMemo, useEffect, useRef } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  message?: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const sanitizedMessageRef = useRef<HTMLDivElement | null>(null);
  const sanitizedMessage = useMemo(() => {
    // Sanitize the message to prevent XSS attacks
    return DOMPurify.sanitize(message || '');
  }, [message]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    // Handle keyboard events for better accessibility
    if (event.key === 'Tab') {
      event.preventDefault();
      event.stopPropagation();
    }
  }, []);

  useEffect(() => {
    // Ensure the sanitized message is set when the component is mounted
    if (sanitizedMessageRef.current) {
      sanitizedMessageRef.current.innerHTML = sanitizedMessage;
    }
  }, [sanitizedMessage]);

  return (
    <div
      ref={sanitizedMessageRef} // Store the DOM element for later use
      role="presentation" // Prevent screen reader focus
      tabIndex={-1} // Prevent keyboard interaction
      onKeyDown={handleKeyDown}
      key={sanitizedMessage} // For better React performance and accessibility
    />
  );
};

export default MyComponent;