import React, { FC, useEffect, useState } from 'react';

interface Props {
  apiUrl: string;
  fallbackMessage?: string;
  loadingMessage?: string;
  errorMessage?: string;
  accessibilityLabel?: string;
}

const MyComponent: FC<Props> = ({
  apiUrl,
  fallbackMessage = 'Loading...',
  loadingMessage = 'Fetching data...',
  errorMessage = 'An error occurred while fetching data.',
  accessibilityLabel,
}) => {
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
        setIsLoading(false);
      } catch (error) {
        setError(error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [apiUrl]);

  if (error) {
    return (
      <div role="alert">
        <p>{errorMessage}</p>
        <details>
          <summary>Show details</summary>
          <pre>{error.message}</pre>
        </details>
      </div>
    );
  }

  if (isLoading) {
    return <div>{loadingMessage}</div>;
  }

  if (!data) {
    return <div>{fallbackMessage}</div>;
  }

  return (
    <div>
      <h1>{accessibilityLabel || 'Data'}</h1>
      <div
        dangerouslySetInnerHTML={{ __html: data }}
        aria-label={accessibilityLabel}
      />
    </div>
  );
};

export { MyComponent };

import React, { FC, useEffect, useState } from 'react';

interface Props {
  apiUrl: string;
  fallbackMessage?: string;
  loadingMessage?: string;
  errorMessage?: string;
  accessibilityLabel?: string;
}

const MyComponent: FC<Props> = ({
  apiUrl,
  fallbackMessage = 'Loading...',
  loadingMessage = 'Fetching data...',
  errorMessage = 'An error occurred while fetching data.',
  accessibilityLabel,
}) => {
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
        setIsLoading(false);
      } catch (error) {
        setError(error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [apiUrl]);

  if (error) {
    return (
      <div role="alert">
        <p>{errorMessage}</p>
        <details>
          <summary>Show details</summary>
          <pre>{error.message}</pre>
        </details>
      </div>
    );
  }

  if (isLoading) {
    return <div>{loadingMessage}</div>;
  }

  if (!data) {
    return <div>{fallbackMessage}</div>;
  }

  return (
    <div>
      <h1>{accessibilityLabel || 'Data'}</h1>
      <div
        dangerouslySetInnerHTML={{ __html: data }}
        aria-label={accessibilityLabel}
      />
    </div>
  );
};

export { MyComponent };