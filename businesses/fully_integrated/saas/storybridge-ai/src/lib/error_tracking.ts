import React, { useState, useEffect } from 'react';

interface Props {
  message: string;
  errorId?: string;
  onDismiss?: () => void; // Added a callback for dismissing the error
}

const ErrorTrackingComponent: React.FC<Props> = ({ message, errorId, onDismiss }) => {
  const [showError, setShowError] = useState(true);

  useEffect(() => {
    // Send error to your error tracking service
    if (errorId) {
      sendErrorToTrackingService(errorId, message);
    }
  }, [errorId, message]);

  const handleErrorClick = () => {
    setShowError(!showError);
    onDismiss && onDismiss(); // Call the onDismiss callback if provided
  };

  const handleDocumentClick = (event: MouseEvent) => {
    if (event.target instanceof Element && !event.target.closest('.error-container')) {
      setShowError(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleDocumentClick);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  return (
    <div className="error-container" role="alert">
      <div className={`error ${showError ? 'visible' : 'hidden'}`} aria-live="assertive">
        <button onClick={handleErrorClick} aria-label="Dismiss error">
          X
        </button>
        {message}
      </div>
    </div>
  );
};

// Mock function for sending error to tracking service
const sendErrorToTrackingService = (errorId: string, message: string) => {
  console.log(`Sending error ${errorId} with message: ${message}`);
};

export { ErrorTrackingComponent };

In this updated version:

1. I added an `onDismiss` prop to allow the user to provide a callback for dismissing the error.
2. I added an event listener for document clicks to hide the error when clicking outside the error container.
3. I updated the `handleErrorClick` function to call the `onDismiss` callback if provided.
4. I added the `role="alert"` attribute to the error container for better accessibility.
5. I updated the `aria-label` of the close button to be more descriptive.
6. I kept the mock function for sending errors to the tracking service, which you should replace with your actual error tracking service implementation.