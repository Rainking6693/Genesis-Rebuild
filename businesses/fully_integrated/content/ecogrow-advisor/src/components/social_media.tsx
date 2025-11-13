import React, { PropsWithChildren } from 'react';

interface Props {
  message: string;
  className?: string;
  ariaLabel?: string;
}

const MyComponent: React.FC<Props> = ({ message, className, ariaLabel }) => {
  return (
    <div className={className} aria-label={ariaLabel}>
      {message}
    </div>
  );
};

MyComponent.defaultProps = {
  className: '',
  ariaLabel: 'Social media message',
};

export default MyComponent;

import React, { PropsWithChildren } from 'react';

interface Props {
  message: string;
  className?: string;
  ariaLabel?: string;
}

const MyComponent: React.FC<Props> = ({ message, className, ariaLabel }) => {
  return (
    <div className={className} aria-label={ariaLabel}>
      {message}
    </div>
  );
};

MyComponent.defaultProps = {
  className: '',
  ariaLabel: 'Social media message',
};

export default MyComponent;