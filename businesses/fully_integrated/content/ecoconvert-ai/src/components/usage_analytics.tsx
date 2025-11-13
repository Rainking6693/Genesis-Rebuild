import React, { FC, useEffect, useState, useMemo } from 'react';

interface Props {
  message?: string;
}

const UsageAnalytics: FC<Props> = ({ message }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [messageState, setMessageState] = useState<string | null>(message || 'Loading usage analytics...');

  useEffect(() => {
    const fetchUsageAnalytics = async () => {
      try {
        const response = await fetch('https://your-usage-analytics-service.com/api/usage');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setMessageState(data.message);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError(error);
        setLoading(false);
      }
    };

    fetchUsageAnalytics();
  }, []);

  const errorMessage = useMemo(() => {
    if (error) {
      return <div className="usage-analytics error">An error occurred: {error.message}</div>;
    }
    return null;
  }, [error]);

  return (
    <div className={`usage-analytics ${error ? 'error' : ''}`} role="status" aria-live="polite">
      {loading ? messageState || 'Loading usage analytics...' : messageState}
      {errorMessage}
    </div>
  );
};

UsageAnalytics.displayName = 'UsageAnalytics';

// Add defaultProps for better maintainability
UsageAnalytics.defaultProps = {
  message: null,
};

// Use a custom error component for better error handling and UI
UsageAnalytics.errorComponent = (error: Error) => (
  <div className="usage-analytics error">An error occurred: {error.message}</div>
);

// Optimize performance by memoizing the component if the message prop doesn't change
const MemoizedUsageAnalytics = React.memo(UsageAnalytics);

export default MemoizedUsageAnalytics;

import React, { FC, useEffect, useState, useMemo } from 'react';

interface Props {
  message?: string;
}

const UsageAnalytics: FC<Props> = ({ message }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [messageState, setMessageState] = useState<string | null>(message || 'Loading usage analytics...');

  useEffect(() => {
    const fetchUsageAnalytics = async () => {
      try {
        const response = await fetch('https://your-usage-analytics-service.com/api/usage');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setMessageState(data.message);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError(error);
        setLoading(false);
      }
    };

    fetchUsageAnalytics();
  }, []);

  const errorMessage = useMemo(() => {
    if (error) {
      return <div className="usage-analytics error">An error occurred: {error.message}</div>;
    }
    return null;
  }, [error]);

  return (
    <div className={`usage-analytics ${error ? 'error' : ''}`} role="status" aria-live="polite">
      {loading ? messageState || 'Loading usage analytics...' : messageState}
      {errorMessage}
    </div>
  );
};

UsageAnalytics.displayName = 'UsageAnalytics';

// Add defaultProps for better maintainability
UsageAnalytics.defaultProps = {
  message: null,
};

// Use a custom error component for better error handling and UI
UsageAnalytics.errorComponent = (error: Error) => (
  <div className="usage-analytics error">An error occurred: {error.message}</div>
);

// Optimize performance by memoizing the component if the message prop doesn't change
const MemoizedUsageAnalytics = React.memo(UsageAnalytics);

export default MemoizedUsageAnalytics;