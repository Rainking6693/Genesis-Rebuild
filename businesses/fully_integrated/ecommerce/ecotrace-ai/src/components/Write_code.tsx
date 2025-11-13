import React, { FC, useCallback, useMemo, useEffect, useState } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  message?: string;
}

type SanitizedHTML = { __html: string };

const sanitizeHTML = useCallback((html: string) => ({ __html: DOMPurify.sanitize(html) }), []);

const MyComponent: FC<Props> = ({ message }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState<SanitizedHTML>({ __html: '' });

  const handleMessageChange = useCallback((newMessage: string) => {
    if (newMessage) {
      setSanitizedMessage(sanitizeHTML(newMessage));
    }
  }, [sanitizeHTML]);

  useEffect(() => {
    if (message) {
      handleMessageChange(message);
    }
  }, [message, handleMessageChange]);

  return (
    <div aria-label="MyComponent">
      <div key={sanitizedMessage.__html} dangerouslySetInnerHTML={sanitizedMessage} />
    </div>
  );
};

export default MyComponent;

import React, { FC, useCallback, useMemo, useEffect, useState } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  message?: string;
}

type SanitizedHTML = { __html: string };

const sanitizeHTML = useCallback((html: string) => ({ __html: DOMPurify.sanitize(html) }), []);

const MyComponent: FC<Props> = ({ message }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState<SanitizedHTML>({ __html: '' });

  const handleMessageChange = useCallback((newMessage: string) => {
    if (newMessage) {
      setSanitizedMessage(sanitizeHTML(newMessage));
    }
  }, [sanitizeHTML]);

  useEffect(() => {
    if (message) {
      handleMessageChange(message);
    }
  }, [message, handleMessageChange]);

  return (
    <div aria-label="MyComponent">
      <div key={sanitizedMessage.__html} dangerouslySetInnerHTML={sanitizedMessage} />
    </div>
  );
};

export default MyComponent;