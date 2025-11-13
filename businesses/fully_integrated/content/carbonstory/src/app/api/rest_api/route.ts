import React, { FC, ReactNode, useState } from 'react';

interface Props {
  message?: string;
}

const FunctionalComponent: FC<Props> = ({ message }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState<ReactNode>(null);

  React.useEffect(() => {
    if (message) {
      setSanitizedMessage(
        <span dangerouslySetInnerHTML={{ __html: sanitizeInput(message) }} />
      );
    }
  }, [message]);

  return <div>{sanitizedMessage || ''}</div>;
};

// Sanitize the input to prevent XSS attacks
const sanitizeInput = (input: string) => {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

// Add input validation for message prop
FunctionalComponent.defaultProps = {
  message: '',
};

FunctionalComponent.propTypes = {
  message: require('prop-types').string,
};

// Use named export for better readability and maintainability
export const CarbonStoryAPIComponent = FunctionalComponent;

// Add error handling for API calls
import axios from 'axios';

const API_URL = 'https://api.example.com/messages';

const APIComponent: FC<Props> = ({ message }) => {
  const [apiMessage, setApiMessage] = useState<string>('');

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(API_URL);
        setApiMessage(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (!message) {
      fetchData();
    }
  }, [message]);

  return (
    <>
      {message ? (
        <div>{message}</div>
      ) : (
        <div dangerouslySetInnerHTML={{ __html: sanitizeInput(apiMessage) }} />
      )}
    </>
  );
};

// Use named export for better readability and maintainability
export const CarbonStoryAPIIntelligenceComponent = APIComponent;

import React, { FC, ReactNode, useState } from 'react';

interface Props {
  message?: string;
}

const FunctionalComponent: FC<Props> = ({ message }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState<ReactNode>(null);

  React.useEffect(() => {
    if (message) {
      setSanitizedMessage(
        <span dangerouslySetInnerHTML={{ __html: sanitizeInput(message) }} />
      );
    }
  }, [message]);

  return <div>{sanitizedMessage || ''}</div>;
};

// Sanitize the input to prevent XSS attacks
const sanitizeInput = (input: string) => {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

// Add input validation for message prop
FunctionalComponent.defaultProps = {
  message: '',
};

FunctionalComponent.propTypes = {
  message: require('prop-types').string,
};

// Use named export for better readability and maintainability
export const CarbonStoryAPIComponent = FunctionalComponent;

// Add error handling for API calls
import axios from 'axios';

const API_URL = 'https://api.example.com/messages';

const APIComponent: FC<Props> = ({ message }) => {
  const [apiMessage, setApiMessage] = useState<string>('');

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(API_URL);
        setApiMessage(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (!message) {
      fetchData();
    }
  }, [message]);

  return (
    <>
      {message ? (
        <div>{message}</div>
      ) : (
        <div dangerouslySetInnerHTML={{ __html: sanitizeInput(apiMessage) }} />
      )}
    </>
  );
};

// Use named export for better readability and maintainability
export const CarbonStoryAPIIntelligenceComponent = APIComponent;