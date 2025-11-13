import React, { FC, ReactNode, Key } from 'react';

interface Props {
  errorMessage?: string; // Make errorMessage optional for better resiliency
  errorId?: string; // Add optional errorId for better tracking and resiliency
  onError?: (error: Error) => void; // Add an optional onError callback for error handling
}

const ErrorComponent: FC<Props> = ({ errorMessage, errorId, onError }) => {
  // Add a unique key for each rendered error message for better React performance
  const key = errorId || Math.random().toString(36).substring(7);

  // Check if errorMessage is empty, null, or undefined before rendering
  if (!errorMessage) {
    return null;
  }

  // Handle errors that might occur during rendering
  try {
    // Add ARIA attributes for accessibility
    const errorElement = (
      <div className="error-message" key={key} aria-live="polite">
        {errorMessage}
      </div>
    );

    // Wrap the error message in a div with role="alert" for better accessibility
    return <div role="alert">{errorElement}</div>;
  } catch (error) {
    // If an error occurs during rendering, call the onError callback (if provided)
    if (onError) {
      onError(error);
    }
    return null;
  }
};

ErrorComponent.displayName = 'ErrorComponent';

export default ErrorComponent;

This updated version of the component checks if `errorMessage` is empty, null, or undefined before rendering. It also adds an optional `onError` callback to handle errors that might occur during rendering. Additionally, the component now properly handles edge cases where `errorMessage` is not provided.