import React, { useState, useEffect, useCallback, useRef } from 'react';
import { format, isValid } from 'date-fns';

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
}

const AuditLogs: React.FC<AuditLogsProps> = ({ title, logs, dateFormat = 'yyyy-MM-dd HH:mm:ss' }) => {
  const [filteredLogs, setFilteredLogs] = useState<AuditLogEntry[]>(logs);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null); // State for error handling
  const searchInputRef = useRef<HTMLInputElement>(null); // Ref for search input

  // Use useCallback to memoize the filter function
  const filterLogs = useCallback(
    (logsToFilter: AuditLogEntry[], term: string) => {
      try {
        return logsToFilter.filter((log) => {
          const searchTermLower = term.toLowerCase();
          return (
            log.action.toLowerCase().includes(searchTermLower) ||
            log.user.toLowerCase().includes(searchTermLower) ||
            log.details.toLowerCase().includes(searchTermLower)
          );
        });
      } catch (e) {
        console.error("Error filtering logs:", e);
        setError("An error occurred while filtering logs.");
        return logsToFilter; // Return original logs in case of error
      }
    },
    []
  );

  useEffect(() => {
    setFilteredLogs(filterLogs(logs, searchTerm));
  }, [logs, searchTerm, filterLogs]);

  const formatDate = (timestamp: Date | string | number): string => {
    try {
      const date = new Date(timestamp);
      if (!isValid(date)) {
        console.warn("Invalid date:", timestamp);
        return "Invalid Date";
      }
      return format(date, dateFormat);
    } catch (e) {
      console.error("Error formatting date:", timestamp, e);
      return "Invalid Date";
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      // Clear the search input on Escape key press
      setSearchTerm('');
      searchInputRef.current?.focus(); // Focus the search input after clearing
    }
  };

  return (
    <div aria-live="polite"> {/* Accessibility: Announce changes */}
      <h1>{title}</h1>
      <input
        type="search" // Use type="search" for better UX
        placeholder="Search logs..."
        value={searchTerm}
        onChange={handleSearchChange}
        onKeyDown={handleKeyDown}
        ref={searchInputRef} // Ref for search input
        aria-label="Search audit logs" // Accessibility: Label the search input
      />
      {error && <div style={{ color: 'red' }}>{error}</div>} {/* Display error message */}
      {filteredLogs.length === 0 && !error ? (
        <p>No logs found.</p>
      ) : (
        <table aria-label="Audit Logs"> {/* Accessibility: Label the table */}
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
import { format, isValid } from 'date-fns';

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
}

const AuditLogs: React.FC<AuditLogsProps> = ({ title, logs, dateFormat = 'yyyy-MM-dd HH:mm:ss' }) => {
  const [filteredLogs, setFilteredLogs] = useState<AuditLogEntry[]>(logs);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null); // State for error handling
  const searchInputRef = useRef<HTMLInputElement>(null); // Ref for search input

  // Use useCallback to memoize the filter function
  const filterLogs = useCallback(
    (logsToFilter: AuditLogEntry[], term: string) => {
      try {
        return logsToFilter.filter((log) => {
          const searchTermLower = term.toLowerCase();
          return (
            log.action.toLowerCase().includes(searchTermLower) ||
            log.user.toLowerCase().includes(searchTermLower) ||
            log.details.toLowerCase().includes(searchTermLower)
          );
        });
      } catch (e) {
        console.error("Error filtering logs:", e);
        setError("An error occurred while filtering logs.");
        return logsToFilter; // Return original logs in case of error
      }
    },
    []
  );

  useEffect(() => {
    setFilteredLogs(filterLogs(logs, searchTerm));
  }, [logs, searchTerm, filterLogs]);

  const formatDate = (timestamp: Date | string | number): string => {
    try {
      const date = new Date(timestamp);
      if (!isValid(date)) {
        console.warn("Invalid date:", timestamp);
        return "Invalid Date";
      }
      return format(date, dateFormat);
    } catch (e) {
      console.error("Error formatting date:", timestamp, e);
      return "Invalid Date";
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      // Clear the search input on Escape key press
      setSearchTerm('');
      searchInputRef.current?.focus(); // Focus the search input after clearing
    }
  };

  return (
    <div aria-live="polite"> {/* Accessibility: Announce changes */}
      <h1>{title}</h1>
      <input
        type="search" // Use type="search" for better UX
        placeholder="Search logs..."
        value={searchTerm}
        onChange={handleSearchChange}
        onKeyDown={handleKeyDown}
        ref={searchInputRef} // Ref for search input
        aria-label="Search audit logs" // Accessibility: Label the search input
      />
      {error && <div style={{ color: 'red' }}>{error}</div>} {/* Display error message */}
      {filteredLogs.length === 0 && !error ? (
        <p>No logs found.</p>
      ) : (
        <table aria-label="Audit Logs"> {/* Accessibility: Label the table */}
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