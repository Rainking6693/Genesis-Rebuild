import React, { FC, Key, useEffect, useState } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  message?: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState('');

  useEffect(() => {
    if (message) {
      setSanitizedMessage(DOMPurify.sanitize(message));
    }
  }, [message]);

  const key = sanitizedMessage; // Use the sanitized message as the key

  return (
    <div key={key} dangerouslySetInnerHTML={{ __html: sanitizedMessage }} aria-label={sanitizedMessage}>
      {!sanitizedMessage && <div>Loading...</div>}
    </div>
  );
};

export default MyComponent;

import React, { FC, Key, useEffect, useState } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  message?: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState('');

  useEffect(() => {
    if (message) {
      setSanitizedMessage(DOMPurify.sanitize(message));
    }
  }, [message]);

  const key = sanitizedMessage; // Use the sanitized message as the key

  return (
    <div key={key} dangerouslySetInnerHTML={{ __html: sanitizedMessage }} aria-label={sanitizedMessage}>
      {!sanitizedMessage && <div>Loading...</div>}
    </div>
  );
};

export default MyComponent;