import React, { useState, useEffect } from 'react';
import { AuditLogMessage } from './audit_log_message'; // Assuming AuditLogMessage is a separate component or type

interface Props {
  auditLogMessage: AuditLogMessage; // Use a specific type for the message
}

const AuditLogs: React.FC<Props> = ({ auditLogMessage }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleExpandClick = () => {
    setIsExpanded(!isExpanded);
  };

  const detailsRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!detailsRef.current) return;
    if (isExpanded) {
      detailsRef.current.style.height = 'auto';
    } else {
      detailsRef.current.style.height = `${detailsRef.current.scrollHeight}px`;
    }
  }, [isExpanded]);

  return (
    <div>
      <div role="button" tabIndex={0} onClick={handleExpandClick} ref={detailsRef} aria-expanded={isExpanded.toString()}>
        {auditLogMessage.message}
        {auditLogMessage.details && (
          <span className="expand-indicator">{isExpanded ? '-' : '+'}</span>
        )}
      </div>
      {auditLogMessage.details && (
        <div
          className={`details ${isExpanded ? '' : 'hidden'}`}
          style={{ maxHeight: '200px', overflow: 'hidden', transition: 'max-height 0.3s ease' }}
          aria-hidden={!isExpanded.toString()}
        >
          {auditLogMessage.details}
        </div>
      )}
    </div>
  );
};

export default AuditLogs;

// Add a new AuditLogMessage type with optional details property
type AuditLogMessage = {
  message: string;
  details?: string;
};

This updated code addresses the mentioned concerns and improves the overall quality of the `AuditLogs` component.