import React, { PropsWithChildren } from 'react';

interface Props {
  message: string;
  className?: string;
  ariaLabel?: string;
}

const MyComponent: React.FC<Props> = ({ message, className, ariaLabel }) => {
  const defaultClassName = 'my-component';
  const combinedClassName = className ? `${defaultClassName} ${className}` : defaultClassName;

  return (
    <div className={combinedClassName} aria-label={ariaLabel}>
      {message}
    </div>
  );
};

MyComponent.defaultProps = {
  className: null,
  ariaLabel: 'SEO optimized content',
};

export default MyComponent;

import React, { PropsWithChildren } from 'react';

interface Props {
  message: string;
  className?: string;
  ariaLabel?: string;
}

const MyComponent: React.FC<Props> = ({ message, className, ariaLabel }) => {
  const defaultClassName = 'my-component';
  const combinedClassName = className ? `${defaultClassName} ${className}` : defaultClassName;

  return (
    <div className={combinedClassName} aria-label={ariaLabel}>
      {message}
    </div>
  );
};

MyComponent.defaultProps = {
  className: null,
  ariaLabel: 'SEO optimized content',
};

export default MyComponent;