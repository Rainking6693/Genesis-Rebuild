import React, { FC, ReactNode } from 'react';

interface Props {
  subject: string;
  from: string;
  to: string;
  message: string;
  subjectAlt?: string; // Edge case: Provide an alternative subject for screen readers
  fromAlt?: string; // Edge case: Provide an alternative from name for screen readers
  error?: Error; // Edge case: Handle errors in case of API issues
}

const EmailMarketing: FC<Props> = ({
  subject,
  from,
  to,
  message,
  subjectAlt = subject,
  fromAlt = from,
  error,
}) => {
  if (error) {
    return (
      <div role="alert">
        <p>An error occurred while sending the email:</p>
        <pre>{error.message}</pre>
      </div>
    );
  }

  return (
    <div role="presentation">
      {/* Add aria-label for better accessibility */}
      <h3 aria-label={`Email subject: ${subjectAlt}`}>{subject}</h3>
      <div>From: {fromAlt}</div>
      <div>To: {to}</div>
      <div>{message}</div>
    </div>
  );
};

EmailMarketing.defaultProps = {
  subjectAlt: '',
  fromAlt: '',
};

export default EmailMarketing;

import React, { FC, ReactNode } from 'react';

interface Props {
  subject: string;
  from: string;
  to: string;
  message: string;
  subjectAlt?: string; // Edge case: Provide an alternative subject for screen readers
  fromAlt?: string; // Edge case: Provide an alternative from name for screen readers
  error?: Error; // Edge case: Handle errors in case of API issues
}

const EmailMarketing: FC<Props> = ({
  subject,
  from,
  to,
  message,
  subjectAlt = subject,
  fromAlt = from,
  error,
}) => {
  if (error) {
    return (
      <div role="alert">
        <p>An error occurred while sending the email:</p>
        <pre>{error.message}</pre>
      </div>
    );
  }

  return (
    <div role="presentation">
      {/* Add aria-label for better accessibility */}
      <h3 aria-label={`Email subject: ${subjectAlt}`}>{subject}</h3>
      <div>From: {fromAlt}</div>
      <div>To: {to}</div>
      <div>{message}</div>
    </div>
  );
};

EmailMarketing.defaultProps = {
  subjectAlt: '',
  fromAlt: '',
};

export default EmailMarketing;