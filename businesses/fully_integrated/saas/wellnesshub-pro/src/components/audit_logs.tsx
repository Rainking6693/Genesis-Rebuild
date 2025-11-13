import React, { ReactNode } from 'react';
import { AuditLogMessage } from './audit_log_message'; // Assuming AuditLogMessage is a separate component or type

interface Props {
  auditLogMessage: AuditLogMessage; // Use a specific type for the message
  onError?: (error: Error) => void; // Add an optional error handling callback
}

const MyComponent: React.FC<Props> = ({ auditLogMessage, onError = () => {} }) => {
  if (!auditLogMessage) {
    onError(new Error('Invalid audit log message'));
    return null;
  }

  // Add ARIA attributes for accessibility
  const { level, actor, action, resource, timestamp } = auditLogMessage;
  const ariaLabel = `${level} log by ${actor}: ${action} on ${resource} at ${timestamp}`;

  let content: ReactNode;

  try {
    content = <AuditLogMessage {...auditLogMessage} />;
  } catch (error) {
    onError(error);
    content = <div>An error occurred while rendering the audit log: {error.message}</div>;
  }

  return (
    <div aria-label={ariaLabel}>
      {content}
    </div>
  );
};

export default MyComponent;

import React, { ReactNode } from 'react';
import { AuditLogMessage } from './audit_log_message'; // Assuming AuditLogMessage is a separate component or type

interface Props {
  auditLogMessage: AuditLogMessage; // Use a specific type for the message
  onError?: (error: Error) => void; // Add an optional error handling callback
}

const MyComponent: React.FC<Props> = ({ auditLogMessage, onError = () => {} }) => {
  if (!auditLogMessage) {
    onError(new Error('Invalid audit log message'));
    return null;
  }

  // Add ARIA attributes for accessibility
  const { level, actor, action, resource, timestamp } = auditLogMessage;
  const ariaLabel = `${level} log by ${actor}: ${action} on ${resource} at ${timestamp}`;

  let content: ReactNode;

  try {
    content = <AuditLogMessage {...auditLogMessage} />;
  } catch (error) {
    onError(error);
    content = <div>An error occurred while rendering the audit log: {error.message}</div>;
  }

  return (
    <div aria-label={ariaLabel}>
      {content}
    </div>
  );
};

export default MyComponent;