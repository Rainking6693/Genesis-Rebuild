import React, { FC, useState, useEffect } from 'react';

interface Props {
  message: string;
  errorMessage?: string;
  isLoading?: boolean;
}

const MyComponent: FC<Props> = ({ message, errorMessage, isLoading }) => {
  const [isError, setIsError] = useState(!!errorMessage);

  useEffect(() => {
    if (errorMessage) {
      setIsError(true);
    } else {
      setIsError(false);
    }
  }, [errorMessage]);

  return (
    <div>
      {isError && <div className="error-message">{errorMessage}</div>}
      {isLoading && <div className="loading-message">Loading...</div>}
      <div className={`message ${isError ? 'error' : ''}`}>{message}</div>
      <style jsx>{`
        .message {
          font-size: 1.2rem;
          font-weight: bold;
        }
        .error-message {
          color: red;
        }
        .loading-message {
          color: gray;
        }
      `}</style>
    </div>
  );
};

export default MyComponent;

In this updated version, I added an optional `isLoading` prop to display a loading message if the backup system is currently processing a request. This provides better resiliency by giving users feedback about the status of the backup system.

I also added a default value for the `isError` state to `false` in case the `errorMessage` prop is not provided. This ensures that the error message is hidden when there's no error.

Lastly, I added a new CSS class `loading-message` to style the loading message with a gray color. This improves accessibility by providing a clear indication that the backup system is currently working.

These changes make the component more flexible, robust, and user-friendly.