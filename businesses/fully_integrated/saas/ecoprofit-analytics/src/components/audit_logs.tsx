import moment from 'moment';

interface AuditLog {
  timestamp: Date;
  user: string;
  action: string;
  message: string;
}

interface AuditLogWithDefaults extends AuditLog {
  formattedTimestamp?: string;
}

const defaultAuditLog: AuditLogWithDefaults = {
  timestamp: new Date(),
  user: '',
  action: '',
  message: '',
  formattedTimestamp: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
};

type Props = AuditLogWithDefaults & { key?: string };

const AuditLog: React.FC<Props> = ({ timestamp, user, action, message, formattedTimestamp, key }) => {
  // Formatting the timestamp for better readability
  if (!formattedTimestamp) {
    formattedTimestamp = moment(timestamp).format('YYYY-MM-DD HH:mm:ss');
  }

  return (
    <div className="audit-log" aria-label="Audit log entry">
      <div className="audit-log-metadata" aria-label="Audit log metadata">
        <span className="audit-log-timestamp" aria-label="Timestamp">{formattedTimestamp}</span>
        <span className="audit-log-user" aria-label="User">{user}</span>
        <span className="audit-log-action" aria-label="Action">{action}</span>
      </div>
      <div className="audit-log-message" aria-label="Message">{message}</div>
    </div>
  );
};

AuditLog.defaultProps = defaultAuditLog as Props;

export default AuditLog;

// MyComponent.ts
import React from 'react';
import AuditLog from './AuditLog';

interface Props {
  auditLog: AuditLog;
}

const MyComponent: React.FC<Props> = ({ auditLog }) => {
  return <AuditLog key={auditLog.timestamp.toString()} {...auditLog} />;
};

export default MyComponent;