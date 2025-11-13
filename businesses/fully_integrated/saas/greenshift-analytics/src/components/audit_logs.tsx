import React, { FC, ReactNode } from 'react';

interface Props {
  auditLogMessage: string; // Rename 'message' to 'auditLogMessage' for better context
  isError?: boolean; // Add optional 'isError' prop to handle error messages
}

const AuditLogsComponent: FC<Props> = ({ auditLogMessage, isError = false }) => {
  const logClass = isError ? 'error-log' : 'success-log'; // Define classes for error and success messages

  return (
    <div className={logClass}>
      {auditLogMessage}
      {isError && <span className="accessibility-label">Error:</span>}
    </div>
  );
};

export default AuditLogsComponent;

<AuditLogsComponent auditLogMessage="User deleted account" isError={true} />
<AuditLogsComponent auditLogMessage="User successfully logged in" />

import React, { FC, ReactNode } from 'react';

interface Props {
  auditLogMessage: string; // Rename 'message' to 'auditLogMessage' for better context
  isError?: boolean; // Add optional 'isError' prop to handle error messages
}

const AuditLogsComponent: FC<Props> = ({ auditLogMessage, isError = false }) => {
  const logClass = isError ? 'error-log' : 'success-log'; // Define classes for error and success messages

  return (
    <div className={logClass}>
      {auditLogMessage}
      {isError && <span className="accessibility-label">Error:</span>}
    </div>
  );
};

export default AuditLogsComponent;

<AuditLogsComponent auditLogMessage="User deleted account" isError={true} />
<AuditLogsComponent auditLogMessage="User successfully logged in" />

In this updated version, I've added an optional `isError` prop to handle error messages differently from success messages. I've also added a `className` attribute to the `div` element to style error and success messages separately. Additionally, I've added an accessibility label for error messages to help screen readers understand the content better.

To use this updated component, you can pass the `isError` prop as true or false, depending on the type of the audit log message: