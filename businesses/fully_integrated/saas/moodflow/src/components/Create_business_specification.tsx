import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { SlackClient, TeamsClient } from './integration-clients';

interface Props {
  slackClient: SlackClient | TeamsClient;
}

interface SentimentAnalysisResponse {
  sentimentScore: number;
  suggestions: string[];
}

const MyComponent: React.FC<Props> = ({ slackClient }) => {
  const [message, setMessage] = useState<string | null>(null);
  const [sentimentScore, setSentimentScore] = useState<number | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await slackClient.getLatestMessage();
        setMessage(response.message || null);
        if (message) {
          const sentimentResponse = await fetchSentimentAnalysis(message);
          setSentimentScore(sentimentResponse.sentimentScore);
          setSuggestions(sentimentResponse.suggestions);
        }
      } catch (error) {
        setError(error);
      }
    };

    fetchData();
  }, [slackClient]);

  const fetchSentimentAnalysis = async (message: string) => {
    try {
      const response = await axios.post('/api/sentiment-analysis', { message });
      return response.data as SentimentAnalysisResponse;
    } catch (error) {
      console.error('Error fetching sentiment analysis:', error);
      return { sentimentScore: 0, suggestions: [] };
    }
  };

  const handleWellnessIntervention = () => {
    // Trigger personalized wellness intervention based on sentiment score and suggestions
    // Example: Send a message with wellness resources or schedule a break
  };

  const isLoading = !message && !error;
  const isError = !!error;

  return (
    <div>
      <div>Latest message: {message ? message : 'No message received'}</div>
      {isError && <div>Error: {error.message}</div>}
      {!isLoading && (
        <>
          <div>Sentiment score: {sentimentScore || 0}</div>
          <ul>
            {suggestions.map((suggestion, index) => (
              <li key={index}>{suggestion}</li>
            ))}
          </ul>
          <button onClick={handleWellnessIntervention} disabled={isLoading}>
            Trigger Wellness Intervention
          </button>
        </>
      )}
      {isLoading && <div>Loading...</div>}
    </div>
  );
};

export default MyComponent;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { SlackClient, TeamsClient } from './integration-clients';

interface Props {
  slackClient: SlackClient | TeamsClient;
}

interface SentimentAnalysisResponse {
  sentimentScore: number;
  suggestions: string[];
}

const MyComponent: React.FC<Props> = ({ slackClient }) => {
  const [message, setMessage] = useState<string | null>(null);
  const [sentimentScore, setSentimentScore] = useState<number | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await slackClient.getLatestMessage();
        setMessage(response.message || null);
        if (message) {
          const sentimentResponse = await fetchSentimentAnalysis(message);
          setSentimentScore(sentimentResponse.sentimentScore);
          setSuggestions(sentimentResponse.suggestions);
        }
      } catch (error) {
        setError(error);
      }
    };

    fetchData();
  }, [slackClient]);

  const fetchSentimentAnalysis = async (message: string) => {
    try {
      const response = await axios.post('/api/sentiment-analysis', { message });
      return response.data as SentimentAnalysisResponse;
    } catch (error) {
      console.error('Error fetching sentiment analysis:', error);
      return { sentimentScore: 0, suggestions: [] };
    }
  };

  const handleWellnessIntervention = () => {
    // Trigger personalized wellness intervention based on sentiment score and suggestions
    // Example: Send a message with wellness resources or schedule a break
  };

  const isLoading = !message && !error;
  const isError = !!error;

  return (
    <div>
      <div>Latest message: {message ? message : 'No message received'}</div>
      {isError && <div>Error: {error.message}</div>}
      {!isLoading && (
        <>
          <div>Sentiment score: {sentimentScore || 0}</div>
          <ul>
            {suggestions.map((suggestion, index) => (
              <li key={index}>{suggestion}</li>
            ))}
          </ul>
          <button onClick={handleWellnessIntervention} disabled={isLoading}>
            Trigger Wellness Intervention
          </button>
        </>
      )}
      {isLoading && <div>Loading...</div>}
    </div>
  );
};

export default MyComponent;