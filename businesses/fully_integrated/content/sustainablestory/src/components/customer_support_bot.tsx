import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import sanitizeHtml from 'dompurify';

interface Props {
  message: string;
}

const CustomerSupportBot: FC<Props> = ({ message }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      setSanitizedMessage(sanitizeHtml(message));
    }
  }, [message]);

  useEffect(() => {
    if (containerRef.current && containerRef.current.offsetWidth > 0) {
      containerRef.current.innerHTML = sanitizedMessage;
    }
  }, [sanitizedMessage]);

  return (
    <div ref={containerRef} aria-label="Customer Support Bot message">
      {sanitizedMessage}
    </div>
  );
};

CustomerSupportBot.sanitizeMessage = (message: string) => sanitizeHtml(message);

export default CustomerSupportBot;

import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import sanitizeHtml from 'dompurify';

interface Props {
  message: string;
}

const CustomerSupportBot: FC<Props> = ({ message }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      setSanitizedMessage(sanitizeHtml(message));
    }
  }, [message]);

  useEffect(() => {
    if (containerRef.current && containerRef.current.offsetWidth > 0) {
      containerRef.current.innerHTML = sanitizedMessage;
    }
  }, [sanitizedMessage]);

  return (
    <div ref={containerRef} aria-label="Customer Support Bot message">
      {sanitizedMessage}
    </div>
  );
};

CustomerSupportBot.sanitizeMessage = (message: string) => sanitizeHtml(message);

export default CustomerSupportBot;