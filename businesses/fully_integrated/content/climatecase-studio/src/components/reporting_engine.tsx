import React, { useState, useEffect, useCallback } from 'react';

interface ReportProps {
  title: string;
  content: string;
}

const Report: React.FC<ReportProps> = ({ title, content }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = useCallback(async () => {
    try {
      // Simulate fetching the report data
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsLoading(false);
      setError(null);
    } catch (err) {
      setError('Failed to fetch the report data.');
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const handleRetry = useCallback(() => {
    setIsLoading(true);
    fetchReport();
  }, [fetchReport]);

  if (isLoading) {
    return (
      <div className="report-container" aria-live="polite">
        <h1 className="report-title">Loading...</h1>
        <p className="report-content">Please wait while the report is being fetched.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="report-container" aria-live="polite">
        <h1 className="report-title">Error</h1>
        <p className="report-content">{error}</p>
        <button className="retry-button" onClick={handleRetry}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="report-container" aria-live="polite">
      <h1 className="report-title" aria-label={title}>
        {title}
      </h1>
      <p className="report-content" aria-label={content}>
        {content}
      </p>
    </div>
  );
};

export default Report;

import React, { useState, useEffect, useCallback } from 'react';

interface ReportProps {
  title: string;
  content: string;
}

const Report: React.FC<ReportProps> = ({ title, content }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = useCallback(async () => {
    try {
      // Simulate fetching the report data
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsLoading(false);
      setError(null);
    } catch (err) {
      setError('Failed to fetch the report data.');
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const handleRetry = useCallback(() => {
    setIsLoading(true);
    fetchReport();
  }, [fetchReport]);

  if (isLoading) {
    return (
      <div className="report-container" aria-live="polite">
        <h1 className="report-title">Loading...</h1>
        <p className="report-content">Please wait while the report is being fetched.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="report-container" aria-live="polite">
        <h1 className="report-title">Error</h1>
        <p className="report-content">{error}</p>
        <button className="retry-button" onClick={handleRetry}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="report-container" aria-live="polite">
      <h1 className="report-title" aria-label={title}>
        {title}
      </h1>
      <p className="report-content" aria-label={content}>
        {content}
      </p>
    </div>
  );
};

export default Report;