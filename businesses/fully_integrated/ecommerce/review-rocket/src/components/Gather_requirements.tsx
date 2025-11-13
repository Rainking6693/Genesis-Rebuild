import React, { useState, useEffect, useCallback, useRef } from 'react';

interface MyComponentProps {
  title: string;
  content: string;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, content }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const loadData = useCallback(async () => {
    try {
      // Create an AbortController to cancel the request if the component is unmounted
      abortControllerRef.current = new AbortController();
      const { signal } = abortControllerRef.current;

      // Simulate asynchronous data loading
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (signal.aborted) {
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
    loadData();

    return () => {
      // Clean up any ongoing data loading or other side effects
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [loadData]);

  return (
    <div>
      {isLoading ? (
        <div role="status" aria-live="polite">
          <span className="visually-hidden">Loading...</span>
          <div className="loading-spinner" aria-hidden="true"></div>
        </div>
      ) : error ? (
        <div role="alert">
          <h2>Oops, something went wrong!</h2>
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

  const loadData = useCallback(async () => {
    try {
      // Create an AbortController to cancel the request if the component is unmounted
      abortControllerRef.current = new AbortController();
      const { signal } = abortControllerRef.current;

      // Simulate asynchronous data loading
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (signal.aborted) {
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
    loadData();

    return () => {
      // Clean up any ongoing data loading or other side effects
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [loadData]);

  return (
    <div>
      {isLoading ? (
        <div role="status" aria-live="polite">
          <span className="visually-hidden">Loading...</span>
          <div className="loading-spinner" aria-hidden="true"></div>
        </div>
      ) : error ? (
        <div role="alert">
          <h2>Oops, something went wrong!</h2>
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