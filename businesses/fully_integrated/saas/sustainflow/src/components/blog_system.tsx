import React, { FC, useRef, useEffect, useState } from 'react';
import { sanitizeUserInput } from '../../security/input_sanitizer';

interface Props {
  message?: string;
  isFocused?: boolean;
}

const MyComponent: FC<Props> = ({ message, isFocused = false }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState(sanitizeUserInput(message || ''));
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (divRef.current && isFocused) {
      divRef.current.focus();
    }
  }, [sanitizedMessage, isFocused]);

  useEffect(() => {
    if (message !== sanitizedMessage) {
      setSanitizedMessage(sanitizeUserInput(message || ''));
    }
  }, [message]);

  if (!sanitizedMessage.trim()) {
    return null;
  }

  return (
    <div data-testid="my-component" ref={divRef} aria-label="My Component">
      <div id="my-component-content" role="text">
        <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
      </div>
    </div>
  );
};

MyComponent.displayName = 'MyComponent';

export default MyComponent;

import React, { FC, useRef, useEffect, useState } from 'react';
import { sanitizeUserInput } from '../../security/input_sanitizer';

interface Props {
  message?: string;
  isFocused?: boolean;
}

const MyComponent: FC<Props> = ({ message, isFocused = false }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState(sanitizeUserInput(message || ''));
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (divRef.current && isFocused) {
      divRef.current.focus();
    }
  }, [sanitizedMessage, isFocused]);

  useEffect(() => {
    if (message !== sanitizedMessage) {
      setSanitizedMessage(sanitizeUserInput(message || ''));
    }
  }, [message]);

  if (!sanitizedMessage.trim()) {
    return null;
  }

  return (
    <div data-testid="my-component" ref={divRef} aria-label="My Component">
      <div id="my-component-content" role="text">
        <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
      </div>
    </div>
  );
};

MyComponent.displayName = 'MyComponent';

export default MyComponent;