import React, { useState, useEffect, useCallback, useRef } from 'react';
import { format } from 'date-fns';

interface AuditLogEntry {
  id: string;
  timestamp: Date;
  action: string;
  user: string;
  details: string;
}

interface AuditLogsProps {
  title: string;
  logs: AuditLogEntry[];
}

const AuditLogs: React.FC<AuditLogsProps> = ({ title, logs = [] }) => {
  const [filteredLogs, setFilteredLogs] = useState<AuditLogEntry[]>(logs);
  const [searchTerm, setSearchTerm] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filterLogs = useCallback(
    (term: string) => {
      return logs.filter((log) =>
        log.action.toLowerCase().includes(term.toLowerCase()) ||
        log.user.toLowerCase().includes(term.toLowerCase()) ||
        log.details.toLowerCase().includes(term.toLowerCase())
      );
    },
    [logs]
  );

  useEffect(() => {
    setFilteredLogs(filterLogs(searchTerm));
  }, [searchTerm, filterLogs]);

  const handleSearchTermChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    searchInputRef.current?.focus();
  };

  return (
    <div>
      <h1>{title}</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search logs..."
          value={searchTerm}
          onChange={handleSearchTermChange}
          aria-label="Search logs"
          ref={searchInputRef}
        />
        {searchTerm && (
          <button className="clear-search" onClick={handleClearSearch}>
            Clear
          </button>
        )}
      </div>
      {filteredLogs.length > 0 ? (
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
                <td>{format(log.timestamp, 'yyyy-MM-dd HH:mm:ss')}</td>
                <td>{log.action}</td>
                <td>{log.user}</td>
                <td>{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No logs found.</p>
      )}
    </div>
  );
};

export default AuditLogs;

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { format } from 'date-fns';

interface AuditLogEntry {
  id: string;
  timestamp: Date;
  action: string;
  user: string;
  details: string;
}

interface AuditLogsProps {
  title: string;
  logs: AuditLogEntry[];
}

const AuditLogs: React.FC<AuditLogsProps> = ({ title, logs = [] }) => {
  const [filteredLogs, setFilteredLogs] = useState<AuditLogEntry[]>(logs);
  const [searchTerm, setSearchTerm] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filterLogs = useCallback(
    (term: string) => {
      return logs.filter((log) =>
        log.action.toLowerCase().includes(term.toLowerCase()) ||
        log.user.toLowerCase().includes(term.toLowerCase()) ||
        log.details.toLowerCase().includes(term.toLowerCase())
      );
    },
    [logs]
  );

  useEffect(() => {
    setFilteredLogs(filterLogs(searchTerm));
  }, [searchTerm, filterLogs]);

  const handleSearchTermChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    searchInputRef.current?.focus();
  };

  return (
    <div>
      <h1>{title}</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search logs..."
          value={searchTerm}
          onChange={handleSearchTermChange}
          aria-label="Search logs"
          ref={searchInputRef}
        />
        {searchTerm && (
          <button className="clear-search" onClick={handleClearSearch}>
            Clear
          </button>
        )}
      </div>
      {filteredLogs.length > 0 ? (
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
                <td>{format(log.timestamp, 'yyyy-MM-dd HH:mm:ss')}</td>
                <td>{log.action}</td>
                <td>{log.user}</td>
                <td>{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No logs found.</p>
      )}
    </div>
  );
};

export default AuditLogs;