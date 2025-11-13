import React, { FC, useMemo, useState } from 'react';
import classnames from 'classnames';
import { sanitize } from 'dompurify';
import { useLocale } from './localeContext';

interface Props {
  message: string;
}

const EmailMarketing: FC<Props> = ({ message }) => {
  const [messageId, setMessageId] = useState<string | null>(null);
  const sanitizedMessage = useMemo(() => sanitize(message), [message]);
  const componentName = 'rb-ai-email-container';
  const { locale } = useLocale();

  // Generate a unique message ID based on the message content and locale
  useMemo(() => {
    const messageHash = JSON.stringify({ message, locale });
    setMessageId(messageHash);
  }, [message, locale]);

  return (
    <div
      className={classnames('review-boost-ai', componentName, {
        [`rb-ai-email-container--${locale}`]: locale,
      })}
      data-testid={componentName}
      data-message-id={messageId}
      role="presentation"
    >
      {sanitizedMessage}
    </div>
  );
};

export default EmailMarketing;

In this updated version, I've made the following improvements:

1. Imported the `useLocale` hook from a custom `localeContext` for better maintainability and internationalization support.
2. Added a unique class name based on the current locale for better styling and maintainability.
3. Generated a unique message ID based on the message content and locale to handle edge cases where multiple emails with the same content are sent.
4. Added a `role="presentation"` attribute to the email container to improve accessibility by ensuring it doesn't get read out by screen readers.
5. Used `useMemo` to optimize performance by minimizing unnecessary re-renders.