import React, { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface MoodData {
  id: string;
  timestamp: number;
  mood: number;
}

interface MoodFlowProps {
  title: string;
}

const MoodFlow: React.FC<MoodFlowProps> = ({ title }) => {
  const [moodData, setMoodData] = useState<MoodData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMoodData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response: AxiosResponse<MoodData[]> = await axios.get<MoodData[]>('/api/mood-data');
      setMoodData(response.data);
      setError(null);
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(
        axiosError.response?.data?.message || 'An error occurred while fetching mood data.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const fetchData = async () => {
      try {
        await fetchMoodData();
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          console.log('Fetch aborted');
        } else {
          throw err;
        }
      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
  }, [fetchMoodData]);

  return (
    <div>
      <h1>{title}</h1>
      {isLoading ? (
        <div role="status" aria-live="polite">
          <span className="sr-only">Loading...</span>
        </div>
      ) : error ? (
        <div role="alert" aria-live="assertive">
          <p>{error}</p>
          <button onClick={fetchMoodData}>Retry</button>
        </div>
      ) : (
        <div>
          {moodData.map((data) => (
            <div key={data.id}>
              <p>Timestamp: {new Date(data.timestamp).toLocaleString()}</p>
              <p>Mood: {data.mood}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MoodFlow;

import React, { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface MoodData {
  id: string;
  timestamp: number;
  mood: number;
}

interface MoodFlowProps {
  title: string;
}

const MoodFlow: React.FC<MoodFlowProps> = ({ title }) => {
  const [moodData, setMoodData] = useState<MoodData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMoodData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response: AxiosResponse<MoodData[]> = await axios.get<MoodData[]>('/api/mood-data');
      setMoodData(response.data);
      setError(null);
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(
        axiosError.response?.data?.message || 'An error occurred while fetching mood data.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const fetchData = async () => {
      try {
        await fetchMoodData();
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          console.log('Fetch aborted');
        } else {
          throw err;
        }
      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
  }, [fetchMoodData]);

  return (
    <div>
      <h1>{title}</h1>
      {isLoading ? (
        <div role="status" aria-live="polite">
          <span className="sr-only">Loading...</span>
        </div>
      ) : error ? (
        <div role="alert" aria-live="assertive">
          <p>{error}</p>
          <button onClick={fetchMoodData}>Retry</button>
        </div>
      ) : (
        <div>
          {moodData.map((data) => (
            <div key={data.id}>
              <p>Timestamp: {new Date(data.timestamp).toLocaleString()}</p>
              <p>Mood: {data.mood}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MoodFlow;