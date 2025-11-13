import React, { FC, useEffect, useState } from 'react';
import DOMParser from 'xmldom';

interface Props {
  message: string;
}

interface ErrorDetails {
  message: string;
  info?: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const [error, setError] = useState<ErrorDetails | null>(null);

  useEffect(() => {
    let parsedMessage: DOMParser.Document | null = null;

    try {
      parsedMessage = new DOMParser().parseFromString(message, 'text/html');
      if (!parsedMessage?.body?.textContent) {
        throw new Error('Invalid backup message');
      }
    } catch (error) {
      setError({ message: 'Error parsing message', info: error.message });
    }
  }, [message]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Tab') {
      event.preventDefault();
    }
  };

  return (
    <div>
      {error ? (
        <div role="alert" aria-live="assertive">
          {error.message}
          {error.info && ` (${error.info})`}
        </div>
      ) : (
        <div
          onKeyDown={handleKeyDown}
          dangerouslySetInnerHTML={{ __html: message }}
          aria-label={message}
        />
      )}
    </div>
  );
};

MyComponent.error = (error: ErrorDetails) => {
  console.error(`Error in MyComponent: ${error.message}${error.info ? ` (${error.info})` : ''}`);
};

const BackupSystem = () => {
  const [backupMessage, setBackupMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchBackupMessage = async () => {
      try {
        const response = await fetch('https://your-backup-service-url.com/backup-message');
        if (!response.ok) {
          throw new Error('Failed to fetch backup message');
        }
        setBackupMessage(await response.text());
      } catch (error) {
        console.error(`Error fetching backup message: ${error.message}`);
      }
    };

    fetchBackupMessage();
  }, []);

  if (!backupMessage) {
    return <div>Loading backup message...</div>;
  }

  return <MyComponent message={backupMessage} />;
};

export default BackupSystem;

import React, { FC, useEffect, useState } from 'react';
import DOMParser from 'xmldom';

interface Props {
  message: string;
}

interface ErrorDetails {
  message: string;
  info?: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const [error, setError] = useState<ErrorDetails | null>(null);

  useEffect(() => {
    let parsedMessage: DOMParser.Document | null = null;

    try {
      parsedMessage = new DOMParser().parseFromString(message, 'text/html');
      if (!parsedMessage?.body?.textContent) {
        throw new Error('Invalid backup message');
      }
    } catch (error) {
      setError({ message: 'Error parsing message', info: error.message });
    }
  }, [message]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Tab') {
      event.preventDefault();
    }
  };

  return (
    <div>
      {error ? (
        <div role="alert" aria-live="assertive">
          {error.message}
          {error.info && ` (${error.info})`}
        </div>
      ) : (
        <div
          onKeyDown={handleKeyDown}
          dangerouslySetInnerHTML={{ __html: message }}
          aria-label={message}
        />
      )}
    </div>
  );
};

MyComponent.error = (error: ErrorDetails) => {
  console.error(`Error in MyComponent: ${error.message}${error.info ? ` (${error.info})` : ''}`);
};

const BackupSystem = () => {
  const [backupMessage, setBackupMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchBackupMessage = async () => {
      try {
        const response = await fetch('https://your-backup-service-url.com/backup-message');
        if (!response.ok) {
          throw new Error('Failed to fetch backup message');
        }
        setBackupMessage(await response.text());
      } catch (error) {
        console.error(`Error fetching backup message: ${error.message}`);
      }
    };

    fetchBackupMessage();
  }, []);

  if (!backupMessage) {
    return <div>Loading backup message...</div>;
  }

  return <MyComponent message={backupMessage} />;
};

export default BackupSystem;