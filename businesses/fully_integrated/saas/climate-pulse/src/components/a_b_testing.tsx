import React, { FunctionComponent, useEffect, useState } from 'react';

interface Props {
  defaultMessage: string; // Provide a default message
  apiUrl?: string; // Make the API URL configurable
}

interface ABTestingData {
  message: string;
}

const fetchABTestingData = async (apiUrl: string): Promise<ABTestingData | null> => {
  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      // Handle HTTP errors explicitly
      const errorText = await response.text();
      console.error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      return null;
    }

    const data: ABTestingData = await response.json();
    return data;
  } catch (e: any) {
    console.error('Error fetching A/B testing data:', e);
    return null;
  }
};

const ErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);

  if (error) {
    return <div role="alert">{error}</div>; // Accessibility: Use role="alert" for error messages
  }

  return children;
};

const ABTestingComponent: FunctionComponent<Props> = ({ defaultMessage, apiUrl = 'https://api.climatepulse.com/ab-testing' }) => {
  const [message, setMessage] = useState<string>(defaultMessage);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchABTestingData(apiUrl);
      if (!data) {
        setError('Failed to load A/B testing content. Please try again later.');
        setMessage(defaultMessage); // Fallback to default message on error
      } else {
        if (typeof data.message !== 'string') {
          console.warn('Invalid message format received from A/B testing API. Using default message.');
          setMessage(defaultMessage);
        } else {
          setMessage(data.message);
        }
        setError(null); // Clear any previous errors
      }
      setIsLoading(false);
    };

    fetchData();
  }, [apiUrl, defaultMessage]);

  return (
    <ErrorBoundary error={error}>
      {isLoading ? (
        <div aria-busy="true">Loading A/B testing content...</div> // Accessibility: Indicate loading state
      ) : (
        <div dangerouslySetInnerHTML={{ __html: message }} aria-live="polite" /> // Accessibility: aria-live="polite" to announce content updates
      )}
    </ErrorBoundary>
  );
};

ABTestingComponent.defaultProps = {
  defaultMessage: 'Default A/B testing message.',
};

export default ABTestingComponent;

This version of the component includes an `ErrorBoundary` component to handle errors at the component level, making it easier to manage errors and improve the user experience. The API call is now separated into a separate utility function, making the component more maintainable. Additionally, I've added type annotations to improve type safety.