import React, { FC, DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';

interface IMessageProps {
  message: string;
  isError?: boolean;
  title?: string;
  testId?: string;
}

type MyComponentProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & IMessageProps;

const MyComponent: FC<MyComponentProps> = ({ message, isError = false, title, testId, ...props }) => {
  const className = `message ${isError ? 'error' : ''}`;

  return (
    <div className={className} data-testid={testId} {...props}>
      {title && <div role="presentation">{title}</div>}
      {message}
    </div>
  );
};

export default MyComponent;

import React, { FC, DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';

interface IMessageProps {
  message: string;
  isError?: boolean;
  title?: string;
  testId?: string;
}

type MyComponentProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & IMessageProps;

const MyComponent: FC<MyComponentProps> = ({ message, isError = false, title, testId, ...props }) => {
  const className = `message ${isError ? 'error' : ''}`;

  return (
    <div className={className} data-testid={testId} {...props}>
      {title && <div role="presentation">{title}</div>}
      {message}
    </div>
  );
};

export default MyComponent;