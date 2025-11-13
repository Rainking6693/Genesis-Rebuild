import React, { FC, ReactNode, useRef } from 'react';

interface Props {
  subject?: string;
  message?: string;
}

const MyComponent: FC<Props> = ({ subject = 'Untitled Email', message = 'No message provided.' }) => {
  const componentId = 'email-component';
  const subjectRef = useRef<HTMLHeadingElement>(null);
  const messageRef = useRef<HTMLParagraphElement>(null);

  // Add a fallback for screen readers if the subject or message is empty
  const fallback = subject || message ? `${subject} ${message}` : 'An empty email';

  // Add a unique key to the message for better performance in lists
  const uniqueKey = messageRef.current ? messageRef.current.key : undefined;

  return (
    <React.Fragment>
      <h3 id={componentId} ref={subjectRef} aria-label={`Email subject: ${subject}`}>{subject}</h3>
      <p id={`${componentId}-message`} ref={messageRef} key={uniqueKey} aria-label={`Email message: ${fallback}`}>{message}</p>
    </React.Fragment>
  );
};

export default MyComponent;

import React, { FC, ReactNode, useRef } from 'react';

interface Props {
  subject?: string;
  message?: string;
}

const MyComponent: FC<Props> = ({ subject = 'Untitled Email', message = 'No message provided.' }) => {
  const componentId = 'email-component';
  const subjectRef = useRef<HTMLHeadingElement>(null);
  const messageRef = useRef<HTMLParagraphElement>(null);

  // Add a fallback for screen readers if the subject or message is empty
  const fallback = subject || message ? `${subject} ${message}` : 'An empty email';

  // Add a unique key to the message for better performance in lists
  const uniqueKey = messageRef.current ? messageRef.current.key : undefined;

  return (
    <React.Fragment>
      <h3 id={componentId} ref={subjectRef} aria-label={`Email subject: ${subject}`}>{subject}</h3>
      <p id={`${componentId}-message`} ref={messageRef} key={uniqueKey} aria-label={`Email message: ${fallback}`}>{message}</p>
    </React.Fragment>
  );
};

export default MyComponent;