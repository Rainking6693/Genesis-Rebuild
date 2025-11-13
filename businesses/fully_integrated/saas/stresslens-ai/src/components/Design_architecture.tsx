import React, { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface MyComponentProps {
  title: string;
  content: string;
}

interface StressInsightsData {
  stressInsights: string;
  wellnessRecommendations: string[];
}

const MyComponent: React.FC<MyComponentProps> = ({ title, content }) => {
  const [data, setData] = useState<StressInsightsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<StressInsightsData> = await axios.get('/api/data');
      setData(response.data);
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(
        axiosError.response?.data?.message ||
          axiosError.message ||
          'An error occurred while fetching data.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRetry = () => {
    fetchData();
  };

  return (
    <div>
      {isLoading && (
        <div role="status" aria-live="polite">
          <span className="sr-only">Loading...</span>
        </div>
      )}

      {error && (
        <div role="alert" aria-live="assertive">
          <p>Error: {error}</p>
          <button onClick={handleRetry}>Retry</button>
        </div>
      )}

      {data && (
        <div>
          <h1>{title}</h1>
          <p>{content}</p>
          <div>
            <h2>Stress Insights</h2>
            <p>{data.stressInsights}</p>
          </div>
          <div>
            <h2>Wellness Recommendations</h2>
            <ul>
              {data.wellnessRecommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyComponent;

import React, { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface MyComponentProps {
  title: string;
  content: string;
}

interface StressInsightsData {
  stressInsights: string;
  wellnessRecommendations: string[];
}

const MyComponent: React.FC<MyComponentProps> = ({ title, content }) => {
  const [data, setData] = useState<StressInsightsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<StressInsightsData> = await axios.get('/api/data');
      setData(response.data);
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(
        axiosError.response?.data?.message ||
          axiosError.message ||
          'An error occurred while fetching data.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRetry = () => {
    fetchData();
  };

  return (
    <div>
      {isLoading && (
        <div role="status" aria-live="polite">
          <span className="sr-only">Loading...</span>
        </div>
      )}

      {error && (
        <div role="alert" aria-live="assertive">
          <p>Error: {error}</p>
          <button onClick={handleRetry}>Retry</button>
        </div>
      )}

      {data && (
        <div>
          <h1>{title}</h1>
          <p>{content}</p>
          <div>
            <h2>Stress Insights</h2>
            <p>{data.stressInsights}</p>
          </div>
          <div>
            <h2>Wellness Recommendations</h2>
            <ul>
              {data.wellnessRecommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyComponent;