import React, { FC, ReactNode } from 'react';

interface Props {
  subject?: string;
  message?: string;
}

const MyEmailComponent: FC<Props> = ({ subject, message }) => {
  // Ensure subject and message are not null, empty, or whitespace
  if (!subject || !message || (subject.trim() === '' && message.trim() === '')) {
    return <div>Error: Subject or message is missing.</div>;
  }

  // Add a role and aria-label for accessibility
  return (
    <div role="presentation">
      <h1 role="heading" aria-level={1}>Subject: {subject}</h1>
      <p>Message: {message}</p>
    </div>
  );
};

export default MyEmailComponent;

import React, { FC, ReactNode } from 'react';

interface Props {
  subject?: string;
  message?: string;
}

const MyEmailComponent: FC<Props> = ({ subject, message }) => {
  // Ensure subject and message are not null, empty, or whitespace
  if (!subject || !message || (subject.trim() === '' && message.trim() === '')) {
    return <div>Error: Subject or message is missing.</div>;
  }

  // Add a role and aria-label for accessibility
  return (
    <div role="presentation">
      <h1 role="heading" aria-level={1}>Subject: {subject}</h1>
      <p>Message: {message}</p>
    </div>
  );
};

export default MyEmailComponent;