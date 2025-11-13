import React, { FC, DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';

interface AuditLogLevel {
  severity: string;
  color: string;
}

const levelMap: Record<AuditLogLevel['severity'], AuditLogLevel> = {
  info: { severity: 'Info', color: '#007bff' },
  warning: { severity: 'Warning', color: '#ffc107' },
  error: { severity: 'Error', color: '#dc3545' },
};

interface AuditLogProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  level?: keyof typeof levelMap;
  children?: ReactNode;
}

const AuditLog: FC<AuditLogProps> = ({ message, level = 'info', children, ...divProps }) => {
  const { severity, color } = levelMap[level];
  const logClass = `audit-log audit-log--${severity}`;

  return (
    <div className={logClass} style={{ color }} {...divProps}>
      <time dateTime={new Date().toISOString()}>{new Date().toLocaleTimeString()}</time>
      {children ? (
        <>
          {children}
          <span className="message">{message}</span>
        </>
      ) : (
        <>
          {message}
          <span className="message">{message}</span>
        </>
      )}
    </div>
  );
};

export { AuditLog };

import React, { FC, DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';

interface AuditLogLevel {
  severity: string;
  color: string;
}

const levelMap: Record<AuditLogLevel['severity'], AuditLogLevel> = {
  info: { severity: 'Info', color: '#007bff' },
  warning: { severity: 'Warning', color: '#ffc107' },
  error: { severity: 'Error', color: '#dc3545' },
};

interface AuditLogProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  level?: keyof typeof levelMap;
  children?: ReactNode;
}

const AuditLog: FC<AuditLogProps> = ({ message, level = 'info', children, ...divProps }) => {
  const { severity, color } = levelMap[level];
  const logClass = `audit-log audit-log--${severity}`;

  return (
    <div className={logClass} style={{ color }} {...divProps}>
      <time dateTime={new Date().toISOString()}>{new Date().toLocaleTimeString()}</time>
      {children ? (
        <>
          {children}
          <span className="message">{message}</span>
        </>
      ) : (
        <>
          {message}
          <span className="message">{message}</span>
        </>
      )}
    </div>
  );
};

export { AuditLog };