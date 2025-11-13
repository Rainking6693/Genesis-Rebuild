import React, { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface MoodData {
  id: string;
  timestamp: number;
  mood: number;
  comment?: string;
}

interface MoodFlowProps {
  teamId: string;
  /** Optional prop to inject a custom error boundary component.  Useful for testing and specific error handling. */
  ErrorBoundary?: React.ComponentType<{ children: React.ReactNode; error: string | null }>;
}

const DefaultErrorBoundary: React.FC<{ children: React.ReactNode; error: string | null }> = ({ children, error }) => {
  if (error) {
    return (
      <div role="alert" aria-live="assertive" className="error">
        <strong>Error:</strong> {error}
      </div>
    );
  }
  return <>{children}</>;
};

const MoodFlow: React.FC<MoodFlowProps> = ({ teamId, ErrorBoundary = DefaultErrorBoundary }) => {
  const [moodData, setMoodData] = useState<MoodData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Add loading state

  const fetchMoodData = useCallback(async () => {
    setLoading(true); // Set loading to true when fetching starts
    try {
      const response: AxiosResponse<MoodData[]> = await axios.get<MoodData[]>(`/api/teams/${teamId}/mood-data`, {
        timeout: 5000, // Add a timeout to prevent indefinite loading
      });

      // Validate the response data structure
      if (!Array.isArray(response.data)) {
        throw new Error('Invalid data format received from the API.');
      }

      setMoodData(response.data);
      setError(null);
    } catch (err) {
      let errorMessage = 'An unexpected error occurred.';
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError;
        errorMessage = `Error fetching mood data: ${axiosError.message}.  Status code: ${axiosError.response?.status || 'N/A'}`;

        if (axiosError.response?.status === 404) {
          errorMessage = `Mood data not found for team ${teamId}.`; // More specific message
        } else if (axiosError.code === 'ECONNABORTED') {
          errorMessage = 'Request timed out while fetching mood data.'; // Timeout error
        }
      } else if (err instanceof Error) {
        errorMessage = err.message; // Capture error message for non-axios errors
      }
      setError(errorMessage);
      console.error("Error fetching mood data:", err); // Log the error for debugging
    } finally {
      setLoading(false); // Set loading to false when fetching completes (success or failure)
    }
  }, [teamId]);

  useEffect(() => {
    fetchMoodData();
  }, [fetchMoodData]);

  // Handle empty state
  if (loading) {
    return <div>Loading mood data...</div>; // Display loading indicator
  }

  const hasMoodData = moodData.length > 0;

  return (
    <div>
      <h1>MoodFlow Analytics</h1>
      <h2>Team Mood Trends</h2>

      <ErrorBoundary error={error}>
        {!hasMoodData && !error && !loading && (
          <div role="alert" aria-live="polite">
            No mood data available for this team.
          </div>
        )}

        {hasMoodData && (
          <ul aria-label="Mood Data List">
            {moodData.map((data) => (
              <li key={data.id}>
                <p>
                  <strong>Timestamp:</strong> {new Date(data.timestamp).toLocaleString()}
                </p>
                <p>
                  <strong>Mood:</strong> {data.mood}
                </p>
                {data.comment && (
                  <p>
                    <strong>Comment:</strong> {data.comment}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </ErrorBoundary>
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
  comment?: string;
}

interface MoodFlowProps {
  teamId: string;
  /** Optional prop to inject a custom error boundary component.  Useful for testing and specific error handling. */
  ErrorBoundary?: React.ComponentType<{ children: React.ReactNode; error: string | null }>;
}

const DefaultErrorBoundary: React.FC<{ children: React.ReactNode; error: string | null }> = ({ children, error }) => {
  if (error) {
    return (
      <div role="alert" aria-live="assertive" className="error">
        <strong>Error:</strong> {error}
      </div>
    );
  }
  return <>{children}</>;
};

const MoodFlow: React.FC<MoodFlowProps> = ({ teamId, ErrorBoundary = DefaultErrorBoundary }) => {
  const [moodData, setMoodData] = useState<MoodData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Add loading state

  const fetchMoodData = useCallback(async () => {
    setLoading(true); // Set loading to true when fetching starts
    try {
      const response: AxiosResponse<MoodData[]> = await axios.get<MoodData[]>(`/api/teams/${teamId}/mood-data`, {
        timeout: 5000, // Add a timeout to prevent indefinite loading
      });

      // Validate the response data structure
      if (!Array.isArray(response.data)) {
        throw new Error('Invalid data format received from the API.');
      }

      setMoodData(response.data);
      setError(null);
    } catch (err) {
      let errorMessage = 'An unexpected error occurred.';
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError;
        errorMessage = `Error fetching mood data: ${axiosError.message}.  Status code: ${axiosError.response?.status || 'N/A'}`;

        if (axiosError.response?.status === 404) {
          errorMessage = `Mood data not found for team ${teamId}.`; // More specific message
        } else if (axiosError.code === 'ECONNABORTED') {
          errorMessage = 'Request timed out while fetching mood data.'; // Timeout error
        }
      } else if (err instanceof Error) {
        errorMessage = err.message; // Capture error message for non-axios errors
      }
      setError(errorMessage);
      console.error("Error fetching mood data:", err); // Log the error for debugging
    } finally {
      setLoading(false); // Set loading to false when fetching completes (success or failure)
    }
  }, [teamId]);

  useEffect(() => {
    fetchMoodData();
  }, [fetchMoodData]);

  // Handle empty state
  if (loading) {
    return <div>Loading mood data...</div>; // Display loading indicator
  }

  const hasMoodData = moodData.length > 0;

  return (
    <div>
      <h1>MoodFlow Analytics</h1>
      <h2>Team Mood Trends</h2>

      <ErrorBoundary error={error}>
        {!hasMoodData && !error && !loading && (
          <div role="alert" aria-live="polite">
            No mood data available for this team.
          </div>
        )}

        {hasMoodData && (
          <ul aria-label="Mood Data List">
            {moodData.map((data) => (
              <li key={data.id}>
                <p>
                  <strong>Timestamp:</strong> {new Date(data.timestamp).toLocaleString()}
                </p>
                <p>
                  <strong>Mood:</strong> {data.mood}
                </p>
                {data.comment && (
                  <p>
                    <strong>Comment:</strong> {data.comment}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </ErrorBoundary>
    </div>
  );
};

export default MoodFlow;