import React, { useState, useEffect, ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';
import DOMPurify from 'dompurify';

const sanitizeMessage = (message: string) => {
  if (DOMPurify) {
    return DOMPurify.sanitize(message);
  }
  throw new Error('DOMPurify not found');
};

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message?: string;
}

const MyComponent: React.FC<Props> = ({ message = '', ...ariaProps }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState(message);

  useEffect(() => {
    setSanitizedMessage(sanitizeMessage(message));
  }, [message]);

  if (!sanitizedMessage) return null;

  return (
    <div {...ariaProps} role="presentation">
      <MemoizedMyComponent sanitizedMessage={sanitizedMessage} />
    </div>
  );
};

const MemoizedMyComponent = React.memo(({ sanitizedMessage }: { sanitizedMessage: string }) => {
  return <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />;
});

export default MyComponent;

import React, { useState, useEffect, ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';
import DOMPurify from 'dompurify';

const sanitizeMessage = (message: string) => {
  if (DOMPurify) {
    return DOMPurify.sanitize(message);
  }
  throw new Error('DOMPurify not found');
};

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message?: string;
}

const MyComponent: React.FC<Props> = ({ message = '', ...ariaProps }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState(message);

  useEffect(() => {
    setSanitizedMessage(sanitizeMessage(message));
  }, [message]);

  if (!sanitizedMessage) return null;

  return (
    <div {...ariaProps} role="presentation">
      <MemoizedMyComponent sanitizedMessage={sanitizedMessage} />
    </div>
  );
};

const MemoizedMyComponent = React.memo(({ sanitizedMessage }: { sanitizedMessage: string }) => {
  return <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />;
});

export default MyComponent;