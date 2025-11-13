import React, { useState, useEffect, useCallback } from 'react';

interface CustomerSupportBotProps {
  title: string;
  content: string;
  onClose?: () => void;
  autoCloseDelay?: number;
}

const CustomerSupportBot: React.FC<CustomerSupportBotProps> = ({
  title,
  content,
  onClose,
  autoCloseDelay = 10000,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    const timer = setTimeout(handleClose, autoCloseDelay);

    return () => clearTimeout(timer);
  }, [autoCloseDelay, handleClose]);

  return isVisible ? (
    <div
      role="alert"
      aria-live="polite"
      className="customer-support-bot"
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: '#fff',
        padding: '20px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        borderRadius: '5px',
        maxWidth: '300px',
        zIndex: 9999,
      }}
    >
      <h1 className="customer-support-bot__title">{title}</h1>
      <p className="customer-support-bot__content">{content}</p>
      <button
        className="customer-support-bot__close-btn"
        onClick={handleClose}
        aria-label="Close customer support bot"
      >
        Close
      </button>
    </div>
  ) : null;
};

export default CustomerSupportBot;

import React, { useState, useEffect, useCallback } from 'react';

interface CustomerSupportBotProps {
  title: string;
  content: string;
  onClose?: () => void;
  autoCloseDelay?: number;
}

const CustomerSupportBot: React.FC<CustomerSupportBotProps> = ({
  title,
  content,
  onClose,
  autoCloseDelay = 10000,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    const timer = setTimeout(handleClose, autoCloseDelay);

    return () => clearTimeout(timer);
  }, [autoCloseDelay, handleClose]);

  return isVisible ? (
    <div
      role="alert"
      aria-live="polite"
      className="customer-support-bot"
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: '#fff',
        padding: '20px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        borderRadius: '5px',
        maxWidth: '300px',
        zIndex: 9999,
      }}
    >
      <h1 className="customer-support-bot__title">{title}</h1>
      <p className="customer-support-bot__content">{content}</p>
      <button
        className="customer-support-bot__close-btn"
        onClick={handleClose}
        aria-label="Close customer support bot"
      >
        Close
      </button>
    </div>
  ) : null;
};

export default CustomerSupportBot;