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
      data-testid="error-tracking"
      role={role}
      aria-live={ariaLive}
      aria-describedby={ariaDescribedBy}
      style={{
        position: 'fixed',
        top: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: '#f44336',
        color: '#fff',
        padding: '16px 24px',
        borderRadius: '4px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
      }}
    >
      <h3 data-testid="title">{title}</h3>
      <p data-testid="content">{content}</p>
      <button
        type="button"
        onClick={handleClose}
        style={{
          marginTop: '16px',
          backgroundColor: '#fff',
          color: '#f44336',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Close
      </button>
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
      data-testid="error-tracking"
      role={role}
      aria-live={ariaLive}
      aria-describedby={ariaDescribedBy}
      style={{
        position: 'fixed',
        top: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: '#f44336',
        color: '#fff',
        padding: '16px 24px',
        borderRadius: '4px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
      }}
    >
      <h3 data-testid="title">{title}</h3>
      <p data-testid="content">{content}</p>
      <button
        type="button"
        onClick={handleClose}
        style={{
          marginTop: '16px',
          backgroundColor: '#fff',
          color: '#f44336',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Close
      </button>
    </div>
  );
};

export default ErrorTracking;