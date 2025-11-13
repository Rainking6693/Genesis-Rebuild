import React, { useState, useEffect, useMemo } from 'react';
import { useFeatureFlag, useLocale } from '@ecospend-ai/feature-flags';

interface Props {
  flagName: string;
  messageId: string;
  fallbackMessage?: string;
  locale?: string;
}

const MyComponent: React.FC<Props> = ({ flagName, messageId, fallbackMessage, locale = 'en' }) => {
  const isEnabled = useFeatureFlag(flagName);
  const { locale: currentLocale } = useLocale();

  const [messageToRender, setMessageToRender] = useState(fallbackMessage || getMessage(messageId, locale || currentLocale) || '');

  const translatedMessage = useMemo(() => getMessage(messageId, locale || currentLocale), [messageId, locale, currentLocale]);

  useEffect(() => {
    if (isEnabled) {
      setMessageToRender(translatedMessage);
    } else {
      setMessageToRender(fallbackMessage || getMessage('feature_flag_disabled', locale || currentLocale));
    }
  }, [isEnabled, translatedMessage, fallbackMessage]);

  return (
    <div key={messageId}>
      {translatedMessage && messageToRender}
    </div>
  );
};

const getMessage = (id: string, locale: string) => {
  // Implement your localization logic here, e.g., using a JSON file or an API.
  // Return the translated message for the given id and locale, or an empty string if it doesn't exist.
};

export default MyComponent;

These changes make the component more resilient by handling cases where the `locale` prop is missing, improve accessibility by providing localized messages, and make it more maintainable by caching the translated messages using the `useMemo` hook.