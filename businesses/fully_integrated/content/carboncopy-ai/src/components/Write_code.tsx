import React, { FC, Key, ReactNode } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  message?: string;
}

const MyComponent: FC<Props> = ({ message = 'No message provided' }) => {
  const sanitizedMessage = DOMPurify.sanitize(message || '');

  // Check if sanitizedMessage is empty before setting innerHTML
  if (sanitizedMessage) {
    return (
      <div key={sanitizedMessage} aria-label={sanitizedMessage}>
        <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
      </div>
    );
  }

  return <div aria-label="No message provided" />;
};

export default MyComponent;

import React, { FC, Key, ReactNode } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  message?: string;
}

const MyComponent: FC<Props> = ({ message = 'No message provided' }) => {
  const sanitizedMessage = DOMPurify.sanitize(message || '');

  // Check if sanitizedMessage is empty before setting innerHTML
  if (sanitizedMessage) {
    return (
      <div key={sanitizedMessage} aria-label={sanitizedMessage}>
        <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
      </div>
    );
  }

  return <div aria-label="No message provided" />;
};

export default MyComponent;