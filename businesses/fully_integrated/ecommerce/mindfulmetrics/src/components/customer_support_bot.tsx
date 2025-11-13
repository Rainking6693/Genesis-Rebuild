import React, { useState, useEffect, useCallback } from 'react';

interface MyComponentProps {
  title: string;
  content: string;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, content }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [localTitle, setLocalTitle] = useState(title);
  const [localContent, setLocalContent] = useState(content);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/data', {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();
      if (typeof data.title !== 'string' || typeof data.content !== 'string') {
        throw new Error('Invalid data format');
      }

      setLocalTitle(data.title);
      setLocalContent(data.content);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('An error occurred while fetching data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const fetchDataWithTimeout = async () => {
      try {
        await Promise.race([
          fetchData(),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Request timed out')), 10000)
          ),
        ]);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('An error occurred while fetching data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDataWithTimeout();

    return () => {
      controller.abort();
    };
  }, [fetchData]);

  return (
    <div>
      {isLoading ? (
        <div role="status" aria-live="polite">
          <span className="visually-hidden">Loading...</span>
          <div className="spinner"></div>
        </div>
      ) : error ? (
        <div role="alert" aria-live="assertive" className="error-message">
          {error}
        </div>
      ) : (
        <>
          <h1>{localTitle}</h1>
          <p>{localContent}</p>
        </>
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
  const [localTitle, setLocalTitle] = useState(title);
  const [localContent, setLocalContent] = useState(content);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/data', {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();
      if (typeof data.title !== 'string' || typeof data.content !== 'string') {
        throw new Error('Invalid data format');
      }

      setLocalTitle(data.title);
      setLocalContent(data.content);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('An error occurred while fetching data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const fetchDataWithTimeout = async () => {
      try {
        await Promise.race([
          fetchData(),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Request timed out')), 10000)
          ),
        ]);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('An error occurred while fetching data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDataWithTimeout();

    return () => {
      controller.abort();
    };
  }, [fetchData]);

  return (
    <div>
      {isLoading ? (
        <div role="status" aria-live="polite">
          <span className="visually-hidden">Loading...</span>
          <div className="spinner"></div>
        </div>
      ) : error ? (
        <div role="alert" aria-live="assertive" className="error-message">
          {error}
        </div>
      ) : (
        <>
          <h1>{localTitle}</h1>
          <p>{localContent}</p>
        </>
      )}
    </div>
  );
};

export default MyComponent;