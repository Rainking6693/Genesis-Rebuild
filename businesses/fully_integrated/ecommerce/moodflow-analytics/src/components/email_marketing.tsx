import React from 'react';

interface EmailMarketingProps {
  subject: string | null;
  body: string | null;
}

const EmailMarketing: React.FC<EmailMarketingProps> = ({ subject, body }) => {
  // Resiliency
  // - Handle empty or null values for `subject` and `body`
  const sanitizedSubject = subject ? subject.replace(/</g, '&lt;').replace(/>/g, '&gt;') : 'No subject';
  const sanitizedBody = body ? body.replace(/</g, '&lt;').replace(/>/g, '&gt;') : 'No content';

  // Accessibility
  // - Add `aria-label` to the `h1` element for screen readers
  // - Add `role="region"` to the container `div` for better semantic structure
  return (
    <div role="region">
      <h1 aria-label={sanitizedSubject}>{sanitizedSubject}</h1>
      <p>{sanitizedBody}</p>
    </div>
  );
};

export default EmailMarketing;

import React from 'react';

interface EmailMarketingProps {
  subject: string | null;
  body: string | null;
}

const EmailMarketing: React.FC<EmailMarketingProps> = ({ subject, body }) => {
  // Resiliency
  // - Handle empty or null values for `subject` and `body`
  const sanitizedSubject = subject ? subject.replace(/</g, '&lt;').replace(/>/g, '&gt;') : 'No subject';
  const sanitizedBody = body ? body.replace(/</g, '&lt;').replace(/>/g, '&gt;') : 'No content';

  // Accessibility
  // - Add `aria-label` to the `h1` element for screen readers
  // - Add `role="region"` to the container `div` for better semantic structure
  return (
    <div role="region">
      <h1 aria-label={sanitizedSubject}>{sanitizedSubject}</h1>
      <p>{sanitizedBody}</p>
    </div>
  );
};

export default EmailMarketing;