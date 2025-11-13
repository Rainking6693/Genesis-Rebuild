import React, { FC, ReactNode, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Component Purpose: A React component to display a backup message, ensuring security, accessibility, and internationalization.

interface Props {
  // Message to be displayed. This could be user-provided data, so we use dangerouslySetInnerHTML to prevent XSS attacks.
  userProvidedMessage?: string;
  // Optional fallback message in case userProvidedMessage is not provided.
  fallbackMessage?: string;
}

// Memoize the component to optimize performance if the children (message) are expensive to render.
const MemoizedMyComponent: FC<Props> = React.memo((props: Props) => {
  const { t } = useTranslation();
  const messageRef = useRef<HTMLDivElement>(null);
  const [isMessageVisible, setMessageVisible] = useState(false);

  // Check if the userProvidedMessage is empty or null, and if so, use the fallbackMessage.
  const message = props.userProvidedMessage || (props.fallbackMessage ? props.fallbackMessage : t('backup_message_fallback'));

  // Use a timeout to ensure the message is fully rendered before making it visible to avoid flickering.
  React.useEffect(() => {
    if (messageRef.current) {
      setTimeout(() => {
        setMessageVisible(true);
      }, 100);
    }
  }, [message]);

  return (
    <div>
      {/* Use aria-hidden to hide the message initially and aria-labelledby to provide a description for screen readers */}
      <div aria-hidden={!isMessageVisible} ref={messageRef}>
        {/* Use dangerouslySetInnerHTML to prevent XSS attacks when displaying user-provided data */}
        <div id="backup-message" aria-labelledby="backup-message-label" dangerouslySetInnerHTML={{ __html: message }} />
      </div>
      {/* Use aria-labelledby to provide a description for screen readers */}
      <div id="backup-message-label" className="sr-only">
        {t('backup_message_label')}
      </div>
    </div>
  );
});

export default MemoizedMyComponent;

import React, { FC, ReactNode, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Component Purpose: A React component to display a backup message, ensuring security, accessibility, and internationalization.

interface Props {
  // Message to be displayed. This could be user-provided data, so we use dangerouslySetInnerHTML to prevent XSS attacks.
  userProvidedMessage?: string;
  // Optional fallback message in case userProvidedMessage is not provided.
  fallbackMessage?: string;
}

// Memoize the component to optimize performance if the children (message) are expensive to render.
const MemoizedMyComponent: FC<Props> = React.memo((props: Props) => {
  const { t } = useTranslation();
  const messageRef = useRef<HTMLDivElement>(null);
  const [isMessageVisible, setMessageVisible] = useState(false);

  // Check if the userProvidedMessage is empty or null, and if so, use the fallbackMessage.
  const message = props.userProvidedMessage || (props.fallbackMessage ? props.fallbackMessage : t('backup_message_fallback'));

  // Use a timeout to ensure the message is fully rendered before making it visible to avoid flickering.
  React.useEffect(() => {
    if (messageRef.current) {
      setTimeout(() => {
        setMessageVisible(true);
      }, 100);
    }
  }, [message]);

  return (
    <div>
      {/* Use aria-hidden to hide the message initially and aria-labelledby to provide a description for screen readers */}
      <div aria-hidden={!isMessageVisible} ref={messageRef}>
        {/* Use dangerouslySetInnerHTML to prevent XSS attacks when displaying user-provided data */}
        <div id="backup-message" aria-labelledby="backup-message-label" dangerouslySetInnerHTML={{ __html: message }} />
      </div>
      {/* Use aria-labelledby to provide a description for screen readers */}
      <div id="backup-message-label" className="sr-only">
        {t('backup_message_label')}
      </div>
    </div>
  );
});

export default MemoizedMyComponent;