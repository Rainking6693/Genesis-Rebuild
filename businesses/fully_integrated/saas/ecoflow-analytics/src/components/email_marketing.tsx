import React, { useMemo } from 'react';
import DOMPurify from 'dompurify';

interface EmailMarketingProps {
  subject: string | null | undefined;
  body: string | null | undefined;
  fallbackContent?: React.ReactNode; // Provide a fallback UI
  onError?: (error: Error) => void; // Callback for error handling
}

const EmailMarketing: React.FC<EmailMarketingProps> = ({
  subject,
  body,
  fallbackContent = null,
  onError,
}) => {
  // Memoize sanitized content to prevent unnecessary re-sanitization
  const sanitizedContent = useMemo(() => {
    if (!subject || !body) {
      return { sanitizedSubject: '', sanitizedBody: '' };
    }

    try {
      // Use DOMPurify for more robust XSS prevention
      const sanitizedSubject = DOMPurify.sanitize(subject, { USE_PROFILES: { html: true } });
      const sanitizedBody = DOMPurify.sanitize(body, { USE_PROFILES: { html: true } });

      return { sanitizedSubject, sanitizedBody };
    } catch (error: any) {
      console.error('Error sanitizing email content:', error);
      onError?.(error); // Report the error to the parent component
      return { sanitizedSubject: '', sanitizedBody: '' }; // Return empty strings to prevent rendering potentially unsafe content
    }
  }, [subject, body, onError]);

  if (!subject || !body) {
    // Render fallback content if subject or body is missing
    return fallbackContent;
  }

  if (!sanitizedContent.sanitizedSubject && !sanitizedContent.sanitizedBody) {
    return fallbackContent; // Render fallback if sanitization failed.
  }

  const subjectId = 'email-marketing-subject';

  return (
    <div role="region" aria-label="Email Marketing">
      <h1 id={subjectId} data-testid="email-subject">
        {sanitizedContent.sanitizedSubject}
      </h1>
      <div aria-describedby={subjectId} data-testid="email-body">
        {/* Use dangerouslySetInnerHTML with sanitized content */}
        <div dangerouslySetInnerHTML={{ __html: sanitizedContent.sanitizedBody }} />
      </div>
    </div>
  );
};

export default EmailMarketing;

import React, { useMemo } from 'react';
import DOMPurify from 'dompurify';

interface EmailMarketingProps {
  subject: string | null | undefined;
  body: string | null | undefined;
  fallbackContent?: React.ReactNode; // Provide a fallback UI
  onError?: (error: Error) => void; // Callback for error handling
}

const EmailMarketing: React.FC<EmailMarketingProps> = ({
  subject,
  body,
  fallbackContent = null,
  onError,
}) => {
  // Memoize sanitized content to prevent unnecessary re-sanitization
  const sanitizedContent = useMemo(() => {
    if (!subject || !body) {
      return { sanitizedSubject: '', sanitizedBody: '' };
    }

    try {
      // Use DOMPurify for more robust XSS prevention
      const sanitizedSubject = DOMPurify.sanitize(subject, { USE_PROFILES: { html: true } });
      const sanitizedBody = DOMPurify.sanitize(body, { USE_PROFILES: { html: true } });

      return { sanitizedSubject, sanitizedBody };
    } catch (error: any) {
      console.error('Error sanitizing email content:', error);
      onError?.(error); // Report the error to the parent component
      return { sanitizedSubject: '', sanitizedBody: '' }; // Return empty strings to prevent rendering potentially unsafe content
    }
  }, [subject, body, onError]);

  if (!subject || !body) {
    // Render fallback content if subject or body is missing
    return fallbackContent;
  }

  if (!sanitizedContent.sanitizedSubject && !sanitizedContent.sanitizedBody) {
    return fallbackContent; // Render fallback if sanitization failed.
  }

  const subjectId = 'email-marketing-subject';

  return (
    <div role="region" aria-label="Email Marketing">
      <h1 id={subjectId} data-testid="email-subject">
        {sanitizedContent.sanitizedSubject}
      </h1>
      <div aria-describedby={subjectId} data-testid="email-body">
        {/* Use dangerouslySetInnerHTML with sanitized content */}
        <div dangerouslySetInnerHTML={{ __html: sanitizedContent.sanitizedBody }} />
      </div>
    </div>
  );
};

export default EmailMarketing;