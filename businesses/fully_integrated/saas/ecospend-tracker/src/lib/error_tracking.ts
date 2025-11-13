import React, { FC, useEffect, useRef, useState } from 'react';

interface Props {
  errorMessage?: string; // Make errorMessage optional
  onDismiss?: () => void; // Keep onDismiss optional
}

const ErrorComponent: FC<Props> = ({ errorMessage, onDismiss }) => {
  const [error, setError] = useState(errorMessage); // Store errorMessage in state for better handling
  const errorRef = useRef<HTMLDivElement>(null); // Store a reference to the error element for focus management

  useEffect(() => {
    if (errorRef.current && error) {
      errorRef.current.focus(); // Automatically focus the error message when it appears
    }
  }, [error]);

  // Handle edge cases where errorMessage is null or undefined
  useEffect(() => {
    if (!error) {
      setError(null);
    }
  }, [errorMessage]);

  return (
    error && (
      <div className="error-message" role="alert" aria-live="assertive">
        <button
          type="button"
          className="error-message__dismiss"
          onClick={onDismiss}
          aria-label="Dismiss error"
        >
          X
        </button>
        <div key={error} ref={errorRef}>
          {error}
        </div>
      </div>
    )
  );
};

// Add a unique identifier for the component
ErrorComponent.displayName = 'EcoSpendTrackerErrorComponent';

// Add a defaultProps object for better default values
ErrorComponent.defaultProps = {
  onDismiss: () => {}, // Default onDismiss function to do nothing
};

// Export default and named exports
export { ErrorComponent as default };
export { ErrorComponent };

In this updated version, I've added a state variable `error` to store the error message, which allows us to handle edge cases where `errorMessage` is null or undefined. I've also added an `aria-live` attribute to the error container to make it more accessible, and I've added a `key` prop to the error message for better React performance.