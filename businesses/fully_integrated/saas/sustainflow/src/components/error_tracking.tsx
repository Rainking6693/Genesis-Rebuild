import React, { FC, useEffect, useState } from 'react';

interface Props {
  errorMessage: string;
  onErrorClear?: () => void; // Add an optional callback to clear the error message
  onError?: (error: Error) => void; // Add an optional callback to handle errors
}

const ErrorComponent: FC<Props> = ({ errorMessage, onErrorClear, onError }) => {
  const [isVisible, setIsVisible] = useState(!!errorMessage); // Show the error message if it exists

  useEffect(() => {
    if (!errorMessage) {
      setIsVisible(false);
    }

    if (onErrorClear && isVisible) {
      onErrorClear(); // Call the clear error callback if the error message is visible
    }
  }, [errorMessage, onErrorClear, isVisible]);

  useEffect(() => {
    if (errorMessage && !isVisible) {
      setIsVisible(true);
    }

    if (onError && errorMessage) {
      onError(new Error(errorMessage)); // Convert the error message to an Error object and call the error handling callback
    }
  }, [errorMessage, isVisible, onError]);

  return (
    <div className="error-message" role="alert">
      {isVisible && <p>{errorMessage}</p>}
      {/* Add a close button for accessibility */}
      {isVisible && (
        <button
          type="button"
          onClick={() => setIsVisible(false)}
          aria-label="Close error message"
        >
          X
        </button>
      )}
    </div>
  );
};

export default ErrorComponent;

In this updated version, I added an optional `onError` callback to handle errors. This callback will be called when the error message is first set and when it becomes invisible. Additionally, I added a check to ensure that the error message is displayed when it is first set. This helps handle edge cases where the error message might be set multiple times in quick succession.