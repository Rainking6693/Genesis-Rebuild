import React, { FC, DetailedHTMLProps, HTMLAttributes } from 'react';

interface AuditLogProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  level?: 'info' | 'warning' | 'error' | 'unknown'; // Added 'unknown' for edge cases
  title?: string; // Added title for accessibility
}

const AuditLog: FC<AuditLogProps> = ({ message, level = 'info', title, className, ...rest }) => {
  const logClass = `audit-log ${level === 'warning' ? 'warning' : level === 'error' ? 'error' : level === 'unknown' ? 'unknown' : ''} ${className || ''}`;
  const dataLevel = level || 'info'; // Ensure level is always defined

  return (
    <div
      className={logClass}
      {...rest}
      role="log"
      aria-live="polite"
      tabIndex={0}
      data-level={dataLevel}
      data-message={message}
    >
      {title && <span className="sr-only">{title}</span>}
      {message}
    </div>
  );
};

export default AuditLog;

This updated component is more resilient, accessible, and maintainable as it handles edge cases, provides a screen reader-friendly description, and allows for programmatic access to the log level and message.