import React, { FC, ReactNode, useState } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const [error, setError] = useState<boolean>(false);
  const [sanitizedMessage, setSanitizedMessage] = useState<string | null>(null);

  React.useEffect(() => {
    const sanitized = DOMPurify.sanitize(message);
    if (sanitized) {
      setSanitizedMessage(sanitized);
      setError(false);
    } else {
      setError(true);
    }
  }, [message]);

  if (error) {
    return <div>Error: Sanitized message is empty or invalid</div>;
  }

  if (!sanitizedMessage) {
    return <div>Loading...</div>;
  }

  return (
    <div key={sanitizedMessage} dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
  );
};

export default MyComponent;

import React, { FC, ReactNode, useState } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const [error, setError] = useState<boolean>(false);
  const [sanitizedMessage, setSanitizedMessage] = useState<string | null>(null);

  React.useEffect(() => {
    const sanitized = DOMPurify.sanitize(message);
    if (sanitized) {
      setSanitizedMessage(sanitized);
      setError(false);
    } else {
      setError(true);
    }
  }, [message]);

  if (error) {
    return <div>Error: Sanitized message is empty or invalid</div>;
  }

  if (!sanitizedMessage) {
    return <div>Loading...</div>;
  }

  return (
    <div key={sanitizedMessage} dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
  );
};

export default MyComponent;