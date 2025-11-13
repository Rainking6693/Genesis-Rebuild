import React, { useState, useEffect, useCallback } from 'react';

interface MyComponentProps {
  title: string;
  content: string;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, content }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found in localStorage');
      }

      const response = await fetch('/api/data', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorMessage = `Network response was not ok (${response.status})`;
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setData(data.content);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;

    const fetchDataWithAbort = async () => {
      try {
        await fetchData({ signal });
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          console.log('Fetch request aborted');
        } else {
          throw error;
        }
      }
    };

    fetchDataWithAbort();

    return () => {
      abortController.abort();
    };
  }, [fetchData]);

  return (
    <div>
      <h1>{title}</h1>
      {isLoading ? (
        <div role="status" aria-live="polite">
          <span className="visually-hidden">Loading...</span>
          <div className="spinner"></div>
        </div>
      ) : error ? (
        <div role="alert" aria-live="assertive">
          <p>Error: {error}</p>
          <button onClick={fetchData}>Retry</button>
        </div>
      ) : (
        <p>{data || content}</p>
      )}
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
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found in localStorage');
      }

      const response = await fetch('/api/data', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorMessage = `Network response was not ok (${response.status})`;
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setData(data.content);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;

    const fetchDataWithAbort = async () => {
      try {
        await fetchData({ signal });
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          console.log('Fetch request aborted');
        } else {
          throw error;
        }
      }
    };

    fetchDataWithAbort();

    return () => {
      abortController.abort();
    };
  }, [fetchData]);

  return (
    <div>
      <h1>{title}</h1>
      {isLoading ? (
        <div role="status" aria-live="polite">
          <span className="visually-hidden">Loading...</span>
          <div className="spinner"></div>
        </div>
      ) : error ? (
        <div role="alert" aria-live="assertive">
          <p>Error: {error}</p>
          <button onClick={fetchData}>Retry</button>
        </div>
      ) : (
        <p>{data || content}</p>
      )}
    </div>
  );
};

export default MyComponent;