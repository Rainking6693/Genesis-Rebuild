import React, { FC, useEffect, useState } from 'react';
import axios, { AxiosInstance, AxiosResponse } from 'axios';

const usageAnalyticsApiTimeout = 5000; // API request timeout in milliseconds

const usageAnalyticsApi: AxiosInstance = axios.create({
  baseURL: 'https://api.greenshift.ai/usage_analytics',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.GREENSHIFT_API_KEY}`,
  },
  responseType: 'json',
  validateStatus: (status) => status < 500,
});

if (!process.env.GREENSHIFT_API_KEY) {
  console.error('Missing GREENSHIFT_API_KEY environment variable.');
}

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const [loading, setLoading] = useState(true);
  const [usageData, setUsageData] = useState<any>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const response: AxiosResponse<any> = await usageAnalyticsApi.get('/', { timeout: usageAnalyticsApiTimeout });
        if (isMounted) {
          setLoading(false);
          setUsageData(response.data);
        }
      } catch (error) {
        if (isMounted) {
          setLoading(false);
          setError(error);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array ensures the effect runs only once on mount

  const fallbackMessage = 'Usage data not available';

  return (
    <div>
      {/* Add ARIA attributes for accessibility */}
      <div aria-busy={loading} aria-label={message}>
        {loading ? 'Loading...' : message}
      </div>
      {/* Conditionally render usage data if available */}
      {usageData && <div>{JSON.stringify(usageData, null, 2)}</div>}
      {!loading && !usageData && <div>{fallbackMessage}</div>}
      {/* Render error message if an error occurred */}
      {error && <div>Error: {error.message}</div>}
    </div>
  );
};

MyComponent.getUsageData = async (): Promise<any> => {
  try {
    const response: AxiosResponse<any> = await usageAnalyticsApi.get('/');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default MyComponent;

import React, { FC, useEffect, useState } from 'react';
import axios, { AxiosInstance, AxiosResponse } from 'axios';

const usageAnalyticsApiTimeout = 5000; // API request timeout in milliseconds

const usageAnalyticsApi: AxiosInstance = axios.create({
  baseURL: 'https://api.greenshift.ai/usage_analytics',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.GREENSHIFT_API_KEY}`,
  },
  responseType: 'json',
  validateStatus: (status) => status < 500,
});

if (!process.env.GREENSHIFT_API_KEY) {
  console.error('Missing GREENSHIFT_API_KEY environment variable.');
}

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const [loading, setLoading] = useState(true);
  const [usageData, setUsageData] = useState<any>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const response: AxiosResponse<any> = await usageAnalyticsApi.get('/', { timeout: usageAnalyticsApiTimeout });
        if (isMounted) {
          setLoading(false);
          setUsageData(response.data);
        }
      } catch (error) {
        if (isMounted) {
          setLoading(false);
          setError(error);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array ensures the effect runs only once on mount

  const fallbackMessage = 'Usage data not available';

  return (
    <div>
      {/* Add ARIA attributes for accessibility */}
      <div aria-busy={loading} aria-label={message}>
        {loading ? 'Loading...' : message}
      </div>
      {/* Conditionally render usage data if available */}
      {usageData && <div>{JSON.stringify(usageData, null, 2)}</div>}
      {!loading && !usageData && <div>{fallbackMessage}</div>}
      {/* Render error message if an error occurred */}
      {error && <div>Error: {error.message}</div>}
    </div>
  );
};

MyComponent.getUsageData = async (): Promise<any> => {
  try {
    const response: AxiosResponse<any> = await usageAnalyticsApi.get('/');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default MyComponent;