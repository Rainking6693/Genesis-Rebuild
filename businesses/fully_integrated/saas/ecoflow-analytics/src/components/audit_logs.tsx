import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchAuditLogs = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Create a new AbortController instance to cancel the request if needed
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      const response: AxiosResponse<AuditLogEntry[]> = await axios.get<AuditLogEntry[]>('/api/audit-logs', {
        signal: abortController.signal,
      });
      setAuditLogs(response.data);
    } catch (err) {
      if (axios.isCancel(err)) {
        // Request was cancelled, do nothing
        return;
      }

      const axiosError = err as AxiosError;
      setError(
        axiosError.response?.data?.message ||
          axiosError.message ||
          'An error occurred while fetching audit logs.'
      );
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, []);

  useEffect(() => {
    fetchAuditLogs();

    // Clean up the AbortController when the component is unmounted
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
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
                <td colSpan={4} className="no-data-message">
                  No audit logs found.
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

import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchAuditLogs = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Create a new AbortController instance to cancel the request if needed
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      const response: AxiosResponse<AuditLogEntry[]> = await axios.get<AuditLogEntry[]>('/api/audit-logs', {
        signal: abortController.signal,
      });
      setAuditLogs(response.data);
    } catch (err) {
      if (axios.isCancel(err)) {
        // Request was cancelled, do nothing
        return;
      }

      const axiosError = err as AxiosError;
      setError(
        axiosError.response?.data?.message ||
          axiosError.message ||
          'An error occurred while fetching audit logs.'
      );
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, []);

  useEffect(() => {
    fetchAuditLogs();

    // Clean up the AbortController when the component is unmounted
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
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
                <td colSpan={4} className="no-data-message">
                  No audit logs found.
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