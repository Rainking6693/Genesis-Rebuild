import React, { FC, ReactNode } from 'react';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

// Fallback for DOMPurify library
const purify =
  typeof window !== 'undefined' &&
  typeof window.DOMPurify !== 'undefined'
    ? window.DOMPurify
    : (message: string) => message;

interface Props {
  message: string;
}

const sanitizeMessage = (message: string): string => {
  const sanitized = purify(message);

  // Support for HTML entities and character references
  const dom = new JSDOM(sanitized);
  const doc = dom.window.document;
  const text = doc.createTextNode(sanitized);
  const sanitizedText = doc.createElement('span').appendChild(text).textContent;

  return sanitizedText.trim();
};

const MyComponent: FC<Props> = ({ message }) => {
  const sanitizedMessage = sanitizeMessage(message || '');
  const isEmpty = sanitizedMessage.length === 0;

  if (isEmpty) {
    return null;
  }

  return (
    <div
      dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
      aria-label={sanitizedMessage}
      aria-describedby="message-id" // Added ID for better accessibility
      id="message-id" // Added ID for better accessibility
    />
  );
};

export { sanitizeMessage };
export default MyComponent;

import { sanitizeMessage } from './MyComponent';

describe('sanitizeMessage', () => {
  it('sanitizes the message', () => {
    const message = '<script>alert("XSS Attack!");</script>';
    const sanitized = sanitizeMessage(message);
    expect(sanitized).not.toContain('<script>');
  });

  it('sanitizes the message with HTML entities and character references', () => {
    const message = '&lt;script&gt;alert(&quot;XSS Attack!&quot;);&lt;/script&gt;';
    const sanitized = sanitizeMessage(message);
    expect(sanitized).not.toContain('<script>');
  });

  it('returns an empty string for an empty message', () => {
    const message = '';
    const sanitized = sanitizeMessage(message);
    expect(sanitized).toEqual('');
  });
});

import React, { FC, ReactNode } from 'react';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

// Fallback for DOMPurify library
const purify =
  typeof window !== 'undefined' &&
  typeof window.DOMPurify !== 'undefined'
    ? window.DOMPurify
    : (message: string) => message;

interface Props {
  message: string;
}

const sanitizeMessage = (message: string): string => {
  const sanitized = purify(message);

  // Support for HTML entities and character references
  const dom = new JSDOM(sanitized);
  const doc = dom.window.document;
  const text = doc.createTextNode(sanitized);
  const sanitizedText = doc.createElement('span').appendChild(text).textContent;

  return sanitizedText.trim();
};

const MyComponent: FC<Props> = ({ message }) => {
  const sanitizedMessage = sanitizeMessage(message || '');
  const isEmpty = sanitizedMessage.length === 0;

  if (isEmpty) {
    return null;
  }

  return (
    <div
      dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
      aria-label={sanitizedMessage}
      aria-describedby="message-id" // Added ID for better accessibility
      id="message-id" // Added ID for better accessibility
    />
  );
};

export { sanitizeMessage };
export default MyComponent;

import { sanitizeMessage } from './MyComponent';

describe('sanitizeMessage', () => {
  it('sanitizes the message', () => {
    const message = '<script>alert("XSS Attack!");</script>';
    const sanitized = sanitizeMessage(message);
    expect(sanitized).not.toContain('<script>');
  });

  it('sanitizes the message with HTML entities and character references', () => {
    const message = '&lt;script&gt;alert(&quot;XSS Attack!&quot;);&lt;/script&gt;';
    const sanitized = sanitizeMessage(message);
    expect(sanitized).not.toContain('<script>');
  });

  it('returns an empty string for an empty message', () => {
    const message = '';
    const sanitized = sanitizeMessage(message);
    expect(sanitized).toEqual('');
  });
});