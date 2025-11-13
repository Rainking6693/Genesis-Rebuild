import React, { useState, useEffect } from 'react';

interface ErrorTrackingProps {
  errorMessage?: string;
  errorContext?: string;
  onClose?: () => void;
}

const ErrorTracking: React.FC<ErrorTrackingProps> = ({
  errorMessage = 'An unexpected error occurred.',
  errorContext = 'No additional context available.',
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) {
        onClose();
      }
    }, 10000); // Auto-close the error message after 10 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  return isVisible ? (
    <div
      role="alert"
      aria-live="assertive"
      className="error-tracking"
      aria-atomic="true"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          setIsVisible(false);
          if (onClose) {
            onClose();
          }
        }
      }}
    >
      <div className="error-tracking__content">
        <h1 className="error-tracking__title">Error Tracking</h1>
        <p className="error-tracking__message">Error Message: {errorMessage}</p>
        <p className="error-tracking__context">Error Context: {errorContext}</p>
        <button
          className="error-tracking__close-btn"
          onClick={() => {
            setIsVisible(false);
            if (onClose) {
              onClose();
            }
          }}
        >
          Close
        </button>
      </div>
    </div>
  ) : null;
};

export default ErrorTracking;

import React, { useState, useEffect } from 'react';

interface ErrorTrackingProps {
  errorMessage?: string;
  errorContext?: string;
  onClose?: () => void;
}

const ErrorTracking: React.FC<ErrorTrackingProps> = ({
  errorMessage = 'An unexpected error occurred.',
  errorContext = 'No additional context available.',
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) {
        onClose();
      }
    }, 10000); // Auto-close the error message after 10 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  return isVisible ? (
    <div
      role="alert"
      aria-live="assertive"
      className="error-tracking"
      aria-atomic="true"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          setIsVisible(false);
          if (onClose) {
            onClose();
          }
        }
      }}
    >
      <div className="error-tracking__content">
        <h1 className="error-tracking__title">Error Tracking</h1>
        <p className="error-tracking__message">Error Message: {errorMessage}</p>
        <p className="error-tracking__context">Error Context: {errorContext}</p>
        <button
          className="error-tracking__close-btn"
          onClick={() => {
            setIsVisible(false);
            if (onClose) {
              onClose();
            }
          }}
        >
          Close
        </button>
      </div>
    </div>
  ) : null;
};

export default ErrorTracking;