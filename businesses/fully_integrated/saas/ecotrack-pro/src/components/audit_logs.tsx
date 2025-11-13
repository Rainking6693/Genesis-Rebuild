import moment from 'moment';

export type AuditLogMessage = {
  timestamp?: Date;
  action: string;
  user: string;
  message?: string;
};

// With moment.js, we can format the timestamp for better readability
export const formatTimestamp = (timestamp: Date | undefined): string =>
  timestamp ? moment(timestamp).format('YYYY-MM-DD HH:mm:ss') : '';

// my_component.tsx
import React from 'react';
import { AuditLogMessage } from './audit_log_message';
import { FormattedHTMLMessage, IntlShape } from 'react-intl';

interface Props {
  auditLogMessage: AuditLogMessage;
  intl: IntlShape;
}

const messages = {
  timestamp: {
    id: 'auditLog.timestamp',
    defaultMessage: 'Timestamp: {timestamp}',
  },
  action: {
    id: 'auditLog.action',
    defaultMessage: 'Action: {action}',
  },
  user: {
    id: 'auditLog.user',
    defaultMessage: 'User: {user}',
  },
  message: {
    id: 'auditLog.message',
    defaultMessage: 'Message: {message}',
  },
};

const MyComponent: React.FC<Props> = ({ auditLogMessage, intl }) => {
  return (
    <div>
      <FormattedHTMLMessage
        id={messages.timestamp.id}
        defaultMessage={messages.timestamp.defaultMessage}
        values={{ timestamp: formatTimestamp(auditLogMessage.timestamp) }}
        aria-label="Timestamp"
      />
      <FormattedHTMLMessage
        id={messages.action.id}
        defaultMessage={messages.action.defaultMessage}
        values={{ action: auditLogMessage.action }}
        aria-label="Action"
      />
      <FormattedHTMLMessage
        id={messages.user.id}
        defaultMessage={messages.user.defaultMessage}
        values={{ user: auditLogMessage.user }}
        aria-label="User"
      />
      <FormattedHTMLMessage
        id={messages.message.id}
        defaultMessage={messages.message.defaultMessage}
        values={{ message: auditLogMessage.message || '' }}
        aria-label="Message"
      />
    </div>
  );
};

export default MyComponent;