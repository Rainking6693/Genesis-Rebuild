import React, { useState, useEffect, DetailedHTMLProps } from 'react';
import { sanitizeHtml } from 'dangerous-html-sanitizer-react';

interface Props extends DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
}

const BackupSystem: React.FC<Props> = ({ message, ...props }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState<string>(message);
  const allowedTags = ['b', 'i', 'u', 'a']; // Customize this array as needed

  useEffect(() => {
    setSanitizedMessage(sanitizeHtml(message, { allowedTags }));
  }, [message]);

  return (
    <div
      {...props}
      aria-label="Backup system message"
      className="backup-system-message"
    >
      <div
        dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
        aria-hidden="true"
      />
    </div>
  );
};

export default BackupSystem;

import React, { useState, useEffect, DetailedHTMLProps } from 'react';
import { sanitizeHtml } from 'dangerous-html-sanitizer-react';

interface Props extends DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
}

const BackupSystem: React.FC<Props> = ({ message, ...props }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState<string>(message);
  const allowedTags = ['b', 'i', 'u', 'a']; // Customize this array as needed

  useEffect(() => {
    setSanitizedMessage(sanitizeHtml(message, { allowedTags }));
  }, [message]);

  return (
    <div
      {...props}
      aria-label="Backup system message"
      className="backup-system-message"
    >
      <div
        dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
        aria-hidden="true"
      />
    </div>
  );
};

export default BackupSystem;