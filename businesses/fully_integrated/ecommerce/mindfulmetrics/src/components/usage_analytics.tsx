import React, { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface AnalyticsData {
  title: string;
  content: string;
  views: number;
  clicks: number;
}

interface ErrorState {
  message: string;
  retryCount: number;
  maxRetries: number;
}

const UsageAnalytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState<ErrorState | null>(null);

  const fetchAnalyticsData = useCallback(async () => {
    try {
      const response: AxiosResponse<AnalyticsData> = await axios.get('/api/analytics');
      setAnalyticsData(response.data);
      setError(null);
    } catch (err) {
      const axiosError = err as AxiosError;
      const errorState: ErrorState = {
        message: `Error fetching analytics data: ${axiosError.message}`,
        retryCount: 0,
        maxRetries: 3,
      };
      setError(errorState);
      setAnalyticsData(null);
    }
  }, []);

  useEffect(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  const handleRetry = useCallback(() => {
    if (error && error.retryCount < error.maxRetries) {
      setError((prevError) => ({
        ...prevError,
        retryCount: prevError?.retryCount + 1,
      }));
      fetchAnalyticsData();
    }
  }, [error, fetchAnalyticsData]);

  if (error) {
    return (
      <div role="alert" aria-live="assertive">
        <p>{error.message}</p>
        <button onClick={handleRetry}>
          Retry ({error.retryCount}/{error.maxRetries})
        </button>
      </div>
    );
  }

  if (!analyticsData) {
    return <div aria-live="polite">Loading...</div>;
  }

  return (
    <div>
      <h1>{analyticsData.title}</h1>
      <p>{analyticsData.content}</p>
      <p>Views: {analyticsData.views.toLocaleString()}</p>
      <p>Clicks: {analyticsData.clicks.toLocaleString()}</p>
    </div>
  );
};

export default UsageAnalytics;

import React, { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface AnalyticsData {
  title: string;
  content: string;
  views: number;
  clicks: number;
}

interface ErrorState {
  message: string;
  retryCount: number;
  maxRetries: number;
}

const UsageAnalytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState<ErrorState | null>(null);

  const fetchAnalyticsData = useCallback(async () => {
    try {
      const response: AxiosResponse<AnalyticsData> = await axios.get('/api/analytics');
      setAnalyticsData(response.data);
      setError(null);
    } catch (err) {
      const axiosError = err as AxiosError;
      const errorState: ErrorState = {
        message: `Error fetching analytics data: ${axiosError.message}`,
        retryCount: 0,
        maxRetries: 3,
      };
      setError(errorState);
      setAnalyticsData(null);
    }
  }, []);

  useEffect(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  const handleRetry = useCallback(() => {
    if (error && error.retryCount < error.maxRetries) {
      setError((prevError) => ({
        ...prevError,
        retryCount: prevError?.retryCount + 1,
      }));
      fetchAnalyticsData();
    }
  }, [error, fetchAnalyticsData]);

  if (error) {
    return (
      <div role="alert" aria-live="assertive">
        <p>{error.message}</p>
        <button onClick={handleRetry}>
          Retry ({error.retryCount}/{error.maxRetries})
        </button>
      </div>
    );
  }

  if (!analyticsData) {
    return <div aria-live="polite">Loading...</div>;
  }

  return (
    <div>
      <h1>{analyticsData.title}</h1>
      <p>{analyticsData.content}</p>
      <p>Views: {analyticsData.views.toLocaleString()}</p>
      <p>Clicks: {analyticsData.clicks.toLocaleString()}</p>
    </div>
  );
};

export default UsageAnalytics;