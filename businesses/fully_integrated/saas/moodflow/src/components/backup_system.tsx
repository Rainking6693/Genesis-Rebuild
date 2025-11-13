import React, { FC, useEffect, useState } from 'react';

interface Props {
  message: string;
  isBackupEnabled?: boolean;
  backupUrl?: string;
}

const MyComponent: FC<Props> = ({ message, isBackupEnabled = true, backupUrl }) => {
  const [backupMessage, setBackupMessage] = useState<string | null>(null);
  const [isFetchingBackup, setIsFetchingBackup] = useState(false);

  useEffect(() => {
    if (isBackupEnabled) {
      setIsFetchingBackup(true);
      fetchBackup();
    }
  }, [isBackupEnabled, backupUrl]);

  const fetchBackup = async () => {
    if (!backupUrl) return;

    try {
      const response = await fetch(backupUrl);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.text();
      setBackupMessage(data);
    } catch (error) {
      console.error('Error fetching backup:', error);
    } finally {
      setIsFetchingBackup(false);
    }
  };

  return (
    <div>
      <p>{message}</p>
      {backupMessage && (
        <p className="backup-message" aria-label="Backup message">
          (Backup: {backupMessage})
        </p>
      )}
      <button
        disabled={!isBackupEnabled || isFetchingBackup}
        aria-label="Fetch backup"
        onClick={fetchBackup}
      >
        {isFetchingBackup ? 'Fetching backup...' : 'Fetch Backup'}
      </button>
    </div>
  );
};

export default MyComponent;

In this updated version:

1. I added `isBackupEnabled` and `backupUrl` props to control whether the backup is fetched and where it is fetched from.
2. I used the `useEffect` hook to fetch the backup when the component mounts and whenever `isBackupEnabled` or `backupUrl` changes.
3. I added a state variable `backupMessage` to store the backup data.
4. I added a state variable `isFetchingBackup` to indicate whether the backup is currently being fetched.
5. I added a function `fetchBackup` to fetch the backup data from the provided URL, with error handling and a `finally` block to set `isFetchingBackup` to false after the fetch is complete.
6. I added a button to allow users to manually fetch the backup if needed, with ARIA attributes for accessibility.
7. I added a loading state to the button when fetching the backup.
8. I made the component more accessible by adding ARIA attributes to the button.
9. I made the component more maintainable by separating concerns and using TypeScript to ensure type safety.