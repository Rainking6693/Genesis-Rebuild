import React, { FC, useContext, useEffect, useRef } from 'react';
import { ErrorContext } from './ErrorContext';

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const { logError } = useContext(ErrorContext);
  const messageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sanitizedMessage = sanitizeHtml(message);
    if (!sanitizedMessage) {
      logError(new Error(`Invalid or malformed message: ${message}`));
      return;
    }

    // Check if the component is mounted before updating the DOM
    if (messageRef.current) {
      messageRef.current.innerHTML = sanitizedMessage;
    }
  }, [message, logError]);

  return <div ref={messageRef} />;
};

MyComponent.displayName = 'BackupSystemMessageComponent';

// Import sanitizeHtml function from a third-party library or create your own function to sanitize the HTML content
// For example, using DOMPurify:
import DOMPurify from 'dompurify';

// Use DOMPurify's sanitizeHtml function to sanitize the message content
function sanitizeHtml(html: string) {
  const sanitized = DOMPurify.sanitize(html);
  return sanitized || null;
}

export { MyComponent };

import React, { FC, useContext, useEffect, useRef } from 'react';
import { ErrorContext } from './ErrorContext';

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const { logError } = useContext(ErrorContext);
  const messageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sanitizedMessage = sanitizeHtml(message);
    if (!sanitizedMessage) {
      logError(new Error(`Invalid or malformed message: ${message}`));
      return;
    }

    // Check if the component is mounted before updating the DOM
    if (messageRef.current) {
      messageRef.current.innerHTML = sanitizedMessage;
    }
  }, [message, logError]);

  return <div ref={messageRef} />;
};

MyComponent.displayName = 'BackupSystemMessageComponent';

// Import sanitizeHtml function from a third-party library or create your own function to sanitize the HTML content
// For example, using DOMPurify:
import DOMPurify from 'dompurify';

// Use DOMPurify's sanitizeHtml function to sanitize the message content
function sanitizeHtml(html: string) {
  const sanitized = DOMPurify.sanitize(html);
  return sanitized || null;
}

export { MyComponent };