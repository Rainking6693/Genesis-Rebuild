import React, { FC, useEffect, useMemo, useState } from 'react';
import { logError } from './error-logging';

interface Props {
  message: string;
  onBackupSuccess?: () => void;
  onBackupError?: (error: Error) => void;
}

const MyComponent: FC<Props> = ({ message, onBackupSuccess, onBackupError }) => {
  const [backupInProgress, setBackupInProgress] = useState(false);
  const memoizedComponent = useMemo(() => {
    return (
      <div className="mindflow-message" aria-label="Backup message">
        {backupInProgress ? (
          <div>Backup in progress...</div>
        ) : (
          <div>{message}</div>
        )}
      </div>
    );
  }, [message, backupInProgress]);

  useEffect(() => {
    let backupTimer: NodeJS.Timeout;

    const backup = async () => {
      try {
        setBackupInProgress(true);
        // Your component logic here
        onBackupSuccess && onBackupSuccess();
      } catch (error) {
        onBackupError && onBackupError(error);
        logError(error);
      } finally {
        setBackupInProgress(false);
      }
    };

    if (message) {
      backupTimer = setTimeout(backup, 5000); // Attempt backup after 5 seconds
    }

    return () => clearTimeout(backupTimer);
  }, [message, onBackupSuccess, onBackupError]);

  return memoizedComponent;
};

export default MyComponent;

import React, { FC, useEffect, useMemo, useState } from 'react';
import { logError } from './error-logging';

interface Props {
  message: string;
  onBackupSuccess?: () => void;
  onBackupError?: (error: Error) => void;
}

const MyComponent: FC<Props> = ({ message, onBackupSuccess, onBackupError }) => {
  const [backupInProgress, setBackupInProgress] = useState(false);
  const memoizedComponent = useMemo(() => {
    return (
      <div className="mindflow-message" aria-label="Backup message">
        {backupInProgress ? (
          <div>Backup in progress...</div>
        ) : (
          <div>{message}</div>
        )}
      </div>
    );
  }, [message, backupInProgress]);

  useEffect(() => {
    let backupTimer: NodeJS.Timeout;

    const backup = async () => {
      try {
        setBackupInProgress(true);
        // Your component logic here
        onBackupSuccess && onBackupSuccess();
      } catch (error) {
        onBackupError && onBackupError(error);
        logError(error);
      } finally {
        setBackupInProgress(false);
      }
    };

    if (message) {
      backupTimer = setTimeout(backup, 5000); // Attempt backup after 5 seconds
    }

    return () => clearTimeout(backupTimer);
  }, [message, onBackupSuccess, onBackupError]);

  return memoizedComponent;
};

export default MyComponent;