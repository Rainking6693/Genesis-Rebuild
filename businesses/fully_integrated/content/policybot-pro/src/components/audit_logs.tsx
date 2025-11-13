import React, { DetailedHTMLProps, HTMLAttributes } from 'react';

interface AuditLogProps {
  timestamp: Date;
  action: string;
  user: string;
  policyId?: string | null;
  policyType?: string | null;
  affectedResource?: string | null;
  message?: string;
}

interface AuditLogMessageProps extends AuditLogProps, DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  isExpanded?: boolean;
}

const AuditLogMessage: React.FC<AuditLogMessageProps> = ({ timestamp, action, user, message, policyId, policyType, affectedResource, isExpanded, ...rest }) => {
  const policyDetails = (
    <>
      {policyId && policyType && affectedResource && (
        <div>
          <p>Policy ID: {policyId}</p>
          <p>Policy Type: {policyType}</p>
          <p>Affected Resource: {affectedResource}</p>
        </div>
      )}
    </>
  );

  return (
    <div {...rest}>
      <div>
        <p>Timestamp: {timestamp.toLocaleString()}</p>
        <p>User: {user}</p>
        {policyDetails}
      </div>
      {isExpanded && <div><p>Message: {message}</p></div>}
    </div>
  );
};

AuditLogMessage.defaultProps = {
  isExpanded: false,
};

interface Props {
  auditLogs: AuditLogProps[];
}

const AuditLogs: React.FC<Props> = ({ auditLogs }) => {
  return (
    <div>
      {auditLogs.map((log) => (
        <AuditLogMessage key={log.timestamp.toString()} {...log} />
      ))}
    </div>
  );
};

export default AuditLogs;

import React, { DetailedHTMLProps, HTMLAttributes } from 'react';

interface AuditLogProps {
  timestamp: Date;
  action: string;
  user: string;
  policyId?: string | null;
  policyType?: string | null;
  affectedResource?: string | null;
  message?: string;
}

interface AuditLogMessageProps extends AuditLogProps, DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  isExpanded?: boolean;
}

const AuditLogMessage: React.FC<AuditLogMessageProps> = ({ timestamp, action, user, message, policyId, policyType, affectedResource, isExpanded, ...rest }) => {
  const policyDetails = (
    <>
      {policyId && policyType && affectedResource && (
        <div>
          <p>Policy ID: {policyId}</p>
          <p>Policy Type: {policyType}</p>
          <p>Affected Resource: {affectedResource}</p>
        </div>
      )}
    </>
  );

  return (
    <div {...rest}>
      <div>
        <p>Timestamp: {timestamp.toLocaleString()}</p>
        <p>User: {user}</p>
        {policyDetails}
      </div>
      {isExpanded && <div><p>Message: {message}</p></div>}
    </div>
  );
};

AuditLogMessage.defaultProps = {
  isExpanded: false,
};

interface Props {
  auditLogs: AuditLogProps[];
}

const AuditLogs: React.FC<Props> = ({ auditLogs }) => {
  return (
    <div>
      {auditLogs.map((log) => (
        <AuditLogMessage key={log.timestamp.toString()} {...log} />
      ))}
    </div>
  );
};

export default AuditLogs;