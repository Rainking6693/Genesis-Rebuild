import React, { PropsWithChildren, ReactNode } from 'react';

interface Props {
  errorMessage: string; // Use errorMessage instead of message for better semantics
  errorType?: string; // Add errorType to provide more context about the error
  errorSeverity?: 'info' | 'warning' | 'error'; // Add errorSeverity to indicate the severity of the error
}

const ErrorComponent: React.FC<Props> = ({ errorMessage, errorType, errorSeverity }) => {
  // Use a try-catch block to handle potential JavaScript errors
  try {
    // Check if errorMessage is provided
    if (!errorMessage) {
      throw new Error('ErrorMessage is required');
    }

    // Map errorSeverity to a corresponding CSS class
    const severityClass = errorSeverity
      ? `error-message--${errorSeverity}`
      : 'error-message';

    return (
      <div className={severityClass} role="alert">
        {/* Add an aria-label for screen readers */}
        <span className="visually-hidden">Error:</span>
        {errorMessage}
        {/* If errorType is provided, display it as well */}
        {errorType && <span> ({errorType})</span>}
      </div>
    );
  } catch (error) {
    // If a JavaScript error occurs, display a fallback message
    return (
      <div className="error-message" role="alert">
        <span className="visually-hidden">Error:</span>
        An unexpected error occurred: {error.message}
      </div>
    );
  }
};

// Add a default export for better code organization
export default ErrorComponent;

In this version, I've added a `errorSeverity` prop to indicate the severity of the error, and I've mapped it to a corresponding CSS class. This allows you to style errors based on their severity. I've also added a type check for the `errorMessage` prop to ensure it's always provided. Additionally, I've added a default value for `errorSeverity` to make the component more flexible.