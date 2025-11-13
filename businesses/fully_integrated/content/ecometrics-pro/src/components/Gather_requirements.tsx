import React, { FC, useEffect, useState, useRef } from 'react';

interface Props {
  message: string;
}

interface APIResponse {
  message: string;
  // Add other properties as needed
}

const MyComponent: FC<Props> = ({ message }) => {
  const [htmlMessage, setHtmlMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const cache = new Map<string, APIResponse>();
  const cacheTime = 60 * 1000; // Cache duration (1 minute)

  const sanitizeMessage = (message: string): string => {
    // Implement your sanitization logic here
    return message;
  };

  const fetchAndCache = async (url: string): Promise<APIResponse> => {
    if (cache.has(url) && Date.now() - cache.get(url).timestamp < cacheTime) {
      return cache.get(url);
    }

    try {
      const response = await fetch(url);
      const data = await response.json();
      cache.set(url, { ...data, timestamp: Date.now() });
      return data;
    } catch (error) {
      console.error(`Error fetching data from ${url}:`, error);
      throw error;
    }
  };

  const handleApiResponse = async (apiUrl: string): Promise<void> => {
    try {
      const response = await fetchAndCache(apiUrl);
      setHtmlMessage(sanitizeMessage(response.message));
    } catch (error) {
      setErrorMessage(`Error: ${error.message}`);
    }
  };

  // Check if the message is an API URL
  useEffect(() => {
    if (message.startsWith('http')) {
      handleApiResponse(message);
    } else {
      setHtmlMessage(sanitizeMessage(message));
    }
  }, [message]);

  // Add accessibility features
  const myComponentId = 'my-component';
  const myComponentRef = useRef<HTMLDivElement>(null);

  return (
    <div id={myComponentId} ref={myComponentRef}>
      {htmlMessage && (
        <>
          <div dangerouslySetInnerHTML={{ __html: htmlMessage }} />
          {/* Add ARIA attributes for accessibility */}
          <div aria-labelledby={myComponentId} />
        </>
      )}
      {errorMessage && <div role="alert">{errorMessage}</div>}
    </div>
  );
};

export default MyComponent;

import React, { FC, useEffect, useState, useRef } from 'react';

interface Props {
  message: string;
}

interface APIResponse {
  message: string;
  // Add other properties as needed
}

const MyComponent: FC<Props> = ({ message }) => {
  const [htmlMessage, setHtmlMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const cache = new Map<string, APIResponse>();
  const cacheTime = 60 * 1000; // Cache duration (1 minute)

  const sanitizeMessage = (message: string): string => {
    // Implement your sanitization logic here
    return message;
  };

  const fetchAndCache = async (url: string): Promise<APIResponse> => {
    if (cache.has(url) && Date.now() - cache.get(url).timestamp < cacheTime) {
      return cache.get(url);
    }

    try {
      const response = await fetch(url);
      const data = await response.json();
      cache.set(url, { ...data, timestamp: Date.now() });
      return data;
    } catch (error) {
      console.error(`Error fetching data from ${url}:`, error);
      throw error;
    }
  };

  const handleApiResponse = async (apiUrl: string): Promise<void> => {
    try {
      const response = await fetchAndCache(apiUrl);
      setHtmlMessage(sanitizeMessage(response.message));
    } catch (error) {
      setErrorMessage(`Error: ${error.message}`);
    }
  };

  // Check if the message is an API URL
  useEffect(() => {
    if (message.startsWith('http')) {
      handleApiResponse(message);
    } else {
      setHtmlMessage(sanitizeMessage(message));
    }
  }, [message]);

  // Add accessibility features
  const myComponentId = 'my-component';
  const myComponentRef = useRef<HTMLDivElement>(null);

  return (
    <div id={myComponentId} ref={myComponentRef}>
      {htmlMessage && (
        <>
          <div dangerouslySetInnerHTML={{ __html: htmlMessage }} />
          {/* Add ARIA attributes for accessibility */}
          <div aria-labelledby={myComponentId} />
        </>
      )}
      {errorMessage && <div role="alert">{errorMessage}</div>}
    </div>
  );
};

export default MyComponent;