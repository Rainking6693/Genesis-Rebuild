import React, { FunctionComponent, DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';
import DOMPurify from 'dompurify';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  children?: ReactNode;
  dataTestId?: string;
}

const MyComponent: FunctionComponent<Props> = ({ message, children, dataTestId, ...htmlAttributes }) => {
  // Use DOMPurify to sanitize the message and prevent XSS attacks
  const sanitizedMessage = DOMPurify.sanitize(message);

  // Allow for custom children
  const content = children || sanitizedMessage;

  // Add data-testid for testing purposes
  const dataTestIdAttribute = dataTestId ? { 'data-testid': dataTestId } : {};

  return (
    <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} {...htmlAttributes} {...dataTestIdAttribute}>
      {content}
    </div>
  );
};

// Add error handling and logging for potential XSS attacks
MyComponent.error = (error: Error) => {
  console.error('XSS error in MyComponent:', error);
};

// Add a unique key for performance optimization and to avoid key warnings
MyComponent.defaultProps = {
  key: 'my-component-unique-key',
};

export default MyComponent;

import React, { FunctionComponent, DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';
import DOMPurify from 'dompurify';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  children?: ReactNode;
  dataTestId?: string;
}

const MyComponent: FunctionComponent<Props> = ({ message, children, dataTestId, ...htmlAttributes }) => {
  // Use DOMPurify to sanitize the message and prevent XSS attacks
  const sanitizedMessage = DOMPurify.sanitize(message);

  // Allow for custom children
  const content = children || sanitizedMessage;

  // Add data-testid for testing purposes
  const dataTestIdAttribute = dataTestId ? { 'data-testid': dataTestId } : {};

  return (
    <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} {...htmlAttributes} {...dataTestIdAttribute}>
      {content}
    </div>
  );
};

// Add error handling and logging for potential XSS attacks
MyComponent.error = (error: Error) => {
  console.error('XSS error in MyComponent:', error);
};

// Add a unique key for performance optimization and to avoid key warnings
MyComponent.defaultProps = {
  key: 'my-component-unique-key',
};

export default MyComponent;