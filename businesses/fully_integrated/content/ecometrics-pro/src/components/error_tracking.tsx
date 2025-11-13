import React, { useState, useEffect } from 'react';

interface Props {
  errorMessage?: string; // Adding optional errorMessage
  onError?: (message: string) => void; // Adding onError callback for handling errors
}

const ErrorComponent: React.FC<Props> = ({ errorMessage, onError }) => {
  const [error, setError] = useState(errorMessage); // Using useState to handle error state

  // If errorMessage is not provided, check if there's an error in state
  const message = error || 'An unexpected error occurred.'; // Default error message

  // Render the error message in a div with proper accessibility
  return (
    <div role="alert" aria-live="assertive">
      <p>{message}</p>
    </div>
  );

  // Handle edge cases by checking if onError callback is provided and errorMessage is not empty
  useEffect(() => {
    if (onError && errorMessage) {
      onError(errorMessage);
    }
  }, [errorMessage, onError]);

  // Add a check for empty errorMessage before setting it to the state
  useEffect(() => {
    if (errorMessage) {
      setError(errorMessage);
    }
  }, [errorMessage]);
};

export default ErrorComponent;

import React, { useState, useEffect } from 'react';

interface Props {
  errorMessage?: string; // Adding optional errorMessage
  onError?: (message: string) => void; // Adding onError callback for handling errors
}

const ErrorComponent: React.FC<Props> = ({ errorMessage, onError }) => {
  const [error, setError] = useState(errorMessage); // Using useState to handle error state

  // If errorMessage is not provided, check if there's an error in state
  const message = error || 'An unexpected error occurred.'; // Default error message

  // Render the error message in a div with proper accessibility
  return (
    <div role="alert" aria-live="assertive">
      <p>{message}</p>
    </div>
  );

  // Handle edge cases by checking if onError callback is provided and errorMessage is not empty
  useEffect(() => {
    if (onError && errorMessage) {
      onError(errorMessage);
    }
  }, [errorMessage, onError]);

  // Add a check for empty errorMessage before setting it to the state
  useEffect(() => {
    if (errorMessage) {
      setError(errorMessage);
    }
  }, [errorMessage]);
};

export default ErrorComponent;