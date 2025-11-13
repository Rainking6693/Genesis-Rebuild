import React, { useState, useEffect, useCallback } from 'react';

interface BackupSystemProps {
  title: string;
  description: string;
  onBackup: () => Promise<void>;
  onRestore: () => Promise<void>;
  onError?: (error: Error) => void;
  backupButtonLabel?: string;
  restoreButtonLabel?: string;
  backupInProgressLabel?: string;
  restoreInProgressLabel?: string;
  errorDisplayTimeout?: number; // milliseconds before error message disappears
}

const BackupSystem: React.FC<BackupSystemProps> = ({
  title,
  description,
  onBackup,
  onRestore,
  onError = () => {},
  backupButtonLabel = 'Backup',
  restoreButtonLabel = 'Restore',
  backupInProgressLabel = 'Backing up...',
  restoreInProgressLabel = 'Restoring...',
  errorDisplayTimeout = 5000,
}) => {
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [errorVisible, setErrorVisible] = useState(false);

  // useCallback to memoize the handlers and prevent unnecessary re-renders
  const handleBackup = useCallback(async () => {
    try {
      setIsBackingUp(true);
      setError(null); // Clear any previous errors
      await onBackup();
      setIsBackingUp(false);
    } catch (err) {
      setIsBackingUp(false);
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      setErrorVisible(true);
    }
  }, [onBackup]);

  const handleRestore = useCallback(async () => {
    try {
      setIsRestoring(true);
      setError(null); // Clear any previous errors
      await onRestore();
      setIsRestoring(false);
    } catch (err) {
      setIsRestoring(false);
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      setErrorVisible(true);
    }
  }, [onRestore]);

  // useEffect to handle error display and timeout
  useEffect(() => {
    if (error) {
      onError(error);
      setErrorVisible(true);

      const timer = setTimeout(() => {
        setErrorVisible(false);
      }, errorDisplayTimeout);

      return () => clearTimeout(timer); // Cleanup the timer on unmount or error change
    }
  }, [error, onError, errorDisplayTimeout]);

  // useEffect to handle error visibility changes
  useEffect(() => {
    if (!errorVisible) {
      // Reset error state when error is no longer visible
      // This prevents the error message from flashing back up briefly
      // if the component re-renders for other reasons.
      setError(null);
    }
  }, [errorVisible]);

  return (
    <div>
      <h2>{title}</h2>
      <p>{description}</p>
      <div>
        <button
          onClick={handleBackup}
          disabled={isBackingUp || isRestoring}
          aria-label={backupButtonLabel}
          title={backupButtonLabel}
        >
          {isBackingUp ? backupInProgressLabel : backupButtonLabel}
        </button>
        <button
          onClick={handleRestore}
          disabled={isBackingUp || isRestoring}
          aria-label={restoreButtonLabel}
          title={restoreButtonLabel}
        >
          {isRestoring ? restoreInProgressLabel : restoreButtonLabel}
        </button>
      </div>

      {errorVisible && error && (
        <div
          role="alert"
          aria-live="assertive"
          style={{
            backgroundColor: '#f8d7da',
            color: '#721c24',
            padding: '10px',
            marginTop: '10px',
            border: '1px solid #f5c6cb',
            borderRadius: '4px',
          }}
        >
          <p>Error: {error.message}</p>
        </div>
      )}
    </div>
  );
};

export default BackupSystem;

import React, { useState, useEffect, useCallback } from 'react';

interface BackupSystemProps {
  title: string;
  description: string;
  onBackup: () => Promise<void>;
  onRestore: () => Promise<void>;
  onError?: (error: Error) => void;
  backupButtonLabel?: string;
  restoreButtonLabel?: string;
  backupInProgressLabel?: string;
  restoreInProgressLabel?: string;
  errorDisplayTimeout?: number; // milliseconds before error message disappears
}

const BackupSystem: React.FC<BackupSystemProps> = ({
  title,
  description,
  onBackup,
  onRestore,
  onError = () => {},
  backupButtonLabel = 'Backup',
  restoreButtonLabel = 'Restore',
  backupInProgressLabel = 'Backing up...',
  restoreInProgressLabel = 'Restoring...',
  errorDisplayTimeout = 5000,
}) => {
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [errorVisible, setErrorVisible] = useState(false);

  // useCallback to memoize the handlers and prevent unnecessary re-renders
  const handleBackup = useCallback(async () => {
    try {
      setIsBackingUp(true);
      setError(null); // Clear any previous errors
      await onBackup();
      setIsBackingUp(false);
    } catch (err) {
      setIsBackingUp(false);
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      setErrorVisible(true);
    }
  }, [onBackup]);

  const handleRestore = useCallback(async () => {
    try {
      setIsRestoring(true);
      setError(null); // Clear any previous errors
      await onRestore();
      setIsRestoring(false);
    } catch (err) {
      setIsRestoring(false);
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      setErrorVisible(true);
    }
  }, [onRestore]);

  // useEffect to handle error display and timeout
  useEffect(() => {
    if (error) {
      onError(error);
      setErrorVisible(true);

      const timer = setTimeout(() => {
        setErrorVisible(false);
      }, errorDisplayTimeout);

      return () => clearTimeout(timer); // Cleanup the timer on unmount or error change
    }
  }, [error, onError, errorDisplayTimeout]);

  // useEffect to handle error visibility changes
  useEffect(() => {
    if (!errorVisible) {
      // Reset error state when error is no longer visible
      // This prevents the error message from flashing back up briefly
      // if the component re-renders for other reasons.
      setError(null);
    }
  }, [errorVisible]);

  return (
    <div>
      <h2>{title}</h2>
      <p>{description}</p>
      <div>
        <button
          onClick={handleBackup}
          disabled={isBackingUp || isRestoring}
          aria-label={backupButtonLabel}
          title={backupButtonLabel}
        >
          {isBackingUp ? backupInProgressLabel : backupButtonLabel}
        </button>
        <button
          onClick={handleRestore}
          disabled={isBackingUp || isRestoring}
          aria-label={restoreButtonLabel}
          title={restoreButtonLabel}
        >
          {isRestoring ? restoreInProgressLabel : restoreButtonLabel}
        </button>
      </div>

      {errorVisible && error && (
        <div
          role="alert"
          aria-live="assertive"
          style={{
            backgroundColor: '#f8d7da',
            color: '#721c24',
            padding: '10px',
            marginTop: '10px',
            border: '1px solid #f5c6cb',
            borderRadius: '4px',
          }}
        >
          <p>Error: {error.message}</p>
        </div>
      )}
    </div>
  );
};

export default BackupSystem;