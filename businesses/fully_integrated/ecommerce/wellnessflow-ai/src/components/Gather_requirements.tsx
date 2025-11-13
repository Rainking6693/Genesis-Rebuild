import React, { useState, useEffect, useCallback, useRef } from 'react';

interface MyComponentProps {
  title: string;
  content: string;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, content }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async () => {
    try {
      // Create an AbortController to handle cancellation
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      // Simulate asynchronous data fetching
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (abortController.signal.aborted) {
            reject(new Error('Request cancelled'));
          } else {
            resolve(undefined);
          }
        }, 1000);
      });

      setIsLoading(false);
    } catch (err) {
      if (err instanceof Error && err.message !== 'Request cancelled') {
        setError(err);
      }
      setIsLoading(false);
    } finally {
      abortControllerRef.current = null;
    }
  }, []);

  useEffect(() => {
    fetchData();

    return () => {
      // Cancel the request if the component is unmounted
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData]);

  return (
    <div>
      {isLoading ? (
        <div role="status" aria-live="polite">
          Loading...
        </div>
      ) : error ? (
        <div role="alert">
          <h2>Error</h2>
          <p>{error.message}</p>
        </div>
      ) : (
        <>
          <h1>{title}</h1>
          <p>{content}</p>
        </>
      )}
    </div>
  );
};

export default MyComponent;

import React, { useState, useEffect, useCallback, useRef } from 'react';

interface MyComponentProps {
  title: string;
  content: string;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, content }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async () => {
    try {
      // Create an AbortController to handle cancellation
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      // Simulate asynchronous data fetching
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (abortController.signal.aborted) {
            reject(new Error('Request cancelled'));
          } else {
            resolve(undefined);
          }
        }, 1000);
      });

      setIsLoading(false);
    } catch (err) {
      if (err instanceof Error && err.message !== 'Request cancelled') {
        setError(err);
      }
      setIsLoading(false);
    } finally {
      abortControllerRef.current = null;
    }
  }, []);

  useEffect(() => {
    fetchData();

    return () => {
      // Cancel the request if the component is unmounted
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData]);

  return (
    <div>
      {isLoading ? (
        <div role="status" aria-live="polite">
          Loading...
        </div>
      ) : error ? (
        <div role="alert">
          <h2>Error</h2>
          <p>{error.message}</p>
        </div>
      ) : (
        <>
          <h1>{title}</h1>
          <p>{content}</p>
        </>
      )}
    </div>
  );
};

export default MyComponent;