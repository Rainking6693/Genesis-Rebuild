import React, { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';

interface EmailMarketingProps {
  emailSubject: string;
  emailBody: string;
}

const EmailMarketing: React.FC<EmailMarketingProps> = ({ emailSubject, emailBody }) => {
  const [sanitizedEmailBody, setSanitizedEmailBody] = useState<string>('');

  useEffect(() => {
    try {
      // Sanitize user input to prevent XSS attacks
      const sanitizedBody = DOMPurify.sanitize(emailBody, {
        ALLOWED_TAGS: ['a', 'b', 'strong', 'i', 'em', 'u', 'p', 'br', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li'],
        ALLOWED_ATTR: ['href', 'target'],
      });
      setSanitizedEmailBody(sanitizedBody);
    } catch (error) {
      console.error('Error sanitizing email body:', error);
      setSanitizedEmailBody('');
    }
  }, [emailBody]);

  return (
    <div role="region" aria-live="polite" aria-atomic="true">
      <h1 aria-label={emailSubject}>{emailSubject}</h1>
      {sanitizedEmailBody ? (
        <div
          className="email-body"
          dangerouslySetInnerHTML={{ __html: sanitizedEmailBody }}
          aria-live="polite"
          aria-atomic="true"
        />
      ) : (
        <p>Error loading email content.</p>
      )}
    </div>
  );
};

export default EmailMarketing;

import React, { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';

interface EmailMarketingProps {
  emailSubject: string;
  emailBody: string;
}

const EmailMarketing: React.FC<EmailMarketingProps> = ({ emailSubject, emailBody }) => {
  const [sanitizedEmailBody, setSanitizedEmailBody] = useState<string>('');

  useEffect(() => {
    try {
      // Sanitize user input to prevent XSS attacks
      const sanitizedBody = DOMPurify.sanitize(emailBody, {
        ALLOWED_TAGS: ['a', 'b', 'strong', 'i', 'em', 'u', 'p', 'br', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li'],
        ALLOWED_ATTR: ['href', 'target'],
      });
      setSanitizedEmailBody(sanitizedBody);
    } catch (error) {
      console.error('Error sanitizing email body:', error);
      setSanitizedEmailBody('');
    }
  }, [emailBody]);

  return (
    <div role="region" aria-live="polite" aria-atomic="true">
      <h1 aria-label={emailSubject}>{emailSubject}</h1>
      {sanitizedEmailBody ? (
        <div
          className="email-body"
          dangerouslySetInnerHTML={{ __html: sanitizedEmailBody }}
          aria-live="polite"
          aria-atomic="true"
        />
      ) : (
        <p>Error loading email content.</p>
      )}
    </div>
  );
};

export default EmailMarketing;