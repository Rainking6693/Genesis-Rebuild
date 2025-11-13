import React, { ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';
import { AuditLogMessage } from './audit_log_message'; // Assuming AuditLogMessage is a separate component or type definition

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  auditLogMessage: AuditLogMessage; // Use a specific type for the message to ensure consistency
  children?: ReactNode; // Allow for custom content within the AuditLog component
}

const AuditLog: React.FC<Props> = ({ auditLogMessage, children, className, ...rest }) => {
  // Add a check for non-empty auditLogMessage to prevent rendering errors
  if (!auditLogMessage) return null;

  // Add a class for styling and accessibility purposes
  const logClass = `audit-log ${className || ''}`;

  // Add a title for screen readers to announce the log message
  const logTitle = auditLogMessage.title || auditLogMessage.message;

  // Add a role and aria-labelledby attributes for proper accessibility
  const logAccessibility = {
    role: 'log',
    'aria-labelledby': `${logClass}-title`,
  };

  return (
    <div {...rest} className={logClass}>
      {children}
      <div className={`${logClass}__message`} {...logAccessibility}>
        <h3 id={`${logClass}-title`}>{logTitle}</h3>
        <p>{auditLogMessage.message}</p>
      </div>
    </div>
  );
};

export default AuditLog;

import React, { ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';
import { AuditLogMessage } from './audit_log_message'; // Assuming AuditLogMessage is a separate component or type definition

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  auditLogMessage: AuditLogMessage; // Use a specific type for the message to ensure consistency
  children?: ReactNode; // Allow for custom content within the AuditLog component
}

const AuditLog: React.FC<Props> = ({ auditLogMessage, children, className, ...rest }) => {
  // Add a check for non-empty auditLogMessage to prevent rendering errors
  if (!auditLogMessage) return null;

  // Add a class for styling and accessibility purposes
  const logClass = `audit-log ${className || ''}`;

  // Add a title for screen readers to announce the log message
  const logTitle = auditLogMessage.title || auditLogMessage.message;

  // Add a role and aria-labelledby attributes for proper accessibility
  const logAccessibility = {
    role: 'log',
    'aria-labelledby': `${logClass}-title`,
  };

  return (
    <div {...rest} className={logClass}>
      {children}
      <div className={`${logClass}__message`} {...logAccessibility}>
        <h3 id={`${logClass}-title`}>{logTitle}</h3>
        <p>{auditLogMessage.message}</p>
      </div>
    </div>
  );
};

export default AuditLog;