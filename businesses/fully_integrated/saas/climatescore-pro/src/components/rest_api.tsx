import React, { useState, useEffect } from 'react';

interface Props {
  apiUrl: string;
  loadingMessage?: string;
  errorMessage?: string;
  successMessage?: string;
}

const MyComponent: React.FC<Props> = ({ apiUrl, loadingMessage, errorMessage, successMessage }) => {
  const [data, setData] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
      }
      setIsLoading(false);
    };

    fetchData();
  }, [apiUrl]);

  return (
    <div>
      {isLoading && <div>{loadingMessage || 'Loading...'}</div>}
      {error && <div role="alert">{error.message}</div>}
      {data && <div>{successMessage || data}</div>}
    </div>
  );
};

MyComponent.defaultProps = {
  loadingMessage: 'Loading...',
  errorMessage: 'An error occurred while fetching the data.',
  successMessage: 'Data fetched successfully.',
};

export default MyComponent;

This refactored component now accepts an `apiUrl` prop, which is used to fetch data from a REST API. It also includes default props for loading, error, and success messages. The component uses the `useState` hook for state management and the `useEffect` hook to fetch data when the component mounts. It also handles errors and sets the loading state accordingly. Additionally, I've added an accessibility role attribute to the error message div.