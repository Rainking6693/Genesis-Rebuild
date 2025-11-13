import React, { useState, useEffect, useCallback } from 'react';

interface EmailMarketingProps {
  title: string;
  content: string;
  fetchData?: () => Promise<{ title: string; content: string } | null>; // Optional prop for data fetching, allows mocking
  loadingIndicator?: React.ReactNode; // Customizable loading indicator
  errorDisplay?: (error: string) => React.ReactNode; // Customizable error display
}

const defaultLoadingIndicator = <div>Loading Email Marketing Content...</div>;

const defaultErrorDisplay = (error: string) => (
  <div role="alert" style={{ color: 'red', border: '1px solid red', padding: '10px' }}>
    <strong>Error:</strong> {error}
  </div>
);

const EmailMarketing: React.FC<EmailMarketingProps> = ({
  title: initialTitle,
  content: initialContent,
  fetchData,
  loadingIndicator = defaultLoadingIndicator,
  errorDisplay = defaultErrorDisplay,
}) => {
  const [title, setTitle] = useState<string>(initialTitle);
  const [content, setContent] = useState<string>(initialContent);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDataFromApi = useCallback(async () => {
    setIsLoading(true);
    setError(null); // Clear any previous errors

    try {
      if (fetchData) {
        const data = await fetchData();
        if (data) {
          setTitle(data.title);
          setContent(data.content);
        } else {
          setError('Failed to retrieve email marketing data.'); // More specific error
        }
      } else {
        // Simulate fetching data from an API with a default implementation
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setTitle('Default Email Title');
        setContent('This is the default email content.');
      }
      setIsLoading(false);
    } catch (err: any) {
      console.error('Error fetching email marketing data:', err); // Log the error for debugging
      setError(`Error fetching email marketing data: ${err.message || 'Unknown error'}`); // More informative error message
      setIsLoading(false);
    }
  }, [fetchData]);

  useEffect(() => {
    fetchDataFromApi();
  }, [fetchDataFromApi]);

  if (isLoading) {
    return loadingIndicator;
  }

  if (error) {
    return errorDisplay(error);
  }

  return (
    <div role="article">
      <h1 id="email-marketing-title" tabIndex={0}>
        {title}
      </h1>
      <p aria-labelledby="email-marketing-title">{content}</p>
    </div>
  );
};

export default EmailMarketing;

import React, { useState, useEffect, useCallback } from 'react';

interface EmailMarketingProps {
  title: string;
  content: string;
  fetchData?: () => Promise<{ title: string; content: string } | null>; // Optional prop for data fetching, allows mocking
  loadingIndicator?: React.ReactNode; // Customizable loading indicator
  errorDisplay?: (error: string) => React.ReactNode; // Customizable error display
}

const defaultLoadingIndicator = <div>Loading Email Marketing Content...</div>;

const defaultErrorDisplay = (error: string) => (
  <div role="alert" style={{ color: 'red', border: '1px solid red', padding: '10px' }}>
    <strong>Error:</strong> {error}
  </div>
);

const EmailMarketing: React.FC<EmailMarketingProps> = ({
  title: initialTitle,
  content: initialContent,
  fetchData,
  loadingIndicator = defaultLoadingIndicator,
  errorDisplay = defaultErrorDisplay,
}) => {
  const [title, setTitle] = useState<string>(initialTitle);
  const [content, setContent] = useState<string>(initialContent);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDataFromApi = useCallback(async () => {
    setIsLoading(true);
    setError(null); // Clear any previous errors

    try {
      if (fetchData) {
        const data = await fetchData();
        if (data) {
          setTitle(data.title);
          setContent(data.content);
        } else {
          setError('Failed to retrieve email marketing data.'); // More specific error
        }
      } else {
        // Simulate fetching data from an API with a default implementation
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setTitle('Default Email Title');
        setContent('This is the default email content.');
      }
      setIsLoading(false);
    } catch (err: any) {
      console.error('Error fetching email marketing data:', err); // Log the error for debugging
      setError(`Error fetching email marketing data: ${err.message || 'Unknown error'}`); // More informative error message
      setIsLoading(false);
    }
  }, [fetchData]);

  useEffect(() => {
    fetchDataFromApi();
  }, [fetchDataFromApi]);

  if (isLoading) {
    return loadingIndicator;
  }

  if (error) {
    return errorDisplay(error);
  }

  return (
    <div role="article">
      <h1 id="email-marketing-title" tabIndex={0}>
        {title}
      </h1>
      <p aria-labelledby="email-marketing-title">{content}</p>
    </div>
  );
};

export default EmailMarketing;