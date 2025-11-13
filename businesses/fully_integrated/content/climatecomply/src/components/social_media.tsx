import React, { PropsWithChildren } from 'react';

interface Props {
  message: string;
  className?: string;
  ariaLabel?: string;
}

const MyComponent: React.FC<Props> = ({ message, className, ariaLabel }) => {
  const defaultClassName = 'social-media-message';
  const combinedClassName = className ? `${defaultClassName} ${className}` : defaultClassName;

  return (
    <div className={combinedClassName} aria-label={ariaLabel}>
      {message}
    </div>
  );
};

MyComponent.defaultProps = {
  className: null,
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
  const defaultClassName = 'social-media-message';
  const combinedClassName = className ? `${defaultClassName} ${className}` : defaultClassName;

  return (
    <div className={combinedClassName} aria-label={ariaLabel}>
      {message}
    </div>
  );
};

MyComponent.defaultProps = {
  className: null,
  ariaLabel: 'Social media message',
};

export default MyComponent;