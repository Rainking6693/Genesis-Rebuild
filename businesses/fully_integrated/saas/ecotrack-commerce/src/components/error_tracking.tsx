import React, { useState, useEffect, useCallback } from 'react';

interface ErrorTrackingProps {
  title?: string;
  content?: string;
  onClose?: () => void;
  autoCloseDelay?: number;
  ariaLive?: 'polite' | 'assertive' | 'off';
  role?: string;
  'aria-describedby'?: string;
}

const ErrorTracking: React.FC<ErrorTrackingProps> = ({
  title = 'Error',
  content = 'An error has occurred. Please try again later.',
  onClose,
  autoCloseDelay = 5000,
  ariaLive = 'assertive',
  role = 'alert',
  'aria-describedby': ariaDescribedBy,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [timer, setTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    if (typeof onClose === 'function') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (autoCloseDelay > 0) {
      setTimer(
        setTimeout(() => {
          handleClose();
        }, autoCloseDelay)
      );
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [autoCloseDelay, handleClose, timer]);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      role={role}
      aria-live={ariaLive}
      aria-describedby={ariaDescribedBy}
      data-testid="error-tracking"
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: '#f44336',
        color: '#fff',
        padding: '16px 24px',
        borderRadius: '4px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
        zIndex: 9999,
      }}
    >
      <h3 data-testid="title">{title}</h3>
      <p data-testid="content">{content}</p>
      {typeof onClose === 'function' && (
        <button
          type="button"
          onClick={handleClose}
          style={{
            backgroundColor: 'transparent',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            marginLeft: '16px',
          }}
        >
          Close
        </button>
      )}
    </div>
  );
};

export default ErrorTracking;

import React, { useState, useEffect, useCallback } from 'react';

interface ErrorTrackingProps {
  title?: string;
  content?: string;
  onClose?: () => void;
  autoCloseDelay?: number;
  ariaLive?: 'polite' | 'assertive' | 'off';
  role?: string;
  'aria-describedby'?: string;
}

const ErrorTracking: React.FC<ErrorTrackingProps> = ({
  title = 'Error',
  content = 'An error has occurred. Please try again later.',
  onClose,
  autoCloseDelay = 5000,
  ariaLive = 'assertive',
  role = 'alert',
  'aria-describedby': ariaDescribedBy,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [timer, setTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    if (typeof onClose === 'function') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (autoCloseDelay > 0) {
      setTimer(
        setTimeout(() => {
          handleClose();
        }, autoCloseDelay)
      );
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [autoCloseDelay, handleClose, timer]);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      role={role}
      aria-live={ariaLive}
      aria-describedby={ariaDescribedBy}
      data-testid="error-tracking"
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: '#f44336',
        color: '#fff',
        padding: '16px 24px',
        borderRadius: '4px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
        zIndex: 9999,
      }}
    >
      <h3 data-testid="title">{title}</h3>
      <p data-testid="content">{content}</p>
      {typeof onClose === 'function' && (
        <button
          type="button"
          onClick={handleClose}
          style={{
            backgroundColor: 'transparent',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            marginLeft: '16px',
          }}
        >
          Close
        </button>
      )}
    </div>
  );
};

export default ErrorTracking;