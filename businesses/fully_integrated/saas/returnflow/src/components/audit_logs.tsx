import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  logEntries: AuditLogEntry[];
}

const AuditLogs: React.FC<AuditLogsProps> = ({ title, logEntries }) => {
  const [filteredLogs, setFilteredLogs] = useState<AuditLogEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setFilteredLogs(logEntries);
  }, [logEntries]);

  const handleSearch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const term = event.target.value.toLowerCase();
      setSearchTerm(term);
      setFilteredLogs(
        logEntries.filter(
          (entry) =>
            entry.action.toLowerCase().includes(term) ||
            entry.user.toLowerCase().includes(term) ||
            entry.details.toLowerCase().includes(term)
        )
      );
    },
    [logEntries]
  );

  const formattedLogs = useMemo(
    () =>
      filteredLogs.map((entry) => ({
        ...entry,
        timestamp: format(entry.timestamp, 'yyyy-MM-dd HH:mm:ss'),
      })),
    [filteredLogs]
  );

  return (
    <div>
      <h1>{title}</h1>
      <div>
        <label htmlFor="search-input">
          <span className="sr-only">Search audit logs</span>
          <input
            id="search-input"
            type="text"
            placeholder="Search audit logs..."
            value={searchTerm}
            onChange={handleSearch}
            aria-label="Search audit logs"
          />
        </label>
      </div>
      {formattedLogs.length > 0 ? (
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
            {formattedLogs.map((entry) => (
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
        <p>No audit logs found.</p>
      )}
    </div>
  );
};

export default AuditLogs;

import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  logEntries: AuditLogEntry[];
}

const AuditLogs: React.FC<AuditLogsProps> = ({ title, logEntries }) => {
  const [filteredLogs, setFilteredLogs] = useState<AuditLogEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setFilteredLogs(logEntries);
  }, [logEntries]);

  const handleSearch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const term = event.target.value.toLowerCase();
      setSearchTerm(term);
      setFilteredLogs(
        logEntries.filter(
          (entry) =>
            entry.action.toLowerCase().includes(term) ||
            entry.user.toLowerCase().includes(term) ||
            entry.details.toLowerCase().includes(term)
        )
      );
    },
    [logEntries]
  );

  const formattedLogs = useMemo(
    () =>
      filteredLogs.map((entry) => ({
        ...entry,
        timestamp: format(entry.timestamp, 'yyyy-MM-dd HH:mm:ss'),
      })),
    [filteredLogs]
  );

  return (
    <div>
      <h1>{title}</h1>
      <div>
        <label htmlFor="search-input">
          <span className="sr-only">Search audit logs</span>
          <input
            id="search-input"
            type="text"
            placeholder="Search audit logs..."
            value={searchTerm}
            onChange={handleSearch}
            aria-label="Search audit logs"
          />
        </label>
      </div>
      {formattedLogs.length > 0 ? (
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
            {formattedLogs.map((entry) => (
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
        <p>No audit logs found.</p>
      )}
    </div>
  );
};

export default AuditLogs;