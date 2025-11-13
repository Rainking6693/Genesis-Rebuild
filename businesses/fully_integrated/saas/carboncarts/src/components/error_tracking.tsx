import React, { FC, ReactNode, useEffect, useState } from 'react';

// Define the interface for the component props
interface ErrorProps {
  message: string;
  error?: Error; // Add error object for more detailed information
}

// Define the interface for the component's children
interface ErrorComponentChildrenProps {
  hasError: boolean;
  errorMessage?: string;
}

// Define a new interface for the component's state
interface ErrorComponentState {
  error?: Error;
}

// Create a functional component with the given props and state
const ErrorComponent: FC<ErrorProps> = ({ message, error }) => {
  // Initialize the component's state
  const [componentState, setComponentState] = useState<ErrorComponentState>({});

  // Use the error prop if available, otherwise use the message prop
  useEffect(() => {
    if (error) {
      setComponentState({ error });
    }
  }, [error]);

  // Extract the error details if available
  const errorDetails = componentState.error ? (
    <>
      <p>Error Code: {componentState.error.code}</p>
      <p>Error Stack: {componentState.error.stack}</p>
    </>
  ) : null;

  // Render the error message with error details if available
  const errorContent = (
    <>
      <h2>Error</h2>
      <p>{message}</p>
      {errorDetails}
    </>
  );

  // Create a wrapper component for accessibility purposes
  const ErrorWrapper: FC<ErrorComponentChildrenProps> = ({ hasError, errorMessage, children }) => {
    if (hasError) {
      return <div role="alert">{errorMessage || children}</div>;
    }

    return <>{children}</>;
  };

  // Render the error content wrapped in the ErrorWrapper component
  return <ErrorWrapper hasError={!!message} errorMessage={message}>{errorContent}</ErrorWrapper>;
};

// Export the functional component
export default ErrorComponent;

import React, { FC, ReactNode, useEffect, useState } from 'react';

// Define the interface for the component props
interface ErrorProps {
  message: string;
  error?: Error; // Add error object for more detailed information
}

// Define the interface for the component's children
interface ErrorComponentChildrenProps {
  hasError: boolean;
  errorMessage?: string;
}

// Define a new interface for the component's state
interface ErrorComponentState {
  error?: Error;
}

// Create a functional component with the given props and state
const ErrorComponent: FC<ErrorProps> = ({ message, error }) => {
  // Initialize the component's state
  const [componentState, setComponentState] = useState<ErrorComponentState>({});

  // Use the error prop if available, otherwise use the message prop
  useEffect(() => {
    if (error) {
      setComponentState({ error });
    }
  }, [error]);

  // Extract the error details if available
  const errorDetails = componentState.error ? (
    <>
      <p>Error Code: {componentState.error.code}</p>
      <p>Error Stack: {componentState.error.stack}</p>
    </>
  ) : null;

  // Render the error message with error details if available
  const errorContent = (
    <>
      <h2>Error</h2>
      <p>{message}</p>
      {errorDetails}
    </>
  );

  // Create a wrapper component for accessibility purposes
  const ErrorWrapper: FC<ErrorComponentChildrenProps> = ({ hasError, errorMessage, children }) => {
    if (hasError) {
      return <div role="alert">{errorMessage || children}</div>;
    }

    return <>{children}</>;
  };

  // Render the error content wrapped in the ErrorWrapper component
  return <ErrorWrapper hasError={!!message} errorMessage={message}>{errorContent}</ErrorWrapper>;
};

// Export the functional component
export default ErrorComponent;