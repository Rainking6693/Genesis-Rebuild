import React, { useState, useEffect, useCallback } from 'react';

interface MyComponentProps {
  title: string;
  content: string;
  dataLoadTimeout?: number; // Optional timeout for data loading, defaults to 5000ms
  retries?: number; // Optional number of retries on failure, defaults to 3
  retryDelay?: number; // Optional delay between retries in ms, defaults to 1000
}

const MyComponent: React.FC<MyComponentProps> = ({
  title,
  content,
  dataLoadTimeout = 5000,
  retries = 3,
  retryDelay = 1000,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const loadData = useCallback(async () => {
    try {
      // Simulate asynchronous data loading with timeout
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Data load timeout')), dataLoadTimeout)
      );

      const dataPromise = new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate data fetch

      await Promise.race([dataPromise, timeoutPromise]);

      setIsLoading(false);
      setError(null); // Clear any previous errors on successful load
    } catch (err: any) {
      console.error('Error loading data:', err);

      if (retryCount < retries) {
        console.log(`Retrying data load (attempt ${retryCount + 1})...`);
        setTimeout(() => {
          setRetryCount((prevCount) => prevCount + 1);
        }, retryDelay);
      } else {
        setError(err instanceof Error ? err : new Error('Failed to load data after multiple retries'));
        setIsLoading(false);
      }
    }
  }, [dataLoadTimeout, retries, retryDelay, retryCount]);

  useEffect(() => {
    setIsLoading(true); // Ensure loading state is set on initial mount/retry
    const load = async () => {
      await loadData();
    };
    load();
  }, [loadData]);

  useEffect(() => {
    if (retryCount > 0 && retryCount <= retries) {
      setIsLoading(true);
      const load = async () => {
        await loadData();
      };
      load();
    }
  }, [retryCount, loadData]);

  const handleRetry = useCallback(() => {
    setRetryCount(0); // Reset retry count
    setError(null); // Clear the error
    setIsLoading(true); // Set loading state
  }, []);

  return (
    <div className="my-component">
      {isLoading ? (
        <div role="status" aria-live="polite" className="loading-indicator">
          <span aria-hidden="true">Loading...</span>
        </div>
      ) : error ? (
        <div role="alert" className="error-message">
          <h2>Error</h2>
          <p>{error.message}</p>
          {retryCount < retries && (
            <button onClick={handleRetry} aria-label="Retry loading data">
              Retry
            </button>
          )}
        </div>
      ) : (
        <div className="content">
          <h1 id="component-title">{title}</h1>
          <p>{content}</p>
        </div>
      )}
    </div>
  );
};

export default MyComponent;

import React, { useState, useEffect, useCallback } from 'react';

interface MyComponentProps {
  title: string;
  content: string;
  dataLoadTimeout?: number; // Optional timeout for data loading, defaults to 5000ms
  retries?: number; // Optional number of retries on failure, defaults to 3
  retryDelay?: number; // Optional delay between retries in ms, defaults to 1000
}

const MyComponent: React.FC<MyComponentProps> = ({
  title,
  content,
  dataLoadTimeout = 5000,
  retries = 3,
  retryDelay = 1000,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const loadData = useCallback(async () => {
    try {
      // Simulate asynchronous data loading with timeout
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Data load timeout')), dataLoadTimeout)
      );

      const dataPromise = new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate data fetch

      await Promise.race([dataPromise, timeoutPromise]);

      setIsLoading(false);
      setError(null); // Clear any previous errors on successful load
    } catch (err: any) {
      console.error('Error loading data:', err);

      if (retryCount < retries) {
        console.log(`Retrying data load (attempt ${retryCount + 1})...`);
        setTimeout(() => {
          setRetryCount((prevCount) => prevCount + 1);
        }, retryDelay);
      } else {
        setError(err instanceof Error ? err : new Error('Failed to load data after multiple retries'));
        setIsLoading(false);
      }
    }
  }, [dataLoadTimeout, retries, retryDelay, retryCount]);

  useEffect(() => {
    setIsLoading(true); // Ensure loading state is set on initial mount/retry
    const load = async () => {
      await loadData();
    };
    load();
  }, [loadData]);

  useEffect(() => {
    if (retryCount > 0 && retryCount <= retries) {
      setIsLoading(true);
      const load = async () => {
        await loadData();
      };
      load();
    }
  }, [retryCount, loadData]);

  const handleRetry = useCallback(() => {
    setRetryCount(0); // Reset retry count
    setError(null); // Clear the error
    setIsLoading(true); // Set loading state
  }, []);

  return (
    <div className="my-component">
      {isLoading ? (
        <div role="status" aria-live="polite" className="loading-indicator">
          <span aria-hidden="true">Loading...</span>
        </div>
      ) : error ? (
        <div role="alert" className="error-message">
          <h2>Error</h2>
          <p>{error.message}</p>
          {retryCount < retries && (
            <button onClick={handleRetry} aria-label="Retry loading data">
              Retry
            </button>
          )}
        </div>
      ) : (
        <div className="content">
          <h1 id="component-title">{title}</h1>
          <p>{content}</p>
        </div>
      )}
    </div>
  );
};

export default MyComponent;