import React, { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface CarbonFootprintData {
  totalEmissions: number;
  suggestedActions: string[];
  teamChallenges: { name: string; description: string; points: number }[];
}

interface ErrorState {
  message: string;
  code?: number;
}

const CarbonFootprintTracker: React.FC = () => {
  const [carbonFootprintData, setCarbonFootprintData] = useState<CarbonFootprintData>({
    totalEmissions: 0,
    suggestedActions: [],
    teamChallenges: [],
  });
  const [error, setError] = useState<ErrorState | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchCarbonFootprintData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response: AxiosResponse<CarbonFootprintData> = await axios.get('/api/carbon-footprint');
      setCarbonFootprintData(response.data);
      setError(null);
    } catch (err) {
      const axiosError = err as AxiosError;
      setError({
        message: `Error fetching carbon footprint data: ${axiosError.message}`,
        code: axiosError.response?.status,
      });
      console.error('Error fetching carbon footprint data:', axiosError);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCarbonFootprintData();
  }, [fetchCarbonFootprintData]);

  return (
    <div>
      <h1>CarbonFlow - AI-powered Carbon Footprint Tracking</h1>
      {error && (
        <div role="alert" aria-live="assertive" className="error-message">
          {error.message}
          {error.code && <p>Error code: {error.code}</p>}
        </div>
      )}
      {isLoading && (
        <div role="status" aria-live="polite" className="loading-indicator">
          Loading...
        </div>
      )}
      <div>
        <h2>Your Total Emissions:</h2>
        <p>{carbonFootprintData.totalEmissions} kg CO2e</p>
      </div>
      <div>
        <h2>Suggested Actions:</h2>
        <ul>
          {carbonFootprintData.suggestedActions.map((action, index) => (
            <li key={index}>{action}</li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Team Challenges:</h2>
        {carbonFootprintData.teamChallenges.map((challenge, index) => (
          <div key={index}>
            <h3>{challenge.name}</h3>
            <p>{challenge.description}</p>
            <p>Points: {challenge.points}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarbonFootprintTracker;

import React, { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface CarbonFootprintData {
  totalEmissions: number;
  suggestedActions: string[];
  teamChallenges: { name: string; description: string; points: number }[];
}

interface ErrorState {
  message: string;
  code?: number;
}

const CarbonFootprintTracker: React.FC = () => {
  const [carbonFootprintData, setCarbonFootprintData] = useState<CarbonFootprintData>({
    totalEmissions: 0,
    suggestedActions: [],
    teamChallenges: [],
  });
  const [error, setError] = useState<ErrorState | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchCarbonFootprintData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response: AxiosResponse<CarbonFootprintData> = await axios.get('/api/carbon-footprint');
      setCarbonFootprintData(response.data);
      setError(null);
    } catch (err) {
      const axiosError = err as AxiosError;
      setError({
        message: `Error fetching carbon footprint data: ${axiosError.message}`,
        code: axiosError.response?.status,
      });
      console.error('Error fetching carbon footprint data:', axiosError);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCarbonFootprintData();
  }, [fetchCarbonFootprintData]);

  return (
    <div>
      <h1>CarbonFlow - AI-powered Carbon Footprint Tracking</h1>
      {error && (
        <div role="alert" aria-live="assertive" className="error-message">
          {error.message}
          {error.code && <p>Error code: {error.code}</p>}
        </div>
      )}
      {isLoading && (
        <div role="status" aria-live="polite" className="loading-indicator">
          Loading...
        </div>
      )}
      <div>
        <h2>Your Total Emissions:</h2>
        <p>{carbonFootprintData.totalEmissions} kg CO2e</p>
      </div>
      <div>
        <h2>Suggested Actions:</h2>
        <ul>
          {carbonFootprintData.suggestedActions.map((action, index) => (
            <li key={index}>{action}</li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Team Challenges:</h2>
        {carbonFootprintData.teamChallenges.map((challenge, index) => (
          <div key={index}>
            <h3>{challenge.name}</h3>
            <p>{challenge.description}</p>
            <p>Points: {challenge.points}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarbonFootprintTracker;