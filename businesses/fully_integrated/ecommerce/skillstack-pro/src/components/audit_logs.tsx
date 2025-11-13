import React, { useState, useEffect } from 'react';
import { useAuditLogs } from '../../hooks/useAuditLogs';

interface Log {
  timestamp: Date;
  user: string;
  action: string;
  details: string;
}

interface Props {
  eventType: string;
  eventData?: any;
}

const AuditLogsComponent: React.FC<Props> = ({ eventType, eventData }) => {
  const [auditLogs, setAuditLogs] = useState<Log[]>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchAuditLogs = async () => {
      try {
        const logs = await useAuditLogs(eventType, eventData);
        setAuditLogs(logs);
      } catch (error) {
        setError(error);
      }
    };

    fetchAuditLogs();
  }, [eventType, eventData]);

  return (
    <div>
      {error && <div role="alert">Error fetching audit logs: {error.message}</div>}
      {auditLogs.map((log, index) => (
        <div key={index} role="log">
          {log.timestamp.toLocaleString()}: {log.user}: {log.action}: {log.details}
        </div>
      ))}
    </div>
  );
};

export default AuditLogsComponent;

In this updated version, I've added an `error` state to handle errors more gracefully. I've also added a `role` attribute to the error and log elements for better accessibility. Additionally, I've used the `toLocaleString()` method to format the timestamp in a more user-friendly way.