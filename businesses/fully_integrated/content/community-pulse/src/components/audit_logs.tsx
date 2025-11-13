import React from 'react';
import { AuditLog } from './AuditLog'; // Assuming AuditLog component exists

interface AuditLog {
  id?: string; // Add optional id property for easier tracking and debugging
  message: string;
  timestamp: Date; // Add timestamp property for better understanding of when the log was created
  user?: string; // Add optional user property for attributing logs to specific users
}

interface Props {
  auditLog: AuditLog; // Pass audit log object instead of string
}

const AuditLogDisplay: React.FC<Props> = ({ auditLog }) => {
  const { id, message, timestamp, user } = auditLog; // Destructure properties from auditLog

  // Add a check to ensure the message is not empty before rendering
  if (!message) {
    return <div>No message provided for this log.</div>;
  }

  // Add a readable timestamp format
  const readableTimestamp = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(timestamp);

  // Add accessibility attributes for screen readers
  const ariaLabel = `Audit log: ${message}`;
  const ariaDescribedBy = id ? `log-${id}` : undefined;

  return (
    <div>
      <div id={id || ''} aria-hidden={!id} aria-labelledby={ariaDescribedBy}>
        {message}
      </div>
      <div role="presentation">{readableTimestamp}</div>
      {user && <div>By: {user}</div>}
    </div>
  );
};

export default AuditLogDisplay;

import React from 'react';
import { AuditLog } from './AuditLog'; // Assuming AuditLog component exists

interface AuditLog {
  id?: string; // Add optional id property for easier tracking and debugging
  message: string;
  timestamp: Date; // Add timestamp property for better understanding of when the log was created
  user?: string; // Add optional user property for attributing logs to specific users
}

interface Props {
  auditLog: AuditLog; // Pass audit log object instead of string
}

const AuditLogDisplay: React.FC<Props> = ({ auditLog }) => {
  const { id, message, timestamp, user } = auditLog; // Destructure properties from auditLog

  // Add a check to ensure the message is not empty before rendering
  if (!message) {
    return <div>No message provided for this log.</div>;
  }

  // Add a readable timestamp format
  const readableTimestamp = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(timestamp);

  // Add accessibility attributes for screen readers
  const ariaLabel = `Audit log: ${message}`;
  const ariaDescribedBy = id ? `log-${id}` : undefined;

  return (
    <div>
      <div id={id || ''} aria-hidden={!id} aria-labelledby={ariaDescribedBy}>
        {message}
      </div>
      <div role="presentation">{readableTimestamp}</div>
      {user && <div>By: {user}</div>}
    </div>
  );
};

export default AuditLogDisplay;