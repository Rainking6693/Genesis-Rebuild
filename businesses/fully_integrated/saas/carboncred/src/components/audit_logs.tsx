import React, { FC, ReactNode, ReactElement } from 'react';

interface AuditLogMessage {
  timestamp: Date;
  user: string;
  action: string;
  details: string;
}

interface Props {
  auditLogMessageData?: AuditLogMessage | null;
}

const getFormattedDate = (date: Date) => date.toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });

const AuditLogComponent: FC<Props> = ({ auditLogMessageData }: Props): ReactElement | null => {
  if (!auditLogMessageData) {
    return <div aria-label="No audit log message provided">No audit log message provided</div>;
  }

  const { timestamp, user, action, details } = auditLogMessageData;

  if (!timestamp || !user || !action || !details) {
    return null;
  }

  return (
    <div aria-label={`${user} performed ${action} at ${getFormattedDate(timestamp)}: ${details}`}>
      {`${user} performed ${action} at ${getFormattedDate(timestamp)}: ${details}`}
    </div>
  );
};

export default AuditLogComponent;

import React, { FC, ReactNode, ReactElement } from 'react';

interface AuditLogMessage {
  timestamp: Date;
  user: string;
  action: string;
  details: string;
}

interface Props {
  auditLogMessageData?: AuditLogMessage | null;
}

const getFormattedDate = (date: Date) => date.toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });

const AuditLogComponent: FC<Props> = ({ auditLogMessageData }: Props): ReactElement | null => {
  if (!auditLogMessageData) {
    return <div aria-label="No audit log message provided">No audit log message provided</div>;
  }

  const { timestamp, user, action, details } = auditLogMessageData;

  if (!timestamp || !user || !action || !details) {
    return null;
  }

  return (
    <div aria-label={`${user} performed ${action} at ${getFormattedDate(timestamp)}: ${details}`}>
      {`${user} performed ${action} at ${getFormattedDate(timestamp)}: ${details}`}
    </div>
  );
};

export default AuditLogComponent;