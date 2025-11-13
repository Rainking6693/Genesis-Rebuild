import React, { PropsWithChildren } from 'react';

interface Props {
  message: string;
  className?: string;
}

const MyComponent: React.FC<Props> = ({ message, className }) => {
  const safeMessage = message.replace(/<.*?>/g, ''); // Remove any HTML tags to prevent XSS attacks

  return <div className={className}>{safeMessage}</div>;
};

MyComponent.defaultProps = {
  className: '',
};

export default MyComponent;

import React, { PropsWithChildren } from 'react';

interface Props {
  message: string;
  className?: string;
}

const MyComponent: React.FC<Props> = ({ message, className }) => {
  const safeMessage = message.replace(/<.*?>/g, ''); // Remove any HTML tags to prevent XSS attacks

  return <div className={className}>{safeMessage}</div>;
};

MyComponent.defaultProps = {
  className: '',
};

export default MyComponent;