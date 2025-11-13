import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { format, fromUnixTime } from 'date-fns';
import { enUS } from 'date-fns/locale';

// Define more specific types for audit log entries
interface AuditLogEntry {
  id: string;
  timestamp: number; // Unix timestamp
  user: string;
  action: string;
  resource: string;
  details?: Record<string, any>;
  status: 'success' | 'failure' | 'pending';
}

interface AuditLogsProps {
  /** Title of the audit logs section.  Defaults to "Audit Logs" */
  title?: string;
  /**  Function to fetch audit logs.  Must handle pagination. */
  fetchAuditLogs: (page: number, pageSize: number) => Promise<{ logs: AuditLogEntry[]; totalCount: number }>;
  /** Number of logs to display per page. Defaults to 20. */
  pageSize?: number;
  /** Optional component to render when there are no logs. */
  emptyStateComponent?: React.ReactNode;
  /** Optional component to render an individual log entry.  Overrides default rendering. */
  renderLogEntry?: (log: AuditLogEntry) => React.ReactNode;
  /** Optional error boundary component.  Wraps the entire component. */
  ErrorBoundary?: React.ComponentType<{ children: React.ReactNode }>;
}

const AuditLogs: React.FC<AuditLogsProps> = ({
  title = 'Audit Logs',
  fetchAuditLogs,
  pageSize = 20,
  emptyStateComponent = <p>No audit logs found.</p>,
  renderLogEntry,
  ErrorBoundary = React.Fragment, // Default to no error boundary
}) => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);

  // Memoize the formatted title for performance
  const formattedTitle = useMemo(() => title, [title]);

  // Use useCallback to memoize the fetch function, preventing unnecessary re-renders
  const loadAuditLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { logs: fetchedLogs, totalCount: fetchedTotalCount } = await fetchAuditLogs(page, pageSize);
      setLogs(fetchedLogs);
      setTotalCount(fetchedTotalCount);
    } catch (err: any) {
      console.error('Error fetching audit logs:', err);
      setError(err instanceof Error ? err : new Error(String(err))); // Ensure error is an Error object
      setLogs([]); // Clear logs on error
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [fetchAuditLogs, page, pageSize]);

  useEffect(() => {
    loadAuditLogs();
  }, [loadAuditLogs]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= Math.ceil(totalCount / pageSize)) {
      setPage(newPage);
    }
  };

  const renderDefaultLogEntry = (log: AuditLogEntry) => (
    <li key={log.id} aria-label={`Audit log entry for ${log.user} on ${format(fromUnixTime(log.timestamp), 'PPPppp', { locale: enUS })}`}>
      <p>
        <strong>User:</strong> {log.user}
      </p>
      <p>
        <strong>Action:</strong> {log.action}
      </p>
      <p>
        <strong>Resource:</strong> {log.resource}
      </p>
      <p>
        <strong>Timestamp:</strong> {format(fromUnixTime(log.timestamp), 'PPPppp', { locale: enUS })}
      </p>
      {log.details && (
        <details>
          <summary>Details</summary>
          <pre>{JSON.stringify(log.details, null, 2)}</pre>
        </details>
      )}
      <p>
        <strong>Status:</strong> {log.status}
      </p>
    </li>
  );

  return (
    <ErrorBoundary>
      <div>
        <h1>{formattedTitle}</h1>

        {loading && <p>Loading audit logs...</p>}

        {error && (
          <div role="alert">
            <p>Error: {error.message}</p>
          </div>
        )}

        {!loading && !error && logs.length === 0 && emptyStateComponent}

        {!loading && !error && logs.length > 0 && (
          <>
            <ul aria-live="polite">
              {logs.map((log) => (renderLogEntry ? renderLogEntry(log) : renderDefaultLogEntry(log)))}
            </ul>

            <div role="navigation" aria-label="Pagination">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                aria-label="Previous Page"
              >
                Previous
              </button>
              <span>
                Page {page} of {Math.ceil(totalCount / pageSize)}
              </span>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === Math.ceil(totalCount / pageSize)}
                aria-label="Next Page"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default AuditLogs;

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { format, fromUnixTime } from 'date-fns';
import { enUS } from 'date-fns/locale';

// Define more specific types for audit log entries
interface AuditLogEntry {
  id: string;
  timestamp: number; // Unix timestamp
  user: string;
  action: string;
  resource: string;
  details?: Record<string, any>;
  status: 'success' | 'failure' | 'pending';
}

interface AuditLogsProps {
  /** Title of the audit logs section.  Defaults to "Audit Logs" */
  title?: string;
  /**  Function to fetch audit logs.  Must handle pagination. */
  fetchAuditLogs: (page: number, pageSize: number) => Promise<{ logs: AuditLogEntry[]; totalCount: number }>;
  /** Number of logs to display per page. Defaults to 20. */
  pageSize?: number;
  /** Optional component to render when there are no logs. */
  emptyStateComponent?: React.ReactNode;
  /** Optional component to render an individual log entry.  Overrides default rendering. */
  renderLogEntry?: (log: AuditLogEntry) => React.ReactNode;
  /** Optional error boundary component.  Wraps the entire component. */
  ErrorBoundary?: React.ComponentType<{ children: React.ReactNode }>;
}

const AuditLogs: React.FC<AuditLogsProps> = ({
  title = 'Audit Logs',
  fetchAuditLogs,
  pageSize = 20,
  emptyStateComponent = <p>No audit logs found.</p>,
  renderLogEntry,
  ErrorBoundary = React.Fragment, // Default to no error boundary
}) => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);

  // Memoize the formatted title for performance
  const formattedTitle = useMemo(() => title, [title]);

  // Use useCallback to memoize the fetch function, preventing unnecessary re-renders
  const loadAuditLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { logs: fetchedLogs, totalCount: fetchedTotalCount } = await fetchAuditLogs(page, pageSize);
      setLogs(fetchedLogs);
      setTotalCount(fetchedTotalCount);
    } catch (err: any) {
      console.error('Error fetching audit logs:', err);
      setError(err instanceof Error ? err : new Error(String(err))); // Ensure error is an Error object
      setLogs([]); // Clear logs on error
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [fetchAuditLogs, page, pageSize]);

  useEffect(() => {
    loadAuditLogs();
  }, [loadAuditLogs]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= Math.ceil(totalCount / pageSize)) {
      setPage(newPage);
    }
  };

  const renderDefaultLogEntry = (log: AuditLogEntry) => (
    <li key={log.id} aria-label={`Audit log entry for ${log.user} on ${format(fromUnixTime(log.timestamp), 'PPPppp', { locale: enUS })}`}>
      <p>
        <strong>User:</strong> {log.user}
      </p>
      <p>
        <strong>Action:</strong> {log.action}
      </p>
      <p>
        <strong>Resource:</strong> {log.resource}
      </p>
      <p>
        <strong>Timestamp:</strong> {format(fromUnixTime(log.timestamp), 'PPPppp', { locale: enUS })}
      </p>
      {log.details && (
        <details>
          <summary>Details</summary>
          <pre>{JSON.stringify(log.details, null, 2)}</pre>
        </details>
      )}
      <p>
        <strong>Status:</strong> {log.status}
      </p>
    </li>
  );

  return (
    <ErrorBoundary>
      <div>
        <h1>{formattedTitle}</h1>

        {loading && <p>Loading audit logs...</p>}

        {error && (
          <div role="alert">
            <p>Error: {error.message}</p>
          </div>
        )}

        {!loading && !error && logs.length === 0 && emptyStateComponent}

        {!loading && !error && logs.length > 0 && (
          <>
            <ul aria-live="polite">
              {logs.map((log) => (renderLogEntry ? renderLogEntry(log) : renderDefaultLogEntry(log)))}
            </ul>

            <div role="navigation" aria-label="Pagination">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                aria-label="Previous Page"
              >
                Previous
              </button>
              <span>
                Page {page} of {Math.ceil(totalCount / pageSize)}
              </span>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === Math.ceil(totalCount / pageSize)}
                aria-label="Next Page"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default AuditLogs;