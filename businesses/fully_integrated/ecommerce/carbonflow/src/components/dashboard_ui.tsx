import React, { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface DashboardProps {
  title: string;
  content: string;
  carbonData: CarbonData;
}

interface CarbonData {
  totalEmissions: number;
  suggestedActions: string[];
  teamChallenges: TeamChallenge[];
}

interface TeamChallenge {
  title: string;
  description: string;
  points: number;
}

interface TeamChallengeProgress {
  [key: string]: number;
}

const Dashboard: React.FC<DashboardProps> = ({ title, content, carbonData }) => {
  const [teamChallengeProgress, setTeamChallengeProgress] = useState<TeamChallengeProgress>({});
  const [error, setError] = useState<string | null>(null);

  const fetchTeamChallengeProgress = useCallback(async () => {
    try {
      const response: AxiosResponse<TeamChallengeProgress> = await axios.get('/api/team-challenge-progress');
      setTeamChallengeProgress(response.data);
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(`Error fetching team challenge progress: ${axiosError.message}`);
    }
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;

    const fetchData = async () => {
      try {
        await fetchTeamChallengeProgress();
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          console.log('Fetch request aborted');
        } else {
          throw err;
        }
      }
    };

    fetchData();

    return () => {
      abortController.abort();
    };
  }, [fetchTeamChallengeProgress]);

  return (
    <div>
      <h1>{title}</h1>
      <p>{content}</p>
      {error && (
        <div role="alert" aria-live="assertive" className="error-message">
          {error}
        </div>
      )}
      <div>
        <h2>Carbon Footprint</h2>
        <p>Total Emissions: {carbonData.totalEmissions} kg CO2e</p>
        <h3>Suggested Actions</h3>
        <ul>
          {carbonData.suggestedActions.map((action, index) => (
            <li key={index}>{action}</li>
          ))}
        </ul>
        <h3>Team Challenges</h3>
        {carbonData.teamChallenges.map((challenge, index) => (
          <div key={index}>
            <h4>{challenge.title}</h4>
            <p>{challenge.description}</p>
            <p>Points: {challenge.points}</p>
            <p>Progress: {teamChallengeProgress[challenge.title] || 0}%</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

import React, { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface DashboardProps {
  title: string;
  content: string;
  carbonData: CarbonData;
}

interface CarbonData {
  totalEmissions: number;
  suggestedActions: string[];
  teamChallenges: TeamChallenge[];
}

interface TeamChallenge {
  title: string;
  description: string;
  points: number;
}

interface TeamChallengeProgress {
  [key: string]: number;
}

const Dashboard: React.FC<DashboardProps> = ({ title, content, carbonData }) => {
  const [teamChallengeProgress, setTeamChallengeProgress] = useState<TeamChallengeProgress>({});
  const [error, setError] = useState<string | null>(null);

  const fetchTeamChallengeProgress = useCallback(async () => {
    try {
      const response: AxiosResponse<TeamChallengeProgress> = await axios.get('/api/team-challenge-progress');
      setTeamChallengeProgress(response.data);
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(`Error fetching team challenge progress: ${axiosError.message}`);
    }
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;

    const fetchData = async () => {
      try {
        await fetchTeamChallengeProgress();
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          console.log('Fetch request aborted');
        } else {
          throw err;
        }
      }
    };

    fetchData();

    return () => {
      abortController.abort();
    };
  }, [fetchTeamChallengeProgress]);

  return (
    <div>
      <h1>{title}</h1>
      <p>{content}</p>
      {error && (
        <div role="alert" aria-live="assertive" className="error-message">
          {error}
        </div>
      )}
      <div>
        <h2>Carbon Footprint</h2>
        <p>Total Emissions: {carbonData.totalEmissions} kg CO2e</p>
        <h3>Suggested Actions</h3>
        <ul>
          {carbonData.suggestedActions.map((action, index) => (
            <li key={index}>{action}</li>
          ))}
        </ul>
        <h3>Team Challenges</h3>
        {carbonData.teamChallenges.map((challenge, index) => (
          <div key={index}>
            <h4>{challenge.title}</h4>
            <p>{challenge.description}</p>
            <p>Points: {challenge.points}</p>
            <p>Progress: {teamChallengeProgress[challenge.title] || 0}%</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;