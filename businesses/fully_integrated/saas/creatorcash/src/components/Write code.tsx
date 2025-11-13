import React, { FC, useRef, useEffect, useState } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  message?: string;
}

const MyComponent: FC<Props> = ({ message = '' }) => {
  const [divContent, setDivContent] = useState(message);
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (divRef.current) {
      setDivContent(DOMPurify.sanitize(message));
    }
  }, [message]);

  useEffect(() => {
    if (divRef.current) {
      divRef.current.innerHTML = divContent;
    }
  }, [divContent]);

  return (
    <div key={divContent} aria-label="MyComponent" ref={divRef}>
      {divContent}
    </div>
  );
};

export default MyComponent;

import React, { FC, useRef, useEffect, useState } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  message?: string;
}

const MyComponent: FC<Props> = ({ message = '' }) => {
  const [divContent, setDivContent] = useState(message);
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (divRef.current) {
      setDivContent(DOMPurify.sanitize(message));
    }
  }, [message]);

  useEffect(() => {
    if (divRef.current) {
      divRef.current.innerHTML = divContent;
    }
  }, [divContent]);

  return (
    <div key={divContent} aria-label="MyComponent" ref={divRef}>
      {divContent}
    </div>
  );
};

export default MyComponent;