import { useState, useEffect, useRef } from 'react';
import axios, { AxiosError } from 'axios';

interface Props {
  apiEndpoint: string;
  onError?: (error: Error) => void;
}

const MyComponent: React.FC<Props> = ({ apiEndpoint, onError }) => {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const fetchData = async () => {
      try {
        const response = await axios.get(apiEndpoint);
        setMessage(response.data.message || null);
      } catch (error) {
        if (onError) {
          onError(error as Error);
        }
        setError(error as Error);
      }
    };

    fetchData();
  }, [apiEndpoint, onError]);

  return (
    <div role="alert" aria-live="assertive">
      {message && <p role="alert">{message}</p>}
      {error && <p role="alert">An error occurred: {error.message}</p>}
    </div>
  );
};

export default MyComponent;

import { useState, useEffect, useRef } from 'react';
import axios, { AxiosError } from 'axios';

interface Props {
  apiEndpoint: string;
  onError?: (error: Error) => void;
}

const MyComponent: React.FC<Props> = ({ apiEndpoint, onError }) => {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const fetchData = async () => {
      try {
        const response = await axios.get(apiEndpoint);
        setMessage(response.data.message || null);
      } catch (error) {
        if (onError) {
          onError(error as Error);
        }
        setError(error as Error);
      }
    };

    fetchData();
  }, [apiEndpoint, onError]);

  return (
    <div role="alert" aria-live="assertive">
      {message && <p role="alert">{message}</p>}
      {error && <p role="alert">An error occurred: {error.message}</p>}
    </div>
  );
};

export default MyComponent;