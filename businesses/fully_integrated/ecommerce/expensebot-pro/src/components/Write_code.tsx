import React, { FC, ReactNode, useEffect, useState } from 'react';
import DOMPurify from 'dompurify';

interface SanitizedHTMLData {
  __html: string;
}

interface Props {
  message?: string;
  className?: string;
  children?: ReactNode;
}

const MyComponent: FC<Props> = ({ message = '', className, children }) => {
  const [safeHTML, setSafeHTML] = useState<ReactNode | null>(null);

  useEffect(() => {
    if (message) {
      setSafeHTML(DOMPurify.sanitize(message));
    }
  }, [message]);

  return (
    <div key={message} className={className} role="text">
      {safeHTML || children}
    </div>
  );
};

export default MyComponent;

import React, { FC, ReactNode, useEffect, useState } from 'react';
import DOMPurify from 'dompurify';

interface SanitizedHTMLData {
  __html: string;
}

interface Props {
  message?: string;
  className?: string;
  children?: ReactNode;
}

const MyComponent: FC<Props> = ({ message = '', className, children }) => {
  const [safeHTML, setSafeHTML] = useState<ReactNode | null>(null);

  useEffect(() => {
    if (message) {
      setSafeHTML(DOMPurify.sanitize(message));
    }
  }, [message]);

  return (
    <div key={message} className={className} role="text">
      {safeHTML || children}
    </div>
  );
};

export default MyComponent;