import React, { useState } from 'react';
import DOMPurify from 'dompurify';

type AuditLog = {
  id: string;
  html: string;
};

const AuditLogs: React.FC<{ logs: AuditLog[] }> = ({ logs }) => {
  const [sanitize] = useState(() => DOMPurify.sanitize).bind(null, {
    ALLOWED_TAGS: ['pre', 'code', 'strong', 'em', 'a', 'span', 'br'],
    ALLOWED_ATTRS: {
      'a': ['href', 'target', 'rel'],
      '*': ['class'],
    },
  });

  return (
    <div>
      <h2 aria-label="Audit logs">Audit Logs</h2>
      <ul>
        {logs.map((log) => (
          <li key={log.id}>
            <div
              dangerouslySetInnerHTML={{
                __html: sanitize(log.html),
              }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AuditLogs;

import React, { useState } from 'react';
import DOMPurify from 'dompurify';

type AuditLog = {
  id: string;
  html: string;
};

const AuditLogs: React.FC<{ logs: AuditLog[] }> = ({ logs }) => {
  const [sanitize] = useState(() => DOMPurify.sanitize).bind(null, {
    ALLOWED_TAGS: ['pre', 'code', 'strong', 'em', 'a', 'span', 'br'],
    ALLOWED_ATTRS: {
      'a': ['href', 'target', 'rel'],
      '*': ['class'],
    },
  });

  return (
    <div>
      <h2 aria-label="Audit logs">Audit Logs</h2>
      <ul>
        {logs.map((log) => (
          <li key={log.id}>
            <div
              dangerouslySetInnerHTML={{
                __html: sanitize(log.html),
              }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AuditLogs;