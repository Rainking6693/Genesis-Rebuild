import React, { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface AnalyticsData {
  title: string;
  content: string;
}

interface ErrorState {
  message: string;
  code?: string;
}

const UsageAnalytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState<ErrorState | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAnalyticsData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response: AxiosResponse<AnalyticsData> = await axios.get('/api/analytics');
      setAnalyticsData(response.data);
      setError(null);
    } catch (error) {
      const axiosError = error as AxiosError;
      setError({
        message: axiosError.message,
        code: axiosError.code,
      });
      setAnalyticsData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  if (error) {
    return (
      <div role="alert" aria-live="assertive">
        <h1>Error fetching analytics data</h1>
        <p>{error.message}</p>
        {error.code && <p>Error code: {error.code}</p>}
        <button onClick={fetchAnalyticsData}>Retry</button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div role="status" aria-live="polite">
        <p>Loading...</p>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div role="alert" aria-live="assertive">
        <p>No analytics data available.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>{analyticsData.title}</h1>
      <p>{analyticsData.content}</p>
    </div>
  );
};

export default UsageAnalytics;

import React, { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface AnalyticsData {
  title: string;
  content: string;
}

interface ErrorState {
  message: string;
  code?: string;
}

const UsageAnalytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState<ErrorState | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAnalyticsData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response: AxiosResponse<AnalyticsData> = await axios.get('/api/analytics');
      setAnalyticsData(response.data);
      setError(null);
    } catch (error) {
      const axiosError = error as AxiosError;
      setError({
        message: axiosError.message,
        code: axiosError.code,
      });
      setAnalyticsData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  if (error) {
    return (
      <div role="alert" aria-live="assertive">
        <h1>Error fetching analytics data</h1>
        <p>{error.message}</p>
        {error.code && <p>Error code: {error.code}</p>}
        <button onClick={fetchAnalyticsData}>Retry</button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div role="status" aria-live="polite">
        <p>Loading...</p>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div role="alert" aria-live="assertive">
        <p>No analytics data available.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>{analyticsData.title}</h1>
      <p>{analyticsData.content}</p>
    </div>
  );
};

export default UsageAnalytics;