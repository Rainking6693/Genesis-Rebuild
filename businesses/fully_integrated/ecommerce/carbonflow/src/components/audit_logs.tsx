import React, { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  details: string;
}

interface AuditLogsState {
  auditLogs: AuditLogEntry[];
  error: string | null;
  isLoading: boolean;
}

const AuditLogs: React.FC = () => {
  const [state, setState] = useState<AuditLogsState>({
    auditLogs: [],
    error: null,
    isLoading: false,
  });

  const fetchAuditLogs = useCallback(async () => {
    try {
      setState((prevState) => ({ ...prevState, isLoading: true, error: null }));
      const response: AxiosResponse<AuditLogEntry[]> = await axios.get('/api/audit-logs');
      setState((prevState) => ({ ...prevState, auditLogs: response.data, isLoading: false }));
    } catch (err) {
      const axiosError = err as AxiosError;
      setState((prevState) => ({
        ...prevState,
        error:
          axiosError.response?.data?.message || 'An error occurred while fetching audit logs.',
        isLoading: false,
      }));
    }
  }, []);

  useEffect(() => {
    fetchAuditLogs();
  }, [fetchAuditLogs]);

  return (
    <div>
      <h1>Audit Logs</h1>
      {state.error && (
        <div role="alert" aria-live="assertive" className="error-message">
          {state.error}
        </div>
      )}
      {state.isLoading ? (
        <div className="loading-spinner">Loading...</div>
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
            {state.auditLogs.map((log) => (
              <tr key={log.id}>
                <td>{log.timestamp}</td>
                <td>{log.action}</td>
                <td>{log.user}</td>
                <td>{log.details}</td>
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
import axios, { AxiosError, AxiosResponse } from 'axios';

interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  details: string;
}

interface AuditLogsState {
  auditLogs: AuditLogEntry[];
  error: string | null;
  isLoading: boolean;
}

const AuditLogs: React.FC = () => {
  const [state, setState] = useState<AuditLogsState>({
    auditLogs: [],
    error: null,
    isLoading: false,
  });

  const fetchAuditLogs = useCallback(async () => {
    try {
      setState((prevState) => ({ ...prevState, isLoading: true, error: null }));
      const response: AxiosResponse<AuditLogEntry[]> = await axios.get('/api/audit-logs');
      setState((prevState) => ({ ...prevState, auditLogs: response.data, isLoading: false }));
    } catch (err) {
      const axiosError = err as AxiosError;
      setState((prevState) => ({
        ...prevState,
        error:
          axiosError.response?.data?.message || 'An error occurred while fetching audit logs.',
        isLoading: false,
      }));
    }
  }, []);

  useEffect(() => {
    fetchAuditLogs();
  }, [fetchAuditLogs]);

  return (
    <div>
      <h1>Audit Logs</h1>
      {state.error && (
        <div role="alert" aria-live="assertive" className="error-message">
          {state.error}
        </div>
      )}
      {state.isLoading ? (
        <div className="loading-spinner">Loading...</div>
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
            {state.auditLogs.map((log) => (
              <tr key={log.id}>
                <td>{log.timestamp}</td>
                <td>{log.action}</td>
                <td>{log.user}</td>
                <td>{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AuditLogs;