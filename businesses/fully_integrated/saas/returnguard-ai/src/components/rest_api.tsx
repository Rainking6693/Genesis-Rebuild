import React, { FC, useEffect, useState } from 'react';
import axios from 'axios';

interface Props {
  apiEndpoint: string;
  fallbackMessage?: string;
  accessibilityLabel?: string;
}

const MyComponent: FC<Props> = ({ apiEndpoint, fallbackMessage = 'Loading...', accessibilityLabel }) => {
  const [data, setData] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(apiEndpoint);
        setData(response.data);
      } catch (error) {
        setError(error);
      }
    };

    fetchData();
  }, [apiEndpoint]);

  if (error) {
    return <div role="alert">{error.message}</div>;
  }

  if (!data) {
    return <div aria-label={accessibilityLabel || 'Loading'} role="status">{fallbackMessage}</div>;
  }

  return <div>{data}</div>;
};

export default MyComponent;

import React, { FC, useEffect, useState } from 'react';
import axios from 'axios';

interface Props {
  apiEndpoint: string;
  fallbackMessage?: string;
  accessibilityLabel?: string;
}

const MyComponent: FC<Props> = ({ apiEndpoint, fallbackMessage = 'Loading...', accessibilityLabel }) => {
  const [data, setData] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(apiEndpoint);
        setData(response.data);
      } catch (error) {
        setError(error);
      }
    };

    fetchData();
  }, [apiEndpoint]);

  if (error) {
    return <div role="alert">{error.message}</div>;
  }

  if (!data) {
    return <div aria-label={accessibilityLabel || 'Loading'} role="status">{fallbackMessage}</div>;
  }

  return <div>{data}</div>;
};

export default MyComponent;