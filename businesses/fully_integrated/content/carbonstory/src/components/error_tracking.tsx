import React, { FC, useEffect, useState } from 'react';

interface Props {
  errorMessage: string;
  onErrorClear?: () => void; // Adding an optional onErrorClear callback for clearing the error message
  visibilityDelay?: number; // Adding an optional visibilityDelay for controlling the delay before the error message becomes visible
}

const ErrorComponent: FC<Props> = ({ errorMessage, onErrorClear, visibilityDelay }) => {
  const [visible, setVisible] = useState(!!errorMessage); // Show the error message only if it's not empty

  useEffect(() => {
    if (!errorMessage) {
      setVisible(false);
    }

    if (onErrorClear) {
      onErrorClear(); // Clear the error message if provided
    }

    if (errorMessage && visible === false) {
      setTimeout(() => {
        setVisible(true);
      }, visibilityDelay || 1000); // Show the error message after the specified delay
    }
  }, [errorMessage, onErrorClear, visibilityDelay]);

  return (
    <div className="error-message" role="alert" aria-live="assertive" aria-atomic="true">
      {visible && <p key={errorMessage}>{errorMessage}</p>}
      {/* Adding ARIA attributes for accessibility */}
    </div>
  );
};

export default ErrorComponent;

In this updated version, I added an optional `visibilityDelay` property to control the delay before the error message becomes visible. This can be useful for improving the user experience by preventing the error message from appearing too quickly. Additionally, I added a `key` attribute to the error message paragraph to ensure the component remains accessible when multiple error messages are displayed.