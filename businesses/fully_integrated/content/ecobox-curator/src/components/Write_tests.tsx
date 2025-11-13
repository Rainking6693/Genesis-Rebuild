import React, { Key, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  messageKey: string; // Use messageKey instead of message for better maintainability
  fallbackMessage?: string; // Add fallbackMessage for edge cases where the translation is not found
  fallbackComponent?: ReactNode; // Add fallbackComponent for edge cases where the translation is not a string
  key?: Key; // Adding a key for better accessibility
}

const MyComponent: React.FC<Props> = ({ messageKey, fallbackMessage, fallbackComponent, key }) => {
  const { t } = useTranslation();

  // Using t function to translate the message
  const translatedMessage = t(messageKey, { returnObjects: true }) || fallbackMessage;

  // Check if translatedMessage is a string or a valid ReactNode before setting it as HTML
  if (typeof translatedMessage === 'string' || (translatedMessage !== null && typeof translatedMessage === 'object' && 'props' in translatedMessage)) {
    return <div key={key} dangerouslySetInnerHTML={{ __html: translatedMessage as string }} />;
  }

  // If translatedMessage is not a string or a valid ReactNode, return the fallbackComponent or an error message
  return fallbackComponent || <div key={key}>{`Error: Translated message is not a string or a valid ReactNode: ${JSON.stringify(translatedMessage)}`}</div>;
};

export default MyComponent;

import React, { Key, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  messageKey: string; // Use messageKey instead of message for better maintainability
  fallbackMessage?: string; // Add fallbackMessage for edge cases where the translation is not found
  fallbackComponent?: ReactNode; // Add fallbackComponent for edge cases where the translation is not a string
  key?: Key; // Adding a key for better accessibility
}

const MyComponent: React.FC<Props> = ({ messageKey, fallbackMessage, fallbackComponent, key }) => {
  const { t } = useTranslation();

  // Using t function to translate the message
  const translatedMessage = t(messageKey, { returnObjects: true }) || fallbackMessage;

  // Check if translatedMessage is a string or a valid ReactNode before setting it as HTML
  if (typeof translatedMessage === 'string' || (translatedMessage !== null && typeof translatedMessage === 'object' && 'props' in translatedMessage)) {
    return <div key={key} dangerouslySetInnerHTML={{ __html: translatedMessage as string }} />;
  }

  // If translatedMessage is not a string or a valid ReactNode, return the fallbackComponent or an error message
  return fallbackComponent || <div key={key}>{`Error: Translated message is not a string or a valid ReactNode: ${JSON.stringify(translatedMessage)}`}</div>;
};

export default MyComponent;