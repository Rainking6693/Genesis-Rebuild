import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface CarbonFlowProps {
  title: string;
  description: string;
  features: string[];
  teamChallenges: { name: string; description: string; points: number }[];
  carbonData: { timestamp: string; emissions: number }[];
}

interface CarbonData {
  emissions: number;
}

const CarbonFlow: React.FC<CarbonFlowProps> = ({
  title,
  description,
  features,
  teamChallenges,
  carbonData,
}) => {
  const [activeChallenge, setActiveChallenge] = useState<
    { name: string; description: string; points: number } | null
  >(null);
  const [totalEmissions, setTotalEmissions] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(false);

  const fetchCarbonData = useCallback(async () => {
    try {
      const response: AxiosResponse<CarbonData[]> = await axios.get('/api/carbon-data');
      setTotalEmissions(
        response.data.reduce((total, data) => total + data.emissions, 0)
      );
    } catch (error) {
      const axiosError = error as AxiosError;
      setError(
        `Error fetching carbon data: ${axiosError.message} (${axiosError.status})`
      );
    }
  }, []);

  useEffect(() => {
    isMounted.current = true;
    fetchCarbonData();

    return () => {
      isMounted.current = false;
    };
  }, [fetchCarbonData]);

  const handleChallengeClick = (challenge: {
    name: string;
    description: string;
    points: number;
  }) => {
    setActiveChallenge(challenge);
  };

  return (
    <div>
      <h1>{title}</h1>
      <p>{description}</p>
      <h2>Features:</h2>
      <ul>
        {features.map((feature, index) => (
          <li key={index}>{feature}</li>
        ))}
      </ul>
      <h2>Team Challenges:</h2>
      <div>
        {teamChallenges.map((challenge, index) => (
          <div
            key={index}
            onClick={() => handleChallengeClick(challenge)}
            style={{
              backgroundColor:
                activeChallenge?.name === challenge.name ? '#f0f0f0' : 'transparent',
              padding: '10px',
              cursor: 'pointer',
            }}
            aria-label={`Challenge: ${challenge.name}`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleChallengeClick(challenge);
              }
            }}
          >
            <h3>{challenge.name}</h3>
            <p>{challenge.description}</p>
            <p>Points: {challenge.points}</p>
          </div>
        ))}
      </div>
      {activeChallenge && (
        <div>
          <h2>Active Challenge:</h2>
          <h3>{activeChallenge.name}</h3>
          <p>{activeChallenge.description}</p>
          <p>Points: {activeChallenge.points}</p>
        </div>
      )}
      <h2>Carbon Data:</h2>
      {error ? (
        <p>{error}</p>
      ) : (
        <>
          <p>Total Emissions: {totalEmissions.toFixed(2)} kg CO2</p>
          <div>
            {carbonData.map((data, index) => (
              <div key={index}>
                <p>Timestamp: {data.timestamp}</p>
                <p>Emissions: {data.emissions.toFixed(2)} kg CO2</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CarbonFlow;

import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface CarbonFlowProps {
  title: string;
  description: string;
  features: string[];
  teamChallenges: { name: string; description: string; points: number }[];
  carbonData: { timestamp: string; emissions: number }[];
}

interface CarbonData {
  emissions: number;
}

const CarbonFlow: React.FC<CarbonFlowProps> = ({
  title,
  description,
  features,
  teamChallenges,
  carbonData,
}) => {
  const [activeChallenge, setActiveChallenge] = useState<
    { name: string; description: string; points: number } | null
  >(null);
  const [totalEmissions, setTotalEmissions] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(false);

  const fetchCarbonData = useCallback(async () => {
    try {
      const response: AxiosResponse<CarbonData[]> = await axios.get('/api/carbon-data');
      setTotalEmissions(
        response.data.reduce((total, data) => total + data.emissions, 0)
      );
    } catch (error) {
      const axiosError = error as AxiosError;
      setError(
        `Error fetching carbon data: ${axiosError.message} (${axiosError.status})`
      );
    }
  }, []);

  useEffect(() => {
    isMounted.current = true;
    fetchCarbonData();

    return () => {
      isMounted.current = false;
    };
  }, [fetchCarbonData]);

  const handleChallengeClick = (challenge: {
    name: string;
    description: string;
    points: number;
  }) => {
    setActiveChallenge(challenge);
  };

  return (
    <div>
      <h1>{title}</h1>
      <p>{description}</p>
      <h2>Features:</h2>
      <ul>
        {features.map((feature, index) => (
          <li key={index}>{feature}</li>
        ))}
      </ul>
      <h2>Team Challenges:</h2>
      <div>
        {teamChallenges.map((challenge, index) => (
          <div
            key={index}
            onClick={() => handleChallengeClick(challenge)}
            style={{
              backgroundColor:
                activeChallenge?.name === challenge.name ? '#f0f0f0' : 'transparent',
              padding: '10px',
              cursor: 'pointer',
            }}
            aria-label={`Challenge: ${challenge.name}`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleChallengeClick(challenge);
              }
            }}
          >
            <h3>{challenge.name}</h3>
            <p>{challenge.description}</p>
            <p>Points: {challenge.points}</p>
          </div>
        ))}
      </div>
      {activeChallenge && (
        <div>
          <h2>Active Challenge:</h2>
          <h3>{activeChallenge.name}</h3>
          <p>{activeChallenge.description}</p>
          <p>Points: {activeChallenge.points}</p>
        </div>
      )}
      <h2>Carbon Data:</h2>
      {error ? (
        <p>{error}</p>
      ) : (
        <>
          <p>Total Emissions: {totalEmissions.toFixed(2)} kg CO2</p>
          <div>
            {carbonData.map((data, index) => (
              <div key={index}>
                <p>Timestamp: {data.timestamp}</p>
                <p>Emissions: {data.emissions.toFixed(2)} kg CO2</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CarbonFlow;