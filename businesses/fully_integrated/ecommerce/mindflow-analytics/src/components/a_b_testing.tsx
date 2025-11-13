import React, { useState, useEffect, useCallback } from 'react';

interface MyComponentProps {
  title: string;
  content: string;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, content }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<MyComponentProps | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch('/api/my-component', {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
      }

      const data: MyComponentProps = await response.json();
      setData(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    fetchData({ signal: abortController.signal });
    return () => abortController.abort();
  }, [fetchData]);

  if (isLoading) {
    return (
      <div role="status" aria-live="polite" className="loading-spinner">
        <span className="visually-hidden">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div role="alert" className="error-message">
        <p>Error fetching data: {error.message}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div role="alert" className="no-data-message">
        <p>No data available.</p>
      </div>
    );
  }

  return (
    <div className="my-component">
      <h1 className="title">{data.title}</h1>
      <p className="content">{data.content}</p>
    </div>
  );
};

export default MyComponent;

import React, { useState, useEffect, useCallback } from 'react';

interface MyComponentProps {
  title: string;
  content: string;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, content }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<MyComponentProps | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch('/api/my-component', {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
      }

      const data: MyComponentProps = await response.json();
      setData(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    fetchData({ signal: abortController.signal });
    return () => abortController.abort();
  }, [fetchData]);

  if (isLoading) {
    return (
      <div role="status" aria-live="polite" className="loading-spinner">
        <span className="visually-hidden">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div role="alert" className="error-message">
        <p>Error fetching data: {error.message}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div role="alert" className="no-data-message">
        <p>No data available.</p>
      </div>
    );
  }

  return (
    <div className="my-component">
      <h1 className="title">{data.title}</h1>
      <p className="content">{data.content}</p>
    </div>
  );
};

export default MyComponent;