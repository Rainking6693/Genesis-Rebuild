import React, { FC, ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';
import DOMPurify from 'dompurify';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message?: string;
}

const defaultProps: Partial<Props> = {
  dangerouslySetInnerHTML: {},
};

const MyComponent: FC<Props> = ({ message = '', ...props }) => {
  const sanitizedMessage = sanitizeContent(message);

  // Check if dangerouslySetInnerHTML is supported
  if (!('dangerouslySetInnerHTML' in props)) {
    return <div {...props}>{sanitizedMessage}</div>;
  }

  // Check if sanitized content is valid HTML
  if (!DOMPurify.isValid(sanitizedMessage)) {
    throw new Error('Invalid HTML in sanitized content');
  }

  return <div {...props} dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />;
};

const sanitizeContent = (content: string) => {
  // Use DOMPurify library for production-ready sanitization
  const sanitizedContent = DOMPurify.sanitize(content);
  return sanitizedContent;
};

export default MyComponent;

// Test for sanitizeContent function
describe('sanitizeContent', () => {
  it('should correctly sanitize the content', () => {
    const content = '<script>alert("XSS Attack!");</script>';
    const sanitizedContent = sanitizeContent(content);
    expect(sanitizedContent).not.toContain('<script>');
  });
});

// Comments explaining the purpose and potential risks of the sanitizeContent and dangerouslySetInnerHTML functions
/**
 * The sanitizeContent function is used to sanitize user-provided content to prevent potential security issues such as Cross-Site Scripting (XSS) attacks.
 */

/**
 * The dangerouslySetInnerHTML property is a special property in React that allows you to set the inner HTML of a component. However, it can potentially introduce security risks if not used carefully, as it bypasses the usual security mechanisms in place to prevent XSS attacks.
 */

import React, { FC, ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';
import DOMPurify from 'dompurify';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message?: string;
}

const defaultProps: Partial<Props> = {
  dangerouslySetInnerHTML: {},
};

const MyComponent: FC<Props> = ({ message = '', ...props }) => {
  const sanitizedMessage = sanitizeContent(message);

  // Check if dangerouslySetInnerHTML is supported
  if (!('dangerouslySetInnerHTML' in props)) {
    return <div {...props}>{sanitizedMessage}</div>;
  }

  // Check if sanitized content is valid HTML
  if (!DOMPurify.isValid(sanitizedMessage)) {
    throw new Error('Invalid HTML in sanitized content');
  }

  return <div {...props} dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />;
};

const sanitizeContent = (content: string) => {
  // Use DOMPurify library for production-ready sanitization
  const sanitizedContent = DOMPurify.sanitize(content);
  return sanitizedContent;
};

export default MyComponent;

// Test for sanitizeContent function
describe('sanitizeContent', () => {
  it('should correctly sanitize the content', () => {
    const content = '<script>alert("XSS Attack!");</script>';
    const sanitizedContent = sanitizeContent(content);
    expect(sanitizedContent).not.toContain('<script>');
  });
});

// Comments explaining the purpose and potential risks of the sanitizeContent and dangerouslySetInnerHTML functions
/**
 * The sanitizeContent function is used to sanitize user-provided content to prevent potential security issues such as Cross-Site Scripting (XSS) attacks.
 */

/**
 * The dangerouslySetInnerHTML property is a special property in React that allows you to set the inner HTML of a component. However, it can potentially introduce security risks if not used carefully, as it bypasses the usual security mechanisms in place to prevent XSS attacks.
 */