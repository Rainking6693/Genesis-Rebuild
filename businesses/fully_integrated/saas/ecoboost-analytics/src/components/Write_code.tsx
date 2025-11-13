import React, { FC, useState, useRef, useEffect } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  message?: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState('');
  const divRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (message) {
      try {
        const sanitized = DOMPurify.sanitize(message);
        setSanitizedMessage(sanitized);
      } catch (error) {
        console.error(`Error sanitizing message: ${error.message}`);
      }
    }
  }, [message]);

  useEffect(() => {
    if (divRef.current) {
      divRef.current.focusIfVisible();
    }
  }, [sanitizedMessage]);

  return (
    <div ref={divRef}>
      <div
        dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
        aria-label={sanitizedMessage}
      />
      {!sanitizedMessage && <div>No message provided</div>}
    </div>
  );
};

// Add a focusIfVisible utility function to help with accessibility
const focusIfVisible = (element: HTMLElement | null) => {
  if (element && element.offsetParent) {
    element.focus();
  }
};

export default MyComponent;

import React, { FC, useState, useRef, useEffect } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  message?: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState('');
  const divRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (message) {
      try {
        const sanitized = DOMPurify.sanitize(message);
        setSanitizedMessage(sanitized);
      } catch (error) {
        console.error(`Error sanitizing message: ${error.message}`);
      }
    }
  }, [message]);

  useEffect(() => {
    if (divRef.current) {
      divRef.current.focusIfVisible();
    }
  }, [sanitizedMessage]);

  return (
    <div ref={divRef}>
      <div
        dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
        aria-label={sanitizedMessage}
      />
      {!sanitizedMessage && <div>No message provided</div>}
    </div>
  );
};

// Add a focusIfVisible utility function to help with accessibility
const focusIfVisible = (element: HTMLElement | null) => {
  if (element && element.offsetParent) {
    element.focus();
  }
};

export default MyComponent;