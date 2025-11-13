import React, { FC, ReactNode, useEffect } from 'react';
import { sanitizeText } from 'react-text-sanitizer';

// Add a type for the error object
interface ErrorObject {
  message: string;
  info?: any;
}

// Extract common props interface for reusability and maintainability
interface CommonProps {
  message: string;
}

// Add a displayError function to customize error handling
interface ErrorBoundaryProps extends CommonProps {
  displayError?: (error: ErrorObject) => void;
  fallbackUI?: ReactNode;
  ComponentName?: string;
}

// Create a custom error boundary component to handle errors
const ErrorBoundary: FC<ErrorBoundaryProps> = ({
  children,
  displayError,
  fallbackUI,
  ComponentName,
}) => {
  const [error, setError] = React.useState<ErrorObject | null>(null);

  const handleError = (error: ErrorObject) => {
    if (displayError) displayError(error);
    console.error(`${ComponentName}: ${error.message}`, error.info);
    setError(error);
  };

  useEffect(() => {
    if (error) {
      // You can show an error modal or display an error message
      // based on your application's design and requirements.
      console.error(`${ComponentName}: ${error.message}`);
    }

    return () => {
      setError(null);
    };
  }, [error]);

  return <>{error ? error.message : children || fallbackUI}</>;
};

// Sanitize the message to prevent XSS attacks
const sanitizeOptions = {
  // Customize sanitization options as needed
};

const CustomerSupportBot: FC<CommonProps> = ({ message }) => {
  const sanitizedMessage = sanitizeText(message, sanitizeOptions);
  return <ErrorBoundary>{<div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />}</ErrorBoundary>;
};

// Reuse the component for other use cases if needed
const MyComponent: FC<CommonProps> = ({ message }) => {
  return <ErrorBoundary>{<div>{message}</div>}</ErrorBoundary>;
};

// Add testID prop for better testing and accessibility
CustomerSupportBot.displayName = 'CustomerSupportBot';
MyComponent.displayName = 'MyComponent';

// Export the components
export { CustomerSupportBot, MyComponent };

import React, { FC, ReactNode, useEffect } from 'react';
import { sanitizeText } from 'react-text-sanitizer';

// Add a type for the error object
interface ErrorObject {
  message: string;
  info?: any;
}

// Extract common props interface for reusability and maintainability
interface CommonProps {
  message: string;
}

// Add a displayError function to customize error handling
interface ErrorBoundaryProps extends CommonProps {
  displayError?: (error: ErrorObject) => void;
  fallbackUI?: ReactNode;
  ComponentName?: string;
}

// Create a custom error boundary component to handle errors
const ErrorBoundary: FC<ErrorBoundaryProps> = ({
  children,
  displayError,
  fallbackUI,
  ComponentName,
}) => {
  const [error, setError] = React.useState<ErrorObject | null>(null);

  const handleError = (error: ErrorObject) => {
    if (displayError) displayError(error);
    console.error(`${ComponentName}: ${error.message}`, error.info);
    setError(error);
  };

  useEffect(() => {
    if (error) {
      // You can show an error modal or display an error message
      // based on your application's design and requirements.
      console.error(`${ComponentName}: ${error.message}`);
    }

    return () => {
      setError(null);
    };
  }, [error]);

  return <>{error ? error.message : children || fallbackUI}</>;
};

// Sanitize the message to prevent XSS attacks
const sanitizeOptions = {
  // Customize sanitization options as needed
};

const CustomerSupportBot: FC<CommonProps> = ({ message }) => {
  const sanitizedMessage = sanitizeText(message, sanitizeOptions);
  return <ErrorBoundary>{<div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />}</ErrorBoundary>;
};

// Reuse the component for other use cases if needed
const MyComponent: FC<CommonProps> = ({ message }) => {
  return <ErrorBoundary>{<div>{message}</div>}</ErrorBoundary>;
};

// Add testID prop for better testing and accessibility
CustomerSupportBot.displayName = 'CustomerSupportBot';
MyComponent.displayName = 'MyComponent';

// Export the components
export { CustomerSupportBot, MyComponent };