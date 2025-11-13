import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { SlackClient } from 'slack-web-api-client';

interface Props {
  slackClient: SlackClient;
}

interface Intervention {
  // Add your intervention type here
}

const MyComponent: React.FC<Props> = ({ slackClient }) => {
  const [userEmotion, setUserEmotion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [intervention, setIntervention] = useState<Intervention | null>(null);

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  };

  const handleInputChange = useCallback(
    debounce((e) => {
      setUserEmotion(e.target.value);
      if (e.target.value.trim().length > 0) {
        handleClick();
      }
    }, 500),
    []
  );

  const handleClick = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/sentiment-analysis', { userMessage: userEmotion });
      const { intervention } = response.data;

      if (intervention) {
        slackClient.chat.postMessage({
          channel: process.env.SLACK_CHANNEL,
          text: `Based on your current emotional state, here's a recommended intervention: ${intervention}`,
        });
        setIntervention(intervention);
      }
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      setUserEmotion('');
    };
  }, []);

  return (
    <div>
      <input
        type="text"
        placeholder="Type your message here..."
        value={userEmotion}
        onChange={handleInputChange}
        aria-label="Enter your message"
        key={userEmotion}
      />
      <button onClick={handleClick} disabled={isLoading}>
        {isLoading ? <div className="loading-spinner" /> : 'Submit'}
      </button>
      {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
      {intervention && (
        <div>
          <h3>Recommended Intervention:</h3>
          <p>{intervention}</p>
        </div>
      )}
    </div>
  );
};

export default MyComponent;

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { SlackClient } from 'slack-web-api-client';

interface Props {
  slackClient: SlackClient;
}

interface Intervention {
  // Add your intervention type here
}

const MyComponent: React.FC<Props> = ({ slackClient }) => {
  const [userEmotion, setUserEmotion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [intervention, setIntervention] = useState<Intervention | null>(null);

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  };

  const handleInputChange = useCallback(
    debounce((e) => {
      setUserEmotion(e.target.value);
      if (e.target.value.trim().length > 0) {
        handleClick();
      }
    }, 500),
    []
  );

  const handleClick = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/sentiment-analysis', { userMessage: userEmotion });
      const { intervention } = response.data;

      if (intervention) {
        slackClient.chat.postMessage({
          channel: process.env.SLACK_CHANNEL,
          text: `Based on your current emotional state, here's a recommended intervention: ${intervention}`,
        });
        setIntervention(intervention);
      }
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      setUserEmotion('');
    };
  }, []);

  return (
    <div>
      <input
        type="text"
        placeholder="Type your message here..."
        value={userEmotion}
        onChange={handleInputChange}
        aria-label="Enter your message"
        key={userEmotion}
      />
      <button onClick={handleClick} disabled={isLoading}>
        {isLoading ? <div className="loading-spinner" /> : 'Submit'}
      </button>
      {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
      {intervention && (
        <div>
          <h3>Recommended Intervention:</h3>
          <p>{intervention}</p>
        </div>
      )}
    </div>
  );
};

export default MyComponent;