import React, { ReactNode, useState } from 'react';

interface AuditLogProps {
  timestamp?: Date;
  action?: string;
  user?: string;
  message?: string;
  timestampFormat?: string;
  actionColor?: string;
  userColor?: string;
  onMessageClick?: (message: string) => void;
}

const defaultTimestampFormat = 'yyyy-MM-dd HH:mm:ss';
const defaultActionColor = 'blue';
const defaultUserColor = 'green';

const AuditLog: React.FC<AuditLogProps> = ({
  timestamp = new Date(),
  action = '',
  user = '',
  message = '',
  timestampFormat = defaultTimestampFormat,
  actionColor = defaultActionColor,
  userColor = defaultUserColor,
  onMessageClick,
}) => {
  const [isMessageExpanded, setIsMessageExpanded] = useState(false);

  const formattedTimestamp = timestamp ? timestamp.toLocaleString(undefined, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '';

  const handleMessageClick = () => {
    if (onMessageClick) {
      onMessageClick(message);
    }
    setIsMessageExpanded(!isMessageExpanded);
  };

  return (
    <div>
      <p style={{ color: userColor }}>User: {user}</p>
      <p style={{ color: actionColor }}>Action: {action}</p>
      <p style={{ color: 'black' }}>Timestamp: {formattedTimestamp || 'N/A'}</p>
      <p
        style={{ whiteSpace: 'pre-wrap', cursor: 'pointer' }}
        onClick={handleMessageClick}
      >
        Message: {message || 'N/A'}
      </p>
      {isMessageExpanded && (
        <p style={{ whiteSpace: 'pre-wrap' }}>{message || 'N/A'}</p>
      )}
    </div>
  );
};

export default AuditLog;

import React, { ReactNode, useState } from 'react';

interface AuditLogProps {
  timestamp?: Date;
  action?: string;
  user?: string;
  message?: string;
  timestampFormat?: string;
  actionColor?: string;
  userColor?: string;
  onMessageClick?: (message: string) => void;
}

const defaultTimestampFormat = 'yyyy-MM-dd HH:mm:ss';
const defaultActionColor = 'blue';
const defaultUserColor = 'green';

const AuditLog: React.FC<AuditLogProps> = ({
  timestamp = new Date(),
  action = '',
  user = '',
  message = '',
  timestampFormat = defaultTimestampFormat,
  actionColor = defaultActionColor,
  userColor = defaultUserColor,
  onMessageClick,
}) => {
  const [isMessageExpanded, setIsMessageExpanded] = useState(false);

  const formattedTimestamp = timestamp ? timestamp.toLocaleString(undefined, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '';

  const handleMessageClick = () => {
    if (onMessageClick) {
      onMessageClick(message);
    }
    setIsMessageExpanded(!isMessageExpanded);
  };

  return (
    <div>
      <p style={{ color: userColor }}>User: {user}</p>
      <p style={{ color: actionColor }}>Action: {action}</p>
      <p style={{ color: 'black' }}>Timestamp: {formattedTimestamp || 'N/A'}</p>
      <p
        style={{ whiteSpace: 'pre-wrap', cursor: 'pointer' }}
        onClick={handleMessageClick}
      >
        Message: {message || 'N/A'}
      </p>
      {isMessageExpanded && (
        <p style={{ whiteSpace: 'pre-wrap' }}>{message || 'N/A'}</p>
      )}
    </div>
  );
};

export default AuditLog;