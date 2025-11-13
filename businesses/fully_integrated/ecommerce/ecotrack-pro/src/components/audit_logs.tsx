// audit_log_types.ts
export type AuditLogMessage = {
  timestamp: Date;
  user: string;
  action: string;
  target: string;
  message: string;
  title?: string;
  severity?: 'info' | 'warning' | 'error';
};

// MyComponent.tsx
import React, { useState } from 'react';
import { AuditLogMessage } from './audit_log_types';

interface Props {
  auditLogMessage: AuditLogMessage;
}

const MyComponent: React.FC<Props> = ({ auditLogMessage }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleExpandClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div>
      <div role="button" tabIndex={0} onClick={handleExpandClick} aria-expanded={isExpanded.toString()}>
        {auditLogMessage.message}
        {auditLogMessage.severity && (
          <span className={`severity-${auditLogMessage.severity}`}>
            {auditLogMessage.severity.toUpperCase()}
          </span>
        )}
      </div>
      {isExpanded && (
        <div className="details" style={{ maxHeight: '300px', overflow: 'hidden', transition: 'max-height 0.3s ease' }}>
          <strong>Title:</strong> {auditLogMessage.title || auditLogMessage.message}
          <br />
          <strong>Timestamp:</strong> {auditLogMessage.timestamp.toLocaleString()}
          <br />
          <strong>User:</strong> {auditLogMessage.user}
          <br />
          <strong>Action:</strong> {auditLogMessage.action}
          <br />
          <strong>Target:</strong> {auditLogMessage.target}
        </div>
      )}
    </div>
  );
};

export default MyComponent;

// audit_log_types.ts
export type AuditLogMessage = {
  timestamp: Date;
  user: string;
  action: string;
  target: string;
  message: string;
  title?: string;
  severity?: 'info' | 'warning' | 'error';
};

// MyComponent.tsx
import React, { useState } from 'react';
import { AuditLogMessage } from './audit_log_types';

interface Props {
  auditLogMessage: AuditLogMessage;
}

const MyComponent: React.FC<Props> = ({ auditLogMessage }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleExpandClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div>
      <div role="button" tabIndex={0} onClick={handleExpandClick} aria-expanded={isExpanded.toString()}>
        {auditLogMessage.message}
        {auditLogMessage.severity && (
          <span className={`severity-${auditLogMessage.severity}`}>
            {auditLogMessage.severity.toUpperCase()}
          </span>
        )}
      </div>
      {isExpanded && (
        <div className="details" style={{ maxHeight: '300px', overflow: 'hidden', transition: 'max-height 0.3s ease' }}>
          <strong>Title:</strong> {auditLogMessage.title || auditLogMessage.message}
          <br />
          <strong>Timestamp:</strong> {auditLogMessage.timestamp.toLocaleString()}
          <br />
          <strong>User:</strong> {auditLogMessage.user}
          <br />
          <strong>Action:</strong> {auditLogMessage.action}
          <br />
          <strong>Target:</strong> {auditLogMessage.target}
        </div>
      )}
    </div>
  );
};

export default MyComponent;