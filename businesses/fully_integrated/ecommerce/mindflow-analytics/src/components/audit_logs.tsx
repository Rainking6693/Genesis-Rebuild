import React, { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  details: string;
}

const AuditLogs: React.FC = () => {
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAuditLogs = useCallback(async () => {
    try {
      setIsLoading(true);
      const response: AxiosResponse<AuditLogEntry[]> = await axios.get<AuditLogEntry[]>('/api/audit-logs');
      setAuditLogs(response.data);
      setError(null);
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(`Error fetching audit logs: ${axiosError.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    fetchAuditLogs().catch((err) => {
      if (err.name !== 'AbortError') {
        console.error('Error fetching audit logs:', err);
      }
    });

    return () => {
      abortController.abort();
    };
  }, [fetchAuditLogs]);

  return (
    <div>
      <h1>Audit Logs</h1>
      {error && (
        <div role="alert" aria-live="assertive" className="error-message">
          {error}
        </div>
      )}
      {isLoading ? (
        <div className="loading-spinner" aria-live="polite">
          Loading...
        </div>
      ) : (
        <table aria-label="Audit Logs" className="audit-logs-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Action</th>
              <th>User</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {auditLogs.length === 0 ? (
              <tr>
                <td colSpan={4} className="no-data">
                  No audit logs available.
                </td>
              </tr>
            ) : (
              auditLogs.map((log) => (
                <tr key={log.id}>
                  <td>{log.timestamp}</td>
                  <td>{log.action}</td>
                  <td>{log.user}</td>
                  <td>{log.details}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AuditLogs;

import React, { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  details: string;
}

const AuditLogs: React.FC = () => {
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAuditLogs = useCallback(async () => {
    try {
      setIsLoading(true);
      const response: AxiosResponse<AuditLogEntry[]> = await axios.get<AuditLogEntry[]>('/api/audit-logs');
      setAuditLogs(response.data);
      setError(null);
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(`Error fetching audit logs: ${axiosError.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    fetchAuditLogs().catch((err) => {
      if (err.name !== 'AbortError') {
        console.error('Error fetching audit logs:', err);
      }
    });

    return () => {
      abortController.abort();
    };
  }, [fetchAuditLogs]);

  return (
    <div>
      <h1>Audit Logs</h1>
      {error && (
        <div role="alert" aria-live="assertive" className="error-message">
          {error}
        </div>
      )}
      {isLoading ? (
        <div className="loading-spinner" aria-live="polite">
          Loading...
        </div>
      ) : (
        <table aria-label="Audit Logs" className="audit-logs-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Action</th>
              <th>User</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {auditLogs.length === 0 ? (
              <tr>
                <td colSpan={4} className="no-data">
                  No audit logs available.
                </td>
              </tr>
            ) : (
              auditLogs.map((log) => (
                <tr key={log.id}>
                  <td>{log.timestamp}</td>
                  <td>{log.action}</td>
                  <td>{log.user}</td>
                  <td>{log.details}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AuditLogs;