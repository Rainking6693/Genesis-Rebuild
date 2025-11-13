import React, { useState, useEffect } from 'react';

interface Props {
  message: string;
  timestamp?: string; // Add optional timestamp for audit logs
}

const AuditLogComponent: React.FC<Props> = ({ message, timestamp }) => {
  const [localTimestamp, setLocalTimestamp] = useState(new Date().toISOString());

  // Check if the provided timestamp is valid and use it if so
  const formattedTimestamp = timestamp ? new Date(timestamp).toISOString() : localTimestamp;

  // Update local timestamp every minute to ensure it's up-to-date
  useEffect(() => {
    const updateLocalTimestamp = () => {
      setLocalTimestamp(new Date().toISOString());
    };

    const interval = setInterval(updateLocalTimestamp, 60000);
    return () => clearInterval(interval);
  }, []);

  // Validate the format of the timestamp before using it
  const validTimestamp = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(\.\d{3})?Z$/.test(formattedTimestamp);

  // If the timestamp is invalid, use the local timestamp instead
  const finalFormattedTimestamp = validTimestamp ? formattedTimestamp : localTimestamp;

  return (
    <div className="audit-log" aria-label="Audit log entry">
      <time dateTime={finalFormattedTimestamp}>{finalFormattedTimestamp}</time>
      <span className="message">{message}</span>
    </div>
  );
};

export default AuditLogComponent;

import React, { useState, useEffect } from 'react';

interface Props {
  message: string;
  timestamp?: string; // Add optional timestamp for audit logs
}

const AuditLogComponent: React.FC<Props> = ({ message, timestamp }) => {
  const [localTimestamp, setLocalTimestamp] = useState(new Date().toISOString());

  // Check if the provided timestamp is valid and use it if so
  const formattedTimestamp = timestamp ? new Date(timestamp).toISOString() : localTimestamp;

  // Update local timestamp every minute to ensure it's up-to-date
  useEffect(() => {
    const updateLocalTimestamp = () => {
      setLocalTimestamp(new Date().toISOString());
    };

    const interval = setInterval(updateLocalTimestamp, 60000);
    return () => clearInterval(interval);
  }, []);

  // Validate the format of the timestamp before using it
  const validTimestamp = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(\.\d{3})?Z$/.test(formattedTimestamp);

  // If the timestamp is invalid, use the local timestamp instead
  const finalFormattedTimestamp = validTimestamp ? formattedTimestamp : localTimestamp;

  return (
    <div className="audit-log" aria-label="Audit log entry">
      <time dateTime={finalFormattedTimestamp}>{finalFormattedTimestamp}</time>
      <span className="message">{message}</span>
    </div>
  );
};

export default AuditLogComponent;