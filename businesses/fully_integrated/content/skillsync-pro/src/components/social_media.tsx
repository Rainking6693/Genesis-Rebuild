import React, { FC, useState, useEffect, useMemo } from 'react';
import DOMPurify from 'dompurify';

declare const DOMPurifyAvailable: boolean;

interface Props {
  message: string;
}

interface SanitizedMessage {
  __html: string;
}

const isDOMPurifyAvailable = () => {
  try {
    return DOMPurifyAvailable && DOMPurify.sanitize;
  } catch {
    return false;
  }
};

const sanitizeMessage = (message: string) => {
  if (!isDOMPurifyAvailable()) {
    console.error('DOMPurify library not available.');
    return message;
  }

  try {
    return DOMPurify.sanitize(message);
  } catch (error) {
    console.error('Error sanitizing message:', error);
    return message;
  }
};

const MyComponent: FC<Props> = ({ message }) => {
  const sanitizedMessage = useSanitizedMessage(message);

  return (
    <div data-testid="social-media-component" role="region" aria-label="Social media content">
      <div dangerouslySetInnerHTML={sanitizedMessage} key={sanitizedMessage.__html} />
    </div>
  );
};

const useSanitizedMessage = (message: string) => {
  const [sanitizedMessage, setSanitizedMessage] = useState<SanitizedMessage>({ __html: '' });

  useEffect(() => {
    setSanitizedMessage({ __html: sanitizeMessage(message) });
  }, [message]);

  return useMemo(() => sanitizedMessage, [sanitizedMessage]);
};

export default MyComponent;

export { useSanitizedMessage };

import React, { FC, useState, useEffect, useMemo } from 'react';
import DOMPurify from 'dompurify';

declare const DOMPurifyAvailable: boolean;

interface Props {
  message: string;
}

interface SanitizedMessage {
  __html: string;
}

const isDOMPurifyAvailable = () => {
  try {
    return DOMPurifyAvailable && DOMPurify.sanitize;
  } catch {
    return false;
  }
};

const sanitizeMessage = (message: string) => {
  if (!isDOMPurifyAvailable()) {
    console.error('DOMPurify library not available.');
    return message;
  }

  try {
    return DOMPurify.sanitize(message);
  } catch (error) {
    console.error('Error sanitizing message:', error);
    return message;
  }
};

const MyComponent: FC<Props> = ({ message }) => {
  const sanitizedMessage = useSanitizedMessage(message);

  return (
    <div data-testid="social-media-component" role="region" aria-label="Social media content">
      <div dangerouslySetInnerHTML={sanitizedMessage} key={sanitizedMessage.__html} />
    </div>
  );
};

const useSanitizedMessage = (message: string) => {
  const [sanitizedMessage, setSanitizedMessage] = useState<SanitizedMessage>({ __html: '' });

  useEffect(() => {
    setSanitizedMessage({ __html: sanitizeMessage(message) });
  }, [message]);

  return useMemo(() => sanitizedMessage, [sanitizedMessage]);
};

export default MyComponent;

export { useSanitizedMessage };