import React, { useState, useEffect } from 'react';
import { AuditLog, AuditLogEvent } from './AuditLog';

interface Props {
  message: string;
  auditLog: AuditLog;
}

const MyComponent: React.FC<Props> = ({ message, auditLog }) => {
  const [auditLogEvents, setAuditLogEvents] = useState<AuditLogEvent[]>([]);

  // Add event tracking for changes in the message
  const handleContentUpdate = () => {
    const event: AuditLogEvent = {
      eventName: 'Content Updated',
      message,
      timestamp: new Date(),
    };
    setAuditLogEvents((prevEvents) => [...prevEvents, event]);
    auditLog.trackEvent(event.eventName, event);
  };

  // Handle edge cases where message is null or undefined
  useEffect(() => {
    if (message) handleContentUpdate();
  }, [message]);

  // Add a check for empty audit log events before rendering
  const hasAuditLogEvents = auditLogEvents.length > 0;

  return (
    <div>
      {message}
      {hasAuditLogEvents && <AuditLog logs={auditLogEvents} />}
    </div>
  );
};

export default MyComponent;

import React, { useState, useEffect } from 'react';
import { AuditLog, AuditLogEvent } from './AuditLog';

interface Props {
  message: string;
  auditLog: AuditLog;
}

const MyComponent: React.FC<Props> = ({ message, auditLog }) => {
  const [auditLogEvents, setAuditLogEvents] = useState<AuditLogEvent[]>([]);

  // Add event tracking for changes in the message
  const handleContentUpdate = () => {
    const event: AuditLogEvent = {
      eventName: 'Content Updated',
      message,
      timestamp: new Date(),
    };
    setAuditLogEvents((prevEvents) => [...prevEvents, event]);
    auditLog.trackEvent(event.eventName, event);
  };

  // Handle edge cases where message is null or undefined
  useEffect(() => {
    if (message) handleContentUpdate();
  }, [message]);

  // Add a check for empty audit log events before rendering
  const hasAuditLogEvents = auditLogEvents.length > 0;

  return (
    <div>
      {message}
      {hasAuditLogEvents && <AuditLog logs={auditLogEvents} />}
    </div>
  );
};

export default MyComponent;