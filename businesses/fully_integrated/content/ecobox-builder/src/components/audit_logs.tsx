import React, { useEffect, useState } from 'react';
import { useAuditLogs } from '../../hooks/useAuditLogs';

// Custom hooks
const useIsLoading = (value: boolean) => {
  const [isLoading, setIsLoading] = useState(value);
  return [isLoading, setIsLoading];
};

const useError = (error: Error | null) => {
  const [errorState, setErrorState] = useState(error);
  useEffect(() => {
    setErrorState(error);
  }, [error]);
  return errorState;
};

// Type definitions
type AuditLogAction = 'create' | 'update' | 'delete';

interface Props {
  action: AuditLogAction;
  itemId: string;
  loadingMessage?: string;
  noLogsMessage?: string;
}

interface AuditLog {
  id: string;
  action: AuditLogAction;
  itemId: string;
  timestamp: Date;
  message: string;
}

const AuditLogsComponent: React.FC<Props> = ({
  action,
  itemId,
  loadingMessage = 'Loading audit logs...',
  noLogsMessage = 'No audit logs found.',
}) => {
  const [isLoading, setIsLoading] = useIsLoading(true);
  const error = useError(null);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const debouncedAction = useDebouncedValue(action, 500);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const logs = await useAuditLogs(debouncedAction, itemId);
        setLogs(logs);
        setIsLoading(false);
      } catch (error) {
        setError(error);
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, [debouncedAction, itemId]);

  if (isLoading) {
    return <div>{loadingMessage}</div>;
  }

  if (error) {
    return (
      <div>
        <div>An error occurred while fetching the audit logs:</div>
        <pre>{error.message}</pre>
      </div>
    );
  }

  if (logs.length === 0) {
    return <div>{noLogsMessage}</div>;
  }

  return (
    <div>
      {logs.map((log, index) => (
        <div key={log.id}>{log.message}</div>
      ))}
    </div>
  );
};

// Debounce function
const useDebouncedValue = (value: any, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default AuditLogsComponent;

This updated version includes better error handling, loading state management, and customizable loading and no logs messages. It also improves performance by debouncing API calls and managing debounced values more efficiently.