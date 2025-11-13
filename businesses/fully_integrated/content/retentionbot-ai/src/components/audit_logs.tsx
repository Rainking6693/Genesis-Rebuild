import React, { FC, DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  children?: ReactNode;
  level?: AuditLogLevel;
}

enum AuditLogLevel {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
}

const AuditLogs: FC<Props> = ({ className, message, children, level = AuditLogLevel.INFO, ...rest }) => {
  const auditLogClassNames = [
    `audit-log`,
    `audit-log--${level}`,
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={auditLogClassNames} {...rest}>
      {children || message}
    </div>
  );
};

AuditLogs.defaultProps = {
  className: '',
};

export default AuditLogs;

import React, { FC, DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  children?: ReactNode;
  level?: AuditLogLevel;
}

enum AuditLogLevel {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
}

const AuditLogs: FC<Props> = ({ className, message, children, level = AuditLogLevel.INFO, ...rest }) => {
  const auditLogClassNames = [
    `audit-log`,
    `audit-log--${level}`,
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={auditLogClassNames} {...rest}>
      {children || message}
    </div>
  );
};

AuditLogs.defaultProps = {
  className: '',
};

export default AuditLogs;