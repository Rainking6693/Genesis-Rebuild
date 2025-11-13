import React, { FC, useRef, useCallback } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const divRef = useRef<HTMLDivElement>(null);

  const handleSanitize = useCallback(() => {
    if (divRef.current) {
      divRef.current.innerHTML = DOMPurify.sanitize(message);
    }
  }, [message]);

  React.useEffect(handleSanitize, [message]);

  return (
    <div ref={divRef} className="my-component">
      <div className="my-component-content" dangerouslySetInnerHTML={{ __html: message }} />
    </div>
  );
};

export default MyComponent;

import React, { FC, useRef, useCallback } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const divRef = useRef<HTMLDivElement>(null);

  const handleSanitize = useCallback(() => {
    if (divRef.current) {
      divRef.current.innerHTML = DOMPurify.sanitize(message);
    }
  }, [message]);

  React.useEffect(handleSanitize, [message]);

  return (
    <div ref={divRef} className="my-component">
      <div className="my-component-content" dangerouslySetInnerHTML={{ __html: message }} />
    </div>
  );
};

export default MyComponent;