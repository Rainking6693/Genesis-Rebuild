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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAuditLogs = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/audit-logs');
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      const data = await response.json();
      setAuditLogs(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAuditLogs();
  }, [fetchAuditLogs]);

  return (
    <div className="audit-logs" aria-label={title}>
      <h1 className="audit-logs__title">{title}</h1>
      {isLoading ? (
        <div className="audit-logs__loading" aria-live="polite">
          Loading...
        </div>
      ) : error ? (
        <div className="audit-logs__error" aria-live="polite">
          {error}
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
      <button
        className="audit-logs__refresh-button"
        onClick={fetchAuditLogs}
        disabled={isLoading}
        aria-label="Refresh Audit Logs"
      >
        Refresh
      </button>
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAuditLogs = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/audit-logs');
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      const data = await response.json();
      setAuditLogs(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAuditLogs();
  }, [fetchAuditLogs]);

  return (
    <div className="audit-logs" aria-label={title}>
      <h1 className="audit-logs__title">{title}</h1>
      {isLoading ? (
        <div className="audit-logs__loading" aria-live="polite">
          Loading...
        </div>
      ) : error ? (
        <div className="audit-logs__error" aria-live="polite">
          {error}
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
      <button
        className="audit-logs__refresh-button"
        onClick={fetchAuditLogs}
        disabled={isLoading}
        aria-label="Refresh Audit Logs"
      >
        Refresh
      </button>
    </div>
  );
};

export default AuditLogs;