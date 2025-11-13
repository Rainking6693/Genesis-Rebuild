import React, { FC, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  code?: string;
  messageId?: string;
}

const MyComponent: FC<Props> = ({ code, messageId }) => {
  const { t } = useTranslation();

  if (!code && !messageId) {
    throw new Error('Either code or messageId must be provided');
  }

  let message = '';

  if (code) {
    try {
      message = t(`errors.${code}`);
    } catch (error) {
      message = `Error: ${t('errors.unknown')} (${code})`;
    }
  } else if (messageId) {
    message = t(messageId);
  }

  return (
    <div role="alert">
      <strong>{t('labels.error')}:</strong> {message}
    </div>
  );
};

export default MyComponent;

import React, { FC, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  code?: string;
  messageId?: string;
}

const MyComponent: FC<Props> = ({ code, messageId }) => {
  const { t } = useTranslation();

  if (!code && !messageId) {
    throw new Error('Either code or messageId must be provided');
  }

  let message = '';

  if (code) {
    try {
      message = t(`errors.${code}`);
    } catch (error) {
      message = `Error: ${t('errors.unknown')} (${code})`;
    }
  } else if (messageId) {
    message = t(messageId);
  }

  return (
    <div role="alert">
      <strong>{t('labels.error')}:</strong> {message}
    </div>
  );
};

export default MyComponent;