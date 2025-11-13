import React, { useState, useEffect, useCallback, useRef } from 'react';
import { format, isValid, parseISO } from 'date-fns';

interface AuditLogEntry {
  id: string;
  timestamp: Date | string | number; // Allow different timestamp formats
  action: string;
  user: string;
  details: string;
}

interface AuditLogsProps {
  title: string;
  logs: AuditLogEntry[];
  dateFormat?: string; // Allow customization of date format
  emptyMessage?: string; // Message to display when no logs are found
  errorMessage?: string; // Message to display when there's an error
}

const defaultDateFormat = 'yyyy-MM-dd HH:mm:ss';
const defaultEmptyMessage = 'No audit logs found.';
const defaultErrorMessage = 'Error loading audit logs.';

const AuditLogs: React.FC<AuditLogsProps> = ({
  title,
  logs,
  dateFormat = defaultDateFormat,
  emptyMessage = defaultEmptyMessage,
  errorMessage = defaultErrorMessage,
}) => {
  const [filteredLogs, setFilteredLogs] = useState<AuditLogEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState<string | null>(null); // Add error state
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Use useCallback to memoize the filter function
  const filterLogs = useCallback(
    (logsToFilter: AuditLogEntry[], term: string) => {
      const lowerCaseTerm = term.toLowerCase();
      return logsToFilter.filter((log) => {
        try {
          return (
            log.action.toLowerCase().includes(lowerCaseTerm) ||
            log.user.toLowerCase().includes(lowerCaseTerm) ||
            log.details.toLowerCase().includes(lowerCaseTerm)
          );
        } catch (e) {
          console.error('Error filtering log entry:', log, e);
          return false; // Skip this log entry if there's an error
        }
      });
    },
    []
  );

  useEffect(() => {
    setLoading(true);
    setError(null);

    try {
      // Simulate an API call or data processing if needed
      setTimeout(() => {
        const initialFilteredLogs = filterLogs(logs, searchTerm);
        setFilteredLogs(initialFilteredLogs);
        setLoading(false);
      }, 0); // Use 0 for immediate execution after the current render
    } catch (e) {
      console.error('Error processing logs:', e);
      setError(errorMessage);
      setLoading(false);
    }
  }, [logs, searchTerm, filterLogs, errorMessage]);

  const formatDate = (timestamp: Date | string | number): string => {
    try {
      const date = typeof timestamp === 'string' ? parseISO(timestamp) : new Date(timestamp);
      if (!isValid(date)) {
        console.warn('Invalid date:', timestamp);
        return 'Invalid Date';
      }
      return format(date, dateFormat);
    } catch (e) {
      console.error('Error formatting date:', timestamp, e);
      return 'Invalid Date';
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setSearchTerm('');
      searchInputRef.current?.focus();
    }
  };

  if (error) {
    return (
      <div role="alert" aria-live="assertive">
        {error}
      </div>
    );
  }

  return (
    <div aria-live="polite">
      <h1>{title}</h1>
      <label htmlFor="audit-log-search">Search logs:</label>
      <input
        type="text"
        id="audit-log-search"
        placeholder="Search logs..."
        value={searchTerm}
        onChange={handleSearchChange}
        onKeyDown={handleKeyDown}
        aria-label="Search audit logs"
        ref={searchInputRef}
      />

      {loading ? (
        <div aria-live="assertive">Loading audit logs...</div>
      ) : filteredLogs.length === 0 ? (
        <div aria-live="assertive">{emptyMessage}</div>
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
            {filteredLogs.map((log) => (
              <tr key={log.id}>
                <td>{formatDate(log.timestamp)}</td>
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
import { format, isValid, parseISO } from 'date-fns';

interface AuditLogEntry {
  id: string;
  timestamp: Date | string | number; // Allow different timestamp formats
  action: string;
  user: string;
  details: string;
}

interface AuditLogsProps {
  title: string;
  logs: AuditLogEntry[];
  dateFormat?: string; // Allow customization of date format
  emptyMessage?: string; // Message to display when no logs are found
  errorMessage?: string; // Message to display when there's an error
}

const defaultDateFormat = 'yyyy-MM-dd HH:mm:ss';
const defaultEmptyMessage = 'No audit logs found.';
const defaultErrorMessage = 'Error loading audit logs.';

const AuditLogs: React.FC<AuditLogsProps> = ({
  title,
  logs,
  dateFormat = defaultDateFormat,
  emptyMessage = defaultEmptyMessage,
  errorMessage = defaultErrorMessage,
}) => {
  const [filteredLogs, setFilteredLogs] = useState<AuditLogEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState<string | null>(null); // Add error state
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Use useCallback to memoize the filter function
  const filterLogs = useCallback(
    (logsToFilter: AuditLogEntry[], term: string) => {
      const lowerCaseTerm = term.toLowerCase();
      return logsToFilter.filter((log) => {
        try {
          return (
            log.action.toLowerCase().includes(lowerCaseTerm) ||
            log.user.toLowerCase().includes(lowerCaseTerm) ||
            log.details.toLowerCase().includes(lowerCaseTerm)
          );
        } catch (e) {
          console.error('Error filtering log entry:', log, e);
          return false; // Skip this log entry if there's an error
        }
      });
    },
    []
  );

  useEffect(() => {
    setLoading(true);
    setError(null);

    try {
      // Simulate an API call or data processing if needed
      setTimeout(() => {
        const initialFilteredLogs = filterLogs(logs, searchTerm);
        setFilteredLogs(initialFilteredLogs);
        setLoading(false);
      }, 0); // Use 0 for immediate execution after the current render
    } catch (e) {
      console.error('Error processing logs:', e);
      setError(errorMessage);
      setLoading(false);
    }
  }, [logs, searchTerm, filterLogs, errorMessage]);

  const formatDate = (timestamp: Date | string | number): string => {
    try {
      const date = typeof timestamp === 'string' ? parseISO(timestamp) : new Date(timestamp);
      if (!isValid(date)) {
        console.warn('Invalid date:', timestamp);
        return 'Invalid Date';
      }
      return format(date, dateFormat);
    } catch (e) {
      console.error('Error formatting date:', timestamp, e);
      return 'Invalid Date';
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setSearchTerm('');
      searchInputRef.current?.focus();
    }
  };

  if (error) {
    return (
      <div role="alert" aria-live="assertive">
        {error}
      </div>
    );
  }

  return (
    <div aria-live="polite">
      <h1>{title}</h1>
      <label htmlFor="audit-log-search">Search logs:</label>
      <input
        type="text"
        id="audit-log-search"
        placeholder="Search logs..."
        value={searchTerm}
        onChange={handleSearchChange}
        onKeyDown={handleKeyDown}
        aria-label="Search audit logs"
        ref={searchInputRef}
      />

      {loading ? (
        <div aria-live="assertive">Loading audit logs...</div>
      ) : filteredLogs.length === 0 ? (
        <div aria-live="assertive">{emptyMessage}</div>
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
            {filteredLogs.map((log) => (
              <tr key={log.id}>
                <td>{formatDate(log.timestamp)}</td>
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