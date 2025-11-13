import React, { FC, useState, useEffect } from 'react';
import { isFetchFailed, isResponseOk } from './http-utils';
import fetch from 'isomorphic-unfetch';

interface Props {
  initialMessage: string;
}

const MyComponent: FC<Props> = ({ initialMessage }) => {
  const [backupMessage, setBackupMessage] = useState(initialMessage);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchBackupMessage = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/backup-message');
        if (isResponseOk(response)) {
          const data = await response.json();
          setBackupMessage(data.message);
        } else {
          setError(isFetchFailed(response));
        }
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBackupMessage();
  }, []);

  const handleRefreshClick = () => {
    fetchBackupMessage();
  };

  return (
    <div className="wellness-message">
      {error ? (
        <div>
          <p>An error occurred while fetching the backup message:</p>
          <pre>{error.message}</pre>
        </div>
      ) : (
        backupMessage
      )}
      <button onClick={handleRefreshClick} disabled={isLoading}>
        {isLoading ? 'Refreshing...' : 'Refresh'}
      </button>
    </div>
  );
};

export default MyComponent;

// http-utils.ts
export const isResponseOk = (response: Response) => response.ok;
export const isFetchFailed = (response: Response) => !isResponseOk(response) && response.status !== 0;

import React, { FC, useState, useEffect } from 'react';
import { isFetchFailed, isResponseOk } from './http-utils';
import fetch from 'isomorphic-unfetch';

interface Props {
  initialMessage: string;
}

const MyComponent: FC<Props> = ({ initialMessage }) => {
  const [backupMessage, setBackupMessage] = useState(initialMessage);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchBackupMessage = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/backup-message');
        if (isResponseOk(response)) {
          const data = await response.json();
          setBackupMessage(data.message);
        } else {
          setError(isFetchFailed(response));
        }
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBackupMessage();
  }, []);

  const handleRefreshClick = () => {
    fetchBackupMessage();
  };

  return (
    <div className="wellness-message">
      {error ? (
        <div>
          <p>An error occurred while fetching the backup message:</p>
          <pre>{error.message}</pre>
        </div>
      ) : (
        backupMessage
      )}
      <button onClick={handleRefreshClick} disabled={isLoading}>
        {isLoading ? 'Refreshing...' : 'Refresh'}
      </button>
    </div>
  );
};

export default MyComponent;

// http-utils.ts
export const isResponseOk = (response: Response) => response.ok;
export const isFetchFailed = (response: Response) => !isResponseOk(response) && response.status !== 0;