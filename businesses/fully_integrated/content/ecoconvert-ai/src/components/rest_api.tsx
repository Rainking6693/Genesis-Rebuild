import React, { FC, useMemo } from 'react';
import { isValidHTML, sanitize } from 'dompurify';
import { validate as urlValidate, format as urlFormat } from 'url';

interface Props {
  message: string;
  url?: string;
}

const validateMessage = (message: string): string => {
  // Add your validation logic here
  // For example, let's limit the message length to 255 characters
  if (message.length > 255) {
    throw new Error('Message is too long');
  }
  return message;
};

const sanitizeMessage = (message: string): string => {
  // Sanitize the message to prevent XSS attacks
  if (isValidHTML(message)) {
    return message;
  }
  return sanitize(message);
};

const validateURL = (url: string): void => {
  // Validate the URL to prevent malicious links
  if (!urlValidate(url)) {
    throw new Error('Invalid URL');
  }
};

const formatURL = (url: string): string => {
  // Format the URL to ensure it's clickable
  return urlFormat(url, { forceQuery: true });
};

const MyComponent: FC<Props> = ({ message, url }) => {
  const validatedMessage = useMemo(() => validateMessage(message), [message]);
  const sanitizedMessage = useMemo(() => sanitizeMessage(validatedMessage), [validatedMessage]);

  if (url) {
    validateURL(url);
    const formattedUrl = formatURL(url);
    return (
      <>
        <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
        <a href={formattedUrl} target="_blank" rel="noopener noreferrer">
          {url}
        </a>
      </>
    );
  }

  return <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />;
};

export default React.memo(MyComponent);

import React, { FC, useMemo } from 'react';
import { isValidHTML, sanitize } from 'dompurify';
import { validate as urlValidate, format as urlFormat } from 'url';

interface Props {
  message: string;
  url?: string;
}

const validateMessage = (message: string): string => {
  // Add your validation logic here
  // For example, let's limit the message length to 255 characters
  if (message.length > 255) {
    throw new Error('Message is too long');
  }
  return message;
};

const sanitizeMessage = (message: string): string => {
  // Sanitize the message to prevent XSS attacks
  if (isValidHTML(message)) {
    return message;
  }
  return sanitize(message);
};

const validateURL = (url: string): void => {
  // Validate the URL to prevent malicious links
  if (!urlValidate(url)) {
    throw new Error('Invalid URL');
  }
};

const formatURL = (url: string): string => {
  // Format the URL to ensure it's clickable
  return urlFormat(url, { forceQuery: true });
};

const MyComponent: FC<Props> = ({ message, url }) => {
  const validatedMessage = useMemo(() => validateMessage(message), [message]);
  const sanitizedMessage = useMemo(() => sanitizeMessage(validatedMessage), [validatedMessage]);

  if (url) {
    validateURL(url);
    const formattedUrl = formatURL(url);
    return (
      <>
        <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
        <a href={formattedUrl} target="_blank" rel="noopener noreferrer">
          {url}
        </a>
      </>
    );
  }

  return <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />;
};

export default React.memo(MyComponent);