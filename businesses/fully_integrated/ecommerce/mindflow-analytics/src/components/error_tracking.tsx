import React, { useState, useEffect, useCallback, useRef } from 'react';
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import { ErrorBoundaryProps } from '@sentry/react/dist/types';

Sentry.init({
  dsn: 'YOUR_SENTRY_DSN', // Replace with your Sentry DSN
  integrations: [new BrowserTracing()],
  tracesSampleRate: 0.1,
  environment: process.env.NODE_ENV, // Set the environment
});

interface ErrorTrackingProps extends ErrorBoundaryProps {
  children: React.ReactNode;
  fallbackComponent?: React.ReactNode;
  onError?: (error: Error) => void;
  onReset?: () => void;
}

const ErrorTracking: React.FC<ErrorTrackingProps> = ({
  children,
  fallbackComponent = <div>Something went wrong. Please try again later.</div>,
  onError,
  onReset,
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const errorRef = useRef<Error | null>(null);

  const handleError = useCallback(
    (error: Error) => {
      setHasError(true);
      errorRef.current = error;
      Sentry.captureException(error);
      onError?.(error);
    },
    [onError]
  );

  const handleReset = useCallback(() => {
    setHasError(false);
    errorRef.current = null;
    onReset?.();
  }, [onReset]);

  useEffect(() => {
    if (hasError && errorRef.current) {
      Sentry.captureException(new Error('ErrorTracking component caught an error.', { originalError: errorRef.current }));
    }
  }, [hasError]);

  return (
    <Sentry.ErrorBoundary
      fallback={fallbackComponent}
      onError={handleError}
      onReset={handleReset}
      showDialog
      reportDialogOptions={{
        title: 'MindFlow Analytics - Error Report',
        subtitle: 'An error occurred in the application. Please provide details to help us resolve the issue.',
        labelName: 'Name',
        labelEmail: 'Email',
        labelComments: 'Describe what happened',
        labelClose: 'Close',
        labelSubmit: 'Submit Report',
        errorGeneric: 'An unexpected error occurred. Please try again later.',
        errorFormEntry: 'Please fill out all fields.',
        errorReportSubmitted: 'Thank you for your report!',
        errorReportRejected: 'There was an error submitting your report. Please try again later.',
        closeDialog: handleReset,
      }}
      {...props}
    >
      {children}
    </Sentry.ErrorBoundary>
  );
};

export default ErrorTracking;

import React, { useState, useEffect, useCallback, useRef } from 'react';
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import { ErrorBoundaryProps } from '@sentry/react/dist/types';

Sentry.init({
  dsn: 'YOUR_SENTRY_DSN', // Replace with your Sentry DSN
  integrations: [new BrowserTracing()],
  tracesSampleRate: 0.1,
  environment: process.env.NODE_ENV, // Set the environment
});

interface ErrorTrackingProps extends ErrorBoundaryProps {
  children: React.ReactNode;
  fallbackComponent?: React.ReactNode;
  onError?: (error: Error) => void;
  onReset?: () => void;
}

const ErrorTracking: React.FC<ErrorTrackingProps> = ({
  children,
  fallbackComponent = <div>Something went wrong. Please try again later.</div>,
  onError,
  onReset,
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const errorRef = useRef<Error | null>(null);

  const handleError = useCallback(
    (error: Error) => {
      setHasError(true);
      errorRef.current = error;
      Sentry.captureException(error);
      onError?.(error);
    },
    [onError]
  );

  const handleReset = useCallback(() => {
    setHasError(false);
    errorRef.current = null;
    onReset?.();
  }, [onReset]);

  useEffect(() => {
    if (hasError && errorRef.current) {
      Sentry.captureException(new Error('ErrorTracking component caught an error.', { originalError: errorRef.current }));
    }
  }, [hasError]);

  return (
    <Sentry.ErrorBoundary
      fallback={fallbackComponent}
      onError={handleError}
      onReset={handleReset}
      showDialog
      reportDialogOptions={{
        title: 'MindFlow Analytics - Error Report',
        subtitle: 'An error occurred in the application. Please provide details to help us resolve the issue.',
        labelName: 'Name',
        labelEmail: 'Email',
        labelComments: 'Describe what happened',
        labelClose: 'Close',
        labelSubmit: 'Submit Report',
        errorGeneric: 'An unexpected error occurred. Please try again later.',
        errorFormEntry: 'Please fill out all fields.',
        errorReportSubmitted: 'Thank you for your report!',
        errorReportRejected: 'There was an error submitting your report. Please try again later.',
        closeDialog: handleReset,
      }}
      {...props}
    >
      {children}
    </Sentry.ErrorBoundary>
  );
};

export default ErrorTracking;