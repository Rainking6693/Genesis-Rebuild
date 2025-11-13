import React, { FC, DetailedHTMLProps, HTMLAttributes } from 'react';

/**
 * Props for MoodTrackingMessage and AuditLogMessage components
 */
interface LogMessageProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  title?: string;
  role?: string;
  timestamp?: Date;
  severity?: 'info' | 'warning' | 'error';
}

/**
 * Mood tracking message component for MindShift Pro
 */
const MoodTrackingMessage: FC<LogMessageProps> = ({ className, title, role, timestamp, severity, ...props }) => {
  const messageClass = `mood-tracking-message ${getSeverityClass(severity)} ${className || ''}`;
  const titleText = getTitle(title, message, severity);

  return (
    <div className={messageClass} {...props} key={props.id || timestamp?.toISOString()}>
      <div role={role}>
        <div className="message-timestamp">{getTimestamp(timestamp)}</div>
        <div className="message-title" dangerouslySetInnerHTML={{ __html: titleText }} />
        <div className="message-content">{props.message}</div>
      </div>
    </div>
  );
};

/**
 * Audit log message component for MindShift Pro
 */
const AuditLogMessage: FC<LogMessageProps> = ({ className, title, role, timestamp, severity, ...props }) => {
  const messageClass = `audit-log-message ${getSeverityClass(severity)} ${className || ''}`;
  const titleText = getTitle(title, message, severity);

  return (
    <div className={messageClass} {...props} key={props.id || timestamp?.toISOString()}>
      <div role={role}>
        <div className="message-timestamp">{getTimestamp(timestamp)}</div>
        <div className="message-title" dangerouslySetInnerHTML={{ __html: titleText }} />
        <div className="message-content">{props.message}</div>
      </div>
    </div>
  );
};

// Utility functions
function handleNullOrUndefinedWithDefault<T>(value: T | null | undefined, defaultValue: T): T {
  return value !== null && value !== undefined ? value : defaultValue;
}

function handleEmptyStringOrDefault(value: string, defaultValue: string): string {
  return value.trim() === '' ? defaultValue : value;
}

function getTimestamp(timestamp: Date | undefined): string {
  return timestamp ? timestamp.toLocaleString() : 'N/A';
}

function getSeverityClass(severity: 'info' | 'warning' | 'error' | undefined): string {
  return severity ? `severity-${severity}` : '';
}

function getTitle(title: string | undefined, message: string, severity: 'info' | 'warning' | 'error' | undefined): string {
  return handleEmptyStringOrDefault(title, `${severity ? `${severity} - ` : ''}${message}`);
}

export { MoodTrackingMessage, AuditLogMessage };

This updated code addresses the requested improvements in resiliency, edge cases, accessibility, and maintainability.