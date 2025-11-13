import React, { FC, useEffect, useState } from 'react';
import axios from 'axios';

interface Props {
  apiEndpoint: string;
  fallbackMessage?: string;
  loadingMessage?: string;
}

const MyComponent: FC<Props> = ({ apiEndpoint, fallbackMessage = 'Loading...', loadingMessage = 'Loading data...' }) => {
  const [data, setData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(apiEndpoint);
        setData(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [apiEndpoint]);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (isLoading) {
    return <div>{loadingMessage}</div>;
  }

  if (!data) {
    return <div>{fallbackMessage}</div>;
  }

  return <div>{data}</div>;
};

export default MyComponent;

import React, { FC, useEffect, useState } from 'react';
import axios from 'axios';

interface Props {
  apiEndpoint: string;
  fallbackMessage?: string;
  loadingMessage?: string;
}

const MyComponent: FC<Props> = ({ apiEndpoint, fallbackMessage = 'Loading...', loadingMessage = 'Loading data...' }) => {
  const [data, setData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(apiEndpoint);
        setData(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [apiEndpoint]);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (isLoading) {
    return <div>{loadingMessage}</div>;
  }

  if (!data) {
    return <div>{fallbackMessage}</div>;
  }

  return <div>{data}</div>;
};

export default MyComponent;