import React, { useState, useEffect, useCallback, useRef } from 'react';

interface ContentData {
  title: string;
  content: string;
}

interface MyComponentProps {
  fetchContent: () => Promise<ContentData | null>; // Function to fetch content
  errorComponent?: React.ReactNode; // Optional error component
  loadingComponent?: React.ReactNode; // Optional loading component
  retryComponent?: React.ReactNode; // Optional retry component
  maxRetries?: number; // Maximum number of retries
  retryDelay?: number; // Delay between retries (in milliseconds)
}

const MyComponent: React.FC<MyComponentProps> = ({
  fetchContent,
  errorComponent = <div>Error loading content. Please try again later.</div>,
  loadingComponent = <div>Loading content...</div>,
  retryComponent = <button>Retry</button>,
  maxRetries = 3,
  retryDelay = 3000,
}) => {
  const [contentData, setContentData] = useState<ContentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadContent = useCallback(async () => {
    setIsLoading(true);
    setError(null); // Reset error state on each load attempt

    try {
      const data = await fetchContent();
      if (data) {
        setContentData(data);
      } else {
        // Handle the case where the API returns null or undefined
        setError(new Error("Content not found."));
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An unexpected error occurred."));
      console.error("Error fetching content:", err); // Log the error for debugging

      // Retry mechanism
      if (retryCount < maxRetries) {
        setRetryCount(retryCount + 1);
        retryTimerRef.current = setTimeout(loadContent, retryDelay);
      } else {
        setRetryCount(0);
      }
    } finally {
      setIsLoading(false);
    }
  }, [fetchContent, maxRetries, retryCount, retryDelay]);

  useEffect(() => {
    loadContent();

    return () => {
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
      }
    };
  }, [loadContent]);

  if (isLoading) {
    return (
      <div aria-busy="true" aria-live="polite">
        {loadingComponent}
      </div>
    );
  }

  if (error) {
    return (
      <div role="alert" aria-live="assertive">
        {errorComponent}
        {retryCount < maxRetries && (
          <div>
            {retryComponent}
            <span>Retrying in {Math.floor(retryDelay / 1000)} seconds...</span>
          </div>
        )}
      </div>
    );
  }

  if (!contentData) {
    return (
      <div role="alert" aria-live="assertive">
        {errorComponent}
        {retryCount < maxRetries && (
          <div>
            {retryComponent}
            <span>Retrying in {Math.floor(retryDelay / 1000)} seconds...</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div aria-live="polite">
      <h1 aria-level={1}>{contentData.title}</h1>
      <p>{contentData.content}</p>
    </div>
  );
};

export default MyComponent;

import React, { useState, useEffect, useCallback, useRef } from 'react';

interface ContentData {
  title: string;
  content: string;
}

interface MyComponentProps {
  fetchContent: () => Promise<ContentData | null>; // Function to fetch content
  errorComponent?: React.ReactNode; // Optional error component
  loadingComponent?: React.ReactNode; // Optional loading component
  retryComponent?: React.ReactNode; // Optional retry component
  maxRetries?: number; // Maximum number of retries
  retryDelay?: number; // Delay between retries (in milliseconds)
}

const MyComponent: React.FC<MyComponentProps> = ({
  fetchContent,
  errorComponent = <div>Error loading content. Please try again later.</div>,
  loadingComponent = <div>Loading content...</div>,
  retryComponent = <button>Retry</button>,
  maxRetries = 3,
  retryDelay = 3000,
}) => {
  const [contentData, setContentData] = useState<ContentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadContent = useCallback(async () => {
    setIsLoading(true);
    setError(null); // Reset error state on each load attempt

    try {
      const data = await fetchContent();
      if (data) {
        setContentData(data);
      } else {
        // Handle the case where the API returns null or undefined
        setError(new Error("Content not found."));
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An unexpected error occurred."));
      console.error("Error fetching content:", err); // Log the error for debugging

      // Retry mechanism
      if (retryCount < maxRetries) {
        setRetryCount(retryCount + 1);
        retryTimerRef.current = setTimeout(loadContent, retryDelay);
      } else {
        setRetryCount(0);
      }
    } finally {
      setIsLoading(false);
    }
  }, [fetchContent, maxRetries, retryCount, retryDelay]);

  useEffect(() => {
    loadContent();

    return () => {
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
      }
    };
  }, [loadContent]);

  if (isLoading) {
    return (
      <div aria-busy="true" aria-live="polite">
        {loadingComponent}
      </div>
    );
  }

  if (error) {
    return (
      <div role="alert" aria-live="assertive">
        {errorComponent}
        {retryCount < maxRetries && (
          <div>
            {retryComponent}
            <span>Retrying in {Math.floor(retryDelay / 1000)} seconds...</span>
          </div>
        )}
      </div>
    );
  }

  if (!contentData) {
    return (
      <div role="alert" aria-live="assertive">
        {errorComponent}
        {retryCount < maxRetries && (
          <div>
            {retryComponent}
            <span>Retrying in {Math.floor(retryDelay / 1000)} seconds...</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div aria-live="polite">
      <h1 aria-level={1}>{contentData.title}</h1>
      <p>{contentData.content}</p>
    </div>
  );
};

export default MyComponent;