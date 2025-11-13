import React, { useState, useEffect } from 'react';

interface Props {
  apiUrl: string;
  errorMessage?: string;
  loadingMessage?: string;
  successMessage?: string;
  onData?: (data: string) => void;
  onError?: (error: Error) => void;
}

const MyComponent: React.FC<Props> = ({
  apiUrl,
  errorMessage = 'An error occurred.',
  loadingMessage = 'Loading...',
  successMessage,
  onData,
  onError,
}) => {
  const [data, setData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.text();
        if (onData) onData(data);
        setData(data);
      } catch (error) {
        if (onError) onError(error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [apiUrl, onData, onError]);

  if (error) {
    return <div>{errorMessage}</div>;
  }

  if (isLoading) {
    return <div>{loadingMessage}</div>;
  }

  if (data && successMessage) {
    return <div>{successMessage}</div>;
  }

  if (data) {
    return (
      <div>
        {/* Add aria-label for accessibility */}
        <div dangerouslySetInnerHTML={{ __html: data }} aria-label={`HTML content: ${data}`} />
      </div>
    );
  }

  return null;
};

export { MyComponent };

In this updated version, I added `onData` and `onError` props to handle custom callbacks for data and errors. This makes the component more flexible and easier to integrate with other parts of the application. I also added an `aria-label` to the `dangerouslySetInnerHTML` component for better accessibility.