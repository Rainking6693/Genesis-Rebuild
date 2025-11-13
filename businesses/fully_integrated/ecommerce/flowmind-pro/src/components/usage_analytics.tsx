import React, { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface UsageAnalyticsProps {
  teamId: string;
}

interface AnalyticsData {
  totalUsers: number;
  activeUsers: number;
  averageSessionDuration: number;
  totalSessions: number;
}

interface ErrorState {
  error: string | null;
  isLoading: boolean;
}

const UsageAnalytics: React.FC<UsageAnalyticsProps> = ({ teamId }) => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [errorState, setErrorState] = useState<ErrorState>({
    error: null,
    isLoading: true,
  });

  const fetchAnalyticsData = useCallback(async () => {
    try {
      const response: AxiosResponse<AnalyticsData> = await axios.get(`/api/analytics/${teamId}`);
      setAnalyticsData(response.data);
      setErrorState({ error: null, isLoading: false });
    } catch (error) {
      const axiosError = error as AxiosError;
      setErrorState({
        error: axiosError.message || 'An error occurred while fetching analytics data.',
        isLoading: false,
      });
    }
  }, [teamId]);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const fetchData = async () => {
      try {
        await fetchAnalyticsData();
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          console.log('Fetch request aborted');
        } else {
          throw error;
        }
      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
  }, [fetchAnalyticsData]);

  if (errorState.isLoading) {
    return (
      <div role="status" aria-live="polite">
        <span className="visually-hidden">Loading...</span>
        <div className="spinner"></div>
      </div>
    );
  }

  if (errorState.error) {
    return (
      <div role="alert" aria-live="assertive">
        <h1>Error</h1>
        <p>{errorState.error}</p>
        <button onClick={fetchAnalyticsData}>Retry</button>
      </div>
    );
  }

  if (!analyticsData) {
    return null;
  }

  return (
    <div>
      <h1>Usage Analytics</h1>
      <ul>
        <li>Total Users: {analyticsData.totalUsers}</li>
        <li>Active Users: {analyticsData.activeUsers}</li>
        <li>Average Session Duration: {analyticsData.averageSessionDuration} minutes</li>
        <li>Total Sessions: {analyticsData.totalSessions}</li>
      </ul>
    </div>
  );
};

export default UsageAnalytics;

import React, { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface UsageAnalyticsProps {
  teamId: string;
}

interface AnalyticsData {
  totalUsers: number;
  activeUsers: number;
  averageSessionDuration: number;
  totalSessions: number;
}

interface ErrorState {
  error: string | null;
  isLoading: boolean;
}

const UsageAnalytics: React.FC<UsageAnalyticsProps> = ({ teamId }) => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [errorState, setErrorState] = useState<ErrorState>({
    error: null,
    isLoading: true,
  });

  const fetchAnalyticsData = useCallback(async () => {
    try {
      const response: AxiosResponse<AnalyticsData> = await axios.get(`/api/analytics/${teamId}`);
      setAnalyticsData(response.data);
      setErrorState({ error: null, isLoading: false });
    } catch (error) {
      const axiosError = error as AxiosError;
      setErrorState({
        error: axiosError.message || 'An error occurred while fetching analytics data.',
        isLoading: false,
      });
    }
  }, [teamId]);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const fetchData = async () => {
      try {
        await fetchAnalyticsData();
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          console.log('Fetch request aborted');
        } else {
          throw error;
        }
      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
  }, [fetchAnalyticsData]);

  if (errorState.isLoading) {
    return (
      <div role="status" aria-live="polite">
        <span className="visually-hidden">Loading...</span>
        <div className="spinner"></div>
      </div>
    );
  }

  if (errorState.error) {
    return (
      <div role="alert" aria-live="assertive">
        <h1>Error</h1>
        <p>{errorState.error}</p>
        <button onClick={fetchAnalyticsData}>Retry</button>
      </div>
    );
  }

  if (!analyticsData) {
    return null;
  }

  return (
    <div>
      <h1>Usage Analytics</h1>
      <ul>
        <li>Total Users: {analyticsData.totalUsers}</li>
        <li>Active Users: {analyticsData.activeUsers}</li>
        <li>Average Session Duration: {analyticsData.averageSessionDuration} minutes</li>
        <li>Total Sessions: {analyticsData.totalSessions}</li>
      </ul>
    </div>
  );
};

export default UsageAnalytics;