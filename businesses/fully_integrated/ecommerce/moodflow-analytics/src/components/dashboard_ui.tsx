import React, { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface MoodData {
  timestamp: string;
  mood: number;
}

interface DashboardProps {
  teamId: string;
}

const Dashboard: React.FC<DashboardProps> = ({ teamId }) => {
  const [moodData, setMoodData] = useState<MoodData[]>([]);
  const [averageMood, setAverageMood] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchMoodData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response: AxiosResponse<MoodData[]> = await axios.get(`/api/teams/${teamId}/mood-data`);
      setMoodData(response.data);
      setAverageMood(calculateAverageMood(response.data));
      setError(null);
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(`Error fetching mood data: ${axiosError.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [teamId]);

  useEffect(() => {
    fetchMoodData();
  }, [fetchMoodData]);

  const calculateAverageMood = (data: MoodData[]): number => {
    if (data.length === 0) return 0;
    const totalMood = data.reduce((sum, entry) => sum + entry.mood, 0);
    return totalMood / data.length;
  };

  return (
    <div>
      <h1>Team Mood Dashboard</h1>
      {error ? (
        <div role="alert" aria-live="assertive" className="error">
          {error}
        </div>
      ) : (
        <>
          {isLoading ? (
            <div role="status" aria-live="polite" className="loading">
              Loading mood data...
            </div>
          ) : (
            <>
              <p>Average Mood: {averageMood.toFixed(2)}</p>
              <h2>Mood Trends</h2>
              {moodData.length === 0 ? (
                <p>No mood data available.</p>
              ) : (
                <ul>
                  {moodData.map((entry, index) => (
                    <li key={index}>
                      {new Date(entry.timestamp).toLocaleString()}: {entry.mood}
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;

import React, { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface MoodData {
  timestamp: string;
  mood: number;
}

interface DashboardProps {
  teamId: string;
}

const Dashboard: React.FC<DashboardProps> = ({ teamId }) => {
  const [moodData, setMoodData] = useState<MoodData[]>([]);
  const [averageMood, setAverageMood] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchMoodData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response: AxiosResponse<MoodData[]> = await axios.get(`/api/teams/${teamId}/mood-data`);
      setMoodData(response.data);
      setAverageMood(calculateAverageMood(response.data));
      setError(null);
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(`Error fetching mood data: ${axiosError.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [teamId]);

  useEffect(() => {
    fetchMoodData();
  }, [fetchMoodData]);

  const calculateAverageMood = (data: MoodData[]): number => {
    if (data.length === 0) return 0;
    const totalMood = data.reduce((sum, entry) => sum + entry.mood, 0);
    return totalMood / data.length;
  };

  return (
    <div>
      <h1>Team Mood Dashboard</h1>
      {error ? (
        <div role="alert" aria-live="assertive" className="error">
          {error}
        </div>
      ) : (
        <>
          {isLoading ? (
            <div role="status" aria-live="polite" className="loading">
              Loading mood data...
            </div>
          ) : (
            <>
              <p>Average Mood: {averageMood.toFixed(2)}</p>
              <h2>Mood Trends</h2>
              {moodData.length === 0 ? (
                <p>No mood data available.</p>
              ) : (
                <ul>
                  {moodData.map((entry, index) => (
                    <li key={index}>
                      {new Date(entry.timestamp).toLocaleString()}: {entry.mood}
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;