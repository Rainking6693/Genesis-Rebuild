import React, { FC, PropsWithChildren, ReactNode } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  message?: string;
  children?: ReactNode;
}

const MyComponent: FC<Props> = ({ message, children }) => {
  const sanitizedMessage = message ? DOMPurify.sanitize(message) : '';

  if (!sanitizedMessage && !children) {
    return <div>No message provided</div>;
  }

  return (
    <div>
      {sanitizedMessage && (
        <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
      )}
      {children}
    </div>
  );
};

export { MyComponent };

import React, { FC, PropsWithChildren, ReactNode } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  message?: string;
  children?: ReactNode;
}

const MyComponent: FC<Props> = ({ message, children }) => {
  const sanitizedMessage = message ? DOMPurify.sanitize(message) : '';

  if (!sanitizedMessage && !children) {
    return <div>No message provided</div>;
  }

  return (
    <div>
      {sanitizedMessage && (
        <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
      )}
      {children}
    </div>
  );
};

export { MyComponent };