export type SanitizeFunction = (input: string, language?: string) => string;

export const sanitizeUserInput: SanitizeFunction = (input, language) => {
  if (typeof language !== 'string') {
    throw new Error('The language parameter must be a string.');
  }

  try {
    const sanitizedInput = input
      .replace(/<script[^>]*>([\w\W]*?)<\/script>/gi, '')
      .replace(/<style[^>]*>([\w\W]*?)<\/style>/gi, '')
      .replace(/<[\w:-]+([^>]*)(\b|>)/gi, '')
      .replace(/on[^>]+="[^"]*"/gi, '')
      .replace(/javascript:[\w\W]*?\n/gi, '');

    return sanitizedInput;
  } catch (error) {
    console.error('Error sanitizing user input:', error);
    return '';
  }
};

// MyComponent.tsx
import React, { PropsWithChildren } from 'react';
import { sanitizeUserInput } from '../../security/input_sanitization';

interface Props extends PropsWithChildren {
  message: string;
  language?: string;
}

const MyComponent: React.FC<Props> = ({ children, message, language = '' }) => {
  const sanitizedMessage = sanitizeUserInput(message, language); // Sanitize user input for security

  return (
    <div>
      {sanitizedMessage || children}
    </div>
  );
};

export default MyComponent;