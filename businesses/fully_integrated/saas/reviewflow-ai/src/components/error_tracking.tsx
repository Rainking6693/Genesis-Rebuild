import React, { useEffect, useCallback } from 'react';
import * as Sentry from '@sentry/react';

interface Props {
  message: string;
  onError?: (error: Error) => void; // Add error handling callback
}

const MyComponent: React.FC<Props> = ({ message, onError }) => {
  const errorHandler = useCallback((error: Error) => {
    if (onError) onError(error);
    else {
      console.error(error); // Log errors for better debugging
      Sentry.captureException(error); // Send errors to Sentry for tracking
    }
  }, [onError]);

  useEffect(() => {
    const cleanup = () => {
      window.removeEventListener('error', errorHandler);
      window.removeEventListener('unhandledrejection', errorHandler);
    };

    window.addEventListener('error', errorHandler);
    window.addEventListener('unhandledrejection', errorHandler);

    return () => {
      cleanup();
    };
  }, [errorHandler]); // Ensure error handler is only created once

  return (
    <div role="alert" aria-live="assertive">
      {message}
    </div>
  );
};

export default MyComponent;

import React, { useEffect, useCallback } from 'react';
import * as Sentry from '@sentry/react';

interface Props {
  message: string;
  onError?: (error: Error) => void; // Add error handling callback
}

const MyComponent: React.FC<Props> = ({ message, onError }) => {
  const errorHandler = useCallback((error: Error) => {
    if (onError) onError(error);
    else {
      console.error(error); // Log errors for better debugging
      Sentry.captureException(error); // Send errors to Sentry for tracking
    }
  }, [onError]);

  useEffect(() => {
    const cleanup = () => {
      window.removeEventListener('error', errorHandler);
      window.removeEventListener('unhandledrejection', errorHandler);
    };

    window.addEventListener('error', errorHandler);
    window.addEventListener('unhandledrejection', errorHandler);

    return () => {
      cleanup();
    };
  }, [errorHandler]); // Ensure error handler is only created once

  return (
    <div role="alert" aria-live="assertive">
      {message}
    </div>
  );
};

export default MyComponent;