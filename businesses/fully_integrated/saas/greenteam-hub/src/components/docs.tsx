import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DOMPurify from 'dompurify';

type TranslationFunction = (key: string, values?: { [key: string]: any }) => string;

interface Props {
  id: string;
  messageKey: string;
  // Default value for messageKey in case it's not found
  messageKeyDefault?: string;
}

const MyComponent: React.FC<Props> = ({ id, messageKey, messageKeyDefault }) => {
  const { t }: { t: TranslationFunction } = useTranslation(); // Use i18next for internationalization

  const [message, setMessage] = useState<string | null>(t(messageKey, { id }) || null);

  useEffect(() => {
    const subscription = t.on('change', handleTranslationChange);
    return () => {
      subscription.unsubscribe();
    };
  }, [handleTranslationChange]);

  const handleTranslationChange = useCallback(() => {
    setMessage(t(messageKey, { id })); // Update message when translation changes
  }, [id, t, messageKey]);

  useEffect(() => {
    if (message === null) {
      setMessage(t(messageKeyDefault || messageKey, { id }));
    }
  }, [messageKeyDefault, t]);

  return message !== null ? (
    <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(message) }} />
  ) : null; // Render the component only if message is not null
};

export default MyComponent;

In this updated code, the component will now render even if the `messageKey` prop is not found, using the `messageKeyDefault` prop as a fallback. The component will also unsubscribe from translation changes when it's unmounted, ensuring better memory management. The `handleTranslationChange` function is now memoized using `useCallback` to prevent unnecessary re-renders. Lastly, the component will only render if the message is not `null`, ensuring that it doesn't render an empty or undefined message.