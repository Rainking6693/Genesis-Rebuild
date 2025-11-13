import React, { useState, useEffect, useCallback, useRef } from 'react';

interface ContentData {
  title: string;
  content: string;
  [key: string]: any; // Allow for future expansion of content data
}

interface MyComponentProps {
  fetchContent: () => Promise<ContentData | null>;
  errorComponent?: React.ComponentType<{ error: Error; onRetry: () => void }>;
  loadingComponent?: React.ReactNode;
  retryDelayBase?: number; // Base delay for exponential backoff (ms)
  maxRetries?: number;
  contentId?: string | number; // Unique ID for content, used for caching/deduping
  onContentLoad?: (content: ContentData) => void; // Callback after successful content load
}

const DefaultErrorComponent: React.FC<{ error: Error; onRetry: () => void }> = ({ error, onRetry }) => (
  <div role="alert">
    <strong>Error:</strong> {error.message}
    <button onClick={onRetry}>Retry</button>
  </div>
);

const DefaultLoadingComponent: React.ReactNode = <div aria-label="Loading content">Loading content...</div>;

const MyComponent: React.FC<MyComponentProps> = ({
  fetchContent,
  errorComponent: ErrorComponent = DefaultErrorComponent,
  loadingComponent = DefaultLoadingComponent,
  retryDelayBase = 1000,
  maxRetries = 3,
  contentId,
  onContentLoad,
}) => {
  const [contentData, setContentData] = useState<ContentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const isMounted = useRef(true); // Track component mount status

  const loadContent = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchContent();
      if (data) {
        if (isMounted.current) {
          setContentData(data);
          onContentLoad?.(data); // Optional callback
        }
      } else {
        if (isMounted.current) {
          setError(new Error('No content received.'));
        }
      }
    } catch (e: any) {
      console.error('Error fetching content:', e); // Log the error for debugging
      if (isMounted.current) {
        setError(e instanceof Error ? e : new Error('Failed to load content.'));
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, [fetchContent, onContentLoad]);

  const retryContentLoad = useCallback(() => {
    setRetryCount((prevCount) => prevCount + 1);
    setError(null); // Clear the error before retrying
    loadContent();
  }, [loadContent]);

  useEffect(() => {
    loadContent();

    return () => {
      isMounted.current = false; // Set to false when component unmounts
    };
  }, [loadContent]);

  useEffect(() => {
    if (error && retryCount < maxRetries) {
      const retryDelay = Math.pow(2, retryCount) * retryDelayBase;
      const retryTimer = setTimeout(() => {
        console.log(`Retrying content load (attempt ${retryCount + 1}/${maxRetries})...`);
        retryContentLoad();
      }, retryDelay);

      return () => clearTimeout(retryTimer);
    }
  }, [error, retryCount, maxRetries, retryDelayBase, retryContentLoad]);

  // Memoize the error component props to prevent unnecessary re-renders
  const errorComponentProps = useCallback(
    () => ({
      error: error!,
      onRetry: retryContentLoad,
    }),
    [error, retryContentLoad]
  );

  if (isLoading) {
    return <div aria-busy="true">{loadingComponent}</div>;
  }

  if (error) {
    return <ErrorComponent {...errorComponentProps()} />;
  }

  if (!contentData) {
    return <div aria-label="No content available">No content available.</div>;
  }

  return (
    <div aria-live="polite">
      <h1 tabIndex={0}>{contentData.title}</h1>
      <p>{contentData.content}</p>
      {/* Render additional content fields dynamically */}
      {Object.entries(contentData).map(([key, value]) => {
        if (key !== 'title' && key !== 'content' && typeof value === 'string') {
          return (
            <div key={key}>
              <strong>{key}:</strong> {value}
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};

export default MyComponent;

import React, { useState, useEffect, useCallback, useRef } from 'react';

interface ContentData {
  title: string;
  content: string;
  [key: string]: any; // Allow for future expansion of content data
}

interface MyComponentProps {
  fetchContent: () => Promise<ContentData | null>;
  errorComponent?: React.ComponentType<{ error: Error; onRetry: () => void }>;
  loadingComponent?: React.ReactNode;
  retryDelayBase?: number; // Base delay for exponential backoff (ms)
  maxRetries?: number;
  contentId?: string | number; // Unique ID for content, used for caching/deduping
  onContentLoad?: (content: ContentData) => void; // Callback after successful content load
}

const DefaultErrorComponent: React.FC<{ error: Error; onRetry: () => void }> = ({ error, onRetry }) => (
  <div role="alert">
    <strong>Error:</strong> {error.message}
    <button onClick={onRetry}>Retry</button>
  </div>
);

const DefaultLoadingComponent: React.ReactNode = <div aria-label="Loading content">Loading content...</div>;

const MyComponent: React.FC<MyComponentProps> = ({
  fetchContent,
  errorComponent: ErrorComponent = DefaultErrorComponent,
  loadingComponent = DefaultLoadingComponent,
  retryDelayBase = 1000,
  maxRetries = 3,
  contentId,
  onContentLoad,
}) => {
  const [contentData, setContentData] = useState<ContentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const isMounted = useRef(true); // Track component mount status

  const loadContent = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchContent();
      if (data) {
        if (isMounted.current) {
          setContentData(data);
          onContentLoad?.(data); // Optional callback
        }
      } else {
        if (isMounted.current) {
          setError(new Error('No content received.'));
        }
      }
    } catch (e: any) {
      console.error('Error fetching content:', e); // Log the error for debugging
      if (isMounted.current) {
        setError(e instanceof Error ? e : new Error('Failed to load content.'));
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, [fetchContent, onContentLoad]);

  const retryContentLoad = useCallback(() => {
    setRetryCount((prevCount) => prevCount + 1);
    setError(null); // Clear the error before retrying
    loadContent();
  }, [loadContent]);

  useEffect(() => {
    loadContent();

    return () => {
      isMounted.current = false; // Set to false when component unmounts
    };
  }, [loadContent]);

  useEffect(() => {
    if (error && retryCount < maxRetries) {
      const retryDelay = Math.pow(2, retryCount) * retryDelayBase;
      const retryTimer = setTimeout(() => {
        console.log(`Retrying content load (attempt ${retryCount + 1}/${maxRetries})...`);
        retryContentLoad();
      }, retryDelay);

      return () => clearTimeout(retryTimer);
    }
  }, [error, retryCount, maxRetries, retryDelayBase, retryContentLoad]);

  // Memoize the error component props to prevent unnecessary re-renders
  const errorComponentProps = useCallback(
    () => ({
      error: error!,
      onRetry: retryContentLoad,
    }),
    [error, retryContentLoad]
  );

  if (isLoading) {
    return <div aria-busy="true">{loadingComponent}</div>;
  }

  if (error) {
    return <ErrorComponent {...errorComponentProps()} />;
  }

  if (!contentData) {
    return <div aria-label="No content available">No content available.</div>;
  }

  return (
    <div aria-live="polite">
      <h1 tabIndex={0}>{contentData.title}</h1>
      <p>{contentData.content}</p>
      {/* Render additional content fields dynamically */}
      {Object.entries(contentData).map(([key, value]) => {
        if (key !== 'title' && key !== 'content' && typeof value === 'string') {
          return (
            <div key={key}>
              <strong>{key}:</strong> {value}
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};

export default MyComponent;