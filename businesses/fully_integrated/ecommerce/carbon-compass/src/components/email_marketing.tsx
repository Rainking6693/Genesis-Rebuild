import React, { FC, ReactNode } from 'react';
import { EmailMessage } from './EmailMessage'; // Assuming you have an EmailMessage component for email structure

type Props = {
  subject?: string;
  body?: string;
  recipientEmail?: string;
};

const validateEmail = (email: string) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
  return re.test(String(email).toLowerCase());
};

const MyComponent: FC<Props> = ({ subject, body, recipientEmail }) => {
  if (!subject || !body || !validateEmail(recipientEmail)) {
    return <div>A placeholder component for missing or invalid props</div>;
  }

  return <EmailMessage subject={subject} body={body} recipientEmail={recipientEmail} />;
};

MyComponent.defaultProps = {
  subject: '',
  body: '',
  recipientEmail: '',
};

MyComponent.propTypes = {
  subject: React.PropTypes.string,
  body: React.PropTypes.string,
  recipientEmail: React.PropTypes.string,
};

MyComponent.validate = (props: Props) => {
  if (!validateEmail(props.recipientEmail)) {
    throw new Error('Invalid recipient email');
  }
};

export default MyComponent;

import React, { FC, ReactNode } from 'react';
import { EmailMessage } from './EmailMessage'; // Assuming you have an EmailMessage component for email structure

type Props = {
  subject?: string;
  body?: string;
  recipientEmail?: string;
};

const validateEmail = (email: string) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
  return re.test(String(email).toLowerCase());
};

const MyComponent: FC<Props> = ({ subject, body, recipientEmail }) => {
  if (!subject || !body || !validateEmail(recipientEmail)) {
    return <div>A placeholder component for missing or invalid props</div>;
  }

  return <EmailMessage subject={subject} body={body} recipientEmail={recipientEmail} />;
};

MyComponent.defaultProps = {
  subject: '',
  body: '',
  recipientEmail: '',
};

MyComponent.propTypes = {
  subject: React.PropTypes.string,
  body: React.PropTypes.string,
  recipientEmail: React.PropTypes.string,
};

MyComponent.validate = (props: Props) => {
  if (!validateEmail(props.recipientEmail)) {
    throw new Error('Invalid recipient email');
  }
};

export default MyComponent;