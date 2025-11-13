import React, { FC, useRef, useEffect, useState } from 'react';
import DOMPurify from 'dompurify';

type Props = {
  message: string;
  ariaLabel?: string;
};

const MyComponent: FC<Props> = ({ message, ariaLabel }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [sanitizedMessage, setSanitizedMessage] = useState('');

  useEffect(() => {
    const sanitized = DOMPurify.sanitize(message);
    if (sanitized) {
      setSanitizedMessage(sanitized);
    } else {
      setSanitizedMessage('Invalid HTML detected. Please review the message.');
    }
  }, [message]);

  return (
    <div ref={divRef} aria-label={ariaLabel}>
      {sanitizedMessage && (
        <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
      )}
    </div>
  );
};

MyComponent.defaultProps = {
  ariaLabel: 'MyComponent content',
};

export { MyComponent as default };
export { MyComponent };

import React, { FC, useRef, useEffect, useState } from 'react';
import DOMPurify from 'dompurify';

type Props = {
  message: string;
  ariaLabel?: string;
};

const MyComponent: FC<Props> = ({ message, ariaLabel }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [sanitizedMessage, setSanitizedMessage] = useState('');

  useEffect(() => {
    const sanitized = DOMPurify.sanitize(message);
    if (sanitized) {
      setSanitizedMessage(sanitized);
    } else {
      setSanitizedMessage('Invalid HTML detected. Please review the message.');
    }
  }, [message]);

  return (
    <div ref={divRef} aria-label={ariaLabel}>
      {sanitizedMessage && (
        <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
      )}
    </div>
  );
};

MyComponent.defaultProps = {
  ariaLabel: 'MyComponent content',
};

export { MyComponent as default };
export { MyComponent };