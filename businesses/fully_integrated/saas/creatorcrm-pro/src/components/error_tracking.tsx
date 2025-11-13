// ErrorMessageProps.ts
export interface ErrorMessageProps {
  message: string;
  error?: Error | null; // Add null check for error
  isVisible?: boolean; // Flag to control visibility of the error message
}

// MyComponent.tsx
import React, { useState, useEffect } from 'react';
import { ErrorMessageProps } from './ErrorMessageProps';
import styles from './ErrorMessage.module.css'; // Add a CSS module for styling

const MyComponent: React.FC<ErrorMessageProps> = ({ message, error, isVisible = true }) => {
  const [errorMessage, setErrorMessage] = useState(message);

  useEffect(() => {
    if (error) {
      setErrorMessage(error.message);
    }
  }, [error]);

  // Check if isVisible is a boolean
  const isVisibleBoolean = typeof isVisible === 'boolean';

  return (
    <div className={`${styles.errorMessage} ${isVisible ? '' : styles.visuallyHidden}`} role="alert" aria-live="assertive" aria-describedby="error-message" data-testid="error-message-container">
      {isVisibleBoolean && errorMessage && (
        <div id="error-message" title={errorMessage}>{errorMessage}</div>
      )}
    </div>
  );
};

export default MyComponent;

// ErrorMessageProps.ts
export interface ErrorMessageProps {
  message: string;
  error?: Error | null; // Add null check for error
  isVisible?: boolean; // Flag to control visibility of the error message
}

// MyComponent.tsx
import React, { useState, useEffect } from 'react';
import { ErrorMessageProps } from './ErrorMessageProps';
import styles from './ErrorMessage.module.css'; // Add a CSS module for styling

const MyComponent: React.FC<ErrorMessageProps> = ({ message, error, isVisible = true }) => {
  const [errorMessage, setErrorMessage] = useState(message);

  useEffect(() => {
    if (error) {
      setErrorMessage(error.message);
    }
  }, [error]);

  // Check if isVisible is a boolean
  const isVisibleBoolean = typeof isVisible === 'boolean';

  return (
    <div className={`${styles.errorMessage} ${isVisible ? '' : styles.visuallyHidden}`} role="alert" aria-live="assertive" aria-describedby="error-message" data-testid="error-message-container">
      {isVisibleBoolean && errorMessage && (
        <div id="error-message" title={errorMessage}>{errorMessage}</div>
      )}
    </div>
  );
};

export default MyComponent;