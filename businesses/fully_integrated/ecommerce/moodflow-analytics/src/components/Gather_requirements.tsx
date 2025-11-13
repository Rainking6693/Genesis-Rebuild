import React, { useState, useEffect, useCallback } from 'react';

interface MyComponentProps {
  title: string;
  content: string;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, content }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      // Simulate asynchronous data loading
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsLoading(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred.'));
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const fetchDataWithSignal = async () => {
      try {
        await fetchData();
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          setError(err);
        }
      }
    };

    fetchDataWithSignal();

    return () => {
      controller.abort();
    };
  }, [fetchData]);

  return (
    <div>
      {isLoading ? (
        <div role="status" aria-live="polite">
          <span className="visually-hidden">Loading...</span>
          <div className="spinner" aria-hidden="true"></div>
        </div>
      ) : error ? (
        <div role="alert">
          <h2>Oops, something went wrong!</h2>
          <p>{error.message}</p>
          <button onClick={fetchData}>Try again</button>
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

import React, { useState, useEffect, useCallback } from 'react';

interface MyComponentProps {
  title: string;
  content: string;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, content }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      // Simulate asynchronous data loading
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsLoading(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred.'));
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const fetchDataWithSignal = async () => {
      try {
        await fetchData();
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          setError(err);
        }
      }
    };

    fetchDataWithSignal();

    return () => {
      controller.abort();
    };
  }, [fetchData]);

  return (
    <div>
      {isLoading ? (
        <div role="status" aria-live="polite">
          <span className="visually-hidden">Loading...</span>
          <div className="spinner" aria-hidden="true"></div>
        </div>
      ) : error ? (
        <div role="alert">
          <h2>Oops, something went wrong!</h2>
          <p>{error.message}</p>
          <button onClick={fetchData}>Try again</button>
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