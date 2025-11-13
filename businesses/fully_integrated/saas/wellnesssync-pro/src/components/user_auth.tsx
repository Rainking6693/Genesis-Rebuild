import React, { FC, ReactNode } from 'react';
import classnames from 'classnames';

interface Props {
  message: string;
  error?: boolean;
  children?: ReactNode;
}

const MyComponent: FC<Props> = ({ message, error = false, children }) => {
  const className = classnames('user-auth-message', { 'user-auth-message--error': error });

  return (
    <div className={className}>
      {children}
      <div>{message}</div>
    </div>
  );
};

export default MyComponent;

import React, { FC, ReactNode } from 'react';
import classnames from 'classnames';

interface Props {
  message: string;
  error?: boolean;
  children?: ReactNode;
}

const MyComponent: FC<Props> = ({ message, error = false, children }) => {
  const className = classnames('user-auth-message', { 'user-auth-message--error': error });

  return (
    <div className={className}>
      {children}
      <div>{message}</div>
    </div>
  );
};

export default MyComponent;