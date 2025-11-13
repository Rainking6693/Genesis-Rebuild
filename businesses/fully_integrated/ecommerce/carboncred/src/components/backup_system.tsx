import React, { FC, useEffect, useState } from 'react';

interface Props {
  message: string;
  isBackupEnabled?: boolean;
}

const MyComponent: FC<Props> = ({ message, isBackupEnabled = true }) => {
  const [backupMessage, setBackupMessage] = useState('');

  useEffect(() => {
    // Check if localStorage is available before saving the message
    if (typeof localStorage !== 'undefined' && isBackupEnabled) {
      localStorage.setItem('backupMessage', message);
      setBackupMessage(message);
    }
  }, [message, isBackupEnabled]);

  // Sanitize the message to prevent XSS attacks
  const sanitizedMessage = { __html: message.replace(/<[^>]*>?/gm, '') };

  // Use a more accessible approach to render the message
  const renderedMessage = <div dangerouslySetInnerHTML={sanitizedMessage} />;

  // Add a fallback for the sanitized message in case it fails to render
  const fallbackMessage = <div>{message}</div>;

  return (
    <div>
      {/* Render the message */}
      {React.createElement(
        typeof renderedMessage === 'object' ? renderedMessage : fallbackMessage,
      )}

      {/* Display a notification if backup is enabled */}
      {isBackupEnabled && (
        <p>
          Your message is being backed up. If there's an issue with the primary
          display, you can view the backup below:
        </p>
      )}

      {/* Display the backup message if it exists */}
      {isBackupEnabled && backupMessage && (
        <pre>{backupMessage}</pre>
      )}
    </div>
  );
};

export default MyComponent;

import React, { FC, useEffect, useState } from 'react';

interface Props {
  message: string;
  isBackupEnabled?: boolean;
}

const MyComponent: FC<Props> = ({ message, isBackupEnabled = true }) => {
  const [backupMessage, setBackupMessage] = useState('');

  useEffect(() => {
    // Check if localStorage is available before saving the message
    if (typeof localStorage !== 'undefined' && isBackupEnabled) {
      localStorage.setItem('backupMessage', message);
      setBackupMessage(message);
    }
  }, [message, isBackupEnabled]);

  // Sanitize the message to prevent XSS attacks
  const sanitizedMessage = { __html: message.replace(/<[^>]*>?/gm, '') };

  // Use a more accessible approach to render the message
  const renderedMessage = <div dangerouslySetInnerHTML={sanitizedMessage} />;

  // Add a fallback for the sanitized message in case it fails to render
  const fallbackMessage = <div>{message}</div>;

  return (
    <div>
      {/* Render the message */}
      {React.createElement(
        typeof renderedMessage === 'object' ? renderedMessage : fallbackMessage,
      )}

      {/* Display a notification if backup is enabled */}
      {isBackupEnabled && (
        <p>
          Your message is being backed up. If there's an issue with the primary
          display, you can view the backup below:
        </p>
      )}

      {/* Display the backup message if it exists */}
      {isBackupEnabled && backupMessage && (
        <pre>{backupMessage}</pre>
      )}
    </div>
  );
};

export default MyComponent;