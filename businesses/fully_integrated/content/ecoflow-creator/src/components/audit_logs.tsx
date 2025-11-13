import React from 'react';
import { AuditLog } from './AuditLog';
import { useTranslation } from 'react-i18next';

interface Props {
  messageId: string;
  auditLog: AuditLog;
}

const MyComponent: React.FC<Props> = ({ messageId, auditLog }) => {
  const { t } = useTranslation();

  // Add a default value for auditLog to handle missing or invalid data
  const defaultAuditLog: AuditLog = {
    timestamp: new Date(),
    user: '',
    action: '',
  };

  const auditLogData = { ...defaultAuditLog, ...auditLog };

  return (
    <div>
      <p>{t(messageId)}</p>
      <AuditLog logData={auditLogData} />
    </div>
  );
};

export default MyComponent;

import React from 'react';
import { AuditLog } from './AuditLog';
import { formatDistanceToNowStrict } from 'date-fns';
import pt from 'date-fns/locale/pt';
import { useTranslation } from 'react-i18next';

interface AuditLog {
  timestamp: Date;
  user: string;
  action: string;
  data?: any;
}

const AuditLog: React.FC<{ logData: AuditLog }> = ({ logData }) => {
  const { t } = useTranslation();

  // Add a default value for logData.data to handle missing or invalid data
  const defaultData: any = {};

  const logDataWithDefaults = { ...logData, data: { ...defaultData, ...logData.data } };

  return (
    <div>
      <p>
        {t('timestamp')}: {formatDistanceToNowStrict(logDataWithDefaults.timestamp, {
          locale: pt,
          addSeconds: true,
        })}
      </p>
      <p>{t('user')}: {logDataWithDefaults.user}</p>
      <p>{t('action')}: {logDataWithDefaults.action}</p>
      {logDataWithDefaults.data && (
        <pre>{JSON.stringify(logDataWithDefaults.data, null, 2)}</pre>
      )}
    </div>
  );
};

export default AuditLog;

import React from 'react';
import { AuditLog } from './AuditLog';
import { useTranslation } from 'react-i18next';

interface Props {
  messageId: string;
  auditLog: AuditLog;
}

const MyComponent: React.FC<Props> = ({ messageId, auditLog }) => {
  const { t } = useTranslation();

  // Add a default value for auditLog to handle missing or invalid data
  const defaultAuditLog: AuditLog = {
    timestamp: new Date(),
    user: '',
    action: '',
  };

  const auditLogData = { ...defaultAuditLog, ...auditLog };

  return (
    <div>
      <p>{t(messageId)}</p>
      <AuditLog logData={auditLogData} />
    </div>
  );
};

export default MyComponent;

import React from 'react';
import { AuditLog } from './AuditLog';
import { formatDistanceToNowStrict } from 'date-fns';
import pt from 'date-fns/locale/pt';
import { useTranslation } from 'react-i18next';

interface AuditLog {
  timestamp: Date;
  user: string;
  action: string;
  data?: any;
}

const AuditLog: React.FC<{ logData: AuditLog }> = ({ logData }) => {
  const { t } = useTranslation();

  // Add a default value for logData.data to handle missing or invalid data
  const defaultData: any = {};

  const logDataWithDefaults = { ...logData, data: { ...defaultData, ...logData.data } };

  return (
    <div>
      <p>
        {t('timestamp')}: {formatDistanceToNowStrict(logDataWithDefaults.timestamp, {
          locale: pt,
          addSeconds: true,
        })}
      </p>
      <p>{t('user')}: {logDataWithDefaults.user}</p>
      <p>{t('action')}: {logDataWithDefaults.action}</p>
      {logDataWithDefaults.data && (
        <pre>{JSON.stringify(logDataWithDefaults.data, null, 2)}</pre>
      )}
    </div>
  );
};

export default AuditLog;

AuditLog.tsx: