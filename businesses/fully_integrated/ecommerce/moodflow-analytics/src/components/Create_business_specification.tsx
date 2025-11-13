import React, { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface MoodData {
  id: string;
  timestamp: number;
  mood: number;
  comment: string;
}

interface MoodFlowProps {
  teamSize: number;
  industry: string;
}

const MoodFlow: React.FC<MoodFlowProps> = ({ teamSize, industry }) => {
  const [moodData, setMoodData] = useState<MoodData[]>([]);
  const [averageMood, setAverageMood] = useState(0);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchMoodData = useCallback(async () => {
    try {
      const response: AxiosResponse<MoodData[]> = await axios.get<MoodData[]>('/api/mood-data');
      setMoodData(response.data);
      calculateAverageMood(response.data);
      generateRecommendations(response.data, teamSize, industry);
      setError(null);
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(`Error fetching mood data: ${axiosError.message}`);
    }
  }, [teamSize, industry]);

  useEffect(() => {
    const abortController = new AbortController();
    fetchMoodData().catch((error) => {
      if (error.name !== 'AbortError') {
        setError(`Error fetching mood data: ${error.message}`);
      }
    });

    return () => {
      abortController.abort();
    };
  }, [fetchMoodData]);

  const calculateAverageMood = (data: MoodData[]) => {
    const totalMood = data.reduce((sum, item) => sum + item.mood, 0);
    setAverageMood(data.length > 0 ? totalMood / data.length : 0);
  };

  const generateRecommendations = (data: MoodData[], teamSize: number, industry: string) => {
    const recommendations: string[] = [];

    if (averageMood < 3) {
      recommendations.push('Implement team-building activities to boost morale.');
    }

    if (teamSize > 20 && industry === 'technology') {
      recommendations.push('Consider introducing a mental health program for employees.');
    }

    setRecommendations(recommendations);
  };

  return (
    <div>
      <h1>MoodFlow Analytics</h1>
      {error ? (
        <div role="alert" aria-live="assertive" className="error">
          {error}
        </div>
      ) : (
        <>
          <p>Average Mood: {averageMood.toFixed(2)}</p>
          <h2>Recommendations:</h2>
          <ul>
            {recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </>
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
  comment: string;
}

interface MoodFlowProps {
  teamSize: number;
  industry: string;
}

const MoodFlow: React.FC<MoodFlowProps> = ({ teamSize, industry }) => {
  const [moodData, setMoodData] = useState<MoodData[]>([]);
  const [averageMood, setAverageMood] = useState(0);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchMoodData = useCallback(async () => {
    try {
      const response: AxiosResponse<MoodData[]> = await axios.get<MoodData[]>('/api/mood-data');
      setMoodData(response.data);
      calculateAverageMood(response.data);
      generateRecommendations(response.data, teamSize, industry);
      setError(null);
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(`Error fetching mood data: ${axiosError.message}`);
    }
  }, [teamSize, industry]);

  useEffect(() => {
    const abortController = new AbortController();
    fetchMoodData().catch((error) => {
      if (error.name !== 'AbortError') {
        setError(`Error fetching mood data: ${error.message}`);
      }
    });

    return () => {
      abortController.abort();
    };
  }, [fetchMoodData]);

  const calculateAverageMood = (data: MoodData[]) => {
    const totalMood = data.reduce((sum, item) => sum + item.mood, 0);
    setAverageMood(data.length > 0 ? totalMood / data.length : 0);
  };

  const generateRecommendations = (data: MoodData[], teamSize: number, industry: string) => {
    const recommendations: string[] = [];

    if (averageMood < 3) {
      recommendations.push('Implement team-building activities to boost morale.');
    }

    if (teamSize > 20 && industry === 'technology') {
      recommendations.push('Consider introducing a mental health program for employees.');
    }

    setRecommendations(recommendations);
  };

  return (
    <div>
      <h1>MoodFlow Analytics</h1>
      {error ? (
        <div role="alert" aria-live="assertive" className="error">
          {error}
        </div>
      ) : (
        <>
          <p>Average Mood: {averageMood.toFixed(2)}</p>
          <h2>Recommendations:</h2>
          <ul>
            {recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default MoodFlow;