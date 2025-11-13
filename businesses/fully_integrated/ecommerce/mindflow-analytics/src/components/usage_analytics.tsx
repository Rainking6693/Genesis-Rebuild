import React, { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface AnalyticsData {
  title: string;
  content: string;
}

interface FetchAnalyticsDataResponse {
  data: AnalyticsData;
  error: string | null;
}

const UsageAnalytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchAnalyticsData = useCallback(async (): Promise<FetchAnalyticsDataResponse> => {
    setIsLoading(true);
    try {
      const response: AxiosResponse<AnalyticsData> = await axios.get<AnalyticsData>('/api/analytics');
      setIsLoading(false);
      return { data: response.data, error: null };
    } catch (err) {
      setIsLoading(false);
      const error = err as AxiosError;
      return { data: null, error: `Error fetching analytics data: ${error.message}` };
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await fetchAnalyticsData();
      setAnalyticsData(data);
      setError(error);
    };
    fetchData();
  }, [fetchAnalyticsData]);

  return (
    <div>
      {error ? (
        <div role="alert" aria-live="assertive" className="error">
          {error}
        </div>
      ) : analyticsData ? (
        <>
          <h1 id="analytics-title">{analyticsData.title}</h1>
          <p aria-describedby="analytics-title">{analyticsData.content}</p>
        </>
      ) : (
        <div role="status" aria-live="polite" className="loading">
          {isLoading ? 'Loading...' : 'No data available'}
        </div>
      )}
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

interface FetchAnalyticsDataResponse {
  data: AnalyticsData;
  error: string | null;
}

const UsageAnalytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchAnalyticsData = useCallback(async (): Promise<FetchAnalyticsDataResponse> => {
    setIsLoading(true);
    try {
      const response: AxiosResponse<AnalyticsData> = await axios.get<AnalyticsData>('/api/analytics');
      setIsLoading(false);
      return { data: response.data, error: null };
    } catch (err) {
      setIsLoading(false);
      const error = err as AxiosError;
      return { data: null, error: `Error fetching analytics data: ${error.message}` };
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await fetchAnalyticsData();
      setAnalyticsData(data);
      setError(error);
    };
    fetchData();
  }, [fetchAnalyticsData]);

  return (
    <div>
      {error ? (
        <div role="alert" aria-live="assertive" className="error">
          {error}
        </div>
      ) : analyticsData ? (
        <>
          <h1 id="analytics-title">{analyticsData.title}</h1>
          <p aria-describedby="analytics-title">{analyticsData.content}</p>
        </>
      ) : (
        <div role="status" aria-live="polite" className="loading">
          {isLoading ? 'Loading...' : 'No data available'}
        </div>
      )}
    </div>
  );
};

export default UsageAnalytics;