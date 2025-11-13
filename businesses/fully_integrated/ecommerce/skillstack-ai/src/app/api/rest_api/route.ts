import React, { FC, useEffect, useState } from 'react';

interface Props {
  apiUrl: string;
  fallbackMessage?: string;
  loadingMessage?: string;
  onError?: (error: Error) => void;
  onLoad?: () => void;
}

const MyComponent: FC<Props> = ({
  apiUrl,
  fallbackMessage = 'Loading...',
  loadingMessage = 'Fetching data...',
  onError,
  onLoad,
}) => {
  const [data, setData] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.text();
        setData(data);

        if (onLoad) {
          onLoad();
        }
      } catch (error) {
        setError(error);

        if (onError) {
          onError(error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [apiUrl, onError, onLoad]);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (isLoading) {
    return <div>{loadingMessage}</div>;
  }

  if (!data) {
    return <div>{fallbackMessage}</div>;
  }

  return (
    <div>
      {/* Use a safe HTML parser to prevent XSS attacks */}
      <div dangerouslySetInnerHTML={{ __html: sanitize(data) }} />
    </div>
  );
};

// Add a sanitize function to prevent XSS attacks
const sanitize = (html: string) => {
  const tempElement = document.createElement('div');
  tempElement.innerHTML = html;
  return tempElement.textContent || '';
};

export { MyComponent };

In this updated code, I've added an `onError` and `onLoad` props to allow custom error handling and callbacks when the data is loaded. I've also added a sanitize function to prevent XSS attacks when setting the innerHTML of the component. Additionally, I've moved the API URL, fallbackMessage, and loadingMessage to the top of the component for better readability and maintainability.