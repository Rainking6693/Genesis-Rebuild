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
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchAuditLogs = useCallback(async () => {
    try {
      setState((prevState) => ({ ...prevState, isLoading: true, error: null }));
      abortControllerRef.current = new AbortController();
      const { signal } = abortControllerRef.current;
      const response: AxiosResponse<AuditLogEntry[]> = await axios.get<AuditLogEntry[]>(
        '/api/audit-logs',
        { signal }
      );
      setState((prevState) => ({ ...prevState, auditLogs: response.data }));
    } catch (err) {
      const axiosError = err as AxiosError;
      if (axiosError.response?.data?.message) {
        setState((prevState) => ({
          ...prevState,
          error: axiosError.response.data.message,
        }));
      } else if (axiosError.message) {
        setState((prevState) => ({
          ...prevState,
          error: axiosError.message,
        }));
      } else {
        setState((prevState) => ({
          ...prevState,
          error: 'An error occurred while fetching audit logs.',
        }));
      }
    } finally {
      setState((prevState) => ({ ...prevState, isLoading: false }));
    }
  }, []);

  useEffect(() => {
    fetchAuditLogs();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchAuditLogs]);

  return (
    <div>
      <h1>Audit Logs</h1>
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
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchAuditLogs = useCallback(async () => {
    try {
      setState((prevState) => ({ ...prevState, isLoading: true, error: null }));
      abortControllerRef.current = new AbortController();
      const { signal } = abortControllerRef.current;
      const response: AxiosResponse<AuditLogEntry[]> = await axios.get<AuditLogEntry[]>(
        '/api/audit-logs',
        { signal }
      );
      setState((prevState) => ({ ...prevState, auditLogs: response.data }));
    } catch (err) {
      const axiosError = err as AxiosError;
      if (axiosError.response?.data?.message) {
        setState((prevState) => ({
          ...prevState,
          error: axiosError.response.data.message,
        }));
      } else if (axiosError.message) {
        setState((prevState) => ({
          ...prevState,
          error: axiosError.message,
        }));
      } else {
        setState((prevState) => ({
          ...prevState,
          error: 'An error occurred while fetching audit logs.',
        }));
      }
    } finally {
      setState((prevState) => ({ ...prevState, isLoading: false }));
    }
  }, []);

  useEffect(() => {
    fetchAuditLogs();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchAuditLogs]);

  return (
    <div>
      <h1>Audit Logs</h1>
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