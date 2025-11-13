import React, { PropsWithChildren, useState, useEffect, Key } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  message: string;
  className?: string;
  style?: React.CSSProperties;
}

const MyComponent: React.FC<Props> = ({ children, message, className, style }) => {
  const divRef = useRef<HTMLDivElement>(null);

  const [sanitizedMessage, setSanitizedMessage] = useState(message);

  useEffect(() => {
    if (divRef.current) {
      setSanitizedMessage(DOMPurify.sanitize(message));
    }
  }, [message]);

  return (
    <div ref={divRef} className={className} style={style} key={sanitizedMessage}>
      {children}
      {sanitizedMessage}
    </div>
  );
};

export default MyComponent;

import React, { PropsWithChildren, useState, useEffect, Key } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  message: string;
  className?: string;
  style?: React.CSSProperties;
}

const MyComponent: React.FC<Props> = ({ children, message, className, style }) => {
  const divRef = useRef<HTMLDivElement>(null);

  const [sanitizedMessage, setSanitizedMessage] = useState(message);

  useEffect(() => {
    if (divRef.current) {
      setSanitizedMessage(DOMPurify.sanitize(message));
    }
  }, [message]);

  return (
    <div ref={divRef} className={className} style={style} key={sanitizedMessage}>
      {children}
      {sanitizedMessage}
    </div>
  );
};

export default MyComponent;