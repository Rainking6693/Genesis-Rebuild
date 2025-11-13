import React, { useState, useEffect, useCallback, useRef } from 'react';

interface BackupSystemProps {
  /**
   * The unique identifier for the resource being backed up.  Crucial for restoration.
   */
  resourceId: string;
  /**
   * A function that returns a promise resolving to the data to be backed up.
   * Should handle potential errors gracefully.
   */
  fetchBackupData: () => Promise<any>;
  /**
   * A function that takes the backup data and persists it.
   * Should handle potential errors gracefully.
   */
  persistBackupData: (data: any) => Promise<void>;
  /**
   * A function to restore data from backup.
   */
  restoreBackupData: () => Promise<any>;
  /**
   * Interval (in milliseconds) at which backups should be attempted.
   * Defaults to 24 hours.
   */
  backupInterval?: number;
  /**
   * Number of retries before giving up on a backup attempt.
   * Defaults to 3.
   */
  maxRetries?: number;
  /**
   * Component to render while a backup is in progress.  Can be null.
   */
  loadingIndicator?: React.ReactNode;
  /**
   * Component to render if the backup fails. Can be null.
   */
  errorIndicator?: React.ReactNode;
  /**
   * Callback function to execute after a successful backup.
   */
  onBackupSuccess?: () => void;
  /**
   * Callback function to execute after a failed backup.
   */
  onBackupFailure?: (error: Error) => void;
  /**
   * Callback function to execute after a successful restore.
   */
  onRestoreSuccess?: (restoredData: any) => void;
  /**
   * Callback function to execute after a failed restore.
   */
  onRestoreFailure?: (error: Error) => void;
  /**
   * Optional prefix for localStorage keys.  Useful for namespacing.
   */
  localStorageKeyPrefix?: string;
}

const BackupSystem: React.FC<BackupSystemProps> = ({
  resourceId,
  fetchBackupData,
  persistBackupData,
  restoreBackupData,
  backupInterval = 24 * 60 * 60 * 1000, // Default: 24 hours
  maxRetries = 3,
  loadingIndicator = null,
  errorIndicator = null,
  onBackupSuccess,
  onBackupFailure,
  onRestoreSuccess,
  onRestoreFailure,
  localStorageKeyPrefix = 'backup',
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastBackupTime, setLastBackupTime] = useState<number | null>(() => {
    const storedTime = localStorage.getItem(`${localStorageKeyPrefix}-${resourceId}-lastBackupTime`);
    return storedTime ? parseInt(storedTime, 10) : null;
  });

  const backupKey = `${localStorageKeyPrefix}-${resourceId}-backupData`;
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const performBackup = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const data = await fetchBackupData();
        await persistBackupData(data);
        localStorage.setItem(backupKey, JSON.stringify(data)); // Store in localStorage as well
        const now = Date.now();
        localStorage.setItem(`${localStorageKeyPrefix}-${resourceId}-lastBackupTime`, now.toString());
        setLastBackupTime(now);
        onBackupSuccess?.();
        setIsLoading(false);
        return; // Exit the loop on success
      } catch (err: any) {
        console.error(`Backup failed (attempt ${attempt + 1}/${maxRetries + 1}):`, err);
        if (attempt === maxRetries) {
          setError(err instanceof Error ? err : new Error(String(err)));
          onBackupFailure?.(err instanceof Error ? err : new Error(String(err)));
          setIsLoading(false);
          return;
        }
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, (attempt + 1) * 1000));
      }
    }
  }, [fetchBackupData, persistBackupData, maxRetries, resourceId, onBackupSuccess, onBackupFailure, localStorageKeyPrefix, backupKey]);

  const performRestore = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const restoredData = await restoreBackupData();
      onRestoreSuccess?.(restoredData);
      setIsLoading(false);
    } catch (err: any) {
      console.error('Restore failed:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      onRestoreFailure?.(err instanceof Error ? err : new Error(String(err)));
      setIsLoading(false);
    }
  }, [restoreBackupData, onRestoreSuccess, onRestoreFailure]);

  // Initial restore from localStorage on component mount
  useEffect(() => {
    const storedBackup = localStorage.getItem(backupKey);
    if (storedBackup) {
      try {
        const parsedData = JSON.parse(storedBackup);
        onRestoreSuccess?.(parsedData); // Consider this a successful restore from localStorage
      } catch (error) {
        console.error("Error parsing backup data from localStorage:", error);
        localStorage.removeItem(backupKey); // Remove corrupted data
      }
    }
  }, [backupKey, onRestoreSuccess]);

  useEffect(() => {
    if (lastBackupTime === null || Date.now() - lastBackupTime > backupInterval) {
      performBackup();
    }

    intervalRef.current = setInterval(() => {
      if (Date.now() - (lastBackupTime || 0) > backupInterval) {
        performBackup();
      }
    }, backupInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }; // Cleanup on unmount
  }, [backupInterval, lastBackupTime, performBackup]);

  const handleManualBackup = () => {
    performBackup();
  };

  const handleManualRestore = () => {
    performRestore();
  };

  return (
    <div>
      {isLoading && loadingIndicator}
      {error && errorIndicator}

      {/* Optional: Display last backup time */}
      {lastBackupTime && (
        <p>Last backup: {new Date(lastBackupTime).toLocaleString()}</p>
      )}

      {/* Buttons for manual backup and restore */}
      <button onClick={handleManualBackup} disabled={isLoading}>
        Backup Now
      </button>
      <button onClick={handleManualRestore} disabled={isLoading}>
        Restore
      </button>
    </div>
  );
};

export default BackupSystem;

import React, { useState, useEffect, useCallback, useRef } from 'react';

interface BackupSystemProps {
  /**
   * The unique identifier for the resource being backed up.  Crucial for restoration.
   */
  resourceId: string;
  /**
   * A function that returns a promise resolving to the data to be backed up.
   * Should handle potential errors gracefully.
   */
  fetchBackupData: () => Promise<any>;
  /**
   * A function that takes the backup data and persists it.
   * Should handle potential errors gracefully.
   */
  persistBackupData: (data: any) => Promise<void>;
  /**
   * A function to restore data from backup.
   */
  restoreBackupData: () => Promise<any>;
  /**
   * Interval (in milliseconds) at which backups should be attempted.
   * Defaults to 24 hours.
   */
  backupInterval?: number;
  /**
   * Number of retries before giving up on a backup attempt.
   * Defaults to 3.
   */
  maxRetries?: number;
  /**
   * Component to render while a backup is in progress.  Can be null.
   */
  loadingIndicator?: React.ReactNode;
  /**
   * Component to render if the backup fails. Can be null.
   */
  errorIndicator?: React.ReactNode;
  /**
   * Callback function to execute after a successful backup.
   */
  onBackupSuccess?: () => void;
  /**
   * Callback function to execute after a failed backup.
   */
  onBackupFailure?: (error: Error) => void;
  /**
   * Callback function to execute after a successful restore.
   */
  onRestoreSuccess?: (restoredData: any) => void;
  /**
   * Callback function to execute after a failed restore.
   */
  onRestoreFailure?: (error: Error) => void;
  /**
   * Optional prefix for localStorage keys.  Useful for namespacing.
   */
  localStorageKeyPrefix?: string;
}

const BackupSystem: React.FC<BackupSystemProps> = ({
  resourceId,
  fetchBackupData,
  persistBackupData,
  restoreBackupData,
  backupInterval = 24 * 60 * 60 * 1000, // Default: 24 hours
  maxRetries = 3,
  loadingIndicator = null,
  errorIndicator = null,
  onBackupSuccess,
  onBackupFailure,
  onRestoreSuccess,
  onRestoreFailure,
  localStorageKeyPrefix = 'backup',
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastBackupTime, setLastBackupTime] = useState<number | null>(() => {
    const storedTime = localStorage.getItem(`${localStorageKeyPrefix}-${resourceId}-lastBackupTime`);
    return storedTime ? parseInt(storedTime, 10) : null;
  });

  const backupKey = `${localStorageKeyPrefix}-${resourceId}-backupData`;
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const performBackup = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const data = await fetchBackupData();
        await persistBackupData(data);
        localStorage.setItem(backupKey, JSON.stringify(data)); // Store in localStorage as well
        const now = Date.now();
        localStorage.setItem(`${localStorageKeyPrefix}-${resourceId}-lastBackupTime`, now.toString());
        setLastBackupTime(now);
        onBackupSuccess?.();
        setIsLoading(false);
        return; // Exit the loop on success
      } catch (err: any) {
        console.error(`Backup failed (attempt ${attempt + 1}/${maxRetries + 1}):`, err);
        if (attempt === maxRetries) {
          setError(err instanceof Error ? err : new Error(String(err)));
          onBackupFailure?.(err instanceof Error ? err : new Error(String(err)));
          setIsLoading(false);
          return;
        }
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, (attempt + 1) * 1000));
      }
    }
  }, [fetchBackupData, persistBackupData, maxRetries, resourceId, onBackupSuccess, onBackupFailure, localStorageKeyPrefix, backupKey]);

  const performRestore = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const restoredData = await restoreBackupData();
      onRestoreSuccess?.(restoredData);
      setIsLoading(false);
    } catch (err: any) {
      console.error('Restore failed:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      onRestoreFailure?.(err instanceof Error ? err : new Error(String(err)));
      setIsLoading(false);
    }
  }, [restoreBackupData, onRestoreSuccess, onRestoreFailure]);

  // Initial restore from localStorage on component mount
  useEffect(() => {
    const storedBackup = localStorage.getItem(backupKey);
    if (storedBackup) {
      try {
        const parsedData = JSON.parse(storedBackup);
        onRestoreSuccess?.(parsedData); // Consider this a successful restore from localStorage
      } catch (error) {
        console.error("Error parsing backup data from localStorage:", error);
        localStorage.removeItem(backupKey); // Remove corrupted data
      }
    }
  }, [backupKey, onRestoreSuccess]);

  useEffect(() => {
    if (lastBackupTime === null || Date.now() - lastBackupTime > backupInterval) {
      performBackup();
    }

    intervalRef.current = setInterval(() => {
      if (Date.now() - (lastBackupTime || 0) > backupInterval) {
        performBackup();
      }
    }, backupInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }; // Cleanup on unmount
  }, [backupInterval, lastBackupTime, performBackup]);

  const handleManualBackup = () => {
    performBackup();
  };

  const handleManualRestore = () => {
    performRestore();
  };

  return (
    <div>
      {isLoading && loadingIndicator}
      {error && errorIndicator}

      {/* Optional: Display last backup time */}
      {lastBackupTime && (
        <p>Last backup: {new Date(lastBackupTime).toLocaleString()}</p>
      )}

      {/* Buttons for manual backup and restore */}
      <button onClick={handleManualBackup} disabled={isLoading}>
        Backup Now
      </button>
      <button onClick={handleManualRestore} disabled={isLoading}>
        Restore
      </button>
    </div>
  );
};

export default BackupSystem;