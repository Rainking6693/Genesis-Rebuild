import React from 'react';
import DOMPurify from 'dompurify';

interface EmailMarketingProps {
  subject: string;
  body: string;
}

const EmailMarketing: React.FC<EmailMarketingProps> = ({ subject, body }) => {
  // Resiliency and Edge Cases
  // - Use DOMPurify to sanitize the input and prevent XSS attacks
  const sanitizedSubject = DOMPurify.sanitize(subject, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
  const sanitizedBody = DOMPurify.sanitize(body, {
    ALLOWED_TAGS: ['p', 'br', 'a', 'strong', 'em', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['href', 'target'],
  });

  // Accessibility
  // - Add ARIA attributes to improve screen reader accessibility
  return (
    <div role="article" aria-label="Email Marketing">
      <h1 aria-label={sanitizedSubject}>{sanitizedSubject}</h1>
      <div
        aria-label={sanitizedBody}
        dangerouslySetInnerHTML={{ __html: sanitizedBody }}
      />
    </div>
  );
};

export default EmailMarketing;

import React from 'react';
import DOMPurify from 'dompurify';

interface EmailMarketingProps {
  subject: string;
  body: string;
}

const EmailMarketing: React.FC<EmailMarketingProps> = ({ subject, body }) => {
  // Resiliency and Edge Cases
  // - Use DOMPurify to sanitize the input and prevent XSS attacks
  const sanitizedSubject = DOMPurify.sanitize(subject, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
  const sanitizedBody = DOMPurify.sanitize(body, {
    ALLOWED_TAGS: ['p', 'br', 'a', 'strong', 'em', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['href', 'target'],
  });

  // Accessibility
  // - Add ARIA attributes to improve screen reader accessibility
  return (
    <div role="article" aria-label="Email Marketing">
      <h1 aria-label={sanitizedSubject}>{sanitizedSubject}</h1>
      <div
        aria-label={sanitizedBody}
        dangerouslySetInnerHTML={{ __html: sanitizedBody }}
      />
    </div>
  );
};

export default EmailMarketing;