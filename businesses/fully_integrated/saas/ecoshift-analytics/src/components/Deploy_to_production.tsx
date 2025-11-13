import React, { FC, ReactNode, useEffect, useState } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  children: ReactNode;
  message?: string;
}

const MyComponent: FC<Props> = ({ children, message }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState(message);

  useEffect(() => {
    if (message) {
      setSanitizedMessage(DOMPurify.sanitize(message));
    }
  }, [message]);

  if (sanitizedMessage) {
    return <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />;
  }

  return <>{children}</>;
};

MyComponent.error = (error: Error) => {
  console.error(error);
};

MyComponent.sanitizeHTML = (html: string) => DOMPurify.sanitize(html);

export default MyComponent as React.FC<Props>;

import React, { FC, ReactNode, useEffect, useState } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  children: ReactNode;
  message?: string;
}

const MyComponent: FC<Props> = ({ children, message }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState(message);

  useEffect(() => {
    if (message) {
      setSanitizedMessage(DOMPurify.sanitize(message));
    }
  }, [message]);

  if (sanitizedMessage) {
    return <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />;
  }

  return <>{children}</>;
};

MyComponent.error = (error: Error) => {
  console.error(error);
};

MyComponent.sanitizeHTML = (html: string) => DOMPurify.sanitize(html);

export default MyComponent as React.FC<Props>;