import React, { FC, ReactNode } from 'react';

interface Props {
  subject?: string;
  message?: string;
  children?: ReactNode; // Allows for additional content within the email component
}

const defaultSubject = 'Welcome to Our Store';
const defaultMessage = 'No message provided';

const MyEmailComponent: FC<Props> = ({ subject = defaultSubject, message = defaultMessage, children }) => {
  // Adding ARIA attributes for accessibility
  const displayedSubject = subject.trim();
  const displayedMessage = message.trim();

  return (
    <div>
      {/* Adding ARIA attributes for accessibility */}
      <h2 aria-level={2} aria-role="heading">{displayedSubject}</h2>
      <p aria-label="Email message">{displayedMessage}</p>
      {/* Allowing for additional content within the email component */}
      {children}
    </div>
  );
};

export default MyEmailComponent;

import React, { FC, ReactNode } from 'react';

interface Props {
  subject?: string;
  message?: string;
  children?: ReactNode; // Allows for additional content within the email component
}

const defaultSubject = 'Welcome to Our Store';
const defaultMessage = 'No message provided';

const MyEmailComponent: FC<Props> = ({ subject = defaultSubject, message = defaultMessage, children }) => {
  // Adding ARIA attributes for accessibility
  const displayedSubject = subject.trim();
  const displayedMessage = message.trim();

  return (
    <div>
      {/* Adding ARIA attributes for accessibility */}
      <h2 aria-level={2} aria-role="heading">{displayedSubject}</h2>
      <p aria-label="Email message">{displayedMessage}</p>
      {/* Allowing for additional content within the email component */}
      {children}
    </div>
  );
};

export default MyEmailComponent;