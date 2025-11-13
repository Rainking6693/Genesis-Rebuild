import React, { FC, ReactNode } from 'react';
import { sanitizeHtml } from 'dompurify';

type RestProps = Record<string, any>;

interface Props {
  message: string;
  validateMessage: (message: string) => boolean;
}

const defaultProps = {
  'data-testid': 'my-component',
};

const MyComponent: FC<Props & typeof defaultProps & RestProps> = ({ message, validateMessage, ...rest }) => {
  if (!validateMessage(message)) {
    throw new Error('Invalid message input');
  }

  // Check if sanitizeHtml function exists before using it
  if (typeof sanitizeHtml !== 'function') {
    throw new Error('sanitizeHtml function not found');
  }

  // Use a safe method to sanitize the message to prevent XSS attacks
  const sanitizedMessage = sanitizeHtml(message);

  // Return a semantic element for accessibility
  return <article dangerouslySetInnerHTML={{ __html: sanitizedMessage }} {...rest} />;
};

MyComponent.defaultProps = defaultProps;

export default MyComponent;

import React, { FC, ReactNode } from 'react';
import { sanitizeHtml } from 'dompurify';

type RestProps = Record<string, any>;

interface Props {
  message: string;
  validateMessage: (message: string) => boolean;
}

const defaultProps = {
  'data-testid': 'my-component',
};

const MyComponent: FC<Props & typeof defaultProps & RestProps> = ({ message, validateMessage, ...rest }) => {
  if (!validateMessage(message)) {
    throw new Error('Invalid message input');
  }

  // Check if sanitizeHtml function exists before using it
  if (typeof sanitizeHtml !== 'function') {
    throw new Error('sanitizeHtml function not found');
  }

  // Use a safe method to sanitize the message to prevent XSS attacks
  const sanitizedMessage = sanitizeHtml(message);

  // Return a semantic element for accessibility
  return <article dangerouslySetInnerHTML={{ __html: sanitizedMessage }} {...rest} />;
};

MyComponent.defaultProps = defaultProps;

export default MyComponent;