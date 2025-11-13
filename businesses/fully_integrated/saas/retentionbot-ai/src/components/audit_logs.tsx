import React from 'react';

interface AuditLogProps {
  logId?: string;
  timestamp?: Date;
  userId?: string;
  action?: string;
  resource?: string;
  details?: string;
}

const AuditLog: React.FC<AuditLogProps> = ({
  logId = 'N/A',
  timestamp = new Date(),
  userId = 'N/A',
  action = 'N/A',
  resource = 'N/A',
  details = 'N/A',
}) => {
  // Resiliency: Handle edge cases for missing or invalid data
  const formattedTimestamp = timestamp.toLocaleString();

  return (
    <div
      className="audit-log-entry"
      aria-label={`Audit log entry for ${action} on ${resource}`}
    >
      {/* Accessibility: Add aria-label for screen readers */}
      <p>
        <strong>Log ID:</strong> {logId}
      </p>
      <p>
        <strong>Timestamp:</strong> {formattedTimestamp}
      </p>
      <p>
        <strong>User ID:</strong> {userId}
      </p>
      <p>
        <strong>Action:</strong> {action}
      </p>
      <p>
        <strong>Resource:</strong> {resource}
      </p>
      <p>
        <strong>Details:</strong> {details}
      </p>
    </div>
  );
};

export default AuditLog;

import React from 'react';

interface AuditLogProps {
  logId?: string;
  timestamp?: Date;
  userId?: string;
  action?: string;
  resource?: string;
  details?: string;
}

const AuditLog: React.FC<AuditLogProps> = ({
  logId = 'N/A',
  timestamp = new Date(),
  userId = 'N/A',
  action = 'N/A',
  resource = 'N/A',
  details = 'N/A',
}) => {
  // Resiliency: Handle edge cases for missing or invalid data
  const formattedTimestamp = timestamp.toLocaleString();

  return (
    <div
      className="audit-log-entry"
      aria-label={`Audit log entry for ${action} on ${resource}`}
    >
      {/* Accessibility: Add aria-label for screen readers */}
      <p>
        <strong>Log ID:</strong> {logId}
      </p>
      <p>
        <strong>Timestamp:</strong> {formattedTimestamp}
      </p>
      <p>
        <strong>User ID:</strong> {userId}
      </p>
      <p>
        <strong>Action:</strong> {action}
      </p>
      <p>
        <strong>Resource:</strong> {resource}
      </p>
      <p>
        <strong>Details:</strong> {details}
      </p>
    </div>
  );
};

export default AuditLog;