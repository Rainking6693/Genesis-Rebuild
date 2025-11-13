import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface RestApiComponentProps {
  apiUrl: string;
  fallbackMessage?: string;
}

interface AxiosError extends Error {
  response?: { data: any };
}

const RestApiComponent: React.FC<RestApiComponentProps> = ({ apiUrl, fallbackMessage }) => {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<AxiosError | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(apiUrl);
        setData(response.data);
      } catch (error) {
        if (error instanceof AxiosError) {
          setError(error);
        }
      }
    };

    fetchData();
  }, [apiUrl]);

  if (error) {
    return (
      <div role="alert" aria-label="API request error">
        Error: {error.message}
      </div>
    );
  }

  return (
    <div role="presentation" aria-label={fallbackMessage || 'API data'}>
      {data || fallbackMessage}
    </div>
  );
};

export default RestApiComponent;

import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface RestApiComponentProps {
  apiUrl: string;
  fallbackMessage?: string;
}

interface AxiosError extends Error {
  response?: { data: any };
}

const RestApiComponent: React.FC<RestApiComponentProps> = ({ apiUrl, fallbackMessage }) => {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<AxiosError | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(apiUrl);
        setData(response.data);
      } catch (error) {
        if (error instanceof AxiosError) {
          setError(error);
        }
      }
    };

    fetchData();
  }, [apiUrl]);

  if (error) {
    return (
      <div role="alert" aria-label="API request error">
        Error: {error.message}
      </div>
    );
  }

  return (
    <div role="presentation" aria-label={fallbackMessage || 'API data'}>
      {data || fallbackMessage}
    </div>
  );
};

export default RestApiComponent;