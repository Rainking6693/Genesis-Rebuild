import React, { useState, useEffect, useCallback, useRef } from 'react';

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
  content = 'An unexpected error occurred. Please try again later.',
  onClose,
  autoCloseDelay = 5000,
  ariaLive = 'assertive',
  role = 'alert',
  'aria-describedby': ariaDescribedBy,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (autoCloseDelay > 0) {
      timerRef.current = setTimeout(handleClose, autoCloseDelay);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [autoCloseDelay, handleClose]);

  useEffect(() => {
    // Focus the close button when the component is rendered
    const closeButton = document.querySelector<HTMLButtonElement>(
      '[data-testid="close-button"]'
    );
    if (closeButton) {
      closeButton.focus();
    }
  }, []);

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
      }}
    >
      <h3 data-testid="title">{title}</h3>
      <p data-testid="content">{content}</p>
      <button
        data-testid="close-button"
        onClick={handleClose}
        style={{
          backgroundColor: 'transparent',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          fontSize: '16px',
          position: 'absolute',
          top: '8px',
          right: '8px',
        }}
      >
        &times;
      </button>
    </div>
  );
};

export default ErrorTracking;

import React, { useState, useEffect, useCallback, useRef } from 'react';

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
  content = 'An unexpected error occurred. Please try again later.',
  onClose,
  autoCloseDelay = 5000,
  ariaLive = 'assertive',
  role = 'alert',
  'aria-describedby': ariaDescribedBy,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (autoCloseDelay > 0) {
      timerRef.current = setTimeout(handleClose, autoCloseDelay);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [autoCloseDelay, handleClose]);

  useEffect(() => {
    // Focus the close button when the component is rendered
    const closeButton = document.querySelector<HTMLButtonElement>(
      '[data-testid="close-button"]'
    );
    if (closeButton) {
      closeButton.focus();
    }
  }, []);

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
      }}
    >
      <h3 data-testid="title">{title}</h3>
      <p data-testid="content">{content}</p>
      <button
        data-testid="close-button"
        onClick={handleClose}
        style={{
          backgroundColor: 'transparent',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          fontSize: '16px',
          position: 'absolute',
          top: '8px',
          right: '8px',
        }}
      >
        &times;
      </button>
    </div>
  );
};

export default ErrorTracking;