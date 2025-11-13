import React, { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface MindfulMetricsProps {
  teamId: string;
  userId: string;
}

interface StressData {
  stressLevel: number;
}

interface WellnessContent {
  content: string;
}

const MindfulMetrics: React.FC<MindfulMetricsProps> = ({ teamId, userId }) => {
  const [stressLevel, setStressLevel] = useState<number | null>(null);
  const [wellnessContent, setWellnessContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchStressData = useCallback(async () => {
    try {
      const response: AxiosResponse<StressData> = await axios.get(`/api/stress-data?teamId=${teamId}&userId=${userId}`);
      setStressLevel(response.data.stressLevel);
    } catch (error) {
      const axiosError = error as AxiosError;
      setError(`Error fetching stress data: ${axiosError.message}`);
    }
  }, [teamId, userId]);

  const fetchWellnessContent = useCallback(async () => {
    try {
      const response: AxiosResponse<WellnessContent> = await axios.get(`/api/wellness-content?userId=${userId}`);
      setWellnessContent(response.data.content);
    } catch (error) {
      const axiosError = error as AxiosError;
      setError(`Error fetching wellness content: ${axiosError.message}`);
    }
  }, [userId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([fetchStressData(), fetchWellnessContent()]);
      } catch (error) {
        const axiosError = error as AxiosError;
        setError(`Error fetching data: ${axiosError.message}`);
      }
    };

    fetchData();
  }, [fetchStressData, fetchWellnessContent]);

  return (
    <div>
      <h1>MindfulMetrics</h1>
      {error ? (
        <p className="error" aria-live="assertive">
          {error}
        </p>
      ) : (
        <>
          {stressLevel !== null ? (
            <p>Your current stress level: {stressLevel}</p>
          ) : (
            <p aria-live="polite">Loading stress level...</p>
          )}
          {wellnessContent !== null ? (
            <p>Personalized wellness content: {wellnessContent}</p>
          ) : (
            <p aria-live="polite">Loading wellness content...</p>
          )}
        </>
      )}
    </div>
  );
};

export default MindfulMetrics;

import React, { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface MindfulMetricsProps {
  teamId: string;
  userId: string;
}

interface StressData {
  stressLevel: number;
}

interface WellnessContent {
  content: string;
}

const MindfulMetrics: React.FC<MindfulMetricsProps> = ({ teamId, userId }) => {
  const [stressLevel, setStressLevel] = useState<number | null>(null);
  const [wellnessContent, setWellnessContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchStressData = useCallback(async () => {
    try {
      const response: AxiosResponse<StressData> = await axios.get(`/api/stress-data?teamId=${teamId}&userId=${userId}`);
      setStressLevel(response.data.stressLevel);
    } catch (error) {
      const axiosError = error as AxiosError;
      setError(`Error fetching stress data: ${axiosError.message}`);
    }
  }, [teamId, userId]);

  const fetchWellnessContent = useCallback(async () => {
    try {
      const response: AxiosResponse<WellnessContent> = await axios.get(`/api/wellness-content?userId=${userId}`);
      setWellnessContent(response.data.content);
    } catch (error) {
      const axiosError = error as AxiosError;
      setError(`Error fetching wellness content: ${axiosError.message}`);
    }
  }, [userId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([fetchStressData(), fetchWellnessContent()]);
      } catch (error) {
        const axiosError = error as AxiosError;
        setError(`Error fetching data: ${axiosError.message}`);
      }
    };

    fetchData();
  }, [fetchStressData, fetchWellnessContent]);

  return (
    <div>
      <h1>MindfulMetrics</h1>
      {error ? (
        <p className="error" aria-live="assertive">
          {error}
        </p>
      ) : (
        <>
          {stressLevel !== null ? (
            <p>Your current stress level: {stressLevel}</p>
          ) : (
            <p aria-live="polite">Loading stress level...</p>
          )}
          {wellnessContent !== null ? (
            <p>Personalized wellness content: {wellnessContent}</p>
          ) : (
            <p aria-live="polite">Loading wellness content...</p>
          )}
        </>
      )}
    </div>
  );
};

export default MindfulMetrics;