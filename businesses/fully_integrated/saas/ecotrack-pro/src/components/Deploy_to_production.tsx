import React, { FC, ReactNode, useEffect, useRef, useCallback } from 'react';

interface Props {
  children: ReactNode;
  error?: Error;
}

const MyComponent: FC<Props> = ({ children, error }) => {
  const logError = useCallback((error: Error) => {
    console.error('MyComponent encountered an error:', error);
  }, []);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (error) {
      logError(error);
    }
  }, [error, logError]);

  const handleError = (error: Error) => {
    logError(error);
    // You can add additional error handling logic here, such as notifying the user or sending the error to an error reporting service.
  };

  const getErrorMessage = (error: Error) => {
    return error.message || String(error);
  };

  const getAccessibleErrorMessage = (error: Error) => {
    // Transform the error message into a more accessible format, such as using ARIA attributes or providing a summary of the error.
    return `An error occurred: ${getErrorMessage(error)}`;
  };

  if (error) {
    return (
      <div data-testid="error-container" role="alert">
        <span id="error-message">{getAccessibleErrorMessage(error)}</span>
        <div aria-hidden={true}>{getErrorMessage(error)}</div>
      </div>
    );
  }

  return <div ref={ref} dangerouslySetInnerHTML={{ __html: children }} />;
};

MyComponent.displayName = 'EcoTrackProMyComponent';

export default MyComponent;

import React, { FC, ReactNode, useEffect, useRef, useCallback } from 'react';

interface Props {
  children: ReactNode;
  error?: Error;
}

const MyComponent: FC<Props> = ({ children, error }) => {
  const logError = useCallback((error: Error) => {
    console.error('MyComponent encountered an error:', error);
  }, []);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (error) {
      logError(error);
    }
  }, [error, logError]);

  const handleError = (error: Error) => {
    logError(error);
    // You can add additional error handling logic here, such as notifying the user or sending the error to an error reporting service.
  };

  const getErrorMessage = (error: Error) => {
    return error.message || String(error);
  };

  const getAccessibleErrorMessage = (error: Error) => {
    // Transform the error message into a more accessible format, such as using ARIA attributes or providing a summary of the error.
    return `An error occurred: ${getErrorMessage(error)}`;
  };

  if (error) {
    return (
      <div data-testid="error-container" role="alert">
        <span id="error-message">{getAccessibleErrorMessage(error)}</span>
        <div aria-hidden={true}>{getErrorMessage(error)}</div>
      </div>
    );
  }

  return <div ref={ref} dangerouslySetInnerHTML={{ __html: children }} />;
};

MyComponent.displayName = 'EcoTrackProMyComponent';

export default MyComponent;