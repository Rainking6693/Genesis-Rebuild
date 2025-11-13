import React, { FC, ReactNode, useId } from 'react';

interface Props {
  errorMessage: string; // Use errorMessage instead of message for better semantics
  errorType?: string; // Add errorType to provide more context about the error
  isVisible?: boolean; // Add isVisible to control the visibility of the error component
}

const ErrorComponent: FC<Props> = ({ errorMessage, errorType, isVisible = true }) => {
  const id = useId(); // Generate a unique ID for each error component for better accessibility

  if (!isVisible) {
    return null; // Return null if the error component is hidden
  }

  return (
    <div id={id} className="error-message" role="alert">
      <strong>{errorType ? `${errorType}: ` : ''}</strong>
      {errorMessage}
      <span className="sr-only">Error message</span> // Add screen reader only text for better accessibility
    </div>
  );
};

// Add a default export for better code organization
export default ErrorComponent;

import React, { FC, ReactNode, useId } from 'react';

interface Props {
  errorMessage: string; // Use errorMessage instead of message for better semantics
  errorType?: string; // Add errorType to provide more context about the error
  isVisible?: boolean; // Add isVisible to control the visibility of the error component
}

const ErrorComponent: FC<Props> = ({ errorMessage, errorType, isVisible = true }) => {
  const id = useId(); // Generate a unique ID for each error component for better accessibility

  if (!isVisible) {
    return null; // Return null if the error component is hidden
  }

  return (
    <div id={id} className="error-message" role="alert">
      <strong>{errorType ? `${errorType}: ` : ''}</strong>
      {errorMessage}
      <span className="sr-only">Error message</span> // Add screen reader only text for better accessibility
    </div>
  );
};

// Add a default export for better code organization
export default ErrorComponent;