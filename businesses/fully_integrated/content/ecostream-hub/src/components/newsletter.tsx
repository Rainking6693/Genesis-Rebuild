import React, { FC, useCallback } from 'react';
import DOMPurify from 'dompurify';

type Props = {
  message: string;
};

const Newsletter: FC<Props> = ({ message }) => {
  const sanitizeMessage = useCallback((message: string) => {
    // Add additional sanitization rules as needed
    const sanitizedMessage = DOMPurify.sanitize(message);

    // Handle empty or null messages
    if (!sanitizedMessage) {
      return '';
    }

    return sanitizedMessage;
  }, []);

  const safeMessage = sanitizeMessage(message);

  // Add ARIA attributes for accessibility
  const newsletterAriaLabel = 'Newsletter';

  return (
    <div>
      <article aria-label={newsletterAriaLabel} role="article">
        <div dangerouslySetInnerHTML={{ __html: safeMessage }} />
      </article>
    </div>
  );
};

Newsletter.sanitize = sanitizeMessage;

export default Newsletter;

import React, { FC, useCallback } from 'react';
import DOMPurify from 'dompurify';

type Props = {
  message: string;
};

const Newsletter: FC<Props> = ({ message }) => {
  const sanitizeMessage = useCallback((message: string) => {
    // Add additional sanitization rules as needed
    const sanitizedMessage = DOMPurify.sanitize(message);

    // Handle empty or null messages
    if (!sanitizedMessage) {
      return '';
    }

    return sanitizedMessage;
  }, []);

  const safeMessage = sanitizeMessage(message);

  // Add ARIA attributes for accessibility
  const newsletterAriaLabel = 'Newsletter';

  return (
    <div>
      <article aria-label={newsletterAriaLabel} role="article">
        <div dangerouslySetInnerHTML={{ __html: safeMessage }} />
      </article>
    </div>
  );
};

Newsletter.sanitize = sanitizeMessage;

export default Newsletter;