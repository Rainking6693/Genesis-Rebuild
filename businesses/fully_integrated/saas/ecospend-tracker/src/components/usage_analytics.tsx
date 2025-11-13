import React, { FC, useState, useEffect, useCallback } from 'react';
import { memo } from 'react';
import sanitizeHtml from 'sanitize-html';
import { AxiosError } from 'axios';

interface Props {
  message: string;
}

interface FetchDataError {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<FetchDataError | null>(null);

  const sanitizeSanitizedMessage = useCallback(
    (message: string) => {
      return sanitizeHtml(message, {
        allowedTags: ['div'],
        allowedAttributes: {},
      });
    },
    []
  );

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch('/api/usage-analytics');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const json = await response.json();
      setData(json);
    } catch (error) {
      if (error instanceof AxiosError) {
        setError({ message: error.message });
      } else {
        console.error(error);
        setError({ message: 'An unexpected error occurred.' });
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return <div className="usage-analytics-message" aria-busy="true">Loading...</div>;
  }

  if (error) {
    return (
      <div className="usage-analytics-message" aria-errormessage="error-message">
        {error.message}
        <br />
        <a href="#" onClick={() => window.location.reload()}>
          Refresh the page and try again
        </a>
      </div>
    );
  }

  return (
    <div className="usage-analytics-message">
      {sanitizeSanitizedMessage(message)}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
};

export default memo(MyComponent);

import React, { FC, useState, useEffect, useCallback } from 'react';
import { memo } from 'react';
import sanitizeHtml from 'sanitize-html';
import { AxiosError } from 'axios';

interface Props {
  message: string;
}

interface FetchDataError {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<FetchDataError | null>(null);

  const sanitizeSanitizedMessage = useCallback(
    (message: string) => {
      return sanitizeHtml(message, {
        allowedTags: ['div'],
        allowedAttributes: {},
      });
    },
    []
  );

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch('/api/usage-analytics');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const json = await response.json();
      setData(json);
    } catch (error) {
      if (error instanceof AxiosError) {
        setError({ message: error.message });
      } else {
        console.error(error);
        setError({ message: 'An unexpected error occurred.' });
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return <div className="usage-analytics-message" aria-busy="true">Loading...</div>;
  }

  if (error) {
    return (
      <div className="usage-analytics-message" aria-errormessage="error-message">
        {error.message}
        <br />
        <a href="#" onClick={() => window.location.reload()}>
          Refresh the page and try again
        </a>
      </div>
    );
  }

  return (
    <div className="usage-analytics-message">
      {sanitizeSanitizedMessage(message)}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
};

export default memo(MyComponent);