import React, { FC, useEffect, useState } from 'react';
import { sanitizeHtml } from './sanitizeHtml';

interface Props {
  message: string;
  isBackupEnabled?: boolean;
}

const MyComponent: FC<Props> = ({ message, isBackupEnabled = true }) => {
  const [backupMessage, setBackupMessage] = useState('');

  useEffect(() => {
    if (!isBackupEnabled) return;

    let backup: HTMLTextAreaElement | null = null;

    const createBackup = () => {
      backup = document.createElement('textarea');
      backup.value = sanitizeHtml(message);
      backup.style.display = 'none';
      backup.setAttribute('aria-hidden', 'true');
      document.body.appendChild(backup);
    };

    const removeBackup = () => {
      if (backup) {
        document.body.removeChild(backup);
        backup = null;
      }
    };

    // Check if a backup already exists and update it if necessary
    if (backup) {
      backup.value = sanitizeHtml(message);
    } else {
      createBackup();
    }

    return () => {
      removeBackup();
    };
  }, [message, isBackupEnabled]);

  const safeMessage = sanitizeHtml(message);

  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: safeMessage }} />
      {isBackupEnabled && (
        <textarea
          value={backupMessage}
          readOnly
          aria-label="Backup message"
        />
      )}
    </div>
  );
};

export default MyComponent;

// sanitizeHtml.ts
import { DOMPurify } from '@dompurify/dompurify';

export const sanitizeHtml = (unsafeHtml: string) => {
  return DOMPurify.sanitize(unsafeHtml);
};

import React, { FC, useEffect, useState } from 'react';
import { sanitizeHtml } from './sanitizeHtml';

interface Props {
  message: string;
  isBackupEnabled?: boolean;
}

const MyComponent: FC<Props> = ({ message, isBackupEnabled = true }) => {
  const [backupMessage, setBackupMessage] = useState('');

  useEffect(() => {
    if (!isBackupEnabled) return;

    let backup: HTMLTextAreaElement | null = null;

    const createBackup = () => {
      backup = document.createElement('textarea');
      backup.value = sanitizeHtml(message);
      backup.style.display = 'none';
      backup.setAttribute('aria-hidden', 'true');
      document.body.appendChild(backup);
    };

    const removeBackup = () => {
      if (backup) {
        document.body.removeChild(backup);
        backup = null;
      }
    };

    // Check if a backup already exists and update it if necessary
    if (backup) {
      backup.value = sanitizeHtml(message);
    } else {
      createBackup();
    }

    return () => {
      removeBackup();
    };
  }, [message, isBackupEnabled]);

  const safeMessage = sanitizeHtml(message);

  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: safeMessage }} />
      {isBackupEnabled && (
        <textarea
          value={backupMessage}
          readOnly
          aria-label="Backup message"
        />
      )}
    </div>
  );
};

export default MyComponent;

// sanitizeHtml.ts
import { DOMPurify } from '@dompurify/dompurify';

export const sanitizeHtml = (unsafeHtml: string) => {
  return DOMPurify.sanitize(unsafeHtml);
};