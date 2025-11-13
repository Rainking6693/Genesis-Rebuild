import React, { PropsWithChildren, DetailedHTMLProps, HTMLAttributes } from 'react';

interface AuditLogDisplayProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  /**
   * The audit log message to be displayed
   */
  message: string;

  /**
   * Optional className for styling
   */
  className?: string;

  /**
   * Optional id for accessibility purposes
   */
  id?: string;
}

const AuditLogDisplay: React.FC<AuditLogDisplayProps> = ({ message, className, id, children, ...rest }) => {
  // Handle empty message to prevent rendering an empty div
  if (!message) return null;

  // Add role="log" for accessibility
  const logRole = { ...rest, role: 'log' };

  return (
    <div className={className} {...logRole}>
      {message}
      {children}
    </div>
  );
};

export default AuditLogDisplay;

import React, { PropsWithChildren, DetailedHTMLProps, HTMLAttributes } from 'react';

interface AuditLogDisplayProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  /**
   * The audit log message to be displayed
   */
  message: string;

  /**
   * Optional className for styling
   */
  className?: string;

  /**
   * Optional id for accessibility purposes
   */
  id?: string;
}

const AuditLogDisplay: React.FC<AuditLogDisplayProps> = ({ message, className, id, children, ...rest }) => {
  // Handle empty message to prevent rendering an empty div
  if (!message) return null;

  // Add role="log" for accessibility
  const logRole = { ...rest, role: 'log' };

  return (
    <div className={className} {...logRole}>
      {message}
      {children}
    </div>
  );
};

export default AuditLogDisplay;