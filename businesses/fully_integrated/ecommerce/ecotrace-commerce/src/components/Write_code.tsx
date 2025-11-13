import React, { FC, useRef, useState, useEffect } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const componentRef = useRef<HTMLDivElement>(null);
  const [focus, setFocus] = useState(false);

  const sanitizedMessage = DOMPurify.sanitize(message);

  useEffect(() => {
    if (!componentRef.current) return;
    componentRef.current.focus();
  }, [sanitizedMessage]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      componentRef.current?.focus();
    }
  };

  return (
    <div id="my-component" role="region" ref={componentRef} onFocus={handleFocus} onKeyDown={handleKeyDown}>
      <React.Fragment dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
      {focus && <div style={{ position: 'absolute', inset: 0, border: '1px solid', outline: 0, boxSizing: 'border-box' }} />}
    </div>
  );
};

export default MyComponent;

import React, { FC, useRef, useState, useEffect } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const componentRef = useRef<HTMLDivElement>(null);
  const [focus, setFocus] = useState(false);

  const sanitizedMessage = DOMPurify.sanitize(message);

  useEffect(() => {
    if (!componentRef.current) return;
    componentRef.current.focus();
  }, [sanitizedMessage]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      componentRef.current?.focus();
    }
  };

  return (
    <div id="my-component" role="region" ref={componentRef} onFocus={handleFocus} onKeyDown={handleKeyDown}>
      <React.Fragment dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
      {focus && <div style={{ position: 'absolute', inset: 0, border: '1px solid', outline: 0, boxSizing: 'border-box' }} />}
    </div>
  );
};

export default MyComponent;