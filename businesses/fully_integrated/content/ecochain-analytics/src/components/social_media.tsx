import React, { PropsWithChildren } from 'react';

interface Props {
  message: string;
  isError?: boolean;
}

const MyComponent: React.FC<Props> = ({ message, isError = false }) => {
  const className = `social-media-message ${isError ? 'error' : ''}`;

  return (
    <div className={className}>
      {message}
      <aria-hidden={true}>{message}</aria-hidden>
    </div>
  );
};

export default MyComponent;

import React, { PropsWithChildren } from 'react';

interface Props {
  message: string;
  isError?: boolean;
}

const MyComponent: React.FC<Props> = ({ message, isError = false }) => {
  const className = `social-media-message ${isError ? 'error' : ''}`;

  return (
    <div className={className}>
      {message}
      <aria-hidden={true}>{message}</aria-hidden>
    </div>
  );
};

export default MyComponent;