import React, { useState } from 'react';

interface Props {
  message: string;
  timestamp?: string; // Add optional timestamp for audit logs
  user?: string; // Add optional user for audit logs
  onUserChange?: (user: string) => void; // Add callback for user change
}

const AuditLog: React.FC<Props> = ({ message, timestamp = new Date().toISOString(), user, onUserChange }) => {
  const [localUser, setLocalUser] = useState<string>(user || '');

  const handleUserChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalUser(event.target.value);
    if (onUserChange) {
      onUserChange(event.target.value);
    }
  };

  return (
    <div>
      <input type="text" value={localUser} onChange={handleUserChange} placeholder="User" />
      <div>{`[${timestamp}][${localUser}] ${message}`}</div>
    </div>
  );
};

export default AuditLog;

import React, { useState } from 'react';

interface Props {
  message: string;
  timestamp?: string; // Add optional timestamp for audit logs
  user?: string; // Add optional user for audit logs
  onUserChange?: (user: string) => void; // Add callback for user change
}

const AuditLog: React.FC<Props> = ({ message, timestamp = new Date().toISOString(), user, onUserChange }) => {
  const [localUser, setLocalUser] = useState<string>(user || '');

  const handleUserChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalUser(event.target.value);
    if (onUserChange) {
      onUserChange(event.target.value);
    }
  };

  return (
    <div>
      <input type="text" value={localUser} onChange={handleUserChange} placeholder="User" />
      <div>{`[${timestamp}][${localUser}] ${message}`}</div>
    </div>
  );
};

export default AuditLog;