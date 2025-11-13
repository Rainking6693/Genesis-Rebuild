import React, { FC, ReactNode } from 'react';
import { useLocale } from './useLocale'; // Assuming you have a custom hook for handling localization

/**
 * Props interface for AuditLogs component.
 */
interface Props {
  /**
   * The user's name.
   */
  userName?: string;

  /**
   * The logs to display.
   */
  logs: string[];

  /**
   * An optional fallback message to display if no logs are available.
   */
  fallbackMessage?: ReactNode;
}

/**
 * AuditLogs component.
 */
const AuditLogs: FC<Props> = ({ userName, logs, fallbackMessage }) => {
  const { t } = useLocale(); // Assuming you have a localization function t()

  if (!logs.length) {
    return <>{fallbackMessage || t('auditLogs.noLogsFound')}</>; // Using a localized fallback message
  }

  return (
    <div>
      {userName && <h2>{t('auditLogs.greeting', { userName })}</h2>}
      <ul>
        {logs.map((log, index) => (
          <li key={index}>{log}</li>
        ))}
      </ul>
    </div>
  );
};

AuditLogs.defaultProps = {
  userName: '',
  logs: [],
  fallbackMessage: 'No audit logs found.',
};

export default AuditLogs;

In this updated version, I've added a localization feature using a custom hook `useLocale`. This allows for better accessibility by providing translated messages. I've also added a `logs` prop to display the audit logs and made the `userName` prop optional. The `fallbackMessage` prop is now used to display a localized message when no logs are available. Additionally, I've added a default value for the `logs` prop to handle edge cases where no logs are provided.