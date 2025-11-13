export type AuditLogSeverity = 'info' | 'warning' | 'error';
export type AuditLogDetails = string;
export type AuditLogMessage = React.ReactText;
export interface AuditLog {
  severity: AuditLogSeverity;
  message: AuditLogMessage;
  timestamp?: Date;
  details?: AuditLogDetails;
}

// MyComponent.tsx
import React, { useState } from 'react';
import moment from 'moment';
import './AuditLog.css';

interface Props {
  auditLog: AuditLog;
}

const MyComponent: React.FC<Props> = ({ auditLog }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="audit-log" role="log">
      <div className="audit-log-header" onClick={toggleExpand} aria-expanded={isExpanded.toString()}>
        <div className="severity" role="logseverity">{auditLog.severity}</div>
        <div className="message" role="logmessage">{auditLog.message}</div>
        <div className="timestamp" role="logtimestamp">
          {auditLog.timestamp ? moment(auditLog.timestamp).format('YYYY-MM-DD HH:mm:ss') : 'N/A'}
        </div>
      </div>
      {isExpanded && (
        <div className="audit-log-details" style={{ maxHeight: '200px', minHeight: '32px', overflow: 'hidden' }} key={auditLog.message}>
          {auditLog.details || 'No details provided'}
        </div>
      )}
    </div>
  );
};

export default MyComponent;