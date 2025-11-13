import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  const isMounted = useRef(true);

  const fetchAuditLogs = useCallback(async () => {
    try {
      setState((prevState) => ({ ...prevState, isLoading: true, error: null }));
      const response: AxiosResponse<AuditLogEntry[]> = await axios.get('/api/audit-logs');
      if (isMounted.current) {
        setState({ auditLogs: response.data, error: null, isLoading: false });
      }
    } catch (err) {
      const axiosError = err as AxiosError;
      if (isMounted.current) {
        setState({
          auditLogs: [],
          error:
            axiosError.response?.data?.message ||
            axiosError.message ||
            'An error occurred while fetching audit logs.',
          isLoading: false,
        });
      }
    }
  }, []);

  useEffect(() => {
    fetchAuditLogs();

    return () => {
      isMounted.current = false;
    };
  }, [fetchAuditLogs]);

  return (
    <div>
      <h2>Audit Logs</h2>
      {state.isLoading ? (
        <div role="status" aria-live="polite">
          Loading audit logs...
        </div>
      ) : state.error ? (
        <div role="alert" aria-live="assertive">
          {state.error}
        </div>
      ) : (
        <table aria-label="Audit Logs">
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

import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  const isMounted = useRef(true);

  const fetchAuditLogs = useCallback(async () => {
    try {
      setState((prevState) => ({ ...prevState, isLoading: true, error: null }));
      const response: AxiosResponse<AuditLogEntry[]> = await axios.get('/api/audit-logs');
      if (isMounted.current) {
        setState({ auditLogs: response.data, error: null, isLoading: false });
      }
    } catch (err) {
      const axiosError = err as AxiosError;
      if (isMounted.current) {
        setState({
          auditLogs: [],
          error:
            axiosError.response?.data?.message ||
            axiosError.message ||
            'An error occurred while fetching audit logs.',
          isLoading: false,
        });
      }
    }
  }, []);

  useEffect(() => {
    fetchAuditLogs();

    return () => {
      isMounted.current = false;
    };
  }, [fetchAuditLogs]);

  return (
    <div>
      <h2>Audit Logs</h2>
      {state.isLoading ? (
        <div role="status" aria-live="polite">
          Loading audit logs...
        </div>
      ) : state.error ? (
        <div role="alert" aria-live="assertive">
          {state.error}
        </div>
      ) : (
        <table aria-label="Audit Logs">
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