import React, { useState } from 'react';
import { AuditLogMessage } from './AuditLogMessage'; // Assuming AuditLogMessage is a separate component or type definition

interface Props {
  auditLogMessage: AuditLogMessage; // Use a specific type for the message to ensure consistency
}

const AuditLogs: React.FC<Props> = ({ auditLogMessage }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleExpandClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div>
      <div role="button" onClick={handleExpandClick}>
        {auditLogMessage.message}
        {auditLogMessage.details && (
          <span className="expand-indicator" data-testid="expand-indicator">
            {isExpanded ? '-' : '+'}
          </span>
        )}
      </div>
      {auditLogMessage.details && (
        <div
          className={`details ${isExpanded ? '' : 'hidden'}`}
          style={{ maxHeight: '300px', overflow: 'hidden', transition: 'max-height 0.3s ease' }}
          key={auditLogMessage.message}
        >
          {auditLogMessage.details}
        </div>
      )}
    </div>
  );
};

export default AuditLogs;

// Adding a type definition for the AuditLogMessage type
type AuditLogMessage = {
  message: string;
  details?: string; // Adding a ? to make details optional
};

This updated code addresses the requested improvements by adding default state values, improving accessibility, handling long messages, and making the component more maintainable.