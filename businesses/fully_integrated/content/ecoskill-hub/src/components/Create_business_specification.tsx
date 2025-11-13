import React, { FC, useCallback, useMemo } from 'react';
import { sanitizeHtml } from 'react-helmet-sanitizer';
import { useTranslation } from 'react-i18next';

type Props = {
  message: string;
  maxLength?: number;
  title?: string;
  className?: string;
};

const validateMessage = useCallback((message: string, maxLength?: number): string => {
  if (!message || /<script/.test(message) || (maxLength && message.length > maxLength)) {
    throw new Error('Invalid message');
  }
  return message;
}, []);

const EcoSkillHubContentComponent: FC<Props> = ({ message, title, className, ...rest }) => {
  const { t } = useTranslation();
  const { i18n } = useTranslation();
  const locale = i18n.language;
  const sanitizedMessage = useMemo(() => sanitizeHtml(validateMessage(message), {
    allowedAttributes: {
      '*': ['class', 'style'],
    },
  }), [message, validateMessage]);

  return (
    <div className={className} {...rest}>
      {title && <h1 className="title" dangerouslySetInnerHTML={{ __html: sanitizeHtml(title, { allowedAttributes: { '*': [] } }) }} />}
      <div
        dangerouslySetInnerHTML={{
          __html: sanitizedMessage || `<div class="empty-message">${t('messages.emptyMessage', { lng: locale })}</div>`,
        }}
      />
    </div>
  );
};

export default EcoSkillHubContentComponent;

import React, { FC, useCallback, useMemo } from 'react';
import { sanitizeHtml } from 'react-helmet-sanitizer';
import { useTranslation } from 'react-i18next';

type Props = {
  message: string;
  maxLength?: number;
  title?: string;
  className?: string;
};

const validateMessage = useCallback((message: string, maxLength?: number): string => {
  if (!message || /<script/.test(message) || (maxLength && message.length > maxLength)) {
    throw new Error('Invalid message');
  }
  return message;
}, []);

const EcoSkillHubContentComponent: FC<Props> = ({ message, title, className, ...rest }) => {
  const { t } = useTranslation();
  const { i18n } = useTranslation();
  const locale = i18n.language;
  const sanitizedMessage = useMemo(() => sanitizeHtml(validateMessage(message), {
    allowedAttributes: {
      '*': ['class', 'style'],
    },
  }), [message, validateMessage]);

  return (
    <div className={className} {...rest}>
      {title && <h1 className="title" dangerouslySetInnerHTML={{ __html: sanitizeHtml(title, { allowedAttributes: { '*': [] } }) }} />}
      <div
        dangerouslySetInnerHTML={{
          __html: sanitizedMessage || `<div class="empty-message">${t('messages.emptyMessage', { lng: locale })}</div>`,
        }}
      />
    </div>
  );
};

export default EcoSkillHubContentComponent;