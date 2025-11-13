import React, { FC, ReactNode, Key } from 'react';

interface Props {
  errorMessage: string; // Use errorMessage instead of message for better semantics
  errorId?: string; // Add optional errorId for better tracking and resiliency
}

const ErrorComponent: FC<Props> = ({ errorMessage, errorId }) => {
  // Ensure errorId is a valid string
  const validErrorId = typeof errorId === 'string' ? errorId : undefined;

  // Generate a unique key if errorId is not provided
  const uniqueKey = validErrorId || Math.random().toString(36).substring(7);

  // Check if errorMessage is empty or null before rendering
  if (!errorMessage) {
    return null;
  }

  // Add ARIA attributes for accessibility
  const errorContent = (
    <>
      <span className="visually-hidden">Error:</span>
      <span id={`error-${uniqueKey}`} className="error-message" role="alert">
        {errorMessage}
      </span>
    </>
  );

  // Add a unique key for each component instance for better React performance
  return <div data-testid="error-component" key={uniqueKey}>{errorContent}</div>;
};

// Add a unique displayName for better React Developer Tools navigation
ErrorComponent.displayName = 'ErrorComponent';

export default ErrorComponent;

import React, { FC, ReactNode, Key } from 'react';

interface Props {
  errorMessage: string; // Use errorMessage instead of message for better semantics
  errorId?: string; // Add optional errorId for better tracking and resiliency
}

const ErrorComponent: FC<Props> = ({ errorMessage, errorId }) => {
  // Ensure errorId is a valid string
  const validErrorId = typeof errorId === 'string' ? errorId : undefined;

  // Generate a unique key if errorId is not provided
  const uniqueKey = validErrorId || Math.random().toString(36).substring(7);

  // Check if errorMessage is empty or null before rendering
  if (!errorMessage) {
    return null;
  }

  // Add ARIA attributes for accessibility
  const errorContent = (
    <>
      <span className="visually-hidden">Error:</span>
      <span id={`error-${uniqueKey}`} className="error-message" role="alert">
        {errorMessage}
      </span>
    </>
  );

  // Add a unique key for each component instance for better React performance
  return <div data-testid="error-component" key={uniqueKey}>{errorContent}</div>;
};

// Add a unique displayName for better React Developer Tools navigation
ErrorComponent.displayName = 'ErrorComponent';

export default ErrorComponent;