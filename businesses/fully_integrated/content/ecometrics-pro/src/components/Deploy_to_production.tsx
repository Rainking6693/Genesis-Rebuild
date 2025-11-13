import React, { FC, ReactNode, DefaultHTMLProps, RefAttributes } from 'react';
import DOMPurify from 'dompurify';

interface Props extends DefaultHTMLProps<HTMLDivElement> {
  message: string;
  children?: ReactNode; // Add support for additional content within the component
  errorHandler?: (error: Error) => void; // Allow for custom error handling
}

const MyComponent: FC<Props & RefAttributes<HTMLDivElement>> = ({
  message,
  children,
  errorHandler,
  ...rest
}) => {
  // Sanitize the input message to prevent XSS attacks
  const sanitizedMessage = DOMPurify.sanitize(message);

  // Render the component with the sanitized message, optional children, and additional props
  return <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} {...rest}>{children}</div>;
};

// Add a default error handler that logs the error and notifies the user
MyComponent.defaultProps = {
  errorHandler: (error) => {
    console.error('Error in MyComponent:', error);
    alert('An error occurred in MyComponent. Please contact the support team.');
  },
};

// Add a type for the exported default
export default MyComponent as React.FC<Props & RefAttributes<HTMLDivElement>>;

import React, { FC, ReactNode, DefaultHTMLProps, RefAttributes } from 'react';
import DOMPurify from 'dompurify';

interface Props extends DefaultHTMLProps<HTMLDivElement> {
  message: string;
  children?: ReactNode; // Add support for additional content within the component
  errorHandler?: (error: Error) => void; // Allow for custom error handling
}

const MyComponent: FC<Props & RefAttributes<HTMLDivElement>> = ({
  message,
  children,
  errorHandler,
  ...rest
}) => {
  // Sanitize the input message to prevent XSS attacks
  const sanitizedMessage = DOMPurify.sanitize(message);

  // Render the component with the sanitized message, optional children, and additional props
  return <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} {...rest}>{children}</div>;
};

// Add a default error handler that logs the error and notifies the user
MyComponent.defaultProps = {
  errorHandler: (error) => {
    console.error('Error in MyComponent:', error);
    alert('An error occurred in MyComponent. Please contact the support team.');
  },
};

// Add a type for the exported default
export default MyComponent as React.FC<Props & RefAttributes<HTMLDivElement>>;