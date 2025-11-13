import React, { useState, useEffect, useCallback } from 'react';

interface ReportingEngineProps {
  title: string;
  content: string;
  fetchData: () => Promise<string>;
  retryDelay?: number;
  maxRetries?: number;
}

const ReportingEngine: React.FC<ReportingEngineProps> = ({
  title,
  content,
  fetchData,
  retryDelay = 5000,
  maxRetries = 3,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);

  const fetchAndHandleData = useCallback(async () => {
    try {
      const data = await fetchData();
      setIsLoading(false);
      setError(null);
    } catch (err) {
      setError('Error fetching data');
      setIsLoading(false);

      if (retryCount < maxRetries) {
        setRetryCount(retryCount + 1);
        setTimeout(fetchAndHandleData, retryDelay);
      }
    }
  }, [fetchData, retryCount, maxRetries, retryDelay]);

  useEffect(() => {
    fetchAndHandleData();
  }, [fetchAndHandleData]);

  if (isLoading) {
    return (
      <div className="reporting-engine">
        <h1 className="reporting-engine__title">Loading...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="reporting-engine">
        <h1 className="reporting-engine__title">Error</h1>
        <p className="reporting-engine__content">{error}</p>
        <p className="reporting-engine__content">
          Retrying in {retryDelay / 1000} seconds...
        </p>
      </div>
    );
  }

  return (
    <div className="reporting-engine" aria-live="polite">
      <h1 className="reporting-engine__title" aria-label={title}>
        {title}
      </h1>
      <p className="reporting-engine__content" aria-label={content}>
        {content}
      </p>
    </div>
  );
};

export default ReportingEngine;

import React, { useState, useEffect, useCallback } from 'react';

interface ReportingEngineProps {
  title: string;
  content: string;
  fetchData: () => Promise<string>;
  retryDelay?: number;
  maxRetries?: number;
}

const ReportingEngine: React.FC<ReportingEngineProps> = ({
  title,
  content,
  fetchData,
  retryDelay = 5000,
  maxRetries = 3,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);

  const fetchAndHandleData = useCallback(async () => {
    try {
      const data = await fetchData();
      setIsLoading(false);
      setError(null);
    } catch (err) {
      setError('Error fetching data');
      setIsLoading(false);

      if (retryCount < maxRetries) {
        setRetryCount(retryCount + 1);
        setTimeout(fetchAndHandleData, retryDelay);
      }
    }
  }, [fetchData, retryCount, maxRetries, retryDelay]);

  useEffect(() => {
    fetchAndHandleData();
  }, [fetchAndHandleData]);

  if (isLoading) {
    return (
      <div className="reporting-engine">
        <h1 className="reporting-engine__title">Loading...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="reporting-engine">
        <h1 className="reporting-engine__title">Error</h1>
        <p className="reporting-engine__content">{error}</p>
        <p className="reporting-engine__content">
          Retrying in {retryDelay / 1000} seconds...
        </p>
      </div>
    );
  }

  return (
    <div className="reporting-engine" aria-live="polite">
      <h1 className="reporting-engine__title" aria-label={title}>
        {title}
      </h1>
      <p className="reporting-engine__content" aria-label={content}>
        {content}
      </p>
    </div>
  );
};

export default ReportingEngine;