import React, { PropsWithChildren } from 'react';

interface Props {
  message: string;
  isError?: boolean;
  className?: string;
}

const MyComponent: React.FC<Props> = ({ message, isError = false, className }) => {
  const errorClassName = isError ? 'error' : '';

  return (
    <div className={`social-media-message ${className || ''} ${errorClassName}`}>
      {message}
    </div>
  );
};

export default MyComponent;

import React, { PropsWithChildren } from 'react';

interface Props {
  message: string;
  isError?: boolean;
  className?: string;
}

const MyComponent: React.FC<Props> = ({ message, isError = false, className }) => {
  const errorClassName = isError ? 'error' : '';

  return (
    <div className={`social-media-message ${className || ''} ${errorClassName}`}>
      {message}
    </div>
  );
};

export default MyComponent;