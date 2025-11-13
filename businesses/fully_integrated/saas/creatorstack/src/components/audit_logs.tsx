import React, { FC, useEffect, useState, useRef } from 'react';

interface Props {
  logs: Array<{ timestamp: Date; message: string }>;
  minDate?: Date;
  maxDate?: Date;
  noLogsMessage?: string;
}

const MyComponent: FC<Props> = ({ logs, minDate, maxDate, noLogsMessage }) => {
  const [filteredLogs, setFilteredLogs] = useState<Array<{ timestamp: Date; message: string }>>(logs);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [hasLogs, setHasLogs] = useState<boolean>(Boolean(logs.length));

  const debounce = (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func.apply(this, args);
      }, wait);
    };
  };

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    setLoading(true);
    const filtered = logs.filter((log) => {
      if (minDate && log.timestamp < minDate) return false;
      if (maxDate && log.timestamp > maxDate) return false;
      return log.message.toLowerCase().includes(searchTerm.toLowerCase());
    });
    setFilteredLogs(filtered);
    setHasLogs(Boolean(filtered.length));
    setLoading(false);
  }, [logs, minDate, maxDate, searchTerm]);

  const handleSearchChange = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, 500);

  return (
    <div className="audit-logs">
      {loading && <div className="loading-spinner">Loading...</div>}
      {!loading && hasLogs ? (
        <>
          <h2>Audit Logs</h2>
          <input
            type="text"
            placeholder="Search logs"
            ref={inputRef}
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <div className="log-container">
            {filteredLogs.map((log) => (
              <div key={log.timestamp.toString()} className="log">
                <div className="log-timestamp">{log.timestamp.toLocaleString()}</div>
                <div className="log-message" dangerouslySetInnerHTML={{ __html: log.message }} />
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="no-logs">{noLogsMessage || 'No logs to display'}</div>
      )}
    </div>
  );
};

export default MyComponent;

import React, { FC, useEffect, useState, useRef } from 'react';

interface Props {
  logs: Array<{ timestamp: Date; message: string }>;
  minDate?: Date;
  maxDate?: Date;
  noLogsMessage?: string;
}

const MyComponent: FC<Props> = ({ logs, minDate, maxDate, noLogsMessage }) => {
  const [filteredLogs, setFilteredLogs] = useState<Array<{ timestamp: Date; message: string }>>(logs);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [hasLogs, setHasLogs] = useState<boolean>(Boolean(logs.length));

  const debounce = (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func.apply(this, args);
      }, wait);
    };
  };

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    setLoading(true);
    const filtered = logs.filter((log) => {
      if (minDate && log.timestamp < minDate) return false;
      if (maxDate && log.timestamp > maxDate) return false;
      return log.message.toLowerCase().includes(searchTerm.toLowerCase());
    });
    setFilteredLogs(filtered);
    setHasLogs(Boolean(filtered.length));
    setLoading(false);
  }, [logs, minDate, maxDate, searchTerm]);

  const handleSearchChange = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, 500);

  return (
    <div className="audit-logs">
      {loading && <div className="loading-spinner">Loading...</div>}
      {!loading && hasLogs ? (
        <>
          <h2>Audit Logs</h2>
          <input
            type="text"
            placeholder="Search logs"
            ref={inputRef}
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <div className="log-container">
            {filteredLogs.map((log) => (
              <div key={log.timestamp.toString()} className="log">
                <div className="log-timestamp">{log.timestamp.toLocaleString()}</div>
                <div className="log-message" dangerouslySetInnerHTML={{ __html: log.message }} />
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="no-logs">{noLogsMessage || 'No logs to display'}</div>
      )}
    </div>
  );
};

export default MyComponent;