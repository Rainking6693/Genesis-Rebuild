import React, { FC, ReactNode } from 'react';
import { sanitizeUserInput } from './input_sanitization';

interface Props {
  subject: string;
  message: string;
  children?: ReactNode; // Allows for additional content in the component
}

const MyComponent: FC<Props> = ({ subject, message, children }) => {
  const sanitizedSubject = sanitizeUserInput(subject) || '';
  const sanitizedMessage = sanitizeUserInput(message) || '';

  // Adding a default fallback message for edge cases where sanitization fails
  const fallbackMessage = 'We encountered an error while processing your message. Please contact our support team.';
  const sanitizedMessageWithFallback = sanitizedMessage || fallbackMessage;

  return (
    <>
      <h3>{sanitizedSubject}</h3>
      <p>{sanitizedMessageWithFallback}</p>
      {/* Adding support for additional content */}
      {children}
    </>
  );
};

// Adding accessibility by providing ARIA labels
MyComponent.defaultProps = {
  'aria-label': 'Email marketing component',
};

export default MyComponent;

import React, { FC, ReactNode } from 'react';
import { sanitizeUserInput } from './input_sanitization';

interface Props {
  subject: string;
  message: string;
  children?: ReactNode; // Allows for additional content in the component
}

const MyComponent: FC<Props> = ({ subject, message, children }) => {
  const sanitizedSubject = sanitizeUserInput(subject) || '';
  const sanitizedMessage = sanitizeUserInput(message) || '';

  // Adding a default fallback message for edge cases where sanitization fails
  const fallbackMessage = 'We encountered an error while processing your message. Please contact our support team.';
  const sanitizedMessageWithFallback = sanitizedMessage || fallbackMessage;

  return (
    <>
      <h3>{sanitizedSubject}</h3>
      <p>{sanitizedMessageWithFallback}</p>
      {/* Adding support for additional content */}
      {children}
    </>
  );
};

// Adding accessibility by providing ARIA labels
MyComponent.defaultProps = {
  'aria-label': 'Email marketing component',
};

export default MyComponent;