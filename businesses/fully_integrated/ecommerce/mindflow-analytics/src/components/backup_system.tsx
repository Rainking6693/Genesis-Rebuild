import React, { useState, useEffect, useCallback } from 'react';

interface BackupSystemProps {
  title: string;
  content: string;
  backupInterval?: number; // Optional backup interval in milliseconds
  maxRetries?: number; // Maximum number of retries for backup
  retryDelay?: number; // Delay between retries in milliseconds
  onBackupSuccess?: () => void; // Callback function for successful backup
  onBackupError?: (error: Error) => void; // Callback function for backup error
}

const BackupSystem: React.FC<BackupSystemProps> = ({
  title,
  content,
  backupInterval = 60000, // Default backup interval is 1 minute
  maxRetries = 3, // Default maximum number of retries is 3
  retryDelay = 5000, // Default retry delay is 5 seconds
  onBackupSuccess,
  onBackupError,
}) => {
  const [isBackedUp, setIsBackedUp] = useState(false);
  const [backupError, setBackupError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const backupData = useCallback(async () => {
    try {
      await performBackup();
      setIsBackedUp(true);
      setBackupError(null);
      setRetryCount(0);
      onBackupSuccess?.();
    } catch (error) {
      console.error('Error backing up data:', error);
      setIsBackedUp(false);
      setBackupError(error as Error);
      onBackupError?.(error as Error);
      if (retryCount < maxRetries) {
        setRetryCount(retryCount + 1);
        setTimeout(backupData, retryDelay);
      }
    }
  }, [maxRetries, retryDelay, onBackupSuccess, onBackupError]);

  useEffect(() => {
    const backupInterval = setInterval(backupData, backupInterval);
    return () => clearInterval(backupInterval);
  }, [backupInterval, backupData]);

  const performBackup = async (): Promise<void> => {
    // Implement secure backup logic here
    // e.g., encrypt data, upload to secure storage, etc.
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulating backup process
  };

  return (
    <div>
      <h1>{title}</h1>
      <p>{content}</p>
      {isBackedUp ? (
        <p>Data has been backed up successfully.</p>
      ) : (
        <p>
          {backupError
            ? `Error backing up data: ${backupError.message}`
            : 'Backing up data, please wait...'}
        </p>
      )}
    </div>
  );
};

export default BackupSystem;

import React, { useState, useEffect, useCallback } from 'react';

interface BackupSystemProps {
  title: string;
  content: string;
  backupInterval?: number; // Optional backup interval in milliseconds
  maxRetries?: number; // Maximum number of retries for backup
  retryDelay?: number; // Delay between retries in milliseconds
  onBackupSuccess?: () => void; // Callback function for successful backup
  onBackupError?: (error: Error) => void; // Callback function for backup error
}

const BackupSystem: React.FC<BackupSystemProps> = ({
  title,
  content,
  backupInterval = 60000, // Default backup interval is 1 minute
  maxRetries = 3, // Default maximum number of retries is 3
  retryDelay = 5000, // Default retry delay is 5 seconds
  onBackupSuccess,
  onBackupError,
}) => {
  const [isBackedUp, setIsBackedUp] = useState(false);
  const [backupError, setBackupError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const backupData = useCallback(async () => {
    try {
      await performBackup();
      setIsBackedUp(true);
      setBackupError(null);
      setRetryCount(0);
      onBackupSuccess?.();
    } catch (error) {
      console.error('Error backing up data:', error);
      setIsBackedUp(false);
      setBackupError(error as Error);
      onBackupError?.(error as Error);
      if (retryCount < maxRetries) {
        setRetryCount(retryCount + 1);
        setTimeout(backupData, retryDelay);
      }
    }
  }, [maxRetries, retryDelay, onBackupSuccess, onBackupError]);

  useEffect(() => {
    const backupInterval = setInterval(backupData, backupInterval);
    return () => clearInterval(backupInterval);
  }, [backupInterval, backupData]);

  const performBackup = async (): Promise<void> => {
    // Implement secure backup logic here
    // e.g., encrypt data, upload to secure storage, etc.
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulating backup process
  };

  return (
    <div>
      <h1>{title}</h1>
      <p>{content}</p>
      {isBackedUp ? (
        <p>Data has been backed up successfully.</p>
      ) : (
        <p>
          {backupError
            ? `Error backing up data: ${backupError.message}`
            : 'Backing up data, please wait...'}
        </p>
      )}
    </div>
  );
};

export default BackupSystem;