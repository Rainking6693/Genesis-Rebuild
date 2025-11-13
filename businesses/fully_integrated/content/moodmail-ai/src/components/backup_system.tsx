import React, { useState, useEffect, useCallback, useRef } from 'react';

interface BackupSystemProps {
  contentSource: () => Promise<string>; // Function to fetch content
  backupInterval: number; // Interval in milliseconds
  backupStorageKey: string; // Key for localStorage
  onBackupSuccess?: (timestamp: number) => void; // Callback for successful backup
  onBackupFailure?: (error: Error) => void; // Callback for backup failure
  onRestoreSuccess?: (timestamp: number) => void; // Callback for successful restore
  onRestoreFailure?: (error: Error) => void; // Callback for restore failure
  uiComponent?: React.FC<{ content: string; lastBackupTime: number | null; error: Error | null }>;
}

interface BackupData {
  content: string;
  timestamp: number;
}

const DefaultUIComponent: React.FC<{ content: string; lastBackupTime: number | null; error: Error | null }> = ({
  content,
  lastBackupTime,
  error,
}) => {
  return (
    <div>
      {error ? (
        <div>
          <p>Error: {error.message}</p>
          <button onClick={() => restoreFromBackup()}>Attempt Restore</button>
        </div>
      ) : (
        <>
          <p>Content: {content}</p>
          {lastBackupTime && <p>Last Backup: {new Date(lastBackupTime).toLocaleString()}</p>}
          {!lastBackupTime && <p>No backup available.</p>}
        </>
      )}
    </div>
  );
};

const BackupSystem: React.FC<BackupSystemProps> = ({
  contentSource,
  backupInterval,
  backupStorageKey,
  onBackupSuccess,
  onBackupFailure,
  onRestoreSuccess,
  onRestoreFailure,
  uiComponent = DefaultUIComponent,
}) => {
  const [content, setContent] = useState<string>('');
  const [lastBackupTime, setLastBackupTime] = useState<number | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const intervalIdRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const performBackup = useCallback(async () => {
    try {
      const currentContent = await contentSource();
      const timestamp = Date.now();
      const backupData: BackupData = { content: currentContent, timestamp };
      localStorage.setItem(backupStorageKey, JSON.stringify(backupData));
      setContent(currentContent);
      setLastBackupTime(timestamp);
      onBackupSuccess?.(timestamp);
      setError(null); // Clear any previous errors
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      console.error('Backup failed:', error);
      onBackupFailure?.(error);
      setError(error);
    }
  }, [contentSource, backupStorageKey, onBackupSuccess, onBackupFailure]);

  const restoreFromBackup = useCallback(() => {
    try {
      const storedData = localStorage.getItem(backupStorageKey);
      if (storedData) {
        const backupData: BackupData = JSON.parse(storedData);
        setContent(backupData.content);
        setLastBackupTime(backupData.timestamp);
        onRestoreSuccess?.(backupData.timestamp);
        setError(null); // Clear any previous errors
      } else {
        // No backup found, handle this case gracefully.
        setContent('');
        setLastBackupTime(null);
        const noBackupError = new Error('No backup found in localStorage.');
        onRestoreFailure?.(noBackupError);
        setError(noBackupError);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      console.error('Restore failed:', error);
      onRestoreFailure?.(error);
      setError(error);
    }
  }, [backupStorageKey, onRestoreSuccess, onRestoreFailure]);

  useEffect(() => {
    restoreFromBackup(); // Attempt to restore on component mount

    intervalIdRef.current = setInterval(() => {
      performBackup();
    }, backupInterval);

    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current); // Cleanup on unmount
      }
    };
  }, [backupInterval, performBackup, restoreFromBackup]);

  const UI = uiComponent;

  return <UI content={content} lastBackupTime={lastBackupTime} error={error} />;
};

export default BackupSystem;

import React, { useState, useEffect, useCallback, useRef } from 'react';

interface BackupSystemProps {
  contentSource: () => Promise<string>; // Function to fetch content
  backupInterval: number; // Interval in milliseconds
  backupStorageKey: string; // Key for localStorage
  onBackupSuccess?: (timestamp: number) => void; // Callback for successful backup
  onBackupFailure?: (error: Error) => void; // Callback for backup failure
  onRestoreSuccess?: (timestamp: number) => void; // Callback for successful restore
  onRestoreFailure?: (error: Error) => void; // Callback for restore failure
  uiComponent?: React.FC<{ content: string; lastBackupTime: number | null; error: Error | null }>;
}

interface BackupData {
  content: string;
  timestamp: number;
}

const DefaultUIComponent: React.FC<{ content: string; lastBackupTime: number | null; error: Error | null }> = ({
  content,
  lastBackupTime,
  error,
}) => {
  return (
    <div>
      {error ? (
        <div>
          <p>Error: {error.message}</p>
          <button onClick={() => restoreFromBackup()}>Attempt Restore</button>
        </div>
      ) : (
        <>
          <p>Content: {content}</p>
          {lastBackupTime && <p>Last Backup: {new Date(lastBackupTime).toLocaleString()}</p>}
          {!lastBackupTime && <p>No backup available.</p>}
        </>
      )}
    </div>
  );
};

const BackupSystem: React.FC<BackupSystemProps> = ({
  contentSource,
  backupInterval,
  backupStorageKey,
  onBackupSuccess,
  onBackupFailure,
  onRestoreSuccess,
  onRestoreFailure,
  uiComponent = DefaultUIComponent,
}) => {
  const [content, setContent] = useState<string>('');
  const [lastBackupTime, setLastBackupTime] = useState<number | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const intervalIdRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const performBackup = useCallback(async () => {
    try {
      const currentContent = await contentSource();
      const timestamp = Date.now();
      const backupData: BackupData = { content: currentContent, timestamp };
      localStorage.setItem(backupStorageKey, JSON.stringify(backupData));
      setContent(currentContent);
      setLastBackupTime(timestamp);
      onBackupSuccess?.(timestamp);
      setError(null); // Clear any previous errors
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      console.error('Backup failed:', error);
      onBackupFailure?.(error);
      setError(error);
    }
  }, [contentSource, backupStorageKey, onBackupSuccess, onBackupFailure]);

  const restoreFromBackup = useCallback(() => {
    try {
      const storedData = localStorage.getItem(backupStorageKey);
      if (storedData) {
        const backupData: BackupData = JSON.parse(storedData);
        setContent(backupData.content);
        setLastBackupTime(backupData.timestamp);
        onRestoreSuccess?.(backupData.timestamp);
        setError(null); // Clear any previous errors
      } else {
        // No backup found, handle this case gracefully.
        setContent('');
        setLastBackupTime(null);
        const noBackupError = new Error('No backup found in localStorage.');
        onRestoreFailure?.(noBackupError);
        setError(noBackupError);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      console.error('Restore failed:', error);
      onRestoreFailure?.(error);
      setError(error);
    }
  }, [backupStorageKey, onRestoreSuccess, onRestoreFailure]);

  useEffect(() => {
    restoreFromBackup(); // Attempt to restore on component mount

    intervalIdRef.current = setInterval(() => {
      performBackup();
    }, backupInterval);

    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current); // Cleanup on unmount
      }
    };
  }, [backupInterval, performBackup, restoreFromBackup]);

  const UI = uiComponent;

  return <UI content={content} lastBackupTime={lastBackupTime} error={error} />;
};

export default BackupSystem;