import React, { FC, useEffect, useState } from 'react';

interface Props {
  apiUrl: string;
  fallbackMessage?: string;
  loadingMessage?: string;
}

const MyComponent: FC<Props> = ({ apiUrl, fallbackMessage = 'Loading...', loadingMessage = 'Fetching data...' }) => {
  const [data, setData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.text();
        setData(data);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [apiUrl]);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (isLoading) {
    return <div>{loadingMessage}</div>;
  }

  if (!data) {
    return <div>{fallbackMessage}</div>;
  }

  return <div dangerouslySetInnerHTML={{ __html: data }} />;
};

export default MyComponent;

import React, { FC, useEffect, useState } from 'react';

interface Props {
  apiUrl: string;
  fallbackMessage?: string;
  loadingMessage?: string;
}

const MyComponent: FC<Props> = ({ apiUrl, fallbackMessage = 'Loading...', loadingMessage = 'Fetching data...' }) => {
  const [data, setData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.text();
        setData(data);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [apiUrl]);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (isLoading) {
    return <div>{loadingMessage}</div>;
  }

  if (!data) {
    return <div>{fallbackMessage}</div>;
  }

  return <div dangerouslySetInnerHTML={{ __html: data }} />;
};

export default MyComponent;