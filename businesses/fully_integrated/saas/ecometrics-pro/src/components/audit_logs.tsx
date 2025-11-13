import React, { useCallback, useMemo, useState } from 'react';
import DOMPurify from 'dompurify';

interface AuditLogProps {
  logMessage: string;
}

const AuditLog: React.FC<AuditLogProps> = ({ logMessage }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState(logMessage);

  const sanitizeMessage = useCallback((message: string) => {
    // Sanitize user-provided data here using DOMPurify library
    return DOMPurify.sanitize(message);
  }, []);

  const handleLogMessageChange = useCallback((newLogMessage: string) => {
    setSanitizedMessage(sanitizeMessage(newLogMessage));
  }, [sanitizeMessage]);

  useMemo(() => {
    setSanitizedMessage(sanitizeMessage(logMessage));
  }, [logMessage, sanitizeMessage]);

  return (
    <div>
      {/* Add a role attribute for screen readers */}
      <div role="log" aria-label="Audit log message">
        {sanitizedMessage}
      </div>
      {/* Add an editable input field for debugging purposes */}
      <input
        type="text"
        value={sanitizedMessage}
        onChange={(e) => handleLogMessageChange(e.target.value)}
        style={{ display: process.env.NODE_ENV === 'development' ? 'block' : 'none' }}
      />
      {/* Add a hidden input field for storing the original, unfiltered log message */}
      <input
        type="hidden"
        value={logMessage}
      />
    </div>
  );
};

export default AuditLog;

import React, { useCallback, useMemo, useState } from 'react';
import DOMPurify from 'dompurify';

interface AuditLogProps {
  logMessage: string;
}

const AuditLog: React.FC<AuditLogProps> = ({ logMessage }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState(logMessage);

  const sanitizeMessage = useCallback((message: string) => {
    // Sanitize user-provided data here using DOMPurify library
    return DOMPurify.sanitize(message);
  }, []);

  const handleLogMessageChange = useCallback((newLogMessage: string) => {
    setSanitizedMessage(sanitizeMessage(newLogMessage));
  }, [sanitizeMessage]);

  useMemo(() => {
    setSanitizedMessage(sanitizeMessage(logMessage));
  }, [logMessage, sanitizeMessage]);

  return (
    <div>
      {/* Add a role attribute for screen readers */}
      <div role="log" aria-label="Audit log message">
        {sanitizedMessage}
      </div>
      {/* Add an editable input field for debugging purposes */}
      <input
        type="text"
        value={sanitizedMessage}
        onChange={(e) => handleLogMessageChange(e.target.value)}
        style={{ display: process.env.NODE_ENV === 'development' ? 'block' : 'none' }}
      />
      {/* Add a hidden input field for storing the original, unfiltered log message */}
      <input
        type="hidden"
        value={logMessage}
      />
    </div>
  );
};

export default AuditLog;