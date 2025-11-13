import React, { FC, useState, useMemo, useCallback, useEffect } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  message?: string;
  className?: string;
  title?: string;
  // Add a default value for message to avoid potential undefined errors
  messageDefaultValue?: string;
}

const MyComponent: FC<Props> = ({ message = '', className, title, messageDefaultValue }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState(messageDefaultValue || '');

  const sanitize = useCallback((html: string) => DOMPurify.sanitize(html), []);

  const sanitizedHtml = useMemo(() => sanitize(sanitizedMessage), [sanitizedMessage, sanitize]);

  // Use useEffect to sanitize the message when it changes
  useEffect(() => {
    setSanitizedMessage(messageDefaultValue || '');
  }, [message, messageDefaultValue]);

  // Add a check for non-empty sanitizedMessage before rendering
  if (!sanitizedMessage) return null;

  return (
    <div className={className} title={title || sanitizedMessage}>
      <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
    </div>
  );
};

export default MyComponent;

import React, { FC, useState, useMemo, useCallback, useEffect } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  message?: string;
  className?: string;
  title?: string;
  // Add a default value for message to avoid potential undefined errors
  messageDefaultValue?: string;
}

const MyComponent: FC<Props> = ({ message = '', className, title, messageDefaultValue }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState(messageDefaultValue || '');

  const sanitize = useCallback((html: string) => DOMPurify.sanitize(html), []);

  const sanitizedHtml = useMemo(() => sanitize(sanitizedMessage), [sanitizedMessage, sanitize]);

  // Use useEffect to sanitize the message when it changes
  useEffect(() => {
    setSanitizedMessage(messageDefaultValue || '');
  }, [message, messageDefaultValue]);

  // Add a check for non-empty sanitizedMessage before rendering
  if (!sanitizedMessage) return null;

  return (
    <div className={className} title={title || sanitizedMessage}>
      <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
    </div>
  );
};

export default MyComponent;