import React, { FC, useEffect, useMemo } from 'react';
import { logError } from './error_logging';
import { useTranslation } from 'react-i18next';

interface Props {
  message?: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const { t } = useTranslation();

  const fallbackDOMParser =
    window.DOMParser ||
    (function () {
      return {
        parseFromString: function (content, type) {
          const doc = new DOCUMENT_FRAGMENT();
          doc.innerHTML = content;
          return doc;
        },
      };
    })();

  const sanitizedMessage = useMemo(() => {
    const sanitized =
      (new fallbackDOMParser?.parseFromString(message || '', 'text/html') || new DOMParser()).parseFromString(
        message || '',
        'text/html'
      ).textContent.trim();
    return sanitized || t('default_message');
  }, [message, t]);

  useEffect(() => {
    try {
      // Your component logic here
    } catch (error) {
      logError({ message, sanitizedMessage }, error);
    }
  }, [message, sanitizedMessage]);

  return (
    <div
      className="customer-support-bot-message"
      data-testid="customer-support-bot"
      role="alert"
      aria-label={t('customer_support_bot_label')}
      aria-describedby="customer-support-bot-description"
      style={{ maxWidth: '500px', minWidth: '200px' }}
      title={t('customer_support_bot_title')}
      aria-live="polite"
    >
      {sanitizedMessage}
      <div id="customer-support-bot-description" hidden>{t('customer_support_bot_description')}</div>
    </div>
  );
};

export default MyComponent;

import React, { FC, useEffect, useMemo } from 'react';
import { logError } from './error_logging';
import { useTranslation } from 'react-i18next';

interface Props {
  message?: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const { t } = useTranslation();

  const fallbackDOMParser =
    window.DOMParser ||
    (function () {
      return {
        parseFromString: function (content, type) {
          const doc = new DOCUMENT_FRAGMENT();
          doc.innerHTML = content;
          return doc;
        },
      };
    })();

  const sanitizedMessage = useMemo(() => {
    const sanitized =
      (new fallbackDOMParser?.parseFromString(message || '', 'text/html') || new DOMParser()).parseFromString(
        message || '',
        'text/html'
      ).textContent.trim();
    return sanitized || t('default_message');
  }, [message, t]);

  useEffect(() => {
    try {
      // Your component logic here
    } catch (error) {
      logError({ message, sanitizedMessage }, error);
    }
  }, [message, sanitizedMessage]);

  return (
    <div
      className="customer-support-bot-message"
      data-testid="customer-support-bot"
      role="alert"
      aria-label={t('customer_support_bot_label')}
      aria-describedby="customer-support-bot-description"
      style={{ maxWidth: '500px', minWidth: '200px' }}
      title={t('customer_support_bot_title')}
      aria-live="polite"
    >
      {sanitizedMessage}
      <div id="customer-support-bot-description" hidden>{t('customer_support_bot_description')}</div>
    </div>
  );
};

export default MyComponent;