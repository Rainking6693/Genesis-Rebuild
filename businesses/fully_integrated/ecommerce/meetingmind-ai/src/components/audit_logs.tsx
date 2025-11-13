import React, { useState, useEffect, useCallback } from 'react';

interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  details: string;
}

interface AuditLogsProps {
  title: string;
}

const AuditLogs: React.FC<AuditLogsProps> = ({ title }) => {
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAuditLogs = useCallback(async () => {
    try {
      const response = await fetch('/api/audit-logs');
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      const data = await response.json();
      setAuditLogs(data);
    } catch (err) {
      setError('Failed to fetch audit logs');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAuditLogs();
  }, [fetchAuditLogs]);

  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    fetchAuditLogs();
  };

  return (
    <div className="audit-logs">
      <h1 className="audit-logs__title">{title}</h1>
      {isLoading ? (
        <div className="audit-logs__loading">Loading...</div>
      ) : error ? (
        <div className="audit-logs__error">
          <p>{error}</p>
          <button onClick={handleRetry}>Retry</button>
        </div>
      ) : (
        <table className="audit-logs__table" aria-label="Audit Logs">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Action</th>
              <th>User</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {auditLogs.map((entry) => (
              <tr key={entry.id}>
                <td>{entry.timestamp}</td>
                <td>{entry.action}</td>
                <td>{entry.user}</td>
                <td>{entry.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AuditLogs;

import React, { useState, useEffect, useCallback } from 'react';

interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  details: string;
}

interface AuditLogsProps {
  title: string;
}

const AuditLogs: React.FC<AuditLogsProps> = ({ title }) => {
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAuditLogs = useCallback(async () => {
    try {
      const response = await fetch('/api/audit-logs');
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      const data = await response.json();
      setAuditLogs(data);
    } catch (err) {
      setError('Failed to fetch audit logs');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAuditLogs();
  }, [fetchAuditLogs]);

  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    fetchAuditLogs();
  };

  return (
    <div className="audit-logs">
      <h1 className="audit-logs__title">{title}</h1>
      {isLoading ? (
        <div className="audit-logs__loading">Loading...</div>
      ) : error ? (
        <div className="audit-logs__error">
          <p>{error}</p>
          <button onClick={handleRetry}>Retry</button>
        </div>
      ) : (
        <table className="audit-logs__table" aria-label="Audit Logs">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Action</th>
              <th>User</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {auditLogs.map((entry) => (
              <tr key={entry.id}>
                <td>{entry.timestamp}</td>
                <td>{entry.action}</td>
                <td>{entry.user}</td>
                <td>{entry.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AuditLogs;