import React, { PropsWithChildren } from 'react';

interface Props {
  message: string;
  isError?: boolean;
}

const MyComponent: React.FC<PropsWithChildren<Props>> = ({ message, isError = false }) => {
  const className = `my-component ${isError ? 'error' : ''}`;

  return (
    <div className={className} role="alert">
      <div>{message}</div>
    </div>
  );
};

export default MyComponent;

import React, { PropsWithChildren } from 'react';

interface Props {
  message: string;
  isError?: boolean;
}

const MyComponent: React.FC<PropsWithChildren<Props>> = ({ message, isError = false }) => {
  const className = `my-component ${isError ? 'error' : ''}`;

  return (
    <div className={className} role="alert">
      <div>{message}</div>
    </div>
  );
};

export default MyComponent;