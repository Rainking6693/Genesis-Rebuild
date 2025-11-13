import React, { PropsWithChildren, DetailedHTMLProps, HTMLAttributes } from 'react';

/**
 * EcoBox Curator - Audit Logs Component
 * Displays a message from the legal agent.
 */
interface AuditLogsProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  /**
   * The message to be displayed in the audit logs.
   */
  message: string;
}

const AuditLogs: React.FC<AuditLogsProps> = ({ message, className, ...rest }) => {
  // Added a check for non-empty message to prevent rendering an empty div.
  if (!message.trim()) return null;

  // Added aria-label for accessibility.
  // Added role="log" for better semantics.
  // Added data-testid for testing purposes.
  return (
    <div data-testid="audit-logs" className={className} role="log" aria-label="Audit Logs" {...rest}>
      {message}
    </div>
  );
};

export default AuditLogs;

import React, { PropsWithChildren, DetailedHTMLProps, HTMLAttributes } from 'react';

/**
 * EcoBox Curator - Audit Logs Component
 * Displays a message from the legal agent.
 */
interface AuditLogsProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  /**
   * The message to be displayed in the audit logs.
   */
  message: string;
}

const AuditLogs: React.FC<AuditLogsProps> = ({ message, className, ...rest }) => {
  // Added a check for non-empty message to prevent rendering an empty div.
  if (!message.trim()) return null;

  // Added aria-label for accessibility.
  // Added role="log" for better semantics.
  // Added data-testid for testing purposes.
  return (
    <div data-testid="audit-logs" className={className} role="log" aria-label="Audit Logs" {...rest}>
      {message}
    </div>
  );
};

export default AuditLogs;