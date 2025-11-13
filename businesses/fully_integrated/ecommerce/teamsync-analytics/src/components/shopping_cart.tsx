import React, { FC, Key, useState } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  message?: string;
  key?: Key;
  className?: string;
  id?: string;
  ariaLabel?: string;
}

const MyComponent: FC<Props> = ({ message, key, className, id, ariaLabel }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState(message || '');

  React.useEffect(() => {
    if (message) {
      setSanitizedMessage(DOMPurify.sanitize(message));
    }
  }, [message]);

  return (
    <div
      key={key}
      className={className}
      id={id}
      aria-label={ariaLabel}
    >
      {sanitizedMessage}
    </div>
  );
};

MyComponent.defaultProps = {
  message: '',
  key: Math.random().toString(),
};

export default MyComponent;

import React, { FC, Key, useState } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  message?: string;
  key?: Key;
  className?: string;
  id?: string;
  ariaLabel?: string;
}

const MyComponent: FC<Props> = ({ message, key, className, id, ariaLabel }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState(message || '');

  React.useEffect(() => {
    if (message) {
      setSanitizedMessage(DOMPurify.sanitize(message));
    }
  }, [message]);

  return (
    <div
      key={key}
      className={className}
      id={id}
      aria-label={ariaLabel}
    >
      {sanitizedMessage}
    </div>
  );
};

MyComponent.defaultProps = {
  message: '',
  key: Math.random().toString(),
};

export default MyComponent;