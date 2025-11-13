import React, { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface AnalyticsData {
  title: string;
  content: string;
  carbonFootprint: number;
  teamChallengeProgress: number;
}

interface ErrorState {
  message: string;
  code?: number;
}

const UsageAnalytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState<ErrorState | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchAnalyticsData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response: AxiosResponse<AnalyticsData> = await axios.get<AnalyticsData>('/api/analytics');
      setAnalyticsData(response.data);
      setError(null);
    } catch (err) {
      const axiosError = err as AxiosError;
      setError({
        message:
          axiosError.response?.data?.message ||
          axiosError.message ||
          'An error occurred while fetching analytics data.',
        code: axiosError.response?.status,
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
        <h2>Error {error.code}</h2>
        <p>{error.message}</p>
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
      <h2>{analyticsData.title}</h2>
      <p>{analyticsData.content}</p>
      <p>Carbon Footprint: {analyticsData.carbonFootprint} kg CO2e</p>
      <p>Team Challenge Progress: {analyticsData.teamChallengeProgress}%</p>
    </div>
  );
};

export default UsageAnalytics;

import React, { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface AnalyticsData {
  title: string;
  content: string;
  carbonFootprint: number;
  teamChallengeProgress: number;
}

interface ErrorState {
  message: string;
  code?: number;
}

const UsageAnalytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState<ErrorState | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchAnalyticsData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response: AxiosResponse<AnalyticsData> = await axios.get<AnalyticsData>('/api/analytics');
      setAnalyticsData(response.data);
      setError(null);
    } catch (err) {
      const axiosError = err as AxiosError;
      setError({
        message:
          axiosError.response?.data?.message ||
          axiosError.message ||
          'An error occurred while fetching analytics data.',
        code: axiosError.response?.status,
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
        <h2>Error {error.code}</h2>
        <p>{error.message}</p>
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
      <h2>{analyticsData.title}</h2>
      <p>{analyticsData.content}</p>
      <p>Carbon Footprint: {analyticsData.carbonFootprint} kg CO2e</p>
      <p>Team Challenge Progress: {analyticsData.teamChallengeProgress}%</p>
    </div>
  );
};

export default UsageAnalytics;