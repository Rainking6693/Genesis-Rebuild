import React, { useState } from 'react';
import { AuditLogMessage } from './audit_log_message'; // Assuming AuditLogMessage is a separate component or type

interface Props {
  auditLogMessage: AuditLogMessage; // Use a specific type for the message
}

const AuditLogs: React.FC<Props> = ({ auditLogMessage }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!auditLogMessage) {
    return <div>Invalid audit log message</div>;
  }

  const handleExpandClick = () => {
    setIsExpanded(!isExpanded);
  };

  const detailsContainerStyle = {
    maxHeight: isExpanded ? '1000px' : '0',
    transition: 'max-height 0.3s ease',
    overflow: 'hidden',
  };

  return (
    <div>
      <div onClick={handleExpandClick} role="button" tabIndex={0}>
        {auditLogMessage.message}
        {auditLogMessage.details && (
          <span className="expand-indicator" aria-hidden="true">
            {isExpanded ? '-' : '+'}
          </span>
        )}
      </div>
      <div
        className={`details ${isExpanded ? '' : 'hidden'}`}
        style={detailsContainerStyle}
        aria-labelledby="audit-log-message"
      >
        {auditLogMessage.details}
      </div>
      <div id="audit-log-message">{auditLogMessage.message}</div>
    </div>
  );
};

interface AuditLogMessageDetails {
  timestamp?: string;
  user?: string;
  action?: string;
  resource?: string;
}

interface AuditLogMessage {
  message: string;
  details?: AuditLogMessageDetails;
}

export default AuditLogs;

import React, { useState } from 'react';
import { AuditLogMessage } from './audit_log_message'; // Assuming AuditLogMessage is a separate component or type

interface Props {
  auditLogMessage: AuditLogMessage; // Use a specific type for the message
}

const AuditLogs: React.FC<Props> = ({ auditLogMessage }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!auditLogMessage) {
    return <div>Invalid audit log message</div>;
  }

  const handleExpandClick = () => {
    setIsExpanded(!isExpanded);
  };

  const detailsContainerStyle = {
    maxHeight: isExpanded ? '1000px' : '0',
    transition: 'max-height 0.3s ease',
    overflow: 'hidden',
  };

  return (
    <div>
      <div onClick={handleExpandClick} role="button" tabIndex={0}>
        {auditLogMessage.message}
        {auditLogMessage.details && (
          <span className="expand-indicator" aria-hidden="true">
            {isExpanded ? '-' : '+'}
          </span>
        )}
      </div>
      <div
        className={`details ${isExpanded ? '' : 'hidden'}`}
        style={detailsContainerStyle}
        aria-labelledby="audit-log-message"
      >
        {auditLogMessage.details}
      </div>
      <div id="audit-log-message">{auditLogMessage.message}</div>
    </div>
  );
};

interface AuditLogMessageDetails {
  timestamp?: string;
  user?: string;
  action?: string;
  resource?: string;
}

interface AuditLogMessage {
  message: string;
  details?: AuditLogMessageDetails;
}

export default AuditLogs;