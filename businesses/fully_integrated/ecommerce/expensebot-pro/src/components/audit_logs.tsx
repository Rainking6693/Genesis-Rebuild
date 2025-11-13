import React, { useState } from 'react';
import { AuditLogMessage } from './audit_log_message'; // Assuming AuditLogMessage is a separate component or type definition

type AuditLogProps = {
  auditLogMessage: AuditLogMessage; // Use a specific type for the message to ensure consistency
};

const AuditLog: React.FC<AuditLogProps> = ({ auditLogMessage }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleExpandClick = () => {
    setIsExpanded(!isExpanded);
  };

  // Add a default message for cases where auditLogMessage.message is undefined or null
  const logMessage = auditLogMessage.message || 'No message provided';

  // Add a role attribute for accessibility
  const role = 'button';

  // Add a key attribute for React's performance optimization
  const key = `audit-log-${auditLogMessage.id}`;

  return (
    <div className="audit-log" key={key}>
      <div className="audit-log-header" role={role} onClick={handleExpandClick}>
        <div className="audit-log-message" id={`audit-log-message-${auditLogMessage.id}`}>
          {logMessage}
        </div>
        <div className="audit-log-expand-icon" id={`audit-log-expand-icon-${auditLogMessage.id}`}>
          {isExpanded ? '-' : '+'}
        </div>
      </div>
      {isExpanded && (
        <div className="audit-log-details" id={`audit-log-details-${auditLogMessage.id}`}>
          <div id={`audit-log-details-message-${auditLogMessage.id}`}>{auditLogMessage.details}</div>
          <div id={`audit-log-details-timestamp-${auditLogMessage.id}`}>{auditLogMessage.timestamp}</div>
        </div>
      )}
    </div>
  );
};

export default AuditLog;

import React, { useState } from 'react';
import { AuditLogMessage } from './audit_log_message'; // Assuming AuditLogMessage is a separate component or type definition

type AuditLogProps = {
  auditLogMessage: AuditLogMessage; // Use a specific type for the message to ensure consistency
};

const AuditLog: React.FC<AuditLogProps> = ({ auditLogMessage }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleExpandClick = () => {
    setIsExpanded(!isExpanded);
  };

  // Add a default message for cases where auditLogMessage.message is undefined or null
  const logMessage = auditLogMessage.message || 'No message provided';

  // Add a role attribute for accessibility
  const role = 'button';

  // Add a key attribute for React's performance optimization
  const key = `audit-log-${auditLogMessage.id}`;

  return (
    <div className="audit-log" key={key}>
      <div className="audit-log-header" role={role} onClick={handleExpandClick}>
        <div className="audit-log-message" id={`audit-log-message-${auditLogMessage.id}`}>
          {logMessage}
        </div>
        <div className="audit-log-expand-icon" id={`audit-log-expand-icon-${auditLogMessage.id}`}>
          {isExpanded ? '-' : '+'}
        </div>
      </div>
      {isExpanded && (
        <div className="audit-log-details" id={`audit-log-details-${auditLogMessage.id}`}>
          <div id={`audit-log-details-message-${auditLogMessage.id}`}>{auditLogMessage.details}</div>
          <div id={`audit-log-details-timestamp-${auditLogMessage.id}`}>{auditLogMessage.timestamp}</div>
        </div>
      )}
    </div>
  );
};

export default AuditLog;