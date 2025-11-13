import React, { FC, ReactNode, useState } from 'react';
import DOMPurify from 'dompurify';

type Props = {
  message: string;
  severity?: 'info' | 'warning' | 'error';
  time?: string;
  id?: string;
  title?: string;
};

const AuditLogClasses = {
  info: 'audit-log-info',
  warning: 'audit-log-warning',
  error: 'audit-log-error',
};

const MyComponent: FC<Props> = ({ message, severity, time, id, title }) => {
  const logClass = `${AuditLogClasses[severity || 'info']} audit-log`;

  return (
    <div className={logClass} data-testid="audit-log" id={id} title={title}>
      <time dateTime={time}>{time}</time>
      {message}
    </div>
  );
};

MyComponent.displayName = 'MoodSyncAuditLog';

const SanitizedMyComponent = (WrappedComponent: FC<Props>) => {
  return (props: Props) => {
    const { message, severity, time, id, title, ...rest } = props;
    let sanitizedMessage = message;

    try {
      sanitizedMessage = DOMPurify.sanitize(message.trim(), {
        ALLOWED_TAGS: [],
        ALLOWED_ATTRS: {},
      });

      if (sanitizedMessage.length > 100) {
        sanitizedMessage = sanitizedMessage.slice(0, 100) + '...';
      }
    } catch (error) {
      console.error('Error sanitizing message:', error);
      sanitizedMessage = `Error sanitizing message: ${error.message}`;
    }

    return (
      <WrappedComponent
        {...rest}
        message={sanitizedMessage}
        severity={severity}
        time={time}
        id={id}
        title={title}
      />
    );
  };
};

export const AuditLog = SanitizedMyComponent(MyComponent);

import React, { FC, ReactNode, useState } from 'react';
import DOMPurify from 'dompurify';

type Props = {
  message: string;
  severity?: 'info' | 'warning' | 'error';
  time?: string;
  id?: string;
  title?: string;
};

const AuditLogClasses = {
  info: 'audit-log-info',
  warning: 'audit-log-warning',
  error: 'audit-log-error',
};

const MyComponent: FC<Props> = ({ message, severity, time, id, title }) => {
  const logClass = `${AuditLogClasses[severity || 'info']} audit-log`;

  return (
    <div className={logClass} data-testid="audit-log" id={id} title={title}>
      <time dateTime={time}>{time}</time>
      {message}
    </div>
  );
};

MyComponent.displayName = 'MoodSyncAuditLog';

const SanitizedMyComponent = (WrappedComponent: FC<Props>) => {
  return (props: Props) => {
    const { message, severity, time, id, title, ...rest } = props;
    let sanitizedMessage = message;

    try {
      sanitizedMessage = DOMPurify.sanitize(message.trim(), {
        ALLOWED_TAGS: [],
        ALLOWED_ATTRS: {},
      });

      if (sanitizedMessage.length > 100) {
        sanitizedMessage = sanitizedMessage.slice(0, 100) + '...';
      }
    } catch (error) {
      console.error('Error sanitizing message:', error);
      sanitizedMessage = `Error sanitizing message: ${error.message}`;
    }

    return (
      <WrappedComponent
        {...rest}
        message={sanitizedMessage}
        severity={severity}
        time={time}
        id={id}
        title={title}
      />
    );
  };
};

export const AuditLog = SanitizedMyComponent(MyComponent);