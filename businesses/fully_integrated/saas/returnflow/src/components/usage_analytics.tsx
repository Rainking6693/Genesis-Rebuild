import React, { memo, useState, useEffect, useCallback } from 'react';

interface UsageAnalyticsProps {
  title: string;
  content: string | React.ReactNode;
  fetchData: () => Promise<any>; // Allow custom fetch function
  onError?: (error: Error) => void;
  loadingIndicator?: React.ReactNode; // Custom loading indicator
  errorDisplay?: (error: Error) => React.ReactNode; // Custom error display
  retries?: number; // Number of retries on failure
  retryDelay?: number; // Delay between retries in ms
}

const defaultLoadingIndicator = (
  <div data-testid="usage-analytics-loading">
    <p aria-label="Loading data">Loading...</p>
  </div>
);

const defaultErrorDisplay = (error: Error) => (
  <div data-testid="usage-analytics-error" role="alert">
    <p>Error: {error.message}</p>
  </div>
);

const UsageAnalytics: React.FC<UsageAnalyticsProps> = memo(({
  title,
  content,
  fetchData,
  onError,
  loadingIndicator = defaultLoadingIndicator,
  errorDisplay = defaultErrorDisplay,
  retries = 3,
  retryDelay = 1000,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);

  const safeFetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null); // Clear any previous errors
      await fetchData();
      setIsLoading(false);
      setRetryCount(0); // Reset retry count on success
    } catch (err: any) { // Explicitly type err as any to handle different error types
      const errorToSet = err instanceof Error ? err : new Error(String(err)); // Ensure it's an Error object
      setError(errorToSet);
      setIsLoading(false);

      if (onError) {
        onError(errorToSet);
      }

      if (retryCount < retries) {
        setTimeout(() => {
          setRetryCount((prevCount) => prevCount + 1);
        }, retryDelay);
      }
    }
  }, [fetchData, onError, retryCount, retries, retryDelay]);

  useEffect(() => {
    safeFetchData();
  }, [safeFetchData, retryCount]); // Re-run effect when retryCount changes

  if (isLoading) {
    return loadingIndicator;
  }

  if (error) {
    return errorDisplay(error);
  }

  return (
    <div data-testid="usage-analytics">
      <h1 data-testid="title">{title}</h1>
      {typeof content === 'string' ? (
        <p data-testid="content">{content}</p>
      ) : (
        <div data-testid="content">{content}</div>
      )}
    </div>
  );
});

export default UsageAnalytics;

import React, { memo, useState, useEffect, useCallback } from 'react';

interface UsageAnalyticsProps {
  title: string;
  content: string | React.ReactNode;
  fetchData: () => Promise<any>; // Allow custom fetch function
  onError?: (error: Error) => void;
  loadingIndicator?: React.ReactNode; // Custom loading indicator
  errorDisplay?: (error: Error) => React.ReactNode; // Custom error display
  retries?: number; // Number of retries on failure
  retryDelay?: number; // Delay between retries in ms
}

const defaultLoadingIndicator = (
  <div data-testid="usage-analytics-loading">
    <p aria-label="Loading data">Loading...</p>
  </div>
);

const defaultErrorDisplay = (error: Error) => (
  <div data-testid="usage-analytics-error" role="alert">
    <p>Error: {error.message}</p>
  </div>
);

const UsageAnalytics: React.FC<UsageAnalyticsProps> = memo(({
  title,
  content,
  fetchData,
  onError,
  loadingIndicator = defaultLoadingIndicator,
  errorDisplay = defaultErrorDisplay,
  retries = 3,
  retryDelay = 1000,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);

  const safeFetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null); // Clear any previous errors
      await fetchData();
      setIsLoading(false);
      setRetryCount(0); // Reset retry count on success
    } catch (err: any) { // Explicitly type err as any to handle different error types
      const errorToSet = err instanceof Error ? err : new Error(String(err)); // Ensure it's an Error object
      setError(errorToSet);
      setIsLoading(false);

      if (onError) {
        onError(errorToSet);
      }

      if (retryCount < retries) {
        setTimeout(() => {
          setRetryCount((prevCount) => prevCount + 1);
        }, retryDelay);
      }
    }
  }, [fetchData, onError, retryCount, retries, retryDelay]);

  useEffect(() => {
    safeFetchData();
  }, [safeFetchData, retryCount]); // Re-run effect when retryCount changes

  if (isLoading) {
    return loadingIndicator;
  }

  if (error) {
    return errorDisplay(error);
  }

  return (
    <div data-testid="usage-analytics">
      <h1 data-testid="title">{title}</h1>
      {typeof content === 'string' ? (
        <p data-testid="content">{content}</p>
      ) : (
        <div data-testid="content">{content}</div>
      )}
    </div>
  );
});

export default UsageAnalytics;