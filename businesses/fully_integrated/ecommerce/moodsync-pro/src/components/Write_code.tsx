import React, { FC, ReactNode, useEffect, useState } from 'react';
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

  return (
    <React.Fragment>
      {sanitizedMessage && (
        <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
      )}
      {message && (
        <div
          aria-live="polite"
          role="alert"
          data-testid="fallback-text"
        >
          {message}
        </div>
      )}
    </React.Fragment>
  );
};

export default MyComponent;

import React, { FC, ReactNode, useEffect, useState } from 'react';
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

  return (
    <React.Fragment>
      {sanitizedMessage && (
        <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
      )}
      {message && (
        <div
          aria-live="polite"
          role="alert"
          data-testid="fallback-text"
        >
          {message}
        </div>
      )}
    </React.Fragment>
  );
};

export default MyComponent;