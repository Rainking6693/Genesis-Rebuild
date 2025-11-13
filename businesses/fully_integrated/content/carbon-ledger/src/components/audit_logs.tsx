import React from 'react';

interface AuditLogProps {
  logId?: string;
  timestamp?: Date;
  userId?: string;
  action?: string;
  resourceType?: string;
  resourceId?: string;
  details?: string;
}

const AuditLog: React.FC<AuditLogProps> = ({
  logId = 'N/A',
  timestamp = new Date(),
  userId = 'N/A',
  action = 'N/A',
  resourceType = 'N/A',
  resourceId = 'N/A',
  details = 'N/A',
}) => {
  // Resiliency: Handle edge cases for invalid or missing data
  const formattedTimestamp = timestamp
    ? timestamp.toLocaleString()
    : 'N/A';
  const formattedLogId = logId || 'N/A';
  const formattedUserId = userId || 'N/A';
  const formattedAction = action || 'N/A';
  const formattedResourceType = resourceType || 'N/A';
  const formattedResourceId = resourceId || 'N/A';
  const formattedDetails = details || 'N/A';

  return (
    <div className="audit-log" aria-label="Audit Log">
      {/* Accessibility: Use appropriate ARIA labels */}
      <p>
        <strong>Log ID:</strong>{' '}
        <span aria-label="Log ID">{formattedLogId}</span>
      </p>
      <p>
        <strong>Timestamp:</strong>{' '}
        <span aria-label="Timestamp">{formattedTimestamp}</span>
      </p>
      <p>
        <strong>User ID:</strong>{' '}
        <span aria-label="User ID">{formattedUserId}</span>
      </p>
      <p>
        <strong>Action:</strong>{' '}
        <span aria-label="Action">{formattedAction}</span>
      </p>
      <p>
        <strong>Resource Type:</strong>{' '}
        <span aria-label="Resource Type">{formattedResourceType}</span>
      </p>
      <p>
        <strong>Resource ID:</strong>{' '}
        <span aria-label="Resource ID">{formattedResourceId}</span>
      </p>
      <p>
        <strong>Details:</strong>{' '}
        <span aria-label="Details">{formattedDetails}</span>
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
  resourceType?: string;
  resourceId?: string;
  details?: string;
}

const AuditLog: React.FC<AuditLogProps> = ({
  logId = 'N/A',
  timestamp = new Date(),
  userId = 'N/A',
  action = 'N/A',
  resourceType = 'N/A',
  resourceId = 'N/A',
  details = 'N/A',
}) => {
  // Resiliency: Handle edge cases for invalid or missing data
  const formattedTimestamp = timestamp
    ? timestamp.toLocaleString()
    : 'N/A';
  const formattedLogId = logId || 'N/A';
  const formattedUserId = userId || 'N/A';
  const formattedAction = action || 'N/A';
  const formattedResourceType = resourceType || 'N/A';
  const formattedResourceId = resourceId || 'N/A';
  const formattedDetails = details || 'N/A';

  return (
    <div className="audit-log" aria-label="Audit Log">
      {/* Accessibility: Use appropriate ARIA labels */}
      <p>
        <strong>Log ID:</strong>{' '}
        <span aria-label="Log ID">{formattedLogId}</span>
      </p>
      <p>
        <strong>Timestamp:</strong>{' '}
        <span aria-label="Timestamp">{formattedTimestamp}</span>
      </p>
      <p>
        <strong>User ID:</strong>{' '}
        <span aria-label="User ID">{formattedUserId}</span>
      </p>
      <p>
        <strong>Action:</strong>{' '}
        <span aria-label="Action">{formattedAction}</span>
      </p>
      <p>
        <strong>Resource Type:</strong>{' '}
        <span aria-label="Resource Type">{formattedResourceType}</span>
      </p>
      <p>
        <strong>Resource ID:</strong>{' '}
        <span aria-label="Resource ID">{formattedResourceId}</span>
      </p>
      <p>
        <strong>Details:</strong>{' '}
        <span aria-label="Details">{formattedDetails}</span>
      </p>
    </div>
  );
};

export default AuditLog;