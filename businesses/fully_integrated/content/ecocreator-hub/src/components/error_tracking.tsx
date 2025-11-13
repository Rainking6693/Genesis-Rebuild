import React, { PropsWithChildren, ReactNode } from 'react';

interface Props {
  errorMessage: string; // Use errorMessage instead of message for better semantics
  errorType?: string; // Add errorType to provide more context about the error
  errorDetails?: ReactNode; // Add errorDetails to provide additional details about the error
}

const ErrorComponent: React.FC<Props> = ({ errorMessage, errorType, errorDetails }) => {
  // Add a unique key to each error message for better performance in lists
  const uniqueKey = Math.random().toString(36).substring(7);

  // Check if errorMessage is empty or null before rendering
  if (!errorMessage) {
    return null;
  }

  // Add role="alert" for better accessibility
  return (
    <div className="error-message" role="alert" aria-live="polite">
      {errorType && <span className="error-type">{errorType}: </span>}
      {errorDetails && <span className="error-details">{errorDetails}</span>}
      <span id={uniqueKey} className="error-message-text">
        {errorMessage}
      </span>
    </div>
  );
};

export default ErrorComponent;

In this version, I've added an `errorDetails` prop to allow for additional details about the error. This can be useful when you want to provide more context or debugging information. I've also added a `ReactNode` type to the `errorDetails` prop to ensure that it can accept any valid React element or text.