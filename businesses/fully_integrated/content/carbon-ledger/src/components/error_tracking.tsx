import React, { useState, useEffect, useCallback } from 'react';

interface ErrorTrackingProps {
  title: string;
  content: React.ReactNode;
  onError?: (error: Error) => void;
  fallbackContent?: React.ReactNode;
  errorMessage?: string;
}

const ErrorTracking: React.FC<ErrorTrackingProps> = ({
  title,
  content,
  onError,
  fallbackContent = 'An error occurred. Please try again later.',
  errorMessage = 'An error occurred.',
}) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [title, content]);

  const handleError = useCallback(
    (error: Error) => {
      setHasError(true);
      if (onError) {
        onError(error);
      }
    },
    [onError]
  );

  return (
    <div className="error-tracking">
      <h2 className="error-tracking__title">{title}</h2>
      {hasError ? (
        <div className="error-tracking__fallback" role="alert">
          {fallbackContent || errorMessage}
        </div>
      ) : (
        <div className="error-tracking__content" aria-live="polite">
          {content}
        </div>
      )}
    </div>
  );
};

export default ErrorTracking;

import React, { useState, useEffect, useCallback } from 'react';

interface ErrorTrackingProps {
  title: string;
  content: React.ReactNode;
  onError?: (error: Error) => void;
  fallbackContent?: React.ReactNode;
  errorMessage?: string;
}

const ErrorTracking: React.FC<ErrorTrackingProps> = ({
  title,
  content,
  onError,
  fallbackContent = 'An error occurred. Please try again later.',
  errorMessage = 'An error occurred.',
}) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [title, content]);

  const handleError = useCallback(
    (error: Error) => {
      setHasError(true);
      if (onError) {
        onError(error);
      }
    },
    [onError]
  );

  return (
    <div className="error-tracking">
      <h2 className="error-tracking__title">{title}</h2>
      {hasError ? (
        <div className="error-tracking__fallback" role="alert">
          {fallbackContent || errorMessage}
        </div>
      ) : (
        <div className="error-tracking__content" aria-live="polite">
          {content}
        </div>
      )}
    </div>
  );
};

export default ErrorTracking;