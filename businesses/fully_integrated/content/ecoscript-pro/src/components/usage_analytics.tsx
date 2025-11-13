import React, { FC, useRef, useEffect, useState } from 'react';
import DOMPurify from 'dompurify';

type FunctionalComponent<P = {}> = FC<P>;

interface Props {
  message: string | undefined;
}

const UsageAnalytics: FunctionalComponent<Props> = ({ message }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    if (divRef.current && message) {
      try {
        const sanitizedMessage = DOMPurify.sanitize(message);
        divRef.current.innerHTML = sanitizedMessage;
      } catch (error) {
        setErrorMessage('Error: Invalid or unsupported content');
      }
    }
  }, [message]);

  return (
    <div data-testid="usage-analytics" aria-label="Usage Analytics">
      {errorMessage && <div role="alert">{errorMessage}</div>}
      <div ref={divRef}>{message || 'No message provided'}</div>
    </div>
  );
};

export default UsageAnalytics;

import React, { FC, useRef, useEffect, useState } from 'react';
import DOMPurify from 'dompurify';

type FunctionalComponent<P = {}> = FC<P>;

interface Props {
  message: string | undefined;
}

const UsageAnalytics: FunctionalComponent<Props> = ({ message }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    if (divRef.current && message) {
      try {
        const sanitizedMessage = DOMPurify.sanitize(message);
        divRef.current.innerHTML = sanitizedMessage;
      } catch (error) {
        setErrorMessage('Error: Invalid or unsupported content');
      }
    }
  }, [message]);

  return (
    <div data-testid="usage-analytics" aria-label="Usage Analytics">
      {errorMessage && <div role="alert">{errorMessage}</div>}
      <div ref={divRef}>{message || 'No message provided'}</div>
    </div>
  );
};

export default UsageAnalytics;