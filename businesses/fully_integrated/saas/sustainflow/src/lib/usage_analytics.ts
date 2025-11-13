import React, { FC, useEffect, useRef, useState } from 'react';

// Use named export for better readability and maintainability
export const UsageAnalyticsComponent: FC<Props> = ({ message }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState('');
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (message) {
      const sanitizedTextarea = document.createElement('textarea');
      sanitizedTextarea.innerHTML = message;
      sanitizedTextarea.setAttribute('dir', 'auto'); // Add directionality attribute for better accessibility
      setSanitizedMessage(sanitizedTextarea.textContent!);
    }
  }, [message]);

  useEffect(() => {
    if (divRef.current && sanitizedMessage) {
      divRef.current.textContent = sanitizedMessage;
    }
  }, [sanitizedMessage]);

  return <div ref={divRef} />;
};

interface Props {
  message: string;
}

import React, { FC, useEffect, useRef, useState } from 'react';

// Use named export for better readability and maintainability
export const UsageAnalyticsComponent: FC<Props> = ({ message }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState('');
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (message) {
      const sanitizedTextarea = document.createElement('textarea');
      sanitizedTextarea.innerHTML = message;
      sanitizedTextarea.setAttribute('dir', 'auto'); // Add directionality attribute for better accessibility
      setSanitizedMessage(sanitizedTextarea.textContent!);
    }
  }, [message]);

  useEffect(() => {
    if (divRef.current && sanitizedMessage) {
      divRef.current.textContent = sanitizedMessage;
    }
  }, [sanitizedMessage]);

  return <div ref={divRef} />;
};

interface Props {
  message: string;
}