import React from 'react';
import DOMPurify from 'dompurify';
import { sanitizeUserInput } from '../../security/input_sanitization';

interface Props {
  message: string;
  sanitizationOptions?: SanitizationOptions;
}

interface SanitizationOptions {
  ALLOWED_TAGS?: string[];
  ALLOWED_ATTRS?: { [key: string]: string | string[] };
}

const sanitizeNewsletterContent = (input: string, options?: SanitizationOptions) => {
  const defaultOptions: SanitizationOptions = {
    ALLOWED_TAGS: [
      'a',
      'strong',
      'em',
      'i',
      'b',
      'br',
      'p',
      'ul',
      'ol',
      'li',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
    ],
    ALLOWED_ATTRS: {
      '*': ['class', 'style'],
      a: ['href', 'target', '_blank'],
      // Add 'aria-*' attributes for accessibility
      '*[aria-*]': true,
    },
  };

  const sanitizedInput = DOMPurify.sanitize(input, { ...defaultOptions, ...options });
  return sanitizedInput;
};

const MyComponent: React.FC<Props> = ({ message, sanitizationOptions }) => {
  return (
    <div
      // Add role="presentation" to hide the component from screen readers
      role="presentation"
      dangerouslySetInnerHTML={{ __html: sanitizeNewsletterContent(message, sanitizationOptions) }}
    />
  );
};

MyComponent.sanitizeMessage = (message: string, sanitizationOptions?: SanitizationOptions) => {
  return sanitizeNewsletterContent(message, sanitizationOptions);
};

export default MyComponent;

import React from 'react';
import DOMPurify from 'dompurify';
import { sanitizeUserInput } from '../../security/input_sanitization';

interface Props {
  message: string;
  sanitizationOptions?: SanitizationOptions;
}

interface SanitizationOptions {
  ALLOWED_TAGS?: string[];
  ALLOWED_ATTRS?: { [key: string]: string | string[] };
}

const sanitizeNewsletterContent = (input: string, options?: SanitizationOptions) => {
  const defaultOptions: SanitizationOptions = {
    ALLOWED_TAGS: [
      'a',
      'strong',
      'em',
      'i',
      'b',
      'br',
      'p',
      'ul',
      'ol',
      'li',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
    ],
    ALLOWED_ATTRS: {
      '*': ['class', 'style'],
      a: ['href', 'target', '_blank'],
      // Add 'aria-*' attributes for accessibility
      '*[aria-*]': true,
    },
  };

  const sanitizedInput = DOMPurify.sanitize(input, { ...defaultOptions, ...options });
  return sanitizedInput;
};

const MyComponent: React.FC<Props> = ({ message, sanitizationOptions }) => {
  return (
    <div
      // Add role="presentation" to hide the component from screen readers
      role="presentation"
      dangerouslySetInnerHTML={{ __html: sanitizeNewsletterContent(message, sanitizationOptions) }}
    />
  );
};

MyComponent.sanitizeMessage = (message: string, sanitizationOptions?: SanitizationOptions) => {
  return sanitizeNewsletterContent(message, sanitizationOptions);
};

export default MyComponent;