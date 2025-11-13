import React, { FC, useContext, useEffect, useRef, useState } from 'react';
import { ErrorContext } from './ErrorContext';

interface Props {
  message?: string; // Adding optional prop for message
}

const UsageAnalytics: FC<Props> = ({ message }) => {
  const [error, setError] = useState<Error | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const { logError } = useContext(ErrorContext);

  useEffect(() => {
    if (error) {
      logError(error);
    }
  }, [error, logError]);

  const handleError = (error: Error) => {
    setError(error);
  };

  const handleDivError = (event: React.SyntheticEvent<HTMLDivElement>) => {
    if (event.currentTarget === event.target) { // Check if the error occurred on the div itself
      handleError(new Error(`Error occurred: ${event.message}`));
    }
  };

  return (
    <div
      className="usage-analytics"
      ref={ref}
      onError={handleDivError} // Use a function to handle errors on the div
    >
      {error ? (
        <div role="alert" aria-live="assertive">{error.message}</div> // Add aria-live for accessibility
      ) : (
        message || 'Loading...' // Use 'Loading...' as default message if no message is provided
      )}
    </div>
  );
};

UsageAnalytics.displayName = 'UsageAnalytics';

// Add default props and error handling for better reliability
UsageAnalytics.defaultProps = {
  message: 'Loading...',
};

UsageAnalytics.errorBoundary = ({ error }) => {
  console.error(error);
  return <div>An error occurred: {error.message}</div>;
};

export default UsageAnalytics;

import React, { FC, useContext, useEffect, useRef, useState } from 'react';
import { ErrorContext } from './ErrorContext';

interface Props {
  message?: string; // Adding optional prop for message
}

const UsageAnalytics: FC<Props> = ({ message }) => {
  const [error, setError] = useState<Error | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const { logError } = useContext(ErrorContext);

  useEffect(() => {
    if (error) {
      logError(error);
    }
  }, [error, logError]);

  const handleError = (error: Error) => {
    setError(error);
  };

  const handleDivError = (event: React.SyntheticEvent<HTMLDivElement>) => {
    if (event.currentTarget === event.target) { // Check if the error occurred on the div itself
      handleError(new Error(`Error occurred: ${event.message}`));
    }
  };

  return (
    <div
      className="usage-analytics"
      ref={ref}
      onError={handleDivError} // Use a function to handle errors on the div
    >
      {error ? (
        <div role="alert" aria-live="assertive">{error.message}</div> // Add aria-live for accessibility
      ) : (
        message || 'Loading...' // Use 'Loading...' as default message if no message is provided
      )}
    </div>
  );
};

UsageAnalytics.displayName = 'UsageAnalytics';

// Add default props and error handling for better reliability
UsageAnalytics.defaultProps = {
  message: 'Loading...',
};

UsageAnalytics.errorBoundary = ({ error }) => {
  console.error(error);
  return <div>An error occurred: {error.message}</div>;
};

export default UsageAnalytics;