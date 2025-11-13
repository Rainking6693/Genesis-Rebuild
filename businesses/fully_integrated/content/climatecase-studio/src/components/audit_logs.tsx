import React, { useState, useEffect, useCallback, useRef } from 'react';

interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  details: string;
}

interface AuditLogsProps {
  title: string;
  fetchInterval?: number; // in milliseconds
}

const AuditLogs: React.FC<AuditLogsProps> = ({ title, fetchInterval = 60000 }) => {
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchAuditLogs = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/audit-logs');
      if (!response.ok) {
        throw new Error(`Failed to fetch audit logs (${response.status})`);
      }
      const data = await response.json();
      setAuditLogs(data);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAuditLogs();

    intervalRef.current = setInterval(fetchAuditLogs, fetchInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchAuditLogs, fetchInterval]);

  return (
    <div className="audit-logs">
      <h2 className="audit-logs__title">{title}</h2>
      {loading && <div className="audit-logs__loading">Loading...</div>}
      {error && (
        <div className="audit-logs__error" role="alert">
          {error}
        </div>
      )}
      {auditLogs.length > 0 ? (
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
      ) : (
        <div className="audit-logs__no-data">No audit logs found.</div>
      )}
    </div>
  );
};

export default AuditLogs;

import React, { useState, useEffect, useCallback, useRef } from 'react';

interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  details: string;
}

interface AuditLogsProps {
  title: string;
  fetchInterval?: number; // in milliseconds
}

const AuditLogs: React.FC<AuditLogsProps> = ({ title, fetchInterval = 60000 }) => {
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchAuditLogs = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/audit-logs');
      if (!response.ok) {
        throw new Error(`Failed to fetch audit logs (${response.status})`);
      }
      const data = await response.json();
      setAuditLogs(data);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAuditLogs();

    intervalRef.current = setInterval(fetchAuditLogs, fetchInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchAuditLogs, fetchInterval]);

  return (
    <div className="audit-logs">
      <h2 className="audit-logs__title">{title}</h2>
      {loading && <div className="audit-logs__loading">Loading...</div>}
      {error && (
        <div className="audit-logs__error" role="alert">
          {error}
        </div>
      )}
      {auditLogs.length > 0 ? (
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
      ) : (
        <div className="audit-logs__no-data">No audit logs found.</div>
      )}
    </div>
  );
};

export default AuditLogs;