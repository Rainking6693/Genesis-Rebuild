import React, { FC, ReactNode, ErrorInfo } from 'react';

interface Props {
  errorMessage: string; // Use errorMessage instead of message for better semantics
  errorType?: string; // Add errorType to provide more context about the error
  errorInfo?: ErrorInfo; // Add errorInfo for component-level error handling
  isVisible?: boolean; // Add isVisible to control the visibility of the error component
}

const ErrorComponent: FC<Props> = ({ errorMessage, errorType, isVisible = true, errorInfo }) => {
  if (!isVisible || !errorMessage) {
    return null; // Don't render the error component if isVisible is false or errorMessage is empty
  }

  const handleError = (error: Error) => {
    console.error(error); // Log the error to the console
    // Add your custom error handling logic here
  };

  // Use the errorInfo prop to handle component-level errors
  if (errorInfo) {
    handleError(errorInfo.error);
  }

  return (
    <div className="error-message" role="alert">
      {/* Add an aria-label for screen readers */}
      <span className="visually-hidden">Error:</span>
      <span>{errorMessage}</span>
      {/* Add errorType if provided */}
      {errorType && <span> ({errorType})</span>}
    </div>
  );
};

// Add a default export for better code organization
export default ErrorComponent;

In this updated version, I've added an `errorInfo` prop to handle component-level errors, and a `handleError` function to log the error to the console. You can replace the console.error() call with your custom error handling logic. Additionally, I've added a check for both `isVisible` and `errorMessage` before rendering the component to ensure that it only renders when both conditions are met.