import React, { useState, useEffect } from 'react';

interface AuditLogProps {
  message: string;
  timestamp?: string; // Optional property for timestamp
  isError?: boolean; // Optional property to indicate if the log is an error
  isInfo?: boolean; // Optional property to indicate if the log is an info message
}

const AuditLog: React.FC<AuditLogProps> = ({ message, timestamp, isError = false, isInfo = false }) => {
  const [formattedTimestamp, setFormattedTimestamp] = useState(timestamp || getFormattedTimestamp());

  useEffect(() => {
    if (timestamp) {
      setFormattedTimestamp(timestamp);
    } else {
      setFormattedTimestamp(getFormattedTimestamp());
    }
  }, [timestamp]);

  const formattedMessage = isError
    ? `Error: ${message}`
    : isInfo
      ? `Info: ${message}`
      : `[${formattedTimestamp}] ${message}`;

  const className = `audit-log ${isError ? 'error' : isInfo ? 'info' : ''}`;

  return (
    <div className={className}>
      {formattedMessage}
    </div>
  );

  function getFormattedTimestamp(): string {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    };

    return new Intl.DateTimeFormat('en-US', options).format(date);
  }
};

export default AuditLog;

1. Added an `isInfo` optional property to differentiate between error, info, and regular logs.
2. Moved the timestamp formatting logic into a separate function `getFormattedTimestamp()` for better maintainability and reusability.
3. Used the `Intl.DateTimeFormat` API to format the timestamp, making it more accessible to users who speak different languages.
4. Added a `useEffect` hook to update the formatted timestamp when the `timestamp` prop changes.
5. Added CSS classes for error and info logs to make it easier to style them separately.