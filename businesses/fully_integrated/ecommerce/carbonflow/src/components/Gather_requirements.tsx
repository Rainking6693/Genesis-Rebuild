import React, { useState, useEffect, useCallback, useRef } from 'react';

interface MyComponentProps {
  title: string;
  content: string;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, content }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const isMounted = useRef(true);

  const fetchData = useCallback(async () => {
    try {
      // Simulate asynchronous data fetching
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (isMounted.current) {
        setIsLoading(false);
      }
    } catch (err) {
      if (isMounted.current) {
        setError(err as Error);
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchData();

    return () => {
      isMounted.current = false;
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
  const isMounted = useRef(true);

  const fetchData = useCallback(async () => {
    try {
      // Simulate asynchronous data fetching
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (isMounted.current) {
        setIsLoading(false);
      }
    } catch (err) {
      if (isMounted.current) {
        setError(err as Error);
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchData();

    return () => {
      isMounted.current = false;
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