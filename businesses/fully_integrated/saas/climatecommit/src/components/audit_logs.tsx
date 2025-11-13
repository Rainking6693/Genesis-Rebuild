import moment from 'moment';

type AuditLog = {
  timestamp: Date;
  user: string;
  action: string;
  message?: string;
};

interface AuditLogWithDefaults extends AuditLog {
  formattedTimestamp?: string;
}

const isValidDate = (date: any): date is Date => {
  return typeof date === 'object' && date !== null && typeof date.getTime === 'function';
};

const formatTimestamp = (timestamp: Date): string => moment(timestamp).format('YYYY-MM-DD HH:mm:ss');

const AuditLog: React.FC<AuditLogWithDefaults> = ({ timestamp, user, action, message, formattedTimestamp }) => {
  if (!isValidDate(timestamp)) {
    return <div>Invalid timestamp provided</div>;
  }

  const formattedTimestampToDisplay = formattedTimestamp || formatTimestamp(timestamp);

  return (
    <div>
      <div>{formattedTimestampToDisplay}</div>
      <div role="cell" aria-label="User">{user}</div>
      <div role="cell" aria-label="Action">{action}</div>
      <div role="cell" aria-label="Message">{message || '-'}</div>
    </div>
  );
};

AuditLog.defaultProps = {
  formattedTimestamp: undefined,
  message: '-',
};

export default AuditLog;

// MyComponent.ts
import React from 'react';
import AuditLog from './AuditLog';

type Props = {
  auditLog: AuditLog;
};

const MyComponent: React.FC<Props> = ({ auditLog }) => {
  return <AuditLog {...auditLog} />;
};

export default MyComponent;