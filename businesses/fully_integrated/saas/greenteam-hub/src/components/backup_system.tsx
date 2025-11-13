import React, { FC, useEffect, useState } from 'react';

interface Props {
  message: string;
  onBackupSuccess?: () => void;
  onBackupError?: (error: Error) => void;
  onBackupStart?: () => void;
  onBackupInterrupted?: () => void;
}

const MyComponent: FC<Props> = ({ message, onBackupSuccess, onBackupError, onBackupStart, onBackupInterrupted }) => {
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backupTimer, setBackupTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isBackingUp && onBackupStart) {
      onBackupStart();
    }

    if (!isBackingUp) {
      setIsBackingUp(true);
      setBackupTimer(setTimeout(() => {
        if (onBackupSuccess) {
          onBackupSuccess();
        }
        setIsBackingUp(false);
        setBackupTimer(null);
      }, 5000)); // Simulate a 5 seconds backup process
    }

    return () => {
      if (backupTimer) {
        clearTimeout(backupTimer);
        if (isBackingUp && onBackupError) {
          onBackupError(new Error('Backup timed out'));
        }
        if (isBackingUp && onBackupInterrupted) {
          onBackupInterrupted();
        }
      }
    };
  }, [isBackingUp, onBackupSuccess, onBackupError, onBackupStart, onBackupInterrupted]);

  return (
    <div
      className="green-team-message"
      aria-busy={isBackingUp}
      aria-live="polite"
    >
      {isBackingUp ? 'Backing up data...' : message}
    </div>
  );
};

export default MyComponent;

In this updated version, I've added:

1. `onBackupStart` prop to notify when the backup process starts.
2. `onBackupInterrupted` prop to notify when the backup process is interrupted (e.g., due to component unmounting).
3. Separated the backup timer state to make it more explicit and easier to manage.
4. Checked if the backup timer exists before clearing it to avoid errors when the component unmounts.
5. Added a check for `isBackingUp` before calling `onBackupInterrupted` to ensure the backup process is actually interrupted.
6. Added a null check for `backupTimer` before clearing it to avoid TypeScript errors.