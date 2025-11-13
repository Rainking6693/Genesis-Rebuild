import React, { ReactElement } from 'react';
import { validateEmail } from './utils/validation';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  subject: string;
  to: string;
  message: string;
}

const validateEmailFormat = (email: string): string => {
  // Custom validation function for email format
  // You can use a library like 'validator' for more robust email validation
  // ...
  // Add a default value for invalid email addresses
  return validateEmail(email) || 'Invalid email format';
};

const MyEmailComponent: React.FC<Props> = ({ subject, to, message }): ReactElement => {
  const validEmail = validateEmailFormat(to); // Validate email before sending

  if (validEmail === 'Invalid email format') {
    return null; // Return null instead of throwing an error to handle edge cases
  }

  // Add accessibility attributes to the email component
  return (
    <div data-email-id={uuidv4()} role="presentation">
      <h3>{subject}</h3>
      <p>{to}</p>
      <p>{message}</p>
    </div>
  );
};

export default MyEmailComponent;

import React, { ReactElement } from 'react';
import { validateEmail } from './utils/validation';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  subject: string;
  to: string;
  message: string;
}

const validateEmailFormat = (email: string): string => {
  // Custom validation function for email format
  // You can use a library like 'validator' for more robust email validation
  // ...
  // Add a default value for invalid email addresses
  return validateEmail(email) || 'Invalid email format';
};

const MyEmailComponent: React.FC<Props> = ({ subject, to, message }): ReactElement => {
  const validEmail = validateEmailFormat(to); // Validate email before sending

  if (validEmail === 'Invalid email format') {
    return null; // Return null instead of throwing an error to handle edge cases
  }

  // Add accessibility attributes to the email component
  return (
    <div data-email-id={uuidv4()} role="presentation">
      <h3>{subject}</h3>
      <p>{to}</p>
      <p>{message}</p>
    </div>
  );
};

export default MyEmailComponent;