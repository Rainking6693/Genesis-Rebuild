import React, { FC, useRef, useState, useEffect } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const divRef = useRef<HTMLDivElement | null>(null);
  const [sanitizedMessage, setSanitizedMessage] = useState(message);

  useEffect(() => {
    if (divRef.current) {
      setSanitizedMessage(DOMPurify.sanitize(message));
    }
  }, [message]);

  useEffect(() => {
    if (!divRef.current) {
      console.warn("divRef is null, ensure the component is mounted before setting ref");
    }
  }, [divRef]);

  useEffect(() => {
    if (divRef.current) {
      divRef.current.focusIfVisible();
    }
  }, [sanitizedMessage]);

  return (
    <div
      ref={divRef}
      dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
      aria-label={`Message: ${message}`} // Adding aria-label for accessibility
    />
  );
};

export default MyComponent;

import React, { FC, useRef, useState, useEffect } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const divRef = useRef<HTMLDivElement | null>(null);
  const [sanitizedMessage, setSanitizedMessage] = useState(message);

  useEffect(() => {
    if (divRef.current) {
      setSanitizedMessage(DOMPurify.sanitize(message));
    }
  }, [message]);

  useEffect(() => {
    if (!divRef.current) {
      console.warn("divRef is null, ensure the component is mounted before setting ref");
    }
  }, [divRef]);

  useEffect(() => {
    if (divRef.current) {
      divRef.current.focusIfVisible();
    }
  }, [sanitizedMessage]);

  return (
    <div
      ref={divRef}
      dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
      aria-label={`Message: ${message}`} // Adding aria-label for accessibility
    />
  );
};

export default MyComponent;