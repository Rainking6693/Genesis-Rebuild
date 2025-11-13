import React, { FC, ReactNode } from 'react';

interface AuditLogProps {
  logMessage: string; // Use a more descriptive name for the prop
  logType?: string; // Add optional log type for better context
  isError?: boolean; // Flag for error logs to apply styling
}

const AuditLogComponent: FC<AuditLogProps> = ({ logMessage, logType, isError }) => {
  const logClassName = `audit-log ${isError ? 'error' : ''} ${logType || ''}`;

  return (
    <div className={logClassName}>
      {logMessage}
      {/* Add screen reader text for accessibility */}
      <span className="sr-only">Audit log: {logMessage}</span>
    </div>
  );
};

export default AuditLogComponent;

<AuditLogComponent logMessage="User logged in" logType="user" />
<AuditLogComponent logMessage="Database connection error" isError />

import React, { FC, ReactNode } from 'react';

interface AuditLogProps {
  logMessage: string; // Use a more descriptive name for the prop
  logType?: string; // Add optional log type for better context
  isError?: boolean; // Flag for error logs to apply styling
}

const AuditLogComponent: FC<AuditLogProps> = ({ logMessage, logType, isError }) => {
  const logClassName = `audit-log ${isError ? 'error' : ''} ${logType || ''}`;

  return (
    <div className={logClassName}>
      {logMessage}
      {/* Add screen reader text for accessibility */}
      <span className="sr-only">Audit log: {logMessage}</span>
    </div>
  );
};

export default AuditLogComponent;

<AuditLogComponent logMessage="User logged in" logType="user" />
<AuditLogComponent logMessage="Database connection error" isError />

In this updated version, I've made the following changes:

1. Renamed the prop `auditLogMessage` to `logMessage` for better readability.
2. Added an optional `logType` prop to provide more context about the log.
3. Added an optional `isError` prop to apply specific styling for error logs.
4. Added a class name based on the log type and error status for better maintainability.
5. Added screen reader text for accessibility.

Now, you can use the component like this: