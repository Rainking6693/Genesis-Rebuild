import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface DashboardData {
  title: string;
  content: string;
  burnoutRisk: number;
  wellnessRecommendations: string[];
}

interface DashboardUIProps {
  apiUrl?: string; // Allow overriding the API URL for testing/dev
}

const DashboardUI: React.FC<DashboardUIProps> = ({ apiUrl = '/api/dashboard' }) => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null); // Clear any previous errors

    // Create a new AbortController to cancel the request if the component is unmounted
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const response: AxiosResponse<DashboardData> = await axios.get<DashboardData>(apiUrl, {
        signal: abortController.signal,
      });

      if (!response.data) {
        throw new Error('No data received from the API.'); // Handle empty response
      }

      setDashboardData(response.data);
    } catch (err) {
      let errorMessage = 'Failed to fetch dashboard data.';

      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError;
        errorMessage = axiosError.message;

        if (axiosError.response) {
          // Handle specific HTTP error codes
          if (axiosError.response.status === 404) {
            errorMessage = 'Dashboard data not found.';
          } else if (axiosError.response.status >= 500) {
            errorMessage = 'Server error while fetching dashboard data.';
          } else {
            errorMessage = `Error fetching data: ${axiosError.response.status} - ${axiosError.response.statusText}`;
          }
        } else if (axiosError.request) {
          errorMessage = 'No response received from the server.';
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      console.error('Error fetching dashboard data:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
      abortControllerRef.current = null; // Reset the AbortController reference
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchDashboardData();

    // Clean up the AbortController when the component is unmounted
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchDashboardData]);

  if (loading) {
    return (
      <div aria-live="polite" aria-busy="true">
        Loading dashboard data...
      </div>
    );
  }

  if (error) {
    return (
      <div role="alert">
        <p>Error: {error}</p>
        <button onClick={fetchDashboardData}>Retry</button>
      </div>
    );
  }

  if (!dashboardData) {
    return <div>No dashboard data available.</div>;
  }

  return (
    <div aria-live="polite">
      <h1 tabIndex={0}>{dashboardData.title}</h1>
      <p>{dashboardData.content}</p>
      <h2>Burnout Risk: {dashboardData.burnoutRisk}%</h2>
      <h3>Wellness Recommendations:</h3>
      {dashboardData.wellnessRecommendations.length > 0 ? (
        <ul>
          {dashboardData.wellnessRecommendations.map((recommendation, index) => (
            <li key={index}>{recommendation}</li>
          ))}
        </ul>
      ) : (
        <p>No wellness recommendations available.</p>
      )}
    </div>
  );
};

export default DashboardUI;

import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface DashboardData {
  title: string;
  content: string;
  burnoutRisk: number;
  wellnessRecommendations: string[];
}

interface DashboardUIProps {
  apiUrl?: string; // Allow overriding the API URL for testing/dev
}

const DashboardUI: React.FC<DashboardUIProps> = ({ apiUrl = '/api/dashboard' }) => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null); // Clear any previous errors

    // Create a new AbortController to cancel the request if the component is unmounted
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const response: AxiosResponse<DashboardData> = await axios.get<DashboardData>(apiUrl, {
        signal: abortController.signal,
      });

      if (!response.data) {
        throw new Error('No data received from the API.'); // Handle empty response
      }

      setDashboardData(response.data);
    } catch (err) {
      let errorMessage = 'Failed to fetch dashboard data.';

      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError;
        errorMessage = axiosError.message;

        if (axiosError.response) {
          // Handle specific HTTP error codes
          if (axiosError.response.status === 404) {
            errorMessage = 'Dashboard data not found.';
          } else if (axiosError.response.status >= 500) {
            errorMessage = 'Server error while fetching dashboard data.';
          } else {
            errorMessage = `Error fetching data: ${axiosError.response.status} - ${axiosError.response.statusText}`;
          }
        } else if (axiosError.request) {
          errorMessage = 'No response received from the server.';
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      console.error('Error fetching dashboard data:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
      abortControllerRef.current = null; // Reset the AbortController reference
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchDashboardData();

    // Clean up the AbortController when the component is unmounted
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchDashboardData]);

  if (loading) {
    return (
      <div aria-live="polite" aria-busy="true">
        Loading dashboard data...
      </div>
    );
  }

  if (error) {
    return (
      <div role="alert">
        <p>Error: {error}</p>
        <button onClick={fetchDashboardData}>Retry</button>
      </div>
    );
  }

  if (!dashboardData) {
    return <div>No dashboard data available.</div>;
  }

  return (
    <div aria-live="polite">
      <h1 tabIndex={0}>{dashboardData.title}</h1>
      <p>{dashboardData.content}</p>
      <h2>Burnout Risk: {dashboardData.burnoutRisk}%</h2>
      <h3>Wellness Recommendations:</h3>
      {dashboardData.wellnessRecommendations.length > 0 ? (
        <ul>
          {dashboardData.wellnessRecommendations.map((recommendation, index) => (
            <li key={index}>{recommendation}</li>
          ))}
        </ul>
      ) : (
        <p>No wellness recommendations available.</p>
      )}
    </div>
  );
};

export default DashboardUI;