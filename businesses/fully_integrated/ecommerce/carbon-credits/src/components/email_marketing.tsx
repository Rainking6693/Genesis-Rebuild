import validate from 'validator';

export const validateEmail = (email: string) => {
  if (!isString(email)) {
    throw new Error('Email must be a string');
  }

  return validate.isEmail(email);
};

export const validateEmailFormat = (email: string) => {
  // Custom validation function to ensure the email format is valid
  // ...
};

import React from 'react';
import { validateEmail, validateEmailFormat } from './utils';
import ReactHtmlParser from 'react-html-parser';

type Props = Readonly<{
  subject: string;
  to: string;
  carbonOffsetCredits: number;
  ecoFriendlyOfficeSupplies: string[];
  subscriptionId: string;
  unsubscribeLink: string;
}>;

const MyComponent: React.FC<Props> = ({
  subject,
  to,
  carbonOffsetCredits,
  ecoFriendlyOfficeSupplies,
  subscriptionId,
  unsubscribeLink,
}) => {
  // Validate the email format before sending the email
  if (!validateEmail(to)) {
    throw new Error('Invalid email address');
  }

  // Use template literals for better readability and concatenation performance
  const message = `
    Dear Carbon Credits Subscriber,

    Your monthly subscription box for carbon offset credits and eco-friendly office supplies has been prepared. Here's what you'll receive this month:

    Carbon Offset Credits: ${carbonOffsetCredits}
    Eco-Friendly Office Supplies: ${ecoFriendlyOfficeSupplies.join(', ')}

    Your subscription ID is: ${subscriptionId}

    To unsubscribe, click here: ${unsubscribeLink}

    Best regards,
    The Carbon Credits Team
  `;

  // Use a library like `react-html-parser` to parse the HTML safely
  const parsedMessage = ReactHtmlParser(message);

  return <div>{parsedMessage}</div>;
};

export default MyComponent;

import validate from 'validator';

export type ValidateEmailResult = boolean;

export const validateEmail = (email: string): ValidateEmailResult => {
  if (!isString(email)) {
    throw new Error('Email must be a string');
  }

  return validate.isEmail(email);
};

export const validateEmailFormat = (email: string): ValidateEmailResult => {
  // Custom validation function to ensure the email format is valid
  // ...
};

type Props = Readonly<{
  subject: string;
  to: string;
  carbonOffsetCredits: number;
  ecoFriendlyOfficeSupplies: string[];
  subscriptionId: string;
  unsubscribeLink: string;
}>;

import { isString } from 'lodash';

export const validateEmail = (email: string): ValidateEmailResult => {
  if (!isString(email)) {
    throw new Error('Email must be a string');
  }

  return validate.isEmail(email);
};

export const validateEmailFormat = (email: string): ValidateEmailResult => {
  // Custom validation function to ensure the email format is valid
  // For example, checking if the email contains an '@' and a '.'
  const emailParts = email.split('@');
  if (emailParts.length !== 2) {
    return false;
  }

  const [local, domain] = emailParts;
  const domainParts = domain.split('.');
  if (domainParts.length < 2) {
    return false;
  }

  return true;
};

if (!validateEmail(to) || !validateEmailFormat(to)) {
  throw new Error('Invalid email address or email format');
}

import validate from 'validator';

export const validateEmail = (email: string) => {
  if (!isString(email)) {
    throw new Error('Email must be a string');
  }

  return validate.isEmail(email);
};

export const validateEmailFormat = (email: string) => {
  // Custom validation function to ensure the email format is valid
  // ...
};

import React from 'react';
import { validateEmail, validateEmailFormat } from './utils';
import ReactHtmlParser from 'react-html-parser';

type Props = Readonly<{
  subject: string;
  to: string;
  carbonOffsetCredits: number;
  ecoFriendlyOfficeSupplies: string[];
  subscriptionId: string;
  unsubscribeLink: string;
}>;

const MyComponent: React.FC<Props> = ({
  subject,
  to,
  carbonOffsetCredits,
  ecoFriendlyOfficeSupplies,
  subscriptionId,
  unsubscribeLink,
}) => {
  // Validate the email format before sending the email
  if (!validateEmail(to)) {
    throw new Error('Invalid email address');
  }

  // Use template literals for better readability and concatenation performance
  const message = `
    Dear Carbon Credits Subscriber,

    Your monthly subscription box for carbon offset credits and eco-friendly office supplies has been prepared. Here's what you'll receive this month:

    Carbon Offset Credits: ${carbonOffsetCredits}
    Eco-Friendly Office Supplies: ${ecoFriendlyOfficeSupplies.join(', ')}

    Your subscription ID is: ${subscriptionId}

    To unsubscribe, click here: ${unsubscribeLink}

    Best regards,
    The Carbon Credits Team
  `;

  // Use a library like `react-html-parser` to parse the HTML safely
  const parsedMessage = ReactHtmlParser(message);

  return <div>{parsedMessage}</div>;
};

export default MyComponent;

import validate from 'validator';

export type ValidateEmailResult = boolean;

export const validateEmail = (email: string): ValidateEmailResult => {
  if (!isString(email)) {
    throw new Error('Email must be a string');
  }

  return validate.isEmail(email);
};

export const validateEmailFormat = (email: string): ValidateEmailResult => {
  // Custom validation function to ensure the email format is valid
  // ...
};

type Props = Readonly<{
  subject: string;
  to: string;
  carbonOffsetCredits: number;
  ecoFriendlyOfficeSupplies: string[];
  subscriptionId: string;
  unsubscribeLink: string;
}>;

import { isString } from 'lodash';

export const validateEmail = (email: string): ValidateEmailResult => {
  if (!isString(email)) {
    throw new Error('Email must be a string');
  }

  return validate.isEmail(email);
};

export const validateEmailFormat = (email: string): ValidateEmailResult => {
  // Custom validation function to ensure the email format is valid
  // For example, checking if the email contains an '@' and a '.'
  const emailParts = email.split('@');
  if (emailParts.length !== 2) {
    return false;
  }

  const [local, domain] = emailParts;
  const domainParts = domain.split('.');
  if (domainParts.length < 2) {
    return false;
  }

  return true;
};

if (!validateEmail(to) || !validateEmailFormat(to)) {
  throw new Error('Invalid email address or email format');
}

2. Using `react-html-parser` to parse the HTML safely in the MyComponent:

3. Adding type annotations for the `validateEmail` and `validateEmailFormat` functions in `utils/validation.ts`:

4. Adding type annotations for the props in MyComponent:

5. Adding a custom email format validation function in `utils/validation.ts`:

6. Adding a check for the `validateEmailFormat` function in MyComponent: