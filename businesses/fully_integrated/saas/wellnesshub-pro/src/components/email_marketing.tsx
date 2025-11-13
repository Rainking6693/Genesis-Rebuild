import React, { PropsWithChildren, ReactNode } from 'react';
import { sanitizeUserInput } from '../../security/input_sanitization';
import { useMemo } from 'react';

interface Props {
  subject: string;
  message: string;
}

const MyComponent: React.FC<Props> = ({ subject, message }) => {
  const sanitizedSubject = useMemo(() => sanitizeUserInput(subject), [subject]);
  const sanitizedMessage = useMemo(() => sanitizeUserInput(message), [message]);

  // Check if sanitizedMessage is empty before rendering to avoid errors
  const sanitizedMessageWithPlaceholder = sanitizedMessage || '(No message provided)';

  // Use React.Fragment for better performance and cleaner markup
  return (
    <>
      <h1>{sanitizedSubject}</h1>
      <React.Fragment dangerouslySetInnerHTML={{ __html: sanitizedMessageWithPlaceholder }} />
      <a href="#" aria-label="Read more">Read more</a>
    </>
  );
};

// Add a default export for better code organization
export default MyComponent;

import React, { PropsWithChildren, ReactNode } from 'react';
import { sanitizeUserInput } from '../../security/input_sanitization';
import { useMemo } from 'react';

interface Props {
  subject: string;
  message: string;
}

const MyComponent: React.FC<Props> = ({ subject, message }) => {
  const sanitizedSubject = useMemo(() => sanitizeUserInput(subject), [subject]);
  const sanitizedMessage = useMemo(() => sanitizeUserInput(message), [message]);

  // Check if sanitizedMessage is empty before rendering to avoid errors
  const sanitizedMessageWithPlaceholder = sanitizedMessage || '(No message provided)';

  // Use React.Fragment for better performance and cleaner markup
  return (
    <>
      <h1>{sanitizedSubject}</h1>
      <React.Fragment dangerouslySetInnerHTML={{ __html: sanitizedMessageWithPlaceholder }} />
      <a href="#" aria-label="Read more">Read more</a>
    </>
  );
};

// Add a default export for better code organization
export default MyComponent;