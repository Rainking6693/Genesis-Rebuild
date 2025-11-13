import React, { FC, ReactNode, Key } from 'react';
import { ErrorMessageProps } from './ErrorMessageProps'; // Assuming you have a separate file for props definition

type SafeKey = Key | string | number;

const ErrorComponent: FC<ErrorMessageProps> = ({ message, id }) => {
  // Using a safe key for each error message to ensure React's stability
  const key: SafeKey = id || (message && message.toString());

  // Adding a role for accessibility
  const role = 'alert';

  // Adding a class for styling and visual feedback
  const className = 'error-message';

  // Handling edge cases where message is null, undefined, or an empty string
  if (!message) return null;
  if (message === '') return null;

  // Adding a description for screen readers
  const description = message;

  return (
    <div key={key} role={role} className={className} aria-describedby={`error-message-${key}`}>
      {message}
    </div>
  );
};

// Adding type for the default export
export default ErrorComponent;

import React, { FC, ReactNode, Key } from 'react';
import { ErrorMessageProps } from './ErrorMessageProps'; // Assuming you have a separate file for props definition

type SafeKey = Key | string | number;

const ErrorComponent: FC<ErrorMessageProps> = ({ message, id }) => {
  // Using a safe key for each error message to ensure React's stability
  const key: SafeKey = id || (message && message.toString());

  // Adding a role for accessibility
  const role = 'alert';

  // Adding a class for styling and visual feedback
  const className = 'error-message';

  // Handling edge cases where message is null, undefined, or an empty string
  if (!message) return null;
  if (message === '') return null;

  // Adding a description for screen readers
  const description = message;

  return (
    <div key={key} role={role} className={className} aria-describedby={`error-message-${key}`}>
      {message}
    </div>
  );
};

// Adding type for the default export
export default ErrorComponent;