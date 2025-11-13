import React, { FC, DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  children?: ReactNode;
  timestamp?: Date;
  level?: 'info' | 'warning' | 'error';
}

const AuditLog: FC<Props> = ({ className, message, children, timestamp, level, ...rest }) => {
  const logClass = `audit-log ${className}`;
  const logLevelClass = level ? `audit-log--${level}` : '';

  return (
    <div className={`${logClass} ${logLevelClass}`} {...rest}>
      {timestamp && <span className="audit-log__timestamp">{timestamp.toLocaleString()}</span>}
      {children || message}
    </div>
  );
};

export default AuditLog;

import React, { FC, DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  children?: ReactNode;
  timestamp?: Date;
  level?: 'info' | 'warning' | 'error';
}

const AuditLog: FC<Props> = ({ className, message, children, timestamp, level, ...rest }) => {
  const logClass = `audit-log ${className}`;
  const logLevelClass = level ? `audit-log--${level}` : '';

  return (
    <div className={`${logClass} ${logLevelClass}`} {...rest}>
      {timestamp && <span className="audit-log__timestamp">{timestamp.toLocaleString()}</span>}
      {children || message}
    </div>
  );
};

export default AuditLog;