import React, { useState } from 'react';
import { AuditLogMessage, AuditLogMessageLevel } from './AuditLogMessage';

type AuditLogProps = {
  auditLogMessage: AuditLogMessage;
};

const AuditLog: React.FC<AuditLogProps> = ({ auditLogMessage }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleExpandClick = () => {
    setIsExpanded(!isExpanded);
  };

  const getSvgIcon = () =>
    isExpanded ? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="feather feather-chevron-up"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    ) : (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="feather feather-chevron-down"
      >
        <polyline points="6 15 12 9 18 15" />
      </svg>
    );

  return (
    <div className="audit-log" role="listitem">
      <div className="audit-log-header" onClick={handleExpandClick} tabIndex={0}>
        <AuditLogMessageLevel>{auditLogMessage.level}</AuditLogMessageLevel>
        <time dateTime={auditLogMessage.timestamp}>{auditLogMessage.timestamp}</time>
        <p>{auditLogMessage.message}</p>
        {getSvgIcon()}
      </div>
      {isExpanded && (
        <div className="audit-log-details" role="list">
          <pre>{JSON.stringify(auditLogMessage, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default AuditLog;

import React, { useState } from 'react';
import { AuditLogMessage, AuditLogMessageLevel } from './AuditLogMessage';

type AuditLogProps = {
  auditLogMessage: AuditLogMessage;
};

const AuditLog: React.FC<AuditLogProps> = ({ auditLogMessage }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleExpandClick = () => {
    setIsExpanded(!isExpanded);
  };

  const getSvgIcon = () =>
    isExpanded ? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="feather feather-chevron-up"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    ) : (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="feather feather-chevron-down"
      >
        <polyline points="6 15 12 9 18 15" />
      </svg>
    );

  return (
    <div className="audit-log" role="listitem">
      <div className="audit-log-header" onClick={handleExpandClick} tabIndex={0}>
        <AuditLogMessageLevel>{auditLogMessage.level}</AuditLogMessageLevel>
        <time dateTime={auditLogMessage.timestamp}>{auditLogMessage.timestamp}</time>
        <p>{auditLogMessage.message}</p>
        {getSvgIcon()}
      </div>
      {isExpanded && (
        <div className="audit-log-details" role="list">
          <pre>{JSON.stringify(auditLogMessage, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default AuditLog;