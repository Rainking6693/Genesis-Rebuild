import React, { FC, useCallback, useEffect, useMemo } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const sanitizeMessage = useCallback((html: string) => {
    try {
      return DOMPurify.sanitize(html);
    } catch (error) {
      console.error(`Error sanitizing HTML content at line: ${error.line}, column: ${error.column}:`, error);
      return '';
    }
  }, []);

  const sanitizedMessage = useMemo(() => sanitizeMessage(message || ''), [message, sanitizeMessage]);

  useEffect(() => {
    if (!sanitizedMessage) {
      MyComponent.error(new Error('Error sanitizing HTML content'));
    }
  }, [sanitizedMessage]);

  return (
    <div
      role="presentation" // Prevent the div from being focusable
      dangerouslySetInnerHTML={{ __html: sanitizedMessage?.trim() || '' }}
      aria-label={sanitizedMessage} // Provide a fallback for screen readers
      title={sanitizedMessage} // Additional context for screen readers
    />
  );
};

MyComponent.error = (error: Error) => {
  console.error('Error rendering HTML content:', error);
};

export default MyComponent;

import React, { FC, useCallback, useEffect, useMemo } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const sanitizeMessage = useCallback((html: string) => {
    try {
      return DOMPurify.sanitize(html);
    } catch (error) {
      console.error(`Error sanitizing HTML content at line: ${error.line}, column: ${error.column}:`, error);
      return '';
    }
  }, []);

  const sanitizedMessage = useMemo(() => sanitizeMessage(message || ''), [message, sanitizeMessage]);

  useEffect(() => {
    if (!sanitizedMessage) {
      MyComponent.error(new Error('Error sanitizing HTML content'));
    }
  }, [sanitizedMessage]);

  return (
    <div
      role="presentation" // Prevent the div from being focusable
      dangerouslySetInnerHTML={{ __html: sanitizedMessage?.trim() || '' }}
      aria-label={sanitizedMessage} // Provide a fallback for screen readers
      title={sanitizedMessage} // Additional context for screen readers
    />
  );
};

MyComponent.error = (error: Error) => {
  console.error('Error rendering HTML content:', error);
};

export default MyComponent;