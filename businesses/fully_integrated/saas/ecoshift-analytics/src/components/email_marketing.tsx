import React, { FC, ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  subject: string;
  message: string;
  children?: ReactNode; // Allows for additional content within the email component
}

const MyEmailComponent: FC<Props> = ({ subject, message, children, ...rest }) => {
  const emailComponentId = `email-component-${Math.random().toString(36).substring(7)}`;

  return (
    <div id={emailComponentId} {...rest} role="presentation" aria-label="Email component">
      <h2>{subject}</h2>
      <div>{message}</div>
      {children}
    </div>
  );
};

export default MyEmailComponent;

import React, { FC, ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  subject: string;
  message: string;
  children?: ReactNode; // Allows for additional content within the email component
}

const MyEmailComponent: FC<Props> = ({ subject, message, children, ...rest }) => {
  const emailComponentId = `email-component-${Math.random().toString(36).substring(7)}`;

  return (
    <div id={emailComponentId} {...rest} role="presentation" aria-label="Email component">
      <h2>{subject}</h2>
      <div>{message}</div>
      {children}
    </div>
  );
};

export default MyEmailComponent;