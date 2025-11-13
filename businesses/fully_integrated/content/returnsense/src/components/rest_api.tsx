import React, { FC, useEffect, useState } from 'react';

interface Props {
  apiUrl: string;
  fallbackMessage?: string;
  loadingMessage?: string;
  altText?: string; // Added alt text for accessibility
}

const MyComponent: FC<Props> = ({ apiUrl, fallbackMessage = 'Loading...', loadingMessage = 'Please wait...', altText = '' }) => {
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

  // Added a sanity check for the data and a fallback image for accessibility
  if (!data.trim()) {
    return <div>{fallbackMessage}</div>;
  }

  // Use a safe-html library to sanitize the data before rendering
  // I'm using DOMPurify for this example: https://github.com/cure53/DOMPurify
  const sanitizedData = DOMPurify.sanitize(data);

  return (
    <>
      {/* Added an image for accessibility */}
      <img src="" alt={altText} style={{ display: 'none' }} />
      <div dangerouslySetInnerHTML={{ __html: sanitizedData }} />
    </>
  );
};

export default MyComponent;

import React, { FC, useEffect, useState } from 'react';

interface Props {
  apiUrl: string;
  fallbackMessage?: string;
  loadingMessage?: string;
  altText?: string; // Added alt text for accessibility
}

const MyComponent: FC<Props> = ({ apiUrl, fallbackMessage = 'Loading...', loadingMessage = 'Please wait...', altText = '' }) => {
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

  // Added a sanity check for the data and a fallback image for accessibility
  if (!data.trim()) {
    return <div>{fallbackMessage}</div>;
  }

  // Use a safe-html library to sanitize the data before rendering
  // I'm using DOMPurify for this example: https://github.com/cure53/DOMPurify
  const sanitizedData = DOMPurify.sanitize(data);

  return (
    <>
      {/* Added an image for accessibility */}
      <img src="" alt={altText} style={{ display: 'none' }} />
      <div dangerouslySetInnerHTML={{ __html: sanitizedData }} />
    </>
  );
};

export default MyComponent;