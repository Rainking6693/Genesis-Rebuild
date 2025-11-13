import React, { FC, useEffect, useState } from 'react';

interface Props {
  name: string;
  onError?: (error: Error) => void;
}

const FunctionalComponent: FC<Props> = ({ name, onError }) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const errorHandler = (error: Error | PromiseLike<Error>) => {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else if (error.message) {
        setErrorMessage(error.message);
      }

      if (onError) onError(error as Error);
    };

    // Add global error handling for unhandled exceptions
    const handleGlobalError = (event: Event) => {
      if (event.error) {
        errorHandler(event.error);
      }
    };

    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', (event) => {
      errorHandler(event.reason);
    });

    // Clean up event listeners on component unmount
    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleGlobalError);
    };
  }, [onError]);

  useEffect(() => {
    // Check for empty error message on mount to handle edge cases
    if (errorMessage) {
      const errorMessageElement = document.querySelector('.error-message');
      if (errorMessageElement) {
        errorMessageElement.focus();
      }
    }
  }, [errorMessage]);

  return (
    <div>
      {errorMessage && (
        <div className="error-message" role="alert">
          {errorMessage}
        </div>
      )}
      <h1>Hello, {name}!</h1>
    </div>
  );
};

FunctionalComponent.defaultProps = {
  onError: (error: Error) => {
    console.error(error);
  },
};

export default FunctionalComponent;

import React, { FC, useEffect, useState } from 'react';

interface Props {
  name: string;
  onError?: (error: Error) => void;
}

const FunctionalComponent: FC<Props> = ({ name, onError }) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const errorHandler = (error: Error | PromiseLike<Error>) => {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else if (error.message) {
        setErrorMessage(error.message);
      }

      if (onError) onError(error as Error);
    };

    // Add global error handling for unhandled exceptions
    const handleGlobalError = (event: Event) => {
      if (event.error) {
        errorHandler(event.error);
      }
    };

    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', (event) => {
      errorHandler(event.reason);
    });

    // Clean up event listeners on component unmount
    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleGlobalError);
    };
  }, [onError]);

  useEffect(() => {
    // Check for empty error message on mount to handle edge cases
    if (errorMessage) {
      const errorMessageElement = document.querySelector('.error-message');
      if (errorMessageElement) {
        errorMessageElement.focus();
      }
    }
  }, [errorMessage]);

  return (
    <div>
      {errorMessage && (
        <div className="error-message" role="alert">
          {errorMessage}
        </div>
      )}
      <h1>Hello, {name}!</h1>
    </div>
  );
};

FunctionalComponent.defaultProps = {
  onError: (error: Error) => {
    console.error(error);
  },
};

export default FunctionalComponent;