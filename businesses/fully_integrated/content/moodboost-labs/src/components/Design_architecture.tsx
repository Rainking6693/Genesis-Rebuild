import React, { FC, ReactNode, useEffect, useState } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  className?: string;
  messageId?: string;
  message?: string;
}

const defaultMessages = {
  en: {
    default: 'Default message',
  },
};

const MyComponent: FC<Props> = ({ className, messageId, message }) => {
  const [translatedMessage, setTranslatedMessage] = useState(message || defaultMessages.en.default);

  useEffect(() => {
    if (messageId) {
      setTranslatedMessage((prevState) => {
        const messages = getMessages();
        const message = messages[messages.currentLanguage]?.[messageId] || messages.en?.[messageId] || '';
        return message || prevState;
      });
    }
  }, [messageId, defaultMessages]);

  const getMessages = () => {
    const messages = {
      en: {
        ...defaultMessages.en,
      },
      // Add custom translations here
    };
    return messages;
  };

  const sanitizeMessage = (message: string) => {
    return DOMPurify.sanitize(message);
  };

  const useTranslation = () => {
    const [currentLanguage, setCurrentLanguage] = useState('en');

    const setLanguage = (language: string) => {
      setCurrentLanguage(language);
    };

    return { currentLanguage, setLanguage };
  };

  const handleMessageIdChange = (newMessageId: string) => {
    if (newMessageId !== messageId) {
      setTranslatedMessage((prevState) => {
        const messages = getMessages();
        const message = messages[messages.currentLanguage]?.[newMessageId] || messages.en?.[newMessageId] || '';
        return message || prevState;
      });
    }
  };

  return (
    <div
      className={`moodboost-message ${className}`}
      aria-label={translatedMessage}
      key={messageId || translatedMessage}
      style={{ maxWidth: '400px' }}
    >
      {sanitizeMessage(translatedMessage)}
    </div>
  );
};

MyComponent.displayName = 'MyComponent';
MyComponent.sanitizeMessage = sanitizeMessage;

export default MyComponent;

// Custom hook for managing translations
export const useAppTranslation = () => useTranslation();

// Add a prop to allow changing the messageId programmatically
MyComponent.defaultProps = {
  messageId: undefined,
};

MyComponent.handleMessageIdChange = handleMessageIdChange;

import React, { FC, ReactNode, useEffect, useState } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  className?: string;
  messageId?: string;
  message?: string;
}

const defaultMessages = {
  en: {
    default: 'Default message',
  },
};

const MyComponent: FC<Props> = ({ className, messageId, message }) => {
  const [translatedMessage, setTranslatedMessage] = useState(message || defaultMessages.en.default);

  useEffect(() => {
    if (messageId) {
      setTranslatedMessage((prevState) => {
        const messages = getMessages();
        const message = messages[messages.currentLanguage]?.[messageId] || messages.en?.[messageId] || '';
        return message || prevState;
      });
    }
  }, [messageId, defaultMessages]);

  const getMessages = () => {
    const messages = {
      en: {
        ...defaultMessages.en,
      },
      // Add custom translations here
    };
    return messages;
  };

  const sanitizeMessage = (message: string) => {
    return DOMPurify.sanitize(message);
  };

  const useTranslation = () => {
    const [currentLanguage, setCurrentLanguage] = useState('en');

    const setLanguage = (language: string) => {
      setCurrentLanguage(language);
    };

    return { currentLanguage, setLanguage };
  };

  const handleMessageIdChange = (newMessageId: string) => {
    if (newMessageId !== messageId) {
      setTranslatedMessage((prevState) => {
        const messages = getMessages();
        const message = messages[messages.currentLanguage]?.[newMessageId] || messages.en?.[newMessageId] || '';
        return message || prevState;
      });
    }
  };

  return (
    <div
      className={`moodboost-message ${className}`}
      aria-label={translatedMessage}
      key={messageId || translatedMessage}
      style={{ maxWidth: '400px' }}
    >
      {sanitizeMessage(translatedMessage)}
    </div>
  );
};

MyComponent.displayName = 'MyComponent';
MyComponent.sanitizeMessage = sanitizeMessage;

export default MyComponent;

// Custom hook for managing translations
export const useAppTranslation = () => useTranslation();

// Add a prop to allow changing the messageId programmatically
MyComponent.defaultProps = {
  messageId: undefined,
};

MyComponent.handleMessageIdChange = handleMessageIdChange;