import React, { PropsWithChildren } from 'react';

interface Props {
  message: string;
  className?: string;
  ariaLabel?: string;
}

const MyComponent: React.FC<Props> = ({ message, className, ariaLabel }) => {
  const customClass = className ? ` ${className}` : '';
  const customAriaLabel = ariaLabel ? ` aria-label="${ariaLabel}"` : '';

  return (
    <div className={`MyComponent${customClass}`} {...customAriaLabel}>
      {message}
    </div>
  );
};

MyComponent.defaultProps = {
  className: '',
  ariaLabel: '',
};

export default MyComponent;

import React, { PropsWithChildren } from 'react';

interface Props {
  message: string;
  className?: string;
  ariaLabel?: string;
}

const MyComponent: React.FC<Props> = ({ message, className, ariaLabel }) => {
  const customClass = className ? ` ${className}` : '';
  const customAriaLabel = ariaLabel ? ` aria-label="${ariaLabel}"` : '';

  return (
    <div className={`MyComponent${customClass}`} {...customAriaLabel}>
      {message}
    </div>
  );
};

MyComponent.defaultProps = {
  className: '',
  ariaLabel: '',
};

export default MyComponent;