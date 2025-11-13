import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ErrorLogger } from './ErrorLogger';

interface MyComponentProps {
  title: string;
  content: string;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, content }) => {
  const [error, setError] = useState<Error | null>(null);
  const isMountedRef = useRef(true);

  const handleError = useCallback((err: unknown) => {
    if (err instanceof Error) {
      setError(err);
      ErrorLogger.log(err);
    } else {
      const unknownError = new Error('An unknown error occurred.');
      setError(unknownError);
      ErrorLogger.log(unknownError);
    }
  }, []);

  useEffect(() => {
    const performOperation = async () => {
      try {
        // Perform some operation that might throw an error
        // ...
      } catch (err) {
        if (isMountedRef.current) {
          handleError(err);
        }
      }
    };

    performOperation();

    return () => {
      isMountedRef.current = false;
    };
  }, [handleError]);

  return (
    <div>
      <h1>{title}</h1>
      <p>{content}</p>
      {error && (
        <div
          className="error-message"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <h3>An error occurred:</h3>
          <p>{error.message}</p>
        </div>
      )}
    </div>
  );
};

export default MyComponent;

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ErrorLogger } from './ErrorLogger';

interface MyComponentProps {
  title: string;
  content: string;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, content }) => {
  const [error, setError] = useState<Error | null>(null);
  const isMountedRef = useRef(true);

  const handleError = useCallback((err: unknown) => {
    if (err instanceof Error) {
      setError(err);
      ErrorLogger.log(err);
    } else {
      const unknownError = new Error('An unknown error occurred.');
      setError(unknownError);
      ErrorLogger.log(unknownError);
    }
  }, []);

  useEffect(() => {
    const performOperation = async () => {
      try {
        // Perform some operation that might throw an error
        // ...
      } catch (err) {
        if (isMountedRef.current) {
          handleError(err);
        }
      }
    };

    performOperation();

    return () => {
      isMountedRef.current = false;
    };
  }, [handleError]);

  return (
    <div>
      <h1>{title}</h1>
      <p>{content}</p>
      {error && (
        <div
          className="error-message"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <h3>An error occurred:</h3>
          <p>{error.message}</p>
        </div>
      )}
    </div>
  );
};

export default MyComponent;