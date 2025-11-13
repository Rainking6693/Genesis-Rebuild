import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';

interface Props {
  // Define the error message property
  errorMessage: string;
  // Define an optional property for the error type
  errorType?: string;
  // Define an optional property for the error source
  errorSource?: string;
  // Define an optional property for the auto-hide duration (in milliseconds)
  autoHideDuration?: number;
}

// Define the MyComponent functional component
const MyComponent: React.FC<Props> = ({ errorMessage, errorType, errorSource, autoHideDuration = 5000 }) => {
  // State to control the visibility of the error message
  const [showError, setShowError] := useState(true);

  // Use effect to handle the visibility of the error message based on a delay
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (showError) {
      timeoutId = setTimeout(() => {
        setShowError(false);
      }, autoHideDuration);
    }

    // Clean up the timeout on unmount or when the showError state changes
    return () => clearTimeout(timeoutId);
  }, [showError, autoHideDuration]);

  // Function to handle the error message click event
  const handleErrorClick = () => {
    setShowError(!showError);
  };

  // Function to handle the error message dismissal manually
  const handleErrorDismiss = () => {
    setShowError(false);
  };

  // Render the error message with additional information and accessibility features
  return (
    <div role="alert" className="error-message" aria-live="assertive">
      {showError && (
        <>
          <button onClick={handleErrorClick} aria-label="Dismiss error">
            X
          </button>
          <strong>{errorType || 'Error'}:</strong> {errorMessage}
          {errorSource && <span> - {errorSource}</span>}
          <button onClick={handleErrorDismiss} style={{ display: 'none' }}>
            Dismiss error
          </button>
        </>
      )}
    </div>
  );
};

// Export the MyComponent for use in other modules
export default MyComponent;

import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';

interface Props {
  // Define the error message property
  errorMessage: string;
  // Define an optional property for the error type
  errorType?: string;
  // Define an optional property for the error source
  errorSource?: string;
  // Define an optional property for the auto-hide duration (in milliseconds)
  autoHideDuration?: number;
}

// Define the MyComponent functional component
const MyComponent: React.FC<Props> = ({ errorMessage, errorType, errorSource, autoHideDuration = 5000 }) => {
  // State to control the visibility of the error message
  const [showError, setShowError] := useState(true);

  // Use effect to handle the visibility of the error message based on a delay
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (showError) {
      timeoutId = setTimeout(() => {
        setShowError(false);
      }, autoHideDuration);
    }

    // Clean up the timeout on unmount or when the showError state changes
    return () => clearTimeout(timeoutId);
  }, [showError, autoHideDuration]);

  // Function to handle the error message click event
  const handleErrorClick = () => {
    setShowError(!showError);
  };

  // Function to handle the error message dismissal manually
  const handleErrorDismiss = () => {
    setShowError(false);
  };

  // Render the error message with additional information and accessibility features
  return (
    <div role="alert" className="error-message" aria-live="assertive">
      {showError && (
        <>
          <button onClick={handleErrorClick} aria-label="Dismiss error">
            X
          </button>
          <strong>{errorType || 'Error'}:</strong> {errorMessage}
          {errorSource && <span> - {errorSource}</span>}
          <button onClick={handleErrorDismiss} style={{ display: 'none' }}>
            Dismiss error
          </button>
        </>
      )}
    </div>
  );
};

// Export the MyComponent for use in other modules
export default MyComponent;