import React, { FC, PropsWithChildren, useContext } from 'react';
import { ErrorContext } from './ErrorContext';

interface Props extends PropsWithChildren<{ message?: string }> {
  /**
   * Optional message to display. If not provided, the default message "Loading..." will be used.
   */
  message?: string;
}

const MyComponent: FC<Props> = ({ children = 'Loading...', message }) => {
  const { setError } = useContext(ErrorContext);
  const sanitizedMessage = message ? sanitizeMessage(message) : children;

  return (
    <div data-testid="my-component">
      {sanitizedMessage ? (
        <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
      ) : (
        <div onClick={() => setError('An error occurred while loading the message.')}>
          An error occurred while loading the message.
        </div>
      )}
    </div>
  );
};

// Add error handling and sanitization for user-generated messages
const sanitizeMessage = (message: string) => {
  // Implement a simple sanitization function to prevent XSS attacks
  // For production use, consider using a library like DOMPurify
  const sanitizedMessage = message
    .replace(/<script>/g, '')
    .replace(/<style>/g, '')
    .replace(/<\/script>/g, '')
    .replace(/<\/style>/g, '');

  if (!sanitizedMessage) {
    throw new Error('Invalid or empty message');
  }

  return sanitizedMessage;
};

MyComponent.defaultProps = {
  message: 'Loading...',
};

export default MyComponent;

// ErrorContext.ts
import React, { createContext, useState } from 'react';

export const ErrorContext = createContext<React.Dispatch<React.SetStateAction<string>>>(() => {});

export const ErrorProvider: React.FC = ({ children }) => {
  const [error, setError] = useState('');

  return (
    <ErrorContext.Provider value={setError}>
      {children}
      {error && <div>{error}</div>}
    </ErrorContext.Provider>
  );
};

import React, { FC, PropsWithChildren, useContext } from 'react';
import { ErrorContext } from './ErrorContext';

interface Props extends PropsWithChildren<{ message?: string }> {
  /**
   * Optional message to display. If not provided, the default message "Loading..." will be used.
   */
  message?: string;
}

const MyComponent: FC<Props> = ({ children = 'Loading...', message }) => {
  const { setError } = useContext(ErrorContext);
  const sanitizedMessage = message ? sanitizeMessage(message) : children;

  return (
    <div data-testid="my-component">
      {sanitizedMessage ? (
        <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
      ) : (
        <div onClick={() => setError('An error occurred while loading the message.')}>
          An error occurred while loading the message.
        </div>
      )}
    </div>
  );
};

// Add error handling and sanitization for user-generated messages
const sanitizeMessage = (message: string) => {
  // Implement a simple sanitization function to prevent XSS attacks
  // For production use, consider using a library like DOMPurify
  const sanitizedMessage = message
    .replace(/<script>/g, '')
    .replace(/<style>/g, '')
    .replace(/<\/script>/g, '')
    .replace(/<\/style>/g, '');

  if (!sanitizedMessage) {
    throw new Error('Invalid or empty message');
  }

  return sanitizedMessage;
};

MyComponent.defaultProps = {
  message: 'Loading...',
};

export default MyComponent;

// ErrorContext.ts
import React, { createContext, useState } from 'react';

export const ErrorContext = createContext<React.Dispatch<React.SetStateAction<string>>>(() => {});

export const ErrorProvider: React.FC = ({ children }) => {
  const [error, setError] = useState('');

  return (
    <ErrorContext.Provider value={setError}>
      {children}
      {error && <div>{error}</div>}
    </ErrorContext.Provider>
  );
};