import React from 'react';
import PropTypes from 'prop-types';

type LogLevel = 'info' | 'warning' | 'error';
type Time = Date | null;
type AuditLogProps = {
  message: string;
  time?: Time;
  level?: LogLevel;
};

const AuditLog: React.FC<AuditLogProps> = ({ message, time, level = 'info' }) => {
  const formattedMessage = message || '';
  const formattedTime = time ? time.toLocaleString() : '';
  const formattedLevel = level ? ` (${level.toUpperCase()})` : '';

  // Handle edge case when time is invalid (e.g., not a Date object)
  const uniqueKey = time ? formattedTime + formattedMessage : message;

  return <div key={uniqueKey} data-testid="audit-log">{formattedTime} {formattedMessage}{formattedLevel}</div>;
};

AuditLog.propTypes = {
  message: PropTypes.string.isRequired,
  time: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.oneOf([null])]),
  level: PropTypes.oneOf(['info', 'warning', 'error']),
};

export default AuditLog;

import React from 'react';
import PropTypes from 'prop-types';

type LogLevel = 'info' | 'warning' | 'error';
type Time = Date | null;
type AuditLogProps = {
  message: string;
  time?: Time;
  level?: LogLevel;
};

const AuditLog: React.FC<AuditLogProps> = ({ message, time, level = 'info' }) => {
  const formattedMessage = message || '';
  const formattedTime = time ? time.toLocaleString() : '';
  const formattedLevel = level ? ` (${level.toUpperCase()})` : '';

  // Handle edge case when time is invalid (e.g., not a Date object)
  const uniqueKey = time ? formattedTime + formattedMessage : message;

  return <div key={uniqueKey} data-testid="audit-log">{formattedTime} {formattedMessage}{formattedLevel}</div>;
};

AuditLog.propTypes = {
  message: PropTypes.string.isRequired,
  time: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.oneOf([null])]),
  level: PropTypes.oneOf(['info', 'warning', 'error']),
};

export default AuditLog;