import React, { FC, useEffect, useState } from 'react';

interface BackupSystemProps {
  // Message to be displayed in the component
  message: string;
  // Optional error message to be displayed if there's an error during the backup process
  errorMessage?: string;
  // Optional function to start the backup process
  startBackup?: () => Promise<void>;
  // Optional function to handle custom error messages
  onError?: (error: Error) => void;
}

const BackupSystem: FC<BackupSystemProps> = ({ message, errorMessage, startBackup, onError }) => {
  const [isBackingUp, setIsBackingUp] = useState(false);

  useEffect(() => {
    if (startBackup) {
      setIsBackingUp(true);
      startBackup()
        .then(() => setIsBackingUp(false))
        .catch((error) => {
          setIsBackingUp(false);
          if (onError) onError(error);
          // Show an error message to the user
          console.error(error);
        });
    }
  }, [startBackup, onError]);

  return (
    <div>
      {/* Display the message only if the backup process is not currently running */}
      {!isBackingUp && <p>{message}</p>}

      {/* Display an error message if there was an error during the backup process */}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {/* Provide a button to start the backup process */}
      <button disabled={isBackingUp} onClick={startBackup}>
        {isBackingUp ? 'Backing up...' : 'Start Backup'}
      </button>
    </div>
  );
};

export default BackupSystem;

import React, { FC, useEffect, useState } from 'react';

interface BackupSystemProps {
  // Message to be displayed in the component
  message: string;
  // Optional error message to be displayed if there's an error during the backup process
  errorMessage?: string;
  // Optional function to start the backup process
  startBackup?: () => Promise<void>;
  // Optional function to handle custom error messages
  onError?: (error: Error) => void;
}

const BackupSystem: FC<BackupSystemProps> = ({ message, errorMessage, startBackup, onError }) => {
  const [isBackingUp, setIsBackingUp] = useState(false);

  useEffect(() => {
    if (startBackup) {
      setIsBackingUp(true);
      startBackup()
        .then(() => setIsBackingUp(false))
        .catch((error) => {
          setIsBackingUp(false);
          if (onError) onError(error);
          // Show an error message to the user
          console.error(error);
        });
    }
  }, [startBackup, onError]);

  return (
    <div>
      {/* Display the message only if the backup process is not currently running */}
      {!isBackingUp && <p>{message}</p>}

      {/* Display an error message if there was an error during the backup process */}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {/* Provide a button to start the backup process */}
      <button disabled={isBackingUp} onClick={startBackup}>
        {isBackingUp ? 'Backing up...' : 'Start Backup'}
      </button>
    </div>
  );
};

export default BackupSystem;