import React, { FC, PropsWithChildren, useEffect, useState } from 'react';
import DOMPurify from 'dompurify';

// Import a library for sanitizing HTML to prevent XSS attacks

interface Props extends PropsWithChildren<{ timestamp?: Date }> {
  // Add a timestamp property to log the time of the event
}

const AuditLogComponent: FC<Props> = ({ children, timestamp }) => {
  const [sanitizedChildren, setSanitizedChildren] = useState(children);
  const [sanitizedTimestamp, setSanitizedTimestamp] = useState(timestamp);

  // Sanitize the children and timestamp when they are received
  useEffect(() => {
    setSanitizedChildren(DOMPurify.sanitize(String(children)));
    setSanitizedTimestamp(timestamp ? new Date(timestamp) : new Date());
  }, [children, timestamp]);

  return (
    <div>
      {/* Display the timestamp of the event */}
      <time dateTime={sanitizedTimestamp.toISOString()}>
        {sanitizedTimestamp.toLocaleString()}
      </time>
      {/* Display the sanitized children */}
      {sanitizedChildren}
    </div>
  );
};

// Add a comment explaining the purpose of the component
// and any assumptions made during its development

// Add accessibility by providing a role and aria-label
AuditLogComponent.defaultProps = {
  role: 'log',
  'aria-label': 'Audit log entry',
};

// Export the memoized component
export default memo(AuditLogComponent);

import React, { FC, PropsWithChildren, useEffect, useState } from 'react';
import DOMPurify from 'dompurify';

// Import a library for sanitizing HTML to prevent XSS attacks

interface Props extends PropsWithChildren<{ timestamp?: Date }> {
  // Add a timestamp property to log the time of the event
}

const AuditLogComponent: FC<Props> = ({ children, timestamp }) => {
  const [sanitizedChildren, setSanitizedChildren] = useState(children);
  const [sanitizedTimestamp, setSanitizedTimestamp] = useState(timestamp);

  // Sanitize the children and timestamp when they are received
  useEffect(() => {
    setSanitizedChildren(DOMPurify.sanitize(String(children)));
    setSanitizedTimestamp(timestamp ? new Date(timestamp) : new Date());
  }, [children, timestamp]);

  return (
    <div>
      {/* Display the timestamp of the event */}
      <time dateTime={sanitizedTimestamp.toISOString()}>
        {sanitizedTimestamp.toLocaleString()}
      </time>
      {/* Display the sanitized children */}
      {sanitizedChildren}
    </div>
  );
};

// Add a comment explaining the purpose of the component
// and any assumptions made during its development

// Add accessibility by providing a role and aria-label
AuditLogComponent.defaultProps = {
  role: 'log',
  'aria-label': 'Audit log entry',
};

// Export the memoized component
export default memo(AuditLogComponent);