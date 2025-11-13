import React, { memo, useState, useEffect, useCallback } from 'react';

interface UsageAnalyticsProps {
  title: string;
  content: string;
  onError?: (error: Error) => void;
  fetchUsageData: () => Promise<any>;
}

const UsageAnalytics: React.FC<UsageAnalyticsProps> = memo(
  ({ title, content, onError, fetchUsageData }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const handleFetchUsageData = useCallback(async () => {
      try {
        setIsLoading(true);
        setError(null);
        await fetchUsageData();
      } catch (err) {
        setError(err as Error);
        if (onError) {
          onError(err as Error);
        }
      } finally {
        setIsLoading(false);
      }
    }, [fetchUsageData, onError]);

    useEffect(() => {
      handleFetchUsageData();
    }, [handleFetchUsageData]);

    return (
      <div data-testid="usage-analytics">
        {isLoading ? (
          <div aria-live="polite" aria-busy="true">
            Loading usage data...
          </div>
        ) : error ? (
          <div aria-live="polite" role="alert">
            Error fetching usage data: {error.message}
          </div>
        ) : (
          <>
            <h1 data-testid="title">{title}</h1>
            <p data-testid="content">{content}</p>
          </>
        )}
      </div>
    );
  }
);

export default UsageAnalytics;

import React, { memo, useState, useEffect, useCallback } from 'react';

interface UsageAnalyticsProps {
  title: string;
  content: string;
  onError?: (error: Error) => void;
  fetchUsageData: () => Promise<any>;
}

const UsageAnalytics: React.FC<UsageAnalyticsProps> = memo(
  ({ title, content, onError, fetchUsageData }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const handleFetchUsageData = useCallback(async () => {
      try {
        setIsLoading(true);
        setError(null);
        await fetchUsageData();
      } catch (err) {
        setError(err as Error);
        if (onError) {
          onError(err as Error);
        }
      } finally {
        setIsLoading(false);
      }
    }, [fetchUsageData, onError]);

    useEffect(() => {
      handleFetchUsageData();
    }, [handleFetchUsageData]);

    return (
      <div data-testid="usage-analytics">
        {isLoading ? (
          <div aria-live="polite" aria-busy="true">
            Loading usage data...
          </div>
        ) : error ? (
          <div aria-live="polite" role="alert">
            Error fetching usage data: {error.message}
          </div>
        ) : (
          <>
            <h1 data-testid="title">{title}</h1>
            <p data-testid="content">{content}</p>
          </>
        )}
      </div>
    );
  }
);

export default UsageAnalytics;