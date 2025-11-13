import React from 'react';
import { AuditLogMessage } from './audit_log_message';

interface Props {
  auditLogMessage: AuditLogMessage | null;
  className?: string;
  maxWidth?: string;
}

const AuditLogs: React.FC<Props> = ({ auditLogMessage, className, maxWidth }) => {
  if (!auditLogMessage) return null;

  return (
    <div className={className} role="log" aria-label="Audit log entry" style={{ maxWidth }}>
      <div>
        {auditLogMessage.timestamp.toLocaleString()} - {auditLogMessage.action} by {auditLogMessage.user}
      </div>
      {auditLogMessage.message && <div>{auditLogMessage.message}</div>}
    </div>
  );
};

export default AuditLogs;

import React from 'react';

interface AuditLogMessage {
  timestamp: Date;
  action: string;
  user: string;
  message: string;
}

interface Props {
  auditLogMessage: AuditLogMessage;
  className?: string;
  title?: string;
}

const AuditLogMessage: React.FC<Props> = ({ auditLogMessage, className, title }) => {
  if (!auditLogMessage) return null;

  return (
    <div className={className} role="log" aria-label="Audit log entry" key={auditLogMessage.timestamp.toString()}>
      <div title={title}>
        {auditLogMessage.timestamp.toLocaleString()} - {auditLogMessage.action} by {auditLogMessage.user}
      </div>
      {auditLogMessage.message && <div>{auditLogMessage.message}</div>}
    </div>
  );
};

export default AuditLogMessage;

import React from 'react';
import { AuditLogMessage } from './audit_log_message';

interface Props {
  auditLogMessage: AuditLogMessage | null;
  className?: string;
  maxWidth?: string;
}

const AuditLogs: React.FC<Props> = ({ auditLogMessage, className, maxWidth }) => {
  if (!auditLogMessage) return null;

  return (
    <div className={className} role="log" aria-label="Audit log entry" style={{ maxWidth }}>
      <div>
        {auditLogMessage.timestamp.toLocaleString()} - {auditLogMessage.action} by {auditLogMessage.user}
      </div>
      {auditLogMessage.message && <div>{auditLogMessage.message}</div>}
    </div>
  );
};

export default AuditLogs;

import React from 'react';

interface AuditLogMessage {
  timestamp: Date;
  action: string;
  user: string;
  message: string;
}

interface Props {
  auditLogMessage: AuditLogMessage;
  className?: string;
  title?: string;
}

const AuditLogMessage: React.FC<Props> = ({ auditLogMessage, className, title }) => {
  if (!auditLogMessage) return null;

  return (
    <div className={className} role="log" aria-label="Audit log entry" key={auditLogMessage.timestamp.toString()}>
      <div title={title}>
        {auditLogMessage.timestamp.toLocaleString()} - {auditLogMessage.action} by {auditLogMessage.user}
      </div>
      {auditLogMessage.message && <div>{auditLogMessage.message}</div>}
    </div>
  );
};

export default AuditLogMessage;

AuditLogMessage.tsx: