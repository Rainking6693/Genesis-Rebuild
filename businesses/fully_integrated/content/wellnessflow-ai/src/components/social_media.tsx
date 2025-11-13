import React, { FC, useMemo } from 'react';
import DOMPurify from 'dompurify';

type Props = {
  message: string;
  ariaLabel?: string;
};

type SanitizedMessage = string;

const sanitizeMessage = (message: string): SanitizedMessage => {
  try {
    const sanitizedMessage = new DOMPurify().sanitize(message);
    return sanitizedMessage;
  } catch (error) {
    console.error('Error sanitizing message:', error);
    return '';
  }
};

const MyComponent: FC<Props> = ({ message = '', ariaLabel = 'Message from WellnessFlow AI content agent' }) => {
  const sanitizedMessage = useMemo(() => sanitizeMessage(message), [message]);

  return (
    <div
      dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
      aria-label={ariaLabel}
    />
  );
};

MyComponent.sanitizeMessage = sanitizeMessage;

// Optimize performance by memoizing the component
export default React.memo<React.FC<Props>>(MyComponent);

import React, { FC, useMemo } from 'react';
import DOMPurify from 'dompurify';

type Props = {
  message: string;
  ariaLabel?: string;
};

type SanitizedMessage = string;

const sanitizeMessage = (message: string): SanitizedMessage => {
  try {
    const sanitizedMessage = new DOMPurify().sanitize(message);
    return sanitizedMessage;
  } catch (error) {
    console.error('Error sanitizing message:', error);
    return '';
  }
};

const MyComponent: FC<Props> = ({ message = '', ariaLabel = 'Message from WellnessFlow AI content agent' }) => {
  const sanitizedMessage = useMemo(() => sanitizeMessage(message), [message]);

  return (
    <div
      dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
      aria-label={ariaLabel}
    />
  );
};

MyComponent.sanitizeMessage = sanitizeMessage;

// Optimize performance by memoizing the component
export default React.memo<React.FC<Props>>(MyComponent);