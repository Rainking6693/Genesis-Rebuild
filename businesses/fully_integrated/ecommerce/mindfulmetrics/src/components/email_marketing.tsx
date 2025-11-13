import React from 'react';

interface EmailMarketingProps {
  subject: string;
  body: string;
}

const EmailMarketing: React.FC<EmailMarketingProps> = ({ subject, body }) => {
  // Resiliency and edge cases
  if (!subject || !body) {
    return (
      <div role="alert" aria-live="assertive">
        <h1>Error: Subject and body are required</h1>
        <p>Please provide a valid subject and body for the email marketing content.</p>
      </div>
    );
  }

  // Accessibility
  return (
    <div>
      <h1 id="email-subject">{subject}</h1>
      <p aria-describedby="email-subject">{body}</p>
    </div>
  );
};

// Maintainability
export default React.memo(EmailMarketing);

import React from 'react';

interface EmailMarketingProps {
  subject: string;
  body: string;
}

const EmailMarketing: React.FC<EmailMarketingProps> = ({ subject, body }) => {
  // Resiliency and edge cases
  if (!subject || !body) {
    return (
      <div role="alert" aria-live="assertive">
        <h1>Error: Subject and body are required</h1>
        <p>Please provide a valid subject and body for the email marketing content.</p>
      </div>
    );
  }

  // Accessibility
  return (
    <div>
      <h1 id="email-subject">{subject}</h1>
      <p aria-describedby="email-subject">{body}</p>
    </div>
  );
};

// Maintainability
export default React.memo(EmailMarketing);