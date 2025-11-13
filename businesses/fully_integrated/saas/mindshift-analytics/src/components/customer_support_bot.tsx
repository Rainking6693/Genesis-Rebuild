import React, { FC, useContext, ReactNode } from 'react';
import { ThemeContext } from './ThemeContext';

interface ThemeContextData {
  isDarkMode: boolean;
  // Add any other properties that the context provides
}

interface Props {
  message: string;
  title?: string;
}

const validateMessage = (message: string): string => {
  // Implement a simple validation function to ensure the message is safe to display
  // This is a basic example, you should use a more robust solution in a production environment
  const safeMessage = message.replace(/<.*?>/g, '');
  if (!safeMessage) {
    throw new Error('Invalid or unsafe message');
  }
  return safeMessage;
};

const MyComponent: FC<Props> = ({ message, title }) => {
  const { isDarkMode } = useContext<ThemeContextData | null>(ThemeContext);

  const sanitizedMessage = validateMessage(message);

  if (!sanitizedMessage) {
    return null;
  }

  return (
    <div
      key={sanitizedMessage}
      className={`message ${isDarkMode ? 'dark' : ''}`}
      dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
      title={title}
    />
  );
};

MyComponent.defaultProps = {
  message: '',
  title: '',
};

MyComponent.validateMessage = validateMessage;

export default MyComponent;

import React, { FC, useContext, ReactNode } from 'react';
import { ThemeContext } from './ThemeContext';

interface ThemeContextData {
  isDarkMode: boolean;
  // Add any other properties that the context provides
}

interface Props {
  message: string;
  title?: string;
}

const validateMessage = (message: string): string => {
  // Implement a simple validation function to ensure the message is safe to display
  // This is a basic example, you should use a more robust solution in a production environment
  const safeMessage = message.replace(/<.*?>/g, '');
  if (!safeMessage) {
    throw new Error('Invalid or unsafe message');
  }
  return safeMessage;
};

const MyComponent: FC<Props> = ({ message, title }) => {
  const { isDarkMode } = useContext<ThemeContextData | null>(ThemeContext);

  const sanitizedMessage = validateMessage(message);

  if (!sanitizedMessage) {
    return null;
  }

  return (
    <div
      key={sanitizedMessage}
      className={`message ${isDarkMode ? 'dark' : ''}`}
      dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
      title={title}
    />
  );
};

MyComponent.defaultProps = {
  message: '',
  title: '',
};

MyComponent.validateMessage = validateMessage;

export default MyComponent;