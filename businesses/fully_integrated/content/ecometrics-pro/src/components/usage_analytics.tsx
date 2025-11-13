import React, { FC, useMemo, useEffect } from 'react';
import DOMPurify from 'dompurify';

type SanitizedHTML = React.ReactNode;
type Props = {
  message: string;
};

const sanitizeHTML = (html: string): SanitizedHTML => {
  return DOMPurify.sanitize(html);
};

const MyComponent: FC<Props> = ({ message }) => {
  const sanitizedHTML = useMemo(() => sanitizeHTML(message), [message]);

  useEffect(() => {
    // Add a unique key for each sanitized HTML to handle dynamic content
    const uniqueKey = `usage-analytics-${Math.random()}`;
    document.querySelector(`[data-testid="usage-analytics"]`)?.setAttribute('key', uniqueKey);
  }, [sanitizedHTML]);

  return (
    <div data-testid="usage-analytics" key={sanitizedHTML} aria-label="Usage Analytics">
      {sanitizedHTML}
    </div>
  );
};

export default MyComponent;

import React, { FC, useMemo, useEffect } from 'react';
import DOMPurify from 'dompurify';

type SanitizedHTML = React.ReactNode;
type Props = {
  message: string;
};

const sanitizeHTML = (html: string): SanitizedHTML => {
  return DOMPurify.sanitize(html);
};

const MyComponent: FC<Props> = ({ message }) => {
  const sanitizedHTML = useMemo(() => sanitizeHTML(message), [message]);

  useEffect(() => {
    // Add a unique key for each sanitized HTML to handle dynamic content
    const uniqueKey = `usage-analytics-${Math.random()}`;
    document.querySelector(`[data-testid="usage-analytics"]`)?.setAttribute('key', uniqueKey);
  }, [sanitizedHTML]);

  return (
    <div data-testid="usage-analytics" key={sanitizedHTML} aria-label="Usage Analytics">
      {sanitizedHTML}
    </div>
  );
};

export default MyComponent;