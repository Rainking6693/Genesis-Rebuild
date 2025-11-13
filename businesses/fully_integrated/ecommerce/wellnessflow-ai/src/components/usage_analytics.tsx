import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface UsageAnalyticsProps {
  userId: string;
}

interface AnalyticsData {
  title: string;
  content: string;
}

interface FetchAnalyticsDataState {
  data: AnalyticsData | null;
  error: string | null;
  loading: boolean;
}

const UsageAnalytics: React.FC<UsageAnalyticsProps> = ({ userId }) => {
  const [state, setState] = useState<FetchAnalyticsDataState>({
    data: null,
    error: null,
    loading: true,
  });
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchAnalyticsData = useCallback(async () => {
    try {
      abortControllerRef.current = new AbortController();
      const { signal } = abortControllerRef.current;
      const response: AxiosResponse<AnalyticsData> = await axios.get<AnalyticsData>(
        `/api/analytics/${userId}`,
        { signal }
      );
      setState({ data: response.data, error: null, loading: false });
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Fetch analytics data request cancelled');
      } else {
        const axiosError = error as AxiosError;
        setState({
          data: null,
          error: axiosError.message || 'An error occurred while fetching analytics data.',
          loading: false,
        });
      }
    } finally {
      abortControllerRef.current = null;
    }
  }, [userId]);

  useEffect(() => {
    fetchAnalyticsData();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchAnalyticsData]);

  return (
    <div>
      {state.loading ? (
        <div role="status" aria-live="polite">
          <span className="visually-hidden">Loading...</span>
        </div>
      ) : state.error ? (
        <div role="alert" aria-live="assertive">
          <p>{state.error}</p>
          <button onClick={fetchAnalyticsData}>Retry</button>
        </div>
      ) : state.data ? (
        <div>
          <h1>{state.data.title}</h1>
          <p>{state.data.content}</p>
        </div>
      ) : null}
    </div>
  );
};

export default UsageAnalytics;

import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface UsageAnalyticsProps {
  userId: string;
}

interface AnalyticsData {
  title: string;
  content: string;
}

interface FetchAnalyticsDataState {
  data: AnalyticsData | null;
  error: string | null;
  loading: boolean;
}

const UsageAnalytics: React.FC<UsageAnalyticsProps> = ({ userId }) => {
  const [state, setState] = useState<FetchAnalyticsDataState>({
    data: null,
    error: null,
    loading: true,
  });
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchAnalyticsData = useCallback(async () => {
    try {
      abortControllerRef.current = new AbortController();
      const { signal } = abortControllerRef.current;
      const response: AxiosResponse<AnalyticsData> = await axios.get<AnalyticsData>(
        `/api/analytics/${userId}`,
        { signal }
      );
      setState({ data: response.data, error: null, loading: false });
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Fetch analytics data request cancelled');
      } else {
        const axiosError = error as AxiosError;
        setState({
          data: null,
          error: axiosError.message || 'An error occurred while fetching analytics data.',
          loading: false,
        });
      }
    } finally {
      abortControllerRef.current = null;
    }
  }, [userId]);

  useEffect(() => {
    fetchAnalyticsData();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchAnalyticsData]);

  return (
    <div>
      {state.loading ? (
        <div role="status" aria-live="polite">
          <span className="visually-hidden">Loading...</span>
        </div>
      ) : state.error ? (
        <div role="alert" aria-live="assertive">
          <p>{state.error}</p>
          <button onClick={fetchAnalyticsData}>Retry</button>
        </div>
      ) : state.data ? (
        <div>
          <h1>{state.data.title}</h1>
          <p>{state.data.content}</p>
        </div>
      ) : null}
    </div>
  );
};

export default UsageAnalytics;