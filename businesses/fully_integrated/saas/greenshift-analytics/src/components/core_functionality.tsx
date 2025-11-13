// i18n messages.ts
export const messages = {
  invalidMessage: 'Invalid message provided. Message must be a non-empty string.',
  unsafeCharacters: 'Message contains unsafe characters. Please remove any special characters.',
  maxLengthExceeded: 'Message is too long. Maximum length is 255 characters.',
};

// validateMessage.ts
import messages from './messages';

export const validateMessage = (message: string): string => {
  // Basic validation checks
  if (!message || typeof message !== 'string') {
    throw new Error(messages.invalidMessage);
  }

  if (message.length > 255) {
    throw new Error(messages.maxLengthExceeded);
  }

  // Custom validation logic (e.g., check for XSS attacks)
  const safeRegex = /^[\w\s\.\,\!\?\(\)\-\+\=\/\@\#\$\%\&\*\;\:\'\"]+$/;
  if (!safeRegex.test(message)) {
    throw new Error(messages.unsafeCharacters);
  }

  return message;
};

// debounce.ts
export const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

// MyComponent.tsx
import React, { FC, useState } from 'react';
import { validateMessage, debounce } from './validateMessage';
import messages from './messages';

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const [error, setError] = useState<string | null>(null);

  const handleMessageChange = debounce((event: React.ChangeEvent<HTMLInputElement>) => {
    const inputMessage = event.target.value;
    try {
      const validatedMessage = validateMessage(inputMessage);
      setError(null);
      return <div dangerouslySetInnerHTML={{ __html: validatedMessage }} />;
    } catch (error) {
      setError(error.message);
      return <div>{error.message}</div>;
    }
  }, 500);

  return (
    <>
      <input
        type="text"
        placeholder="Enter your message"
        role="textbox"
        aria-label="Enter your message"
        onChange={handleMessageChange}
        maxLength={255}
      />
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </>
  );
};

// Test validateMessage function
const testValidateMessage = () => {
  const testCases = [
    { input: '', expected: messages.invalidMessage },
    { input: '123', expected: messages.unsafeCharacters },
    { input: 'abcdefghijklmnopqrstuvwxyz', expected: '' },
    { input: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%&*()-_+=[]{}|;:'\'", expected: '' },
    { input: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%&*()-_+=[]{}|;:'\''.repeat(256), expected: messages.maxLengthExceeded },
  ];

  testCases.forEach(({ input, expected }) => {
    const result = validateMessage(input);
    expect(result).toEqual(expected);
  });
};

// Extract the validation function to a separate module for reusability
export { validateMessage, MyComponent, testValidateMessage };

// i18n messages.ts
export const messages = {
  invalidMessage: 'Invalid message provided. Message must be a non-empty string.',
  unsafeCharacters: 'Message contains unsafe characters. Please remove any special characters.',
  maxLengthExceeded: 'Message is too long. Maximum length is 255 characters.',
};

// validateMessage.ts
import messages from './messages';

export const validateMessage = (message: string): string => {
  // Basic validation checks
  if (!message || typeof message !== 'string') {
    throw new Error(messages.invalidMessage);
  }

  if (message.length > 255) {
    throw new Error(messages.maxLengthExceeded);
  }

  // Custom validation logic (e.g., check for XSS attacks)
  const safeRegex = /^[\w\s\.\,\!\?\(\)\-\+\=\/\@\#\$\%\&\*\;\:\'\"]+$/;
  if (!safeRegex.test(message)) {
    throw new Error(messages.unsafeCharacters);
  }

  return message;
};

// debounce.ts
export const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

// MyComponent.tsx
import React, { FC, useState } from 'react';
import { validateMessage, debounce } from './validateMessage';
import messages from './messages';

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const [error, setError] = useState<string | null>(null);

  const handleMessageChange = debounce((event: React.ChangeEvent<HTMLInputElement>) => {
    const inputMessage = event.target.value;
    try {
      const validatedMessage = validateMessage(inputMessage);
      setError(null);
      return <div dangerouslySetInnerHTML={{ __html: validatedMessage }} />;
    } catch (error) {
      setError(error.message);
      return <div>{error.message}</div>;
    }
  }, 500);

  return (
    <>
      <input
        type="text"
        placeholder="Enter your message"
        role="textbox"
        aria-label="Enter your message"
        onChange={handleMessageChange}
        maxLength={255}
      />
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </>
  );
};

// Test validateMessage function
const testValidateMessage = () => {
  const testCases = [
    { input: '', expected: messages.invalidMessage },
    { input: '123', expected: messages.unsafeCharacters },
    { input: 'abcdefghijklmnopqrstuvwxyz', expected: '' },
    { input: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%&*()-_+=[]{}|;:'\'", expected: '' },
    { input: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%&*()-_+=[]{}|;:'\''.repeat(256), expected: messages.maxLengthExceeded },
  ];

  testCases.forEach(({ input, expected }) => {
    const result = validateMessage(input);
    expect(result).toEqual(expected);
  });
};

// Extract the validation function to a separate module for reusability
export { validateMessage, MyComponent, testValidateMessage };