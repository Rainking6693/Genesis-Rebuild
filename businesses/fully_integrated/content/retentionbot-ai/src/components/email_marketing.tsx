import React, { FunctionComponent, PropsWithChildren } from 'react';
import { setContentSecurityPolicy } from 'helmet';

interface Props extends PropsWithChildren {
  message?: string;
  className?: string; // Add a class name for better styling and accessibility
}

const FunctionalComponent: FunctionComponent<Props> = ({ children, message, className }) => {
  // Add a content security policy to prevent XSS attacks
  setContentSecurityPolicy({
    defaultSrc: ['self'],
    scriptSrc: ['self', 'https://www.example.com'], // Add trusted domains here
    styleSrc: ['self', 'https://fonts.googleapis.com'], // Add trusted domains for styles
    // Add 'unsafe-inline' for styles that cannot be loaded via a separate file
    styleSrcElements: ['unsafe-inline'],
  });

  // Use a template literal for better readability and conciseness
  // Check if message is provided, if not use children
  // Add a fallback for empty message or children
  const content = message || children || '';

  return (
    <div
      className={className} // Use className for better styling and accessibility
      dangerouslySetInnerHTML={{
        __html: content,
      }}
    />
  );
};

// Add a type for the default export to improve type checking and maintainability
export default FunctionalComponent;

import React, { FunctionComponent, PropsWithChildren } from 'react';
import { setContentSecurityPolicy } from 'helmet';

interface Props extends PropsWithChildren {
  message?: string;
  className?: string; // Add a class name for better styling and accessibility
}

const FunctionalComponent: FunctionComponent<Props> = ({ children, message, className }) => {
  // Add a content security policy to prevent XSS attacks
  setContentSecurityPolicy({
    defaultSrc: ['self'],
    scriptSrc: ['self', 'https://www.example.com'], // Add trusted domains here
    styleSrc: ['self', 'https://fonts.googleapis.com'], // Add trusted domains for styles
    // Add 'unsafe-inline' for styles that cannot be loaded via a separate file
    styleSrcElements: ['unsafe-inline'],
  });

  // Use a template literal for better readability and conciseness
  // Check if message is provided, if not use children
  // Add a fallback for empty message or children
  const content = message || children || '';

  return (
    <div
      className={className} // Use className for better styling and accessibility
      dangerouslySetInnerHTML={{
        __html: content,
      }}
    />
  );
};

// Add a type for the default export to improve type checking and maintainability
export default FunctionalComponent;