import React, { FC, useEffect, useState } from 'react';
import { SlackApi, TeamsFederationClient } from '@mentioned_libraries';

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const [error, setError] = useState(false);
  const [slack, setSlack] = useState<SlackApi | null>(null);
  const [teams, setTeams] = useState<TeamsFederationClient | null>(null);

  useEffect(() => {
    if (!process.env.SLACK_TOKEN || !process.env.REDIRECT_URI || !process.env.SLACK_CHANNEL || !process.env.TEAMS_CHANNEL || !process.env.INTEGRATION) {
      setError(true);
      return;
    }

    const initializeSDKs = async () => {
      try {
        setSlack(new SlackApi({ token: process.env.SLACK_TOKEN }));
        setTeams(new TeamsFederationClient({ redirectUri: process.env.REDIRECT_URI }));
      } catch (error) {
        console.error('Error initializing SDKs:', error);
        setError(true);
      }
    };

    initializeSDKs();
  }, []);

  useEffect(() => {
    if (!slack || !teams || !message || error) {
      return;
    }

    const postToIntegration = async (api: any) => {
      try {
        const response = await api.postMessage({
          text: message,
          channel: api.INTEGRATION === 'slack' ? process.env.SLACK_CHANNEL : process.env.TEAMS_CHANNEL,
        });
        console.log(`${api.INTEGRATION} response:`, response);
      } catch (error) {
        console.error(`Error posting to ${api.INTEGRATION}:`, error);
      }
    };

    const integration = process.env.INTEGRATION === 'slack' ? slack : teams;
    if (integration) {
      postToIntegration(integration);
    }
  }, [slack, teams, message, error]);

  // Add accessibility by providing an aria-label for the message
  return (
    <div role="alert" aria-label="User authentication message">
      {error ? <div>An error occurred while posting the message.</div> : message}
    </div>
  );
};

MyComponent.defaultProps = {
  message: 'Please provide a message.',
};

export default MyComponent;

import React, { FC, useEffect, useState } from 'react';
import { SlackApi, TeamsFederationClient } from '@mentioned_libraries';

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const [error, setError] = useState(false);
  const [slack, setSlack] = useState<SlackApi | null>(null);
  const [teams, setTeams] = useState<TeamsFederationClient | null>(null);

  useEffect(() => {
    if (!process.env.SLACK_TOKEN || !process.env.REDIRECT_URI || !process.env.SLACK_CHANNEL || !process.env.TEAMS_CHANNEL || !process.env.INTEGRATION) {
      setError(true);
      return;
    }

    const initializeSDKs = async () => {
      try {
        setSlack(new SlackApi({ token: process.env.SLACK_TOKEN }));
        setTeams(new TeamsFederationClient({ redirectUri: process.env.REDIRECT_URI }));
      } catch (error) {
        console.error('Error initializing SDKs:', error);
        setError(true);
      }
    };

    initializeSDKs();
  }, []);

  useEffect(() => {
    if (!slack || !teams || !message || error) {
      return;
    }

    const postToIntegration = async (api: any) => {
      try {
        const response = await api.postMessage({
          text: message,
          channel: api.INTEGRATION === 'slack' ? process.env.SLACK_CHANNEL : process.env.TEAMS_CHANNEL,
        });
        console.log(`${api.INTEGRATION} response:`, response);
      } catch (error) {
        console.error(`Error posting to ${api.INTEGRATION}:`, error);
      }
    };

    const integration = process.env.INTEGRATION === 'slack' ? slack : teams;
    if (integration) {
      postToIntegration(integration);
    }
  }, [slack, teams, message, error]);

  // Add accessibility by providing an aria-label for the message
  return (
    <div role="alert" aria-label="User authentication message">
      {error ? <div>An error occurred while posting the message.</div> : message}
    </div>
  );
};

MyComponent.defaultProps = {
  message: 'Please provide a message.',
};

export default MyComponent;