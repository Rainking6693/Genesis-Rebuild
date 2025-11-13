import React, { useState, useEffect } from 'react';

interface Props {
  apiUrl: string;
  messageKey: string;
  fallbackMessage?: string;
  errorMessage?: string;
  isLoadingMessage?: string;
}

const MyComponent: React.FC<Props> = ({
  apiUrl,
  messageKey,
  fallbackMessage = 'Loading...',
  errorMessage = 'An error occurred while fetching the message.',
  isLoadingMessage = 'Please wait...',
}) => {
  const [message, setMessage] = useState(fallbackMessage);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        setMessage(data[messageKey] || errorMessage);
        setIsLoading(false);
      } catch (error) {
        setError(true);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [apiUrl, messageKey]);

  return (
    <div>
      {isLoading && <div>{isLoadingMessage}</div>}
      {error && <div>{errorMessage}</div>}
      {!isLoading && !error && <div>{message}</div>}
      {fallbackMessage !== message && (
        <div role="alert">{fallbackMessage}</div>
      )}
    </div>
  );
};

export default MyComponent;

import React, { useState, useEffect } from 'react';

interface Props {
  apiUrl: string;
  messageKey: string;
  fallbackMessage?: string;
  errorMessage?: string;
  isLoadingMessage?: string;
}

const MyComponent: React.FC<Props> = ({
  apiUrl,
  messageKey,
  fallbackMessage = 'Loading...',
  errorMessage = 'An error occurred while fetching the message.',
  isLoadingMessage = 'Please wait...',
}) => {
  const [message, setMessage] = useState(fallbackMessage);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        setMessage(data[messageKey] || errorMessage);
        setIsLoading(false);
      } catch (error) {
        setError(true);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [apiUrl, messageKey]);

  return (
    <div>
      {isLoading && <div>{isLoadingMessage}</div>}
      {error && <div>{errorMessage}</div>}
      {!isLoading && !error && <div>{message}</div>}
      {fallbackMessage !== message && (
        <div role="alert">{fallbackMessage}</div>
      )}
    </div>
  );
};

export default MyComponent;