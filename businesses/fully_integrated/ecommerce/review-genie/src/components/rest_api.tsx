import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface ReviewMessageProps {
  review: string;
  ariaLabel?: string;
}

const ReviewMessage: React.FC<ReviewMessageProps> = ({ review, ariaLabel }) => {
  return <div className="review-message" aria-label={ariaLabel}>{review}</div>;
};

interface LoadingMessageProps {
  ariaLabel?: string;
}

const LoadingMessage: React.FC<LoadingMessageProps> = ({ ariaLabel }) => {
  return <div className="loading-message" aria-label={ariaLabel}>Loading message...</div>;
};

interface Props {
  apiEndpoint: string;
  messageId: string;
  onError?: (error: Error) => void;
}

const MyComponent: React.FC<Props> = ({ apiEndpoint, messageId, onError }) => {
  const [message, setMessage] = useState<string | null>(null);

  const messageAPI = MessageAPI(apiEndpoint);

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const data = await messageAPI.getMessage(messageId);
        setMessage(data.message);
      } catch (error) {
        if (onError) {
          onError(error);
        }
      }
    };

    if (messageId) {
      fetchMessage();
    }
  }, [apiEndpoint, messageId, onError]);

  if (!message) {
    return <LoadingMessage ariaLabel="Loading message" />;
  }

  return <ReviewMessage review={message} ariaLabel="Message content" />;
};

interface MessageAPIProps {
  apiBaseUrl: string;
}

const MessageAPI = (apiBaseUrl: string) => {
  const instance = axios.create({
    baseURL: apiBaseUrl,
  });

  const getMessage = async (messageId: string) => {
    try {
      const response = await instance.get(`/messages/${messageId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching message:', error);
      throw error;
    }
  };

  return { getMessage };
};

export default MyComponent;

import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface ReviewMessageProps {
  review: string;
  ariaLabel?: string;
}

const ReviewMessage: React.FC<ReviewMessageProps> = ({ review, ariaLabel }) => {
  return <div className="review-message" aria-label={ariaLabel}>{review}</div>;
};

interface LoadingMessageProps {
  ariaLabel?: string;
}

const LoadingMessage: React.FC<LoadingMessageProps> = ({ ariaLabel }) => {
  return <div className="loading-message" aria-label={ariaLabel}>Loading message...</div>;
};

interface Props {
  apiEndpoint: string;
  messageId: string;
  onError?: (error: Error) => void;
}

const MyComponent: React.FC<Props> = ({ apiEndpoint, messageId, onError }) => {
  const [message, setMessage] = useState<string | null>(null);

  const messageAPI = MessageAPI(apiEndpoint);

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const data = await messageAPI.getMessage(messageId);
        setMessage(data.message);
      } catch (error) {
        if (onError) {
          onError(error);
        }
      }
    };

    if (messageId) {
      fetchMessage();
    }
  }, [apiEndpoint, messageId, onError]);

  if (!message) {
    return <LoadingMessage ariaLabel="Loading message" />;
  }

  return <ReviewMessage review={message} ariaLabel="Message content" />;
};

interface MessageAPIProps {
  apiBaseUrl: string;
}

const MessageAPI = (apiBaseUrl: string) => {
  const instance = axios.create({
    baseURL: apiBaseUrl,
  });

  const getMessage = async (messageId: string) => {
    try {
      const response = await instance.get(`/messages/${messageId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching message:', error);
      throw error;
    }
  };

  return { getMessage };
};

export default MyComponent;