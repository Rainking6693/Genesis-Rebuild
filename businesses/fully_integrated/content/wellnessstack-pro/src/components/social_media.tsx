import React, { FC, Key, ReactNode } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  message?: string;
  children?: ReactNode;
}

const MyComponent: FC<Props> = ({ message, children }) => {
  const sanitizedMessage = message ? DOMPurify.sanitize(message) : undefined;
  const sanitizedChildren = children ? DOMPurify.sanitize(children.toString()) : undefined;

  if (sanitizedMessage || sanitizedChildren) {
    return (
      <div>
        {sanitizedMessage && <div key={sanitizedMessage} dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />}
        {sanitizedChildren && <div key={`children-${Date.now()}`} dangerouslySetInnerHTML={{ __html: sanitizedChildren }} />}
      </div>
    );
  }

  return null;
};

MyComponent.defaultProps = {
  message: '',
};

MyComponent.displayName = 'MyComponent';

export default MyComponent;

import React, { FC, Key, ReactNode } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  message?: string;
  children?: ReactNode;
}

const MyComponent: FC<Props> = ({ message, children }) => {
  const sanitizedMessage = message ? DOMPurify.sanitize(message) : undefined;
  const sanitizedChildren = children ? DOMPurify.sanitize(children.toString()) : undefined;

  if (sanitizedMessage || sanitizedChildren) {
    return (
      <div>
        {sanitizedMessage && <div key={sanitizedMessage} dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />}
        {sanitizedChildren && <div key={`children-${Date.now()}`} dangerouslySetInnerHTML={{ __html: sanitizedChildren }} />}
      </div>
    );
  }

  return null;
};

MyComponent.defaultProps = {
  message: '',
};

MyComponent.displayName = 'MyComponent';

export default MyComponent;