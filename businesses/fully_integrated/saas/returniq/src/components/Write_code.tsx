import React, { FC, DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';

// Using a constant for the component name for better maintainability
const COMPONENT_NAME = 'MyComponent';

type MyComponentProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  message: string;
  children?: ReactNode;
  className?: string;
};

const MyComponent: FC<MyComponentProps> = ({ message, children, className, ...htmlAttributes }) => {
  // Adding a sanitization function to prevent XSS attacks
  const sanitizeMessage = (message: string) => {
    const DOMPurify = (window as any).DOMPurify;
    return DOMPurify.sanitize(message, {
      ALLOWED_TAGS: ['b', 'i', 'u', 'a', 'strong', 'em', 'sup', 'sub'],
      ALLOWED_ATTRS: {
        a: ['href', 'target', 'rel'],
      },
    });
  };

  // Using the sanitization function to prevent XSS attacks
  const sanitizedMessage = sanitizeMessage(message);

  // Adding a fallback for when no message is provided
  const fallbackContent = children || 'No content provided';

  // Adding a class name for better styling and maintainability
  const classes = className ? `${className} ${COMPONENT_NAME}` : COMPONENT_NAME;

  return (
    <div className={classes} {...htmlAttributes}>
      {sanitizedMessage ? <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} /> : fallbackContent}
    </div>
  );
};

// Adding a displayName for easier debugging and identification
MyComponent.displayName = COMPONENT_NAME;

export default MyComponent;

import React, { FC, DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';

// Using a constant for the component name for better maintainability
const COMPONENT_NAME = 'MyComponent';

type MyComponentProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  message: string;
  children?: ReactNode;
  className?: string;
};

const MyComponent: FC<MyComponentProps> = ({ message, children, className, ...htmlAttributes }) => {
  // Adding a sanitization function to prevent XSS attacks
  const sanitizeMessage = (message: string) => {
    const DOMPurify = (window as any).DOMPurify;
    return DOMPurify.sanitize(message, {
      ALLOWED_TAGS: ['b', 'i', 'u', 'a', 'strong', 'em', 'sup', 'sub'],
      ALLOWED_ATTRS: {
        a: ['href', 'target', 'rel'],
      },
    });
  };

  // Using the sanitization function to prevent XSS attacks
  const sanitizedMessage = sanitizeMessage(message);

  // Adding a fallback for when no message is provided
  const fallbackContent = children || 'No content provided';

  // Adding a class name for better styling and maintainability
  const classes = className ? `${className} ${COMPONENT_NAME}` : COMPONENT_NAME;

  return (
    <div className={classes} {...htmlAttributes}>
      {sanitizedMessage ? <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} /> : fallbackContent}
    </div>
  );
};

// Adding a displayName for easier debugging and identification
MyComponent.displayName = COMPONENT_NAME;

export default MyComponent;