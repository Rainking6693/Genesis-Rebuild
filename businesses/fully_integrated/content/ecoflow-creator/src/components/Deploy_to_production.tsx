import React, { FC, useContext, useState } from 'react';
import { ErrorContext } from './ErrorContext';

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const { logError } = useContext(ErrorContext);
  const [isLoading, setIsLoading] = useState(false);

  const sanitizeMessage = (html: string) => {
    // Add a simple sanitization function to prevent XSS attacks
    // This is a very basic example, you should use a library like DOMPurify for production
    try {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      return doc.documentElement.textContent;
    } catch (error) {
      logError(`Error sanitizing message in ${COMPONENT_NAME}:`, error);
      return '';
    }
  };

  const handleError = (error: Error) => {
    logError(`Error in ${COMPONENT_NAME}:`, error);
  };

  const safeMessage = sanitizeMessage(message);

  const handleLoading = () => {
    setIsLoading(true);
    // You can add your loading logic here
    setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Set a reasonable timeout for loading state
  };

  React.useEffect(handleLoading, [message]); // Trigger loading on message change

  return (
    <div>
      {isLoading ? <div>Loading...</div> : <div dangerouslySetInnerHTML={{ __html: safeMessage }} />}
      {/* Add a loading state to improve user experience */}
      {!isLoading && safeMessage.length === 0 && <div>No message provided.</div>}
      {/* Handle the edge case when no message is provided */}
    </div>
  );
};

// Add a constant for the component name for easier debugging and logging
const COMPONENT_NAME = 'MyComponent';

// Create an ErrorContext to centralize error handling
export const ErrorContext = React.createContext({
  logError: () => {},
});

// Wrap the component with the ErrorContext Provider to make the logError function available
export const ErrorBoundary = ({ children }) => {
  const [error, setError] = useState(null);

  const logError = (message: string, error: Error) => {
    setError(error);
    console.error(message, error);
  };

  return (
    <ErrorContext.Provider value={{ logError }}>
      {error ? <div role="alert">An error occurred: {error.message}</div>}
      {/* Add a role="alert" to improve accessibility */}
      {children}
    </ErrorContext.Provider>
  );
};

// Wrap the MyComponent with the ErrorBoundary to catch and log errors
export default () => (
  <ErrorBoundary>
    <MyComponent />
  </ErrorBoundary>
);

import React, { FC, useContext, useState } from 'react';
import { ErrorContext } from './ErrorContext';

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const { logError } = useContext(ErrorContext);
  const [isLoading, setIsLoading] = useState(false);

  const sanitizeMessage = (html: string) => {
    // Add a simple sanitization function to prevent XSS attacks
    // This is a very basic example, you should use a library like DOMPurify for production
    try {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      return doc.documentElement.textContent;
    } catch (error) {
      logError(`Error sanitizing message in ${COMPONENT_NAME}:`, error);
      return '';
    }
  };

  const handleError = (error: Error) => {
    logError(`Error in ${COMPONENT_NAME}:`, error);
  };

  const safeMessage = sanitizeMessage(message);

  const handleLoading = () => {
    setIsLoading(true);
    // You can add your loading logic here
    setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Set a reasonable timeout for loading state
  };

  React.useEffect(handleLoading, [message]); // Trigger loading on message change

  return (
    <div>
      {isLoading ? <div>Loading...</div> : <div dangerouslySetInnerHTML={{ __html: safeMessage }} />}
      {/* Add a loading state to improve user experience */}
      {!isLoading && safeMessage.length === 0 && <div>No message provided.</div>}
      {/* Handle the edge case when no message is provided */}
    </div>
  );
};

// Add a constant for the component name for easier debugging and logging
const COMPONENT_NAME = 'MyComponent';

// Create an ErrorContext to centralize error handling
export const ErrorContext = React.createContext({
  logError: () => {},
});

// Wrap the component with the ErrorContext Provider to make the logError function available
export const ErrorBoundary = ({ children }) => {
  const [error, setError] = useState(null);

  const logError = (message: string, error: Error) => {
    setError(error);
    console.error(message, error);
  };

  return (
    <ErrorContext.Provider value={{ logError }}>
      {error ? <div role="alert">An error occurred: {error.message}</div>}
      {/* Add a role="alert" to improve accessibility */}
      {children}
    </ErrorContext.Provider>
  );
};

// Wrap the MyComponent with the ErrorBoundary to catch and log errors
export default () => (
  <ErrorBoundary>
    <MyComponent />
  </ErrorBoundary>
);