import React, { FC, useCallback, useMemo } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const sanitizeMessage = useCallback((message: string) => DOMPurify.sanitize(message), []);
  const sanitizedMessage = useMemo(() => sanitizeMessage(message), [message, sanitizeMessage]);

  return (
    <div
      // Use key attribute for accessibility and performance
      key={message}
      // Sanitize the message before rendering
      dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
    />
  );
};

export default MyComponent;

import React, { FC, useCallback, useMemo } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const sanitizeMessage = useCallback((message: string) => DOMPurify.sanitize(message), []);
  const sanitizedMessage = useMemo(() => sanitizeMessage(message), [message, sanitizeMessage]);

  return (
    <div
      // Use key attribute for accessibility and performance
      key={message}
      // Sanitize the message before rendering
      dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
    />
  );
};

export default MyComponent;