import React, { FC, ReactNode } from 'react';
import classnames from 'classnames';

interface Props {
  message: string;
  error?: boolean;
  children?: ReactNode;
}

const MyComponent: FC<Props> = ({ message, error = false, children }) => {
  const containerClass = classnames('user-auth-message', { 'error-message': error });

  return (
    <div className={containerClass}>
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
  const containerClass = classnames('user-auth-message', { 'error-message': error });

  return (
    <div className={containerClass}>
      {children}
      <div>{message}</div>
    </div>
  );
};

export default MyComponent;