import React, { FC, DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';

interface AuditLogProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  level?: 'info' | 'warning' | 'error';
  children?: ReactNode; // Allows for custom content within the log
}

const AuditLog: FC<AuditLogProps> = ({ message, level = 'info', className, children, ...rest }) => {
  const logClass = `audit-log ${className} ${getLogClass(level)}`;

  return <div {...rest} className={logClass}>
    {children || message}
  </div>;
};

const getLogClass = (level: 'info' | 'warning' | 'error') => {
  switch (level) {
    case 'warning':
      return 'text-warning';
    case 'error':
      return 'text-danger';
    default:
      return '';
  }
};

// Added a default export for better module interoperability
export default AuditLog;

// Added a type for the `level` prop to ensure type safety
type LogLevel = 'info' | 'warning' | 'error';

import React, { FC, DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';

interface AuditLogProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  level?: 'info' | 'warning' | 'error';
  children?: ReactNode; // Allows for custom content within the log
}

const AuditLog: FC<AuditLogProps> = ({ message, level = 'info', className, children, ...rest }) => {
  const logClass = `audit-log ${className} ${getLogClass(level)}`;

  return <div {...rest} className={logClass}>
    {children || message}
  </div>;
};

const getLogClass = (level: 'info' | 'warning' | 'error') => {
  switch (level) {
    case 'warning':
      return 'text-warning';
    case 'error':
      return 'text-danger';
    default:
      return '';
  }
};

// Added a default export for better module interoperability
export default AuditLog;

// Added a type for the `level` prop to ensure type safety
type LogLevel = 'info' | 'warning' | 'error';