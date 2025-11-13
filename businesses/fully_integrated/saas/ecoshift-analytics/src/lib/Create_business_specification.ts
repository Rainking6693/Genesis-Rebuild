import React, { FC, useMemo, PropsWithChildren } from 'react';
import { sanitizeHtml } from './sanitize-html';
import DOMPurify from 'dompurify';

interface Props {
  message?: string;
}

const MyComponent: FC<Props> = ({ children, message }) => {
  // Check if message is provided or children are present, return null if not
  if (!message && !children) return null;

  // Sanitize user-provided HTML
  const sanitizedMessage = useMemo(() => {
    if (message) {
      return sanitizeHtml(message);
    }
    return children;
  }, [children, message]);

  // Use DOMPurify for sanitization
  const sanitizedChildren = useMemo(() => {
    if (children) {
      return DOMPurify.sanitize(String(children));
    }
    return '';
  }, [children]);

  // Combine sanitized message and children
  const combinedContent = sanitizedMessage || sanitizedChildren;

  return <div dangerouslySetInnerHTML={{ __html: combinedContent }} />;
};

// Add input validation for props and default values
MyComponent.defaultProps = {
  message: '',
};

// Use named export for better readability and maintainability
export const EcoShiftAnalyticsMyComponent = MyComponent;

// Implement a utility function for sanitizing user-provided HTML
function sanitizeHtml(html: string) {
  // Use DOMPurify for sanitization
  return DOMPurify.sanitize(html);
}

import React, { FC, useMemo, PropsWithChildren } from 'react';
import { sanitizeHtml } from './sanitize-html';
import DOMPurify from 'dompurify';

interface Props {
  message?: string;
}

const MyComponent: FC<Props> = ({ children, message }) => {
  // Check if message is provided or children are present, return null if not
  if (!message && !children) return null;

  // Sanitize user-provided HTML
  const sanitizedMessage = useMemo(() => {
    if (message) {
      return sanitizeHtml(message);
    }
    return children;
  }, [children, message]);

  // Use DOMPurify for sanitization
  const sanitizedChildren = useMemo(() => {
    if (children) {
      return DOMPurify.sanitize(String(children));
    }
    return '';
  }, [children]);

  // Combine sanitized message and children
  const combinedContent = sanitizedMessage || sanitizedChildren;

  return <div dangerouslySetInnerHTML={{ __html: combinedContent }} />;
};

// Add input validation for props and default values
MyComponent.defaultProps = {
  message: '',
};

// Use named export for better readability and maintainability
export const EcoShiftAnalyticsMyComponent = MyComponent;

// Implement a utility function for sanitizing user-provided HTML
function sanitizeHtml(html: string) {
  // Use DOMPurify for sanitization
  return DOMPurify.sanitize(html);
}