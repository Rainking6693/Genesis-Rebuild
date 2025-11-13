import React, { useState } from 'react';
import { EmailMessage, IEmailMessageProps } from './EmailMessage';

interface Props extends IEmailMessageProps {
  recipientEmail: string;
}

const MyComponent: React.FC<Props> = ({ subject, body, recipientEmail }) => {
  const [isValidEmail, setIsValidEmail] = useState<boolean | null>(null);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const email = event.target.value.trim();
    setIsValidEmail(isValidEmailFormat(email) !== null);
  };

  const isValidEmailFormat = (email: string) => {
    // Basic email validation using a regular expression
    // You can use a more robust email validation library if needed
    const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email) !== false;
  };

  return (
    <div>
      <label htmlFor="recipientEmail">Recipient Email:</label>
      <input
        type="email"
        id="recipientEmail"
        value={recipientEmail}
        onChange={handleEmailChange}
        disabled={!isValidEmail}
        aria-describedby="email-validation-message"
      />
      {!isValidEmail && (
        <p id="email-validation-message">Please enter a valid email address.</p>
      )}
      <EmailMessage subject={subject} body={body} recipientEmail={recipientEmail} />
    </div>
  );
};

export default MyComponent;

import React, { useState } from 'react';
import { EmailMessage, IEmailMessageProps } from './EmailMessage';

interface Props extends IEmailMessageProps {
  recipientEmail: string;
}

const MyComponent: React.FC<Props> = ({ subject, body, recipientEmail }) => {
  const [isValidEmail, setIsValidEmail] = useState<boolean | null>(null);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const email = event.target.value.trim();
    setIsValidEmail(isValidEmailFormat(email) !== null);
  };

  const isValidEmailFormat = (email: string) => {
    // Basic email validation using a regular expression
    // You can use a more robust email validation library if needed
    const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email) !== false;
  };

  return (
    <div>
      <label htmlFor="recipientEmail">Recipient Email:</label>
      <input
        type="email"
        id="recipientEmail"
        value={recipientEmail}
        onChange={handleEmailChange}
        disabled={!isValidEmail}
        aria-describedby="email-validation-message"
      />
      {!isValidEmail && (
        <p id="email-validation-message">Please enter a valid email address.</p>
      )}
      <EmailMessage subject={subject} body={body} recipientEmail={recipientEmail} />
    </div>
  );
};

export default MyComponent;